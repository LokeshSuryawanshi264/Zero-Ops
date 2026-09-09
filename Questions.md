# 1) what AI model will we use and how do we use it?
Answer -We will use pre-trained **spaCy (`en_core_web_sm`)** combined with a custom rule-based **`EntityRuler`**, and a manual transliteration lookup table for Hindi names. (For future scaling post-hackathon, we'd integrate pre-trained AI4Bharat/IndicNER instead of training from scratch). 

# 2) what are the possiblites of the model making mistakes in reading the scanned files. how will it affect the output and what do we do to minimize it?
Answer - OCR tools (`pytesseract`) often misread characters (e.g., "0" as "O", typos in names). This can lead to missed connections if exact matching is used. **To minimize this:**
1. **Fuzzy Matching:** We use `RapidFuzz` to score similarity. Minor OCR typos will still yield a high match score (e.g., 85%).
2. **Attribute Boosting:** If a name has an OCR error but the associated phone number matches exactly, the confidence score is bumped up.
3. **Human-in-the-Loop (Crucial):** The system NEVER auto-merges data. It flags potential matches for an analyst to visually verify side-by-side and hit "Approve" or "Reject", ensuring OCR errors don't corrupt the final graph.

# 3) How do we store and handle the data that was created before the implementation of our solution(if its ever implemented)?
Answer - Legacy data can be handled in two ways:
1. **Manual Upload (MVP Phase):** Our system is built as an analyst's workbench. Old scanned FIRs (PDFs/Images) or past CDRs (CSVs) can simply be dragged and dropped into our existing Upload UI. The OCR and NLP pipeline will process and map these historical entities exactly like new data.
2. **Database Integration (Production Roadmap):** For a real-world rollout, we would build API adapters to bulk-ingest historical records directly from existing state databases like **ICJS or CCTNS**.
**Storage:** Once ingested, the extracted entities and relationships are stored in our Graph Database (Neo4j in production), while the original historical files are hashed and recorded in our tamper-evident ledger to preserve their chain of custody.