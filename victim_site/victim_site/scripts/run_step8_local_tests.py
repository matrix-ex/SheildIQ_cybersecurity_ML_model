import argparse
import json
import os
import subprocess
import sys
import threading
import time
from pathlib import Path

import requests


class ManagedProcess:
    def __init__(self, name, command, cwd, env=None):
        self.name = name
        self.command = command
        self.cwd = cwd
        self.env = env
        self.proc = None
        self.lines = []
        self._reader_thread = None

    def start(self):
        env = os.environ.copy()
        if self.env:
            env.update(self.env)
            
        self.proc = subprocess.Popen(
            self.command,
            cwd=self.cwd,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )

        def _reader():
            for line in self.proc.stdout:
                clean = line.rstrip("\n")
                self.lines.append(clean)
                print(f"[{self.name}] {clean}")

        self._reader_thread = threading.Thread(target=_reader, daemon=True)
        self._reader_thread.start()

    def stop(self):
        if not self.proc:
            return
        if self.proc.poll() is None:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=8)
            except subprocess.TimeoutExpired:
                self.proc.kill()

    def has_line(self, text):
        return any(text in line for line in self.lines)


def wait_for_health(url, timeout=90):
    start = time.time()
    while time.time() - start < timeout:
        try:
            response = requests.get(url, timeout=3)
            if response.status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(1)
    return False


def run_attack_mode(python_executable, attack_script, mode):
    command = [python_executable, str(attack_script), "--mode", mode]
    print(f"\n[TEST] Running attack demo mode: {mode}")
    proc = subprocess.run(command, capture_output=True, text=True)

    output = (proc.stdout or "") + "\n" + (proc.stderr or "")
    print(output)

    blocked_count = output.count("[VAULTO BLOCKED]")
    return {
        "mode": mode,
        "exit_code": proc.returncode,
        "blocked_count": blocked_count,
        "output": output,
        "passed": proc.returncode == 0,
    }


def verify_block_payload(nexus_base_url):
    headers = {
        "X-Forwarded-For": "185.199.110.153",
        "User-Agent": "VAULTO-Checklist-Validator/1.0",
    }

    attempts = []

    for _ in range(40):
        try:
            response = requests.get(
                f"{nexus_base_url}/api/users/search",
                params={"name": "' UNION SELECT username, password FROM users --"},
                headers=headers,
                timeout=5,
            )
        except requests.RequestException:
            continue

        payload = {}
        try:
            payload = response.json()
        except Exception:
            payload = {}

        attempts.append((response.status_code, payload))

        if response.status_code in (403, 429):
            if payload.get("vaulto") is True and payload.get("reason"):
                return True, {
                    "status": response.status_code,
                    "payload": payload,
                }

    return False, {"attempts": attempts[-5:]}


def fetch_alerts(vaulto_base_url):
    try:
        response = requests.get(f"{vaulto_base_url}/api/alerts", params={"limit": 20}, timeout=8)
        if response.status_code != 200:
            return False, f"/api/alerts returned status {response.status_code}"
        data = response.json()
        if not isinstance(data, list):
            return False, "Unexpected /api/alerts payload type"
        return len(data) > 0, f"alerts_count={len(data)}"
    except Exception as err:
        return False, str(err)


