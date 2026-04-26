"""
VAULTO - Multi-Source Dataset Download & Merge
===============================================
Downloads and merges 3 real-world IDS datasets for maximum attack coverage:

  1. CICIDS2017   - 2.8M rows, 15 attack types (UNB, Canada)
  2. CIC-IDS2018  - 8M+ rows, 14 attack types (successor to CICIDS2017)
  3. UNSW-NB15    - 2.5M rows, 9 attack types  (ACCS, Australia)

All mapped to the unified VAULTO 20-feature / 11-class schema.
"""

import os
import sys
import json
import numpy as np
import pandas as pd

# ─── PATHS ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
RAW_CICIDS2017 = os.path.join(DATA_DIR, "raw_cicids2017")
RAW_CICIDS2018 = os.path.join(DATA_DIR, "raw_cicids2018")
RAW_UNSW = os.path.join(DATA_DIR, "raw_unsw_nb15")
OUTPUT_FILE = os.path.join(DATA_DIR, "vaulto_dataset.csv")

for d in [RAW_CICIDS2017, RAW_CICIDS2018, RAW_UNSW]:
    os.makedirs(d, exist_ok=True)

# ─── VAULTO SCHEMA ──────────────────────────────────────────
VAULTO_FEATURES = [
    "flow_duration", "total_fwd_packets", "total_bwd_packets",
    "total_len_fwd_packets", "total_len_bwd_packets",
    "fwd_packet_len_mean", "bwd_packet_len_mean",
    "flow_bytes_per_sec", "flow_packets_per_sec",
    "flow_iat_mean", "fwd_iat_mean", "bwd_iat_mean",
    "fwd_psh_flags", "bwd_psh_flags", "fwd_urg_flags",
    "syn_flag_count", "rst_flag_count", "ack_flag_count",
    "down_up_ratio", "avg_packet_size",
]

VAULTO_LABELS = {
    0: "Normal", 1: "Brute_Force", 2: "Dictionary_Attack",
    3: "DoS", 4: "DDoS", 5: "SYN_Flood",
    6: "Port_Scan", 7: "SQL_Injection", 8: "XSS",
    9: "R2L", 10: "Botnet",
}

SAMPLES_PER_CLASS = 50000  # 50K per class for maximum training data

# ─── CICIDS2017 MAPPING ─────────────────────────────────────
CICIDS2017_FEATURE_MAP = {
    "Flow Duration": "flow_duration",
    "Total Fwd Packets": "total_fwd_packets",
    "Total Backward Packets": "total_bwd_packets",
    "Total Length of Fwd Packets": "total_len_fwd_packets",
    "Total Length of Bwd Packets": "total_len_bwd_packets",
    "Fwd Packet Length Mean": "fwd_packet_len_mean",
    "Bwd Packet Length Mean": "bwd_packet_len_mean",
    "Flow Bytes/s": "flow_bytes_per_sec",
    "Flow Packets/s": "flow_packets_per_sec",
    "Flow IAT Mean": "flow_iat_mean",
    "Fwd IAT Mean": "fwd_iat_mean",
    "Bwd IAT Mean": "bwd_iat_mean",
    "Fwd PSH Flags": "fwd_psh_flags",
    "Bwd PSH Flags": "bwd_psh_flags",
    "Fwd URG Flags": "fwd_urg_flags",
    "SYN Flag Count": "syn_flag_count",
    "RST Flag Count": "rst_flag_count",
    "ACK Flag Count": "ack_flag_count",
    "Down/Up Ratio": "down_up_ratio",
    "Average Packet Size": "avg_packet_size",
}

CICIDS2017_LABEL_MAP = {
    "BENIGN": 0, "Benign": 0,
    "FTP-Patator": 1, "SSH-Patator": 1,
    "FTP-BruteForce": 1, "SSH-Bruteforce": 1,
    "DoS slowloris": 3, "DoS Slowhttptest": 3,
    "DoS Hulk": 3, "DoS GoldenEye": 3, "Heartbleed": 3,
    "DoS attacks-Hulk": 3, "DoS attacks-GoldenEye": 3,
    "DoS attacks-Slowloris": 3, "DoS attacks-SlowHTTPTest": 3,
    "DDoS": 4, "DDOS attack-HOIC": 4, "DDOS attack-LOIC-UDP": 4,
    "DDoS attacks-LOIC-HTTP": 4, "DDOS attack-LOIC-HTTP": 4,
    "DDoS attack-HOIC": 4, "DDoS attack-LOIC-UDP": 4,
    "PortScan": 6,
    "Bot": 10,
    "Infiltration": 9, "Infilteration": 9,
}

