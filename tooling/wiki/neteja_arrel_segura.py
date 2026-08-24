#!/usr/bin/env python3
import os
import shutil
import glob
from datetime import datetime

# Rutes
ROOT_DIR = "/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org"
HISTORIC_DIR = os.path.join(ROOT_DIR, "_wiki_de_poble", "90_arxiu_historic", "quarantena_scripts")

# Patrons de brossa a netejar de l'arrel
GARBAGE_PATTERNS = [
    "fix_*.py",
    "scratch_*.py",
    "scratch_*.txt",
    "generate_*.py",
    "puppeteer_*.png",
]

def clean_root():
    if not os.path.exists(HISTORIC_DIR):
        os.makedirs(HISTORIC_DIR, exist_ok=True)
    
    timestamp = datetime.now().strftime("%y%m%d_%H%M")
    session_dir = os.path.join(HISTORIC_DIR, f"{timestamp}_neteja_arrel")
    
    files_moved = 0
    for pattern in GARBAGE_PATTERNS:
        search_path = os.path.join(ROOT_DIR, pattern)
        for filepath in glob.glob(search_path):
            if os.path.isfile(filepath):
                if files_moved == 0:
                    os.makedirs(session_dir, exist_ok=True)
                
                filename = os.path.basename(filepath)
                dest = os.path.join(session_dir, filename)
                shutil.move(filepath, dest)
                print(f"Mogut: {filename} -> {session_dir}")
                files_moved += 1
                
    if files_moved == 0:
        print("L'arrel ja està neta de brossa temporal.")
    else:
        print(f"S'han mogut {files_moved} fitxers temporals a l'arxiu històric.")

if __name__ == "__main__":
    clean_root()
