import json, regex as re

IN  = "data/processed/passages.jsonl"
OUT = "data/processed/findings.jsonl"

# Expanded organism categories
ORGANISMS = [
    # Mammals
    "human", "humans", "mouse", "mice", "rat", "rats", "rodent", "rodents",
    "macaque", "macaques", "monkey", "monkeys", "primate", "primates",
    "rabbit", "rabbits", "pig", "pigs", "swine", "sheep", "goat", "goats",
    # Plants
    "plant", "plants", "arabidopsis", "arabidopsis thaliana", "tobacco", "rice", "wheat", "corn", "maize",
    "soybean", "soybeans", "tomato", "tomatoes", "potato", "potatoes", "lettuce", "cabbage",
    "brassica", "flax", "cotton", "barley", "oats", "sorghum", "millet",
    # Other organisms
    "drosophila", "fruit fly", "fruit flies", "zebrafish", "danio rerio", "c. elegans", "caenorhabditis elegans",
    "yeast", "saccharomyces", "candida", "bacteria", "bacterial", "e. coli", "escherichia coli",
    "tardigrade", "tardigrades", "snail", "snails", "fish", "fishes", "toadfish", "opsanus tau",
    "cell", "cells", "cell line", "cell lines", "tissue", "tissues", "organ", "organs"
]

# Expanded space environment exposures
EXPOSURES = [
    # Gravity and space environment
    "microgravity", "micro-gravity", "zero gravity", "zero-gravity", "weightlessness", "weightless",
    "spaceflight", "space flight", "space environment", "space conditions", "orbital", "low earth orbit",
    "simulated microgravity", "simulated weightlessness", "clinostat", "clinorotation", "random positioning",
    "hindlimb suspension", "hind limb suspension", "unloading", "mechanical unloading",
    # Radiation
    "radiation", "ionizing radiation", "space radiation", "cosmic radiation", "galactic cosmic rays",
    "solar particle events", "solar wind", "proton radiation", "gamma radiation", "x-ray radiation",
    "heavy ions", "iron ions", "carbon ions", "oxygen ions", "radiation exposure", "irradiation",
    # Atmospheric and environmental
    "hypoxia", "hypoxic", "hypercapnia", "hypercapnic", "co2", "carbon dioxide", "oxygen", "o2",
    "atmospheric pressure", "low pressure", "vacuum", "partial pressure", "gas composition",
    "temperature", "thermal", "cold", "heat", "thermal stress", "thermal cycling",
    # Psychological and social
    "isolation", "confinement", "stress", "psychological stress", "social isolation", "loneliness",
    "sleep", "sleep deprivation", "circadian", "circadian rhythm", "light-dark cycle",
    # Physical and mechanical
    "vibration", "vibrations", "acceleration", "g-force", "g forces", "centrifugation",
    "electromagnetic", "magnetic field", "magnetic fields", "electric field", "electric fields",
    # Chemical and biological
    "oxidative stress", "reactive oxygen species", "ros", "free radicals", "antioxidant", "antioxidants",
    "inflammation", "inflammatory", "immune", "immunity", "pathogen", "pathogens", "infection", "infections"
]