# ─── CIC-IDS2018 MAPPING ────────────────────────────────────
CICIDS2018_FEATURE_MAP = {
    "Flow Duration": "flow_duration",
    "Tot Fwd Pkts": "total_fwd_packets",
    "Tot Bwd Pkts": "total_bwd_packets",
    "TotLen Fwd Pkts": "total_len_fwd_packets",
    "TotLen Bwd Pkts": "total_len_bwd_packets",
    "Fwd Pkt Len Mean": "fwd_packet_len_mean",
    "Bwd Pkt Len Mean": "bwd_packet_len_mean",
    "Flow Byts/s": "flow_bytes_per_sec",
    "Flow Pkts/s": "flow_packets_per_sec",
    "Flow IAT Mean": "flow_iat_mean",
    "Fwd IAT Mean": "fwd_iat_mean",
    "Bwd IAT Mean": "bwd_iat_mean",
    "Fwd PSH Flags": "fwd_psh_flags",
    "Bwd PSH Flags": "bwd_psh_flags",
    "Fwd URG Flags": "fwd_urg_flags",
    "SYN Flag Cnt": "syn_flag_count",
    "RST Flag Cnt": "rst_flag_count",
    "ACK Flag Cnt": "ack_flag_count",
    "Down/Up Ratio": "down_up_ratio",
    "Pkt Size Avg": "avg_packet_size",
}

# ─── UNSW-NB15 MAPPING ──────────────────────────────────────
UNSW_FEATURE_MAP = {
    "dur": "flow_duration",
    "spkts": "total_fwd_packets",
    "dpkts": "total_bwd_packets",
    "sbytes": "total_len_fwd_packets",
    "dbytes": "total_len_bwd_packets",
    "smean": "fwd_packet_len_mean",
    "dmean": "bwd_packet_len_mean",
    "sload": "flow_bytes_per_sec",
    "rate": "flow_packets_per_sec",
    "sinpkt": "flow_iat_mean",
    "dinpkt": "fwd_iat_mean",
    "sjit": "bwd_iat_mean",
    "tcprtt": "fwd_psh_flags",      # TCP round-trip (proxy)
    "synack": "bwd_psh_flags",      # SYN-ACK time (proxy)
    "ackdat": "fwd_urg_flags",      # ACK-DAT time (proxy)
    "ct_state_ttl": "syn_flag_count",
    "ct_dst_ltm": "rst_flag_count",
    "ct_src_dport_ltm": "ack_flag_count",
    "trans_depth": "down_up_ratio",
    "response_body_len": "avg_packet_size",
}

UNSW_LABEL_MAP = {
    "Normal": 0,
    "Generic": 1,        # -> Brute_Force (generic attacks)
    "Exploits": 9,       # -> R2L (remote exploits)
    "Fuzzers": 2,        # -> Dictionary_Attack (fuzzing/enumeration)
    "DoS": 3,            # -> DoS
    "Reconnaissance": 6, # -> Port_Scan (recon/scanning)
    "Analysis": 7,       # -> SQL_Injection (analysis/probing)
    "Backdoor": 9,       # -> R2L (backdoor/remote access)
    "Shellcode": 8,      # -> XSS (code injection)
    "Worms": 10,         # -> Botnet (self-propagating)
}


# ═══════════════════════════════════════════════════════════
#  DOWNLOAD FUNCTIONS
# ═══════════════════════════════════════════════════════════

def download_cicids2017():
    """Download CICIDS2017 from HuggingFace."""
    print("\n  [CICIDS2017] Downloading from HuggingFace (c01dsnap/CIC-IDS2017)...")
    from huggingface_hub import hf_hub_download, list_repo_files
    
    repo = "c01dsnap/CIC-IDS2017"
    files = list_repo_files(repo, repo_type="dataset")
    csv_files = [f for f in files if f.endswith('.csv')]
    
    for csv_file in csv_files:
        out_path = os.path.join(RAW_CICIDS2017, os.path.basename(csv_file))
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"    Already exists: {os.path.basename(csv_file)}")
            continue
        print(f"    Downloading: {os.path.basename(csv_file)}...", flush=True)
        hf_hub_download(repo, csv_file, repo_type="dataset", local_dir=RAW_CICIDS2017)
    
    print(f"    Done! {len(csv_files)} files")
    return True


