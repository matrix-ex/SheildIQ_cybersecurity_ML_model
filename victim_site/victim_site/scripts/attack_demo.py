import argparse
import random
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests


class AttackSimulator:
    def __init__(self, target_url):
        self.target_url = target_url.rstrip('/')

    def _classify_and_print(self, response):
        status = response.status_code if response is not None else 0
        blocked = status in (403, 429)
        reason = ""

        if response is not None:
            try:
                payload = response.json()
            except Exception:
                payload = {}
            
            if isinstance(payload, dict):
                reason = payload.get("reason") or payload.get("error") or payload.get("message") or "No reason provided"
            else:
                reason = "Blocked (non-dict response)"

        if blocked:
            print(f"[VAULTO BLOCKED] {reason}")
        else:
            print(f"[PASSED] {status}")

        return blocked

    def _print_summary(self, blocked, total):
        print(f"Blocked: {blocked}/{total} requests | VAULTO prevented the attack")

    def dos_attack(self, endpoint="/api/health", requests_count=100, threads=20):
        print(f"[!] Starting DoS attack on {self.target_url}{endpoint}")
        total = 0
        blocked = 0

        def hit_once(index):
            spoofed_ip = f"192.168.10.{(index % 254) + 1}"
            try:
                return requests.get(
                    f"{self.target_url}{endpoint}",
                    headers={
                        "X-Forwarded-For": spoofed_ip,
                        "User-Agent": f"VAULTO-DoS-Sim/{index}",
                    },
                    timeout=5,
                )
            except Exception:
                return None

        with ThreadPoolExecutor(max_workers=max(1, threads)) as executor:
            futures = [executor.submit(hit_once, i) for i in range(requests_count)]
            for future in as_completed(futures):
                response = future.result()
                total += 1
                if response is None:
                    print("[PASSED] REQUEST_FAILED")
                    continue
                if self._classify_and_print(response):
                    blocked += 1

        self._print_summary(blocked, total)
        return blocked, total

    def brute_force(self, username="admin", wordlist=None):
        print(f"[!] Starting Brute Force attack for user: {username}")
        endpoint = "/api/login"
        passwords = wordlist if wordlist else [
            "123456",
            "password",
            "qwerty",
            "admin123",
            "password123",
            "letmein",
            "welcome",
        ]

        total = 0
        blocked = 0

        for pwd in passwords:
            total += 1
            print(f"[*] Trying password: {pwd}")
            try:
                response = requests.post(
                    f"{self.target_url}{endpoint}",
                    json={"username": username, "password": pwd},
                    headers={
                        "X-Forwarded-For": f"172.16.2.{random.randint(2, 250)}",
                        "User-Agent": "VAULTO-Brute-Sim/1.0",
                    },
                    timeout=5,
                )
            except Exception:
                response = None

            if response is None:
                print("[PASSED] REQUEST_FAILED")
                continue

            if self._classify_and_print(response):
                blocked += 1

            time.sleep(0.2)

        self._print_summary(blocked, total)
        return blocked, total

    def sqli_probe(self):
        print("[!] Starting SQL Injection probe")
        endpoint = "/api/users/search"
        payloads = [
            "' OR '1'='1",
            "admin' --",
            "' UNION SELECT username, password FROM users --",
            "nonexistent' OR 1=1; --",
            "%27%20UNION%20SELECT%20username%2Cpassword%20FROM%20users--",
        ]

        total = 0
        blocked = 0

        for payload in payloads:
            total += 1
            print(f"[*] Payload: {payload}")
            try:
                response = requests.get(
                    f"{self.target_url}{endpoint}",
                    params={"name": payload},
                    headers={
                        "X-Forwarded-For": f"10.20.30.{random.randint(2, 250)}",
                        "User-Agent": "VAULTO-SQLi-Sim/1.0",
                    },
                    timeout=5,
                )
            except Exception:
                response = None

            if response is None:
                print("[PASSED] REQUEST_FAILED")
                continue

            if self._classify_and_print(response):
                blocked += 1

            time.sleep(0.2)

        self._print_summary(blocked, total)
        return blocked, total

    def run_all(self, username="admin", threads=20):
        grand_blocked = 0
        grand_total = 0

        print("\n" + "=" * 60)
        print("[ALL MODE] Phase 1: DoS")
        print("=" * 60)
        blocked, total = self.dos_attack(threads=threads)
        grand_blocked += blocked
        grand_total += total

        time.sleep(3)

        print("\n" + "=" * 60)
        print("[ALL MODE] Phase 2: Brute Force")
        print("=" * 60)
        blocked, total = self.brute_force(username=username)
        grand_blocked += blocked
        grand_total += total

        time.sleep(3)

        print("\n" + "=" * 60)
        print("[ALL MODE] Phase 3: SQL Injection")
        print("=" * 60)
        blocked, total = self.sqli_probe()
        grand_blocked += blocked
        grand_total += total

        print("\n" + "-" * 60)
        self._print_summary(grand_blocked, grand_total)
        print("-" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Nexus Bank attack demo against VAULTO-protected target")
    parser.add_argument("--url", default="http://localhost:5001", help="Target URL (default: http://localhost:5001)")
    parser.add_argument("--mode", choices=["dos", "brute", "sqli", "all"], required=True, help="Attack mode")
    parser.add_argument("--threads", type=int, default=20, help="Thread count for DoS mode")
    parser.add_argument("--user", default="admin", help="Username for brute-force mode")

    args = parser.parse_args()
    sim = AttackSimulator(args.url)

    if args.mode == "dos":
        sim.dos_attack(threads=args.threads)
    elif args.mode == "brute":
        sim.brute_force(username=args.user)
    elif args.mode == "sqli":
        sim.sqli_probe()
    elif args.mode == "all":
        sim.run_all(username=args.user, threads=args.threads)