def main():
    parser = argparse.ArgumentParser(description="Run full Step 8 local checklist for VAULTO + Nexus integration")
    parser.add_argument("--skip-start", action="store_true", help="Skip starting services and only run checks")
    parser.add_argument("--keep-services", action="store_true", help="Do not stop services at the end")
    args = parser.parse_args()

    script_path = Path(__file__).resolve()
    repo_root = script_path.parents[3]

    ml_dir = repo_root / "ml"
    vaulto_backend_dir = repo_root / "backend"
    nexus_backend_dir = repo_root / "victim_site" / "victim_site" / "backend"
    attack_script = repo_root / "victim_site" / "victim_site" / "scripts" / "attack_demo.py"

    python_executable = sys.executable

    services = [
        ManagedProcess("ML", [python_executable, "app.py"], str(ml_dir)),
        ManagedProcess("VAULTO", ["node", "server.js"], str(vaulto_backend_dir), env={"FLASK_URL": "http://127.0.0.1:5000", "ML_API_URL": "http://127.0.0.1:5000"}),
        ManagedProcess("NEXUS", ["node", "server.js"], str(nexus_backend_dir)),
    ]

    summary = {
        "health": {},
        "seed_log_seen": False,
        "attack_results": [],
        "block_payload_verified": False,
        "alerts_verified": False,
        "notes": [],
    }

    try:
        if not args.skip_start:
            print("\n[STEP] Starting ML, VAULTO backend, and Nexus backend...")
            for service in services:
                service.start()
            time.sleep(4)

        print("\n[STEP] Checking service health endpoints...")
        checks = {
            "nexus_health": "http://localhost:5001/api/health",
            "nexus_vaulto_status": "http://localhost:5001/api/vaulto-status",
            "vaulto_health": "http://localhost:4000/api/health",
            "ml_health": "http://localhost:5000/api/health",
        }

        for name, url in checks.items():
            ok = wait_for_health(url)
            summary["health"][name] = ok
            print(f"[HEALTH] {name}: {'PASS' if ok else 'FAIL'} ({url})")

        summary["seed_log_seen"] = services[1].has_line("[VAULTO] Demo API key seeded") if not args.skip_start else False
        if not args.skip_start:
            print(f"[CHECK] Demo key seed log seen: {'YES' if summary['seed_log_seen'] else 'NO'}")
            if not summary["seed_log_seen"]:
                summary["notes"].append("Demo key may already exist, so seed log line might not appear.")

        print("\n[STEP] Running protected attack demo modes...")
        for mode in ["dos", "brute", "sqli", "all"]:
            result = run_attack_mode(python_executable, attack_script, mode)
            summary["attack_results"].append(result)

        print("\n[STEP] Verifying blocked response payload contains vaulto=true and reason...")
        blocked_ok, blocked_details = verify_block_payload("http://localhost:5001")
        summary["block_payload_verified"] = blocked_ok
        if blocked_ok:
            print("[CHECK] Block payload verification: PASS")
            print(json.dumps(blocked_details, indent=2, default=str))
        else:
            print("[CHECK] Block payload verification: FAIL")
            print(json.dumps(blocked_details, indent=2, default=str))

        print("\n[STEP] Verifying alerts are visible through VAULTO API...")
        alerts_ok, alerts_details = fetch_alerts("http://localhost:4000")
        summary["alerts_verified"] = alerts_ok
        print(f"[CHECK] Alerts verification: {'PASS' if alerts_ok else 'FAIL'} ({alerts_details})")

    finally:
        if not args.keep_services and not args.skip_start:
            print("\n[STEP] Stopping services...")
            for service in reversed(services):
                service.stop()

    print("\n" + "=" * 70)
    print("STEP 8 LOCAL CHECKLIST SUMMARY")
    print("=" * 70)

    for name, ok in summary["health"].items():
        print(f"- {name}: {'PASS' if ok else 'FAIL'}")

    print(f"- seed_log_seen: {'PASS' if summary['seed_log_seen'] else 'INFO'}")

    for item in summary["attack_results"]:
        print(
            f"- attack_mode_{item['mode']}: {'PASS' if item['passed'] else 'FAIL'} "
            f"(blocked_messages={item['blocked_count']})"
        )

    print(f"- blocked_payload_verified: {'PASS' if summary['block_payload_verified'] else 'FAIL'}")
    print(f"- alerts_verified: {'PASS' if summary['alerts_verified'] else 'FAIL'}")

    if summary["notes"]:
        print("\nNotes:")
        for note in summary["notes"]:
            print(f"- {note}")

    exit_code = 0
    if not all(summary["health"].values()):
        exit_code = 1
    if any(not item["passed"] for item in summary["attack_results"]):
        exit_code = 1
    if not summary["block_payload_verified"]:
        exit_code = 1
    if not summary["alerts_verified"]:
        exit_code = 1

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