# Expanded biological outcomes and systems
OUTCOMES = [
    # Musculoskeletal system
    "bone", "bones", "skeletal", "skeleton", "osteoporosis", "osteopenia", "bone loss", "bone density",
    "bone formation", "bone resorption", "osteoblast", "osteoblasts", "osteoclast", "osteoclasts",
    "muscle", "muscles", "muscular", "muscle atrophy", "muscle loss", "muscle mass", "muscle strength",
    "sarcopenia", "myofiber", "myofibers", "myocyte", "myocytes", "muscle fiber", "muscle fibers",
    "tendon", "tendons", "ligament", "ligaments", "cartilage", "joint", "joints", "spine", "vertebrae",
    # Cardiovascular system
    "cardio", "cardiovascular", "heart", "cardiac", "myocardium", "myocardial", "blood pressure",
    "hypertension", "hypotension", "circulation", "circulatory", "vascular", "vasculature",
    "endothelial", "endothelium", "artery", "arteries", "vein", "veins", "capillary", "capillaries",
    "blood flow", "hemodynamics", "cardiac output", "stroke volume", "heart rate", "pulse",
    # Nervous system
    "neuro", "neural", "neurological", "brain", "cerebral", "cortex", "cortical", "hippocampus",
    "cerebellum", "brainstem", "neuron", "neurons", "neuronal", "synapse", "synapses", "synaptic",
    "neurotransmitter", "neurotransmitters", "dopamine", "serotonin", "acetylcholine", "gaba",
    "cognitive", "cognition", "memory", "learning", "behavior", "behaviour", "behavioral",
    "motor", "sensory", "perception", "coordination", "balance", "vestibular", "proprioception",
    # Immune system
    "immune", "immunity", "immunological", "immunity", "lymphocyte", "lymphocytes", "t cell", "t cells",
    "b cell", "b cells", "nk cell", "nk cells", "macrophage", "macrophages", "neutrophil", "neutrophils",
    "cytokine", "cytokines", "interleukin", "interferon", "tumor necrosis factor", "tnf",
    "antibody", "antibodies", "immunoglobulin", "immunoglobulins", "complement", "inflammation",
    "inflammatory", "anti-inflammatory", "pro-inflammatory", "immune response", "immune function",
    # Endocrine system
    "endocrine", "hormone", "hormones", "hormonal", "insulin", "glucose", "glucagon", "cortisol",
    "testosterone", "estrogen", "estradiol", "progesterone", "thyroid", "thyroxine", "t3", "t4",
    "growth hormone", "gh", "igf-1", "leptin", "adiponectin", "melatonin", "circadian",
    # Metabolic system
    "metabolism", "metabolic", "glucose", "glucose metabolism", "insulin resistance", "diabetes",
    "lipid", "lipids", "cholesterol", "triglyceride", "triglycerides", "fatty acid", "fatty acids",
    "protein", "proteins", "amino acid", "amino acids", "protein synthesis", "protein degradation",
    "atp", "mitochondria", "mitochondrial", "oxidative phosphorylation", "glycolysis",
    # Gene expression and molecular
    "gene expression", "gene regulation", "transcription", "transcriptional", "translation",
    "mrna", "rna", "dna", "genome", "genomic", "epigenetic", "epigenetics", "methylation",
    "histone", "histones", "chromatin", "chromosome", "chromosomes", "telomere", "telomeres",
    "protein expression", "protein synthesis", "protein degradation", "proteome", "proteomic",
    "metabolome", "metabolomic", "transcriptome", "transcriptomic", "omics", "multi-omics",
    # Cellular and molecular processes
    "cell cycle", "apoptosis", "necrosis", "autophagy", "senescence", "differentiation",
    "proliferation", "migration", "adhesion", "signaling", "signal transduction", "pathway", "pathways",
    "receptor", "receptors", "ligand", "ligands", "enzyme", "enzymes", "kinase", "kinases",
    "phosphatase", "phosphatases", "transcription factor", "transcription factors", "tfs",
    # Organ systems
    "liver", "hepatic", "kidney", "renal", "lung", "pulmonary", "respiratory", "gastrointestinal",
    "gi tract", "intestine", "intestinal", "stomach", "gastric", "pancreas", "pancreatic",
    "spleen", "thymus", "bone marrow", "adipose", "fat", "adipocyte", "adipocytes",
    "skin", "dermal", "epidermal", "hair", "follicle", "follicles", "eye", "ocular", "retinal",
    "ear", "auditory", "vestibular", "balance", "equilibrium", "cochlea", "semicircular canals"
]