def download_cicids2018():
    """Download CIC-IDS2018 from HuggingFace."""
    print("\n  [CIC-IDS2018] Downloading from HuggingFace (c01dsnap/CIC-IDS2018)...")
    from huggingface_hub import hf_hub_download, list_repo_files
    
    repo = "c01dsnap/CIC-IDS2018"
    files = list_repo_files(repo, repo_type="dataset")
    csv_files = [f for f in files if f.endswith('.csv')]
    
    for csv_file in csv_files:
        out_path = os.path.join(RAW_CICIDS2018, os.path.basename(csv_file))
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"    Already exists: {os.path.basename(csv_file)}")
            continue
        print(f"    Downloading: {os.path.basename(csv_file)}...", flush=True)
        hf_hub_download(repo, csv_file, repo_type="dataset", local_dir=RAW_CICIDS2018)
    
    print(f"    Done! {len(csv_files)} files")
    return True


def download_unsw_nb15():
    """Download UNSW-NB15 from HuggingFace."""
    print("\n  [UNSW-NB15] Downloading from HuggingFace (Mouwiya/UNSW-NB15)...")
    from huggingface_hub import hf_hub_download
    
    files_to_get = ["UNSW_NB15_training-set.csv", "NUSW-NB15_features.csv"]
    for fname in files_to_get:
        out_path = os.path.join(RAW_UNSW, fname)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
            print(f"    Already exists: {fname}")
            continue
        print(f"    Downloading: {fname}...", flush=True)
        hf_hub_download("Mouwiya/UNSW-NB15", fname, repo_type="dataset", local_dir=RAW_UNSW)
    
    print("    Done!")
    return True


# ═══════════════════════════════════════════════════════════
#  LOADING FUNCTIONS
# ═══════════════════════════════════════════════════════════

def load_and_map_csvs_from_dir(directory, feature_map, label_map, dataset_name, max_per_file=500000):
    """Load CSVs one at a time, map and sample each to avoid OOM."""
    csv_files = sorted([f for f in os.listdir(directory) if f.endswith('.csv') and os.path.getsize(os.path.join(directory, f)) > 1000])
    if not csv_files:
        return None
    
    all_mapped = []
    for csv_file in csv_files:
        path = os.path.join(directory, csv_file)
        fsize = os.path.getsize(path) / 1024 / 1024
        print(f"    Loading: {csv_file} ({fsize:.0f} MB)...", end=" ", flush=True)
        try:
            df = pd.read_csv(path, encoding='utf-8', low_memory=False)
        except UnicodeDecodeError:
            df = pd.read_csv(path, encoding='latin-1', low_memory=False)
        except Exception as e:
            print(f"FAILED: {e}")
            continue
        
        df.columns = df.columns.str.strip()
        print(f"{len(df):,} rows", end="", flush=True)
        
        # Find label column
        label_col = None
        for candidate in ['attack_cat', 'Label', 'label']:
            if candidate in df.columns:
                label_col = candidate
                break
        if label_col is None:
            print(" -> no label column, skipping")
            continue
        
        # Map features
        matched = {}
        for src_col, vaulto_col in feature_map.items():
            if src_col in df.columns:
                matched[src_col] = vaulto_col
        
        cols_to_select = list(matched.keys()) + [label_col]
        df_sel = df[cols_to_select].copy()
        del df  # free memory immediately
        
        df_sel = df_sel.rename(columns=matched)
        for feat in VAULTO_FEATURES:
            if feat not in df_sel.columns:
                df_sel[feat] = 0
        for col in VAULTO_FEATURES:
            df_sel[col] = pd.to_numeric(df_sel[col], errors='coerce')
        
        # Map labels
        df_sel[label_col] = df_sel[label_col].astype(str).str.strip()
        df_sel['label'] = df_sel[label_col].map(label_map)
        
        # Handle unmapped web attacks
        unmapped = df_sel[df_sel['label'].isna()][label_col].unique()
        for um in unmapped:
            um_lower = str(um).lower()
            if 'brute' in um_lower or 'patator' in um_lower:
                df_sel.loc[df_sel[label_col] == um, 'label'] = 1
            elif 'sql' in um_lower:
                df_sel.loc[df_sel[label_col] == um, 'label'] = 7
            elif 'xss' in um_lower:
                df_sel.loc[df_sel[label_col] == um, 'label'] = 8
            elif 'ddos' in um_lower:
                df_sel.loc[df_sel[label_col] == um, 'label'] = 4
            elif 'dos' in um_lower:
                df_sel.loc[df_sel[label_col] == um, 'label'] = 3
            elif 'port' in um_lower or 'scan' in um_lower:
                df_sel.loc[df_sel[label_col] == um, 'label'] = 6
            elif 'bot' in um_lower:
                df_sel.loc[df_sel[label_col] == um, 'label'] = 10
            elif 'infiltr' in um_lower:
                df_sel.loc[df_sel[label_col] == um, 'label'] = 9
        
        df_sel = df_sel.dropna(subset=['label'])
        df_sel['label'] = df_sel['label'].astype(int)
        df_sel = df_sel.drop(columns=[label_col])
        df_sel = df_sel.replace([np.inf, -np.inf], np.nan).fillna(0)
        df_sel = df_sel[VAULTO_FEATURES + ['label']]
        
        # Sample if too large (prevent OOM when merging)
        if len(df_sel) > max_per_file:
            df_sel = df_sel.sample(n=max_per_file, random_state=42)
        
        print(f" -> {len(df_sel):,} mapped")
        all_mapped.append(df_sel)
    
    if not all_mapped:
        return None
    
    result = pd.concat(all_mapped, ignore_index=True)
    print(f"\n  {dataset_name} total: {len(result):,} rows, {len(matched)}/20 features matched")
    
    # Print label distribution
    for lid in sorted(result['label'].unique()):
        cnt = len(result[result['label'] == lid])
        print(f"    {lid:2d} ({VAULTO_LABELS.get(lid, '?'):20s}): {cnt:>8,}")
    
    return result


