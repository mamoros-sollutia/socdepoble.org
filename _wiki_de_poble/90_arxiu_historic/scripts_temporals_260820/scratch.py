import json

log_file = "/Users/javillinares/.gemini/antigravity-ide/brain/2593585b-1eaa-4623-a04e-36759406de4c/.system_generated/logs/transcript_full.jsonl"
failed_timestamps = ["2026-08-20T13:08:29Z", "2026-08-20T13:08:50Z", "2026-08-20T14:09:31Z", "2026-08-20T14:11:27Z", "2026-08-20T14:11:51Z"]

with open(log_file, "r") as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get("type") == "PLANNER_RESPONSE":
                ts = data.get("created_at")
                if ts in failed_timestamps:
                    for call in data.get("tool_calls", []):
                        if call["name"] in ["replace_file_content", "multi_replace_file_content"] and "UniversalComponents" in call["args"].get("TargetFile", ""):
                            print(f"\n--- FAILED CHUNKS FROM {ts} ---")
                            if "ReplacementChunks" in call["args"]:
                                for i, chunk in enumerate(call["args"]["ReplacementChunks"]):
                                    print(f"CHUNK {i} TARGET:\n{chunk.get('TargetContent')}")
                                    print(f"CHUNK {i} REPLACEMENT:\n{chunk.get('ReplacementContent')}")
                            else:
                                print(f"TARGET:\n{call['args'].get('TargetContent')}")
                                print(f"REPLACEMENT:\n{call['args'].get('ReplacementContent')}")
        except Exception:
            pass