# Expanded directional and effect words
UP_WORDS = [
    "increase", "increases", "increased", "increasing", "increment", "incremental",
    "upregulate", "upregulated", "upregulating", "upregulation", "up-regulated",
    "elevated", "elevation", "elevating", "elevate", "elevates",
    "higher", "highest", "high", "heightened", "heightening",
    "enhanced", "enhance", "enhances", "enhancing", "enhancement",
    "amplified", "amplify", "amplifies", "amplifying", "amplification",
    "boosted", "boost", "boosts", "boosting", "augmented", "augment", "augments", "augmenting",
    "promoted", "promote", "promotes", "promoting", "promotion", "stimulated", "stimulate",
    "stimulates", "stimulating", "stimulation", "activated", "activate", "activates", "activating",
    "activation", "induced", "induce", "induces", "inducing", "induction", "triggered", "trigger",
    "triggers", "triggering", "facilitated", "facilitate", "facilitates", "facilitating",
    "facilitation", "accelerated", "accelerate", "accelerates", "accelerating", "acceleration",
    "intensified", "intensify", "intensifies", "intensifying", "intensification", "strengthened",
    "strengthen", "strengthens", "strengthening", "strengthening", "improved", "improve",
    "improves", "improving", "improvement", "upward", "upwards", "rise", "rises", "rising",
    "surge", "surges", "surging", "spike", "spikes", "spiking", "peak", "peaks", "peaking"
]

DOWN_WORDS = [
    "decrease", "decreases", "decreased", "decreasing", "decrement", "decremental",
    "downregulate", "downregulated", "downregulating", "downregulation", "down-regulated",
    "reduced", "reduce", "reduces", "reducing", "reduction", "reductive",
    "lower", "lowest", "low", "lowered", "lowering", "depressed", "depress", "depresses",
    "depressing", "depression", "suppressed", "suppress", "suppresses", "suppressing",
    "suppression", "inhibited", "inhibit", "inhibits", "inhibiting", "inhibition", "inhibitory",
    "blocked", "block", "blocks", "blocking", "blockade", "prevented", "prevent", "prevents",
    "preventing", "prevention", "preventive", "attenuated", "attenuate", "attenuates",
    "attenuating", "attenuation", "diminished", "diminish", "diminishes", "diminishing",
    "diminution", "declined", "decline", "declines", "declining", "decline", "deteriorated",
    "deteriorate", "deteriorates", "deteriorating", "deterioration", "impaired", "impair",
    "impairs", "impairing", "impairment", "compromised", "compromise", "compromises",
    "compromising", "compromise", "weakened", "weaken", "weakens", "weakening", "weakening",
    "worsened", "worse", "worsen", "worsens", "worsening", "deteriorated", "deteriorate",
    "deteriorates", "deteriorating", "deterioration", "downward", "downwards", "fall", "falls",
    "falling", "drop", "drops", "dropping", "plunge", "plunges", "plunging", "crash", "crashes",
    "crashing", "collapse", "collapses", "collapsing", "shrink", "shrinks", "shrinking",
    "contraction", "contract", "contracts", "contracting", "constriction", "constrict",
    "constricts", "constricting"
]