# ═══════════════════════════════════════════════════════════
#  MAIN PIPELINE
# ═══════════════════════════════════════════════════════════

def main():
    print("=" * 65)
    print("  VAULTO - Multi-Source Real Dataset Download & Merge")
    print("  Sources: CICIDS2017 + CIC-IDS2018 + UNSW-NB15")
    print("=" * 65)
    
    # ── STEP 1: Download all datasets ──────────────────────
    print("\n[1/6] Downloading datasets...")
    
    try:
        download_cicids2017()
    except Exception as e:
        print(f"    CICIDS2017 download error: {e}")
    
    try:
        download_cicids2018()
    except Exception as e:
        print(f"    CIC-IDS2018 download error: {e}")
    
    try:
        download_unsw_nb15()
    except Exception as e:
        print(f"    UNSW-NB15 download error: {e}")
    
    # ── STEP 2: Load CICIDS2017 ────────────────────────────
    all_mapped = []
    
    print("\n[2/6] Loading & mapping CICIDS2017...")
    if os.path.exists(RAW_CICIDS2017) and any(f.endswith('.csv') for f in os.listdir(RAW_CICIDS2017)):
        mapped = load_and_map_csvs_from_dir(RAW_CICIDS2017, CICIDS2017_FEATURE_MAP, CICIDS2017_LABEL_MAP, "CICIDS2017")
        if mapped is not None:
            all_mapped.append(mapped)
            del mapped
    else:
        print("    Skipped (no files)")
    
    # ── STEP 3: Load CIC-IDS2018 ──────────────────────────
    print("\n[3/6] Loading & mapping CIC-IDS2018...")
    if os.path.exists(RAW_CICIDS2018) and any(f.endswith('.csv') for f in os.listdir(RAW_CICIDS2018)):
        mapped = load_and_map_csvs_from_dir(RAW_CICIDS2018, CICIDS2018_FEATURE_MAP, CICIDS2017_LABEL_MAP, "CIC-IDS2018")
        if mapped is not None:
            all_mapped.append(mapped)
            del mapped
    else:
        print("    Skipped (no files)")
    
    # ── STEP 4: Load UNSW-NB15 ────────────────────────────
    print("\n[4/6] Loading & mapping UNSW-NB15...")
    if os.path.exists(RAW_UNSW) and any(f.endswith('.csv') for f in os.listdir(RAW_UNSW)):
        mapped = load_and_map_csvs_from_dir(RAW_UNSW, UNSW_FEATURE_MAP, UNSW_LABEL_MAP, "UNSW-NB15")
        if mapped is not None:
            all_mapped.append(mapped)
            del mapped
    else:
        print("    Skipped (no files)")
    
    if not all_mapped:
        print("\n  ERROR: No datasets were loaded!")
        return False
    
    # ── STEP 5: Create SYN_Flood class ────────────────────
    print("\n[5/6] Merging all datasets and creating SYN_Flood class...")
    df_all = pd.concat(all_mapped, ignore_index=True)
    del all_mapped
    print(f"  Combined total: {len(df_all):,} rows")
    
    # Create SYN_Flood from high-SYN DoS/DDoS traffic
    dos_ddos = df_all[df_all['label'].isin([3, 4])].copy()
    if len(dos_ddos) > 0:
        q70 = dos_ddos['syn_flag_count'].quantile(0.7)
        syn_candidates = dos_ddos[
            (dos_ddos['syn_flag_count'] >= max(q70, 1)) &
            (dos_ddos['flow_packets_per_sec'] > dos_ddos['flow_packets_per_sec'].quantile(0.5))
        ]
        if len(syn_candidates) >= 500:
            n = min(SAMPLES_PER_CLASS, len(syn_candidates))
            syn_samples = syn_candidates.sample(n=n, random_state=42).copy()
            syn_samples['label'] = 5
            df_all = df_all.drop(syn_samples.index)
            df_all = pd.concat([df_all, syn_samples], ignore_index=True)
            print(f"  Created {len(syn_samples):,} SYN_Flood samples from real data")
        else:
            # Augment from DoS
            n = min(SAMPLES_PER_CLASS, len(dos_ddos))
            syn_aug = dos_ddos.sample(n=n, random_state=42).copy()
            syn_aug['label'] = 5
            syn_aug['syn_flag_count'] += np.random.randint(3, 10, len(syn_aug))
            syn_aug['flow_packets_per_sec'] *= np.random.uniform(1.5, 3.0, len(syn_aug))
            df_all = pd.concat([df_all, syn_aug], ignore_index=True)
            print(f"  Created {len(syn_aug):,} SYN_Flood samples (augmented)")
    
    # ── STEP 6: Balance and save ──────────────────────────
    print(f"\n[6/6] Balancing classes and saving...")
    
    print(f"\n  Pre-balance distribution:")
    for lid in sorted(df_all['label'].unique()):
        cnt = len(df_all[df_all['label'] == lid])
        print(f"    {lid:2d} ({VAULTO_LABELS.get(lid,'?'):20s}): {cnt:>10,}")
    
    # Balance
    balanced = []
    for lid in sorted(df_all['label'].unique()):
        cdf = df_all[df_all['label'] == lid]
        if len(cdf) > SAMPLES_PER_CLASS:
            cdf = cdf.sample(n=SAMPLES_PER_CLASS, random_state=42)
        balanced.append(cdf)
    
    df_final = pd.concat(balanced, ignore_index=True)
    df_final = df_final.sample(frac=1, random_state=42).reset_index(drop=True)
    df_final['label_name'] = df_final['label'].map(VAULTO_LABELS)
    
    # Ensure column order
    df_final = df_final[VAULTO_FEATURES + ['label', 'label_name']]
    
    print(f"\n  Final dataset:")
    total = 0
    for lid in sorted(df_final['label'].unique()):
        cnt = len(df_final[df_final['label'] == lid])
        print(f"    {lid:2d} ({VAULTO_LABELS.get(lid,'?'):20s}): {cnt:>6,}")
        total += cnt
    
    missing = set(range(11)) - set(df_final['label'].unique())
    if missing:
        print(f"\n  Classes with no data: {[VAULTO_LABELS[c] for c in sorted(missing)]}")
    
    df_final.to_csv(OUTPUT_FILE, index=False)
    
    print(f"\n  {'=' * 55}")
    print(f"  Dataset saved: {OUTPUT_FILE}")
    print(f"  Total samples:  {total:,}")
    print(f"  Features:       20")
    print(f"  Classes:        {df_final['label'].nunique()}")
    print(f"  {'=' * 55}")
    print(f"\n  Next: python train_models.py")
    print("=" * 65)
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
