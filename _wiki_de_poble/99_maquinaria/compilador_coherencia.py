#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
COMPILADOR DE COHERÈNCIA SÓC DE POBLE
Llegeix tota la wiki, valida enllaços i cerca patrons de contradicció coneguts.
"""
import os, re, yaml
from pathlib import Path

WIKI = Path("_wiki_de_poble")
ENLLAÇ = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")
PATRONS_CONTRADICCIÓ = [
    ("#1 44px vs 48px", r"44x44.*px", r"48x48.*px|56px"),
    ("#2 28px ambigü", r"28px.*font|font.*28px", r"28px.*radius|radius.*28px"),
    ("#3 Anglicismes", r"\bThe [A-Z][a-z]+ Paradigm\b|State-of-the-art"),
    ("#4 PouchDB vs idb", r"PouchDB"),
    ("#5 Tailwind obligatori", r"Tailwind és obligatori"),
    ("#9 Carpeta oculta", r"\.gemini"),
]

def escanejar():
    arxius = list(WIKI.rglob("*.md"))
    tots_enllaços, definits = set(), set()
    resultats = {"enllaços_trencats": [], "orfes": [], "contradiccions": []}

    for a in arxius:
        text = a.read_text(encoding="utf-8")
        definits.add(a.stem)
        for e in ENLLAÇ.findall(text):
            tots_enllaços.add(e.split("/")[-1])
        for nom, p1, p2 in PATRONS_CONTRADICCIÓ:
            if re.search(p1, text) and re.search(p2, text) if isinstance(p2,str) else re.search(p2.pattern,text):
                resultats["contradiccions"].append(f"{nom} → {a}")

    resultats["enllaços_trencats"] = sorted(tots_enllaços - definits)
    usats = {e.split("/")[-1] for e in tots_enllaços}
    resultats["orfes"] = sorted([d for d in definits if d not in usats and not d.startswith("_")])
    return resultats

if __name__ == "__main__":
    r = escanejar()
    print(yaml.safe_dump(r, allow_unicode=True))