# Expanded mitigation and protection words
MITI_WORDS = [
    "mitigate", "mitigates", "mitigated", "mitigating", "mitigation", "alleviate", "alleviates",
    "alleviated", "alleviating", "alleviation", "attenuate", "attenuates", "attenuated",
    "attenuating", "attenuation", "counteract", "counteracts", "counteracted", "counteracting",
    "counteraction", "protect", "protects", "protected", "protecting", "protection", "protective",
    "ameliorate", "ameliorates", "ameliorated", "ameliorating", "amelioration", "prevent",
    "prevents", "prevented", "preventing", "prevention", "preventive", "block", "blocks",
    "blocked", "blocking", "blockade", "inhibit", "inhibits", "inhibited", "inhibiting",
    "inhibition", "inhibitory", "suppress", "suppresses", "suppressed", "suppressing",
    "suppression", "suppressive", "resist", "resists", "resisted", "resisting", "resistance",
    "resistant", "defend", "defends", "defended", "defending", "defense", "defensive",
    "shield", "shields", "shielded", "shielding", "shelter", "shelters", "sheltered",
    "sheltering", "buffer", "buffers", "buffered", "buffering", "cushion", "cushions",
    "cushioned", "cushioning", "compensate", "compensates", "compensated", "compensating",
    "compensation", "compensatory", "restore", "restores", "restored", "restoring",
    "restoration", "restorative", "recover", "recovers", "recovered", "recovering",
    "recovery", "rehabilitate", "rehabilitates", "rehabilitated", "rehabilitating",
    "rehabilitation", "rehabilitative", "therapeutic", "therapy", "treatment", "treatments",
    "intervention", "interventions", "countermeasure", "countermeasures", "remedy", "remedies",
    "solution", "solutions", "rescue", "rescues", "rescued", "rescuing", "salvage",
    "salvages", "salvaged", "salvaging", "preserve", "preserves", "preserved", "preserving",
    "preservation", "preservative", "maintain", "maintains", "maintained", "maintaining",
    "maintenance", "sustain", "sustains", "sustained", "sustaining", "sustainability",
    "sustainable", "stabilize", "stabilizes", "stabilized", "stabilizing", "stabilization",
    "stabilizing", "normalize", "normalizes", "normalized", "normalizing", "normalization"
]

def any_in(words, text):
    """Find all matching words from a list in text (case-insensitive)"""
    t = text.lower()
    return [w for w in words if w in t]

def find_phrases(phrases, text):
    """Find multi-word phrases in text (case-insensitive)"""
    t = text.lower()
    found = []
    for phrase in phrases:
        if phrase.lower() in t:
            found.append(phrase)
    return found

def direction(text):
    """Determine the direction of effect based on keywords"""
    t = text.lower()
    
    # Check for mitigation/protection words first (highest priority)
    if any(w in t for w in MITI_WORDS): 
        return "mitigates"
    
    # Check for increase/upregulation words
    if any(w in t for w in UP_WORDS):   
        return "increase"
    
    # Check for decrease/downregulation words
    if any(w in t for w in DOWN_WORDS): 
        return "decrease"
    
    return "unspecified"

def calculate_confidence(text, section, organisms, exposures, outcomes):
    """Calculate confidence score based on multiple factors"""
    base_score = 1.0 if "results" in section else 0.7 if "conclusion" in section else 0.4
    
    # Boost confidence for multiple matches
    if len(organisms) > 1:
        base_score += 0.1
    if len(exposures) > 1:
        base_score += 0.1
    if len(outcomes) > 1:
        base_score += 0.1
    
    # Boost confidence for specific scientific terms
    scientific_terms = ["significant", "significantly", "p<", "p <", "p=", "p =", "statistical", 
                       "statistically", "correlation", "correlated", "association", "associated",
                       "mechanism", "pathway", "regulation", "regulated", "expression", "expressed"]
    
    if any(term in text.lower() for term in scientific_terms):
        base_score += 0.1
    
    # Boost confidence for quantitative terms
    quantitative_terms = ["fold", "times", "percent", "%", "ratio", "concentration", "level", "levels",
                         "amount", "quantity", "dose", "doses", "mg", "ml", "μl", "ng", "μg", "mM", "μM"]
    
    if any(term in text.lower() for term in quantitative_terms):
        base_score += 0.1
    
    return min(base_score, 1.0)  # Cap at 1.0

def extract_measurements(text):
    """Extract numerical measurements and units from text"""
    import re
    
    # Common measurement patterns
    patterns = [
        r'(\d+\.?\d*)\s*(mg|ml|μl|ng|μg|mM|μM|g|kg|mg/kg|ml/kg|fold|times|x)',
        r'(\d+\.?\d*)\s*(%)',
        r'(\d+\.?\d*)\s*(fold|times|x)\s*(increase|decrease|reduction|elevation)',
        r'p\s*[<>=]\s*(\d+\.?\d*)',
        r'(\d+\.?\d*)\s*±\s*(\d+\.?\d*)',  # mean ± SD
    ]
    
    measurements = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        measurements.extend(matches)
    
    return measurements

