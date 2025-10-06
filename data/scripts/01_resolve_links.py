import os, pandas as pd

# Detecta el CSV de PMC dentro de BioNabu/data/raw
candidates = [
    "../data/raw/SB_publication_PMC.csv",
    "../data/raw/SB_publications_PMC.csv"
]
SRC = next((p for p in candidates if os.path.exists(p)), None)
if not SRC:
    raise SystemExit("No se encontró el CSV en data/raw/")

# Este CSV suele venir sin encabezados: col 0 = título, col 1 = url PMC
df = pd.read_csv(SRC, header=None, names=["title","best_url"])
df = df.dropna().drop_duplicates("best_url")
os.makedirs("../data/interim", exist_ok=True)
df.to_csv("../data/interim/download_list.csv", index=False)
print(f"Listo: {len(df)} enlaces → ../data/interim/download_list.csv")
