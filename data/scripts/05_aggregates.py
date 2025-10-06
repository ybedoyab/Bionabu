import json, pandas as pd

FIND = "data/processed/findings.jsonl"
GAPS = "data/processed/gaps.csv"
MISS = "data/processed/mission_matrix.csv"

rows = [json.loads(l) for l in open(FIND, encoding="utf-8")]
df = pd.DataFrame(rows)

gaps = df.groupby(["exposure","outcome"]).size().reset_index(name="count").sort_values("count")
gaps.to_csv(GAPS, index=False)

mm = df[df["direction"]=="mitigates"].groupby(["outcome","exposure"]).size().reset_index(name="n_findings")
mm.rename(columns={"outcome":"risk","exposure":"countermeasure"}, inplace=True)
mm.to_csv(MISS, index=False)

print("OK ->", GAPS, MISS)