def categorize_outcome(outcome):
    """Categorize outcomes into broader biological systems"""
    categories = {
        "musculoskeletal": ["bone", "muscle", "skeletal", "osteoporosis", "sarcopenia", "tendon", "ligament", "cartilage"],
        "cardiovascular": ["cardio", "heart", "cardiac", "blood pressure", "circulation", "vascular", "endothelial"],
        "nervous": ["neuro", "brain", "neural", "cognitive", "memory", "behavior", "motor", "sensory"],
        "immune": ["immune", "lymphocyte", "cytokine", "inflammation", "antibody", "immunoglobulin"],
        "metabolic": ["metabolism", "glucose", "insulin", "lipid", "cholesterol", "protein", "mitochondria"],
        "endocrine": ["hormone", "insulin", "cortisol", "testosterone", "estrogen", "thyroid", "melatonin"],
        "molecular": ["gene expression", "transcription", "mrna", "dna", "protein expression", "epigenetic"],
        "cellular": ["cell cycle", "apoptosis", "proliferation", "differentiation", "signaling", "receptor"]
    }
    
    outcome_lower = outcome.lower()
    for category, keywords in categories.items():
        if any(keyword in outcome_lower for keyword in keywords):
            return category
    
    return "other"

with open(IN, encoding="utf-8") as fin, open(OUT, "w", encoding="utf-8") as fout:
    findings_count = 0
    
    for line in fin:
        rec = json.loads(line)
        sec = rec.get("section","")
        text = rec["text"]
        
        # Find all matching terms
        orgs = any_in(ORGANISMS, text)
        expos = any_in(EXPOSURES, text)
        outs = any_in(OUTCOMES, text)
        dire = direction(text)
        
        # Calculate enhanced confidence score
        confidence = calculate_confidence(text, sec, orgs, expos, outs)
        
        # Extract measurements
        measurements = extract_measurements(text)
        
        # Check if this passage contains a finding
        has_finding = False
        
        # Original criteria: exposure + outcome OR organism + outcome
        if (expos and outs) or (orgs and outs):
            has_finding = True
        
        # Additional criteria: any significant scientific finding
        scientific_indicators = ["significant", "significantly", "p<", "p <", "p=", "p =", 
                               "statistical", "statistically", "correlation", "correlated", 
                               "association", "associated", "mechanism", "pathway", "regulation"]
        
        if any(indicator in text.lower() for indicator in scientific_indicators):
            if orgs or expos or outs:
                has_finding = True
        
        # Additional criteria: quantitative findings
        if measurements and (orgs or expos or outs):
            has_finding = True
        
        if has_finding:
            # Categorize the primary outcome
            primary_outcome = outs[0] if outs else None
            outcome_category = categorize_outcome(primary_outcome) if primary_outcome else "other"
            
            finding = {
                "study_id": rec["study_id"],
                "passage_anchor": rec["anchor"],
                "section": sec,
                "organism": orgs[0] if orgs else None,
                "organisms_all": orgs,  # All found organisms
                "exposure": expos[0] if expos else None,
                "exposures_all": expos,  # All found exposures
                "outcome": primary_outcome,
                "outcomes_all": outs,  # All found outcomes
                "outcome_category": outcome_category,
                "direction": dire,
                "confidence": round(confidence, 3),
                "measurements": measurements,
                "summary": re.sub(r"\s+"," ", text)[:300],  # Increased summary length
                "images": rec.get("images", []),  # Include image metadata
                "word_count": len(text.split()),
                "has_statistics": any(term in text.lower() for term in ["p<", "p <", "p=", "p =", "significant", "statistical"]),
                "has_measurements": len(measurements) > 0
            }
            fout.write(json.dumps(finding, ensure_ascii=False) + "\n")
            findings_count += 1

print(f"OK -> {OUT} ({findings_count} findings extracted)")
