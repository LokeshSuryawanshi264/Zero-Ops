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

# 4) how do we plot the graphs. what info would we present and how? how can it be helpful?
Answer - 
**1. How we plot it:** 
We use an in-memory graph engine (`NetworkX`) on the backend to process connections, and a frontend visualization library (like `react-force-graph` or `Cytoscape.js`) to render it interactively. The extracted data is structured as **Nodes** (Entities) and **Edges** (Relationships).

**2. What info we present & how:**
- **Nodes (Entities):** Represent People, Phone Numbers, Vehicles, or Bank Accounts. They are color-coded and use icons for quick visual recognition (e.g., blue for phone numbers, red for known suspects).
- **Edges (Relationships):** Represent connections like "CALLED", "OWNS", or "MENTIONED_IN". 
- **Explainable Evidence:** Clicking any connecting line (edge) opens an "Evidence Card" showing the exact source document and line of text that proves this connection.
- **Time-Slider:** A temporal timeline control at the bottom of the screen allows users to filter the graph by specific date ranges.

**3. How it is helpful:**
- **Reveals Hidden Bridges:** It instantly highlights cross-case connections. For example, it visually shows if a suspect from an extortion case (FIR A) and a suspect from a smuggling case (FIR B) both transferred money to the exact same bank account. A human reading paper files might easily miss this.
- **Pre-Crime Pattern Discovery:** By dragging the time-slider, investigators can visually spot sudden spikes in communication (from CDRs) between nodes immediately before a crime date, helping establish a timeline of conspiracy.
- **Cognitive Relief:** It transforms 100 pages of disjointed text into a single, interactive 2D map, drastically reducing the time it takes an analyst to understand the criminal network.

# 5) what exactly do we mean by tamper evident ledger. how do execute it?
Answer - 
A **Tamper-Evident Ledger** is a security mechanism designed to prove that digital evidence (like uploaded FIRs or CDRs) hasn't been secretly altered after being entered into our system. This is crucial for maintaining the "Chain of Custody" required for court admissibility.

**How we execute it:**
1. **Cryptographic Hashing (The Fingerprint):** The exact millisecond a file is uploaded to the system, our backend (FastAPI) calculates its SHA-256 hash. A hash is a unique, mathematical digital fingerprint. If even a single comma is changed in that file later, the hash completely changes.
2. **Append-Only Database:** This hash, along with the upload timestamp, the uploader's user ID, and the file metadata, is recorded into a secure database table (SQLite for the MVP). This table is programmed to be "append-only"—meaning new rows can be added, but existing rows can *never* be edited or deleted by anyone, not even an admin.
3. **Verification (The "Evident" part):** If a defense attorney questions the validity of a connection on our graph, the investigator can download the source document from our system, run it through any standard hashing tool, and compare the result to our ledger. If the hashes match, it provides mathematical proof that the document is exactly the same as the day it was uploaded, proving no tampering occurred.
# 6) how will we generate reports based on the data fed to system? what will we use for that? how will the graph help us in this?
Answer - 
**1. How we generate reports & What we use:**
We will automate the generation of structured investigation summaries. When an analyst is ready, they can click "Generate Report." Our FastAPI backend will use Python libraries like **`ReportLab`** (to generate immutable PDFs) or **`python-docx`** (for editable Word files). The report will automatically compile all the "Approved" entity connections, the original source text (from the Evidence Cards), and the tamper-evident ledger hashes to ensure court-readiness.

**2. How the graph helps in this:**
The graph isn't just a visual tool; it's a mathematical data structure (`NetworkX`) that does the heavy lifting for the report:
- **Auto-Summarizing the "Shortest Path":** If an investigator selects two distant suspects on the graph, the system uses graph algorithms to instantly write out exactly how they are connected in the report (e.g., "Suspect A called Phone X, which is owned by Suspect B").
- **Identifying Key Players (Centrality):** Using graph metrics like *Degree Centrality*, the report can automatically highlight the "most connected" entities—instantly telling the investigator which phone number or person is the central hub of the operation.
- **Visual Evidence:** A high-resolution snapshot of the relevant graph cluster is directly embedded into the generated PDF, giving prosecutors and judges a clear visual aid alongside the raw text data.

# 7) how will the system perform the hash ledger entry as soon as the file is uploaded?
Answer - 
When a file is uploaded to our system via our **FastAPI** backend, the hash ledger entry is performed automatically using built-in Python libraries and an SQLite database to ensure a strict chain of custody:
1. **Immediate Hashing (`hashlib`):** The moment the file is received as an `UploadFile` object in FastAPI, before any OCR or NLP processing begins, we use Python's built-in **`hashlib`** library. We read the raw file bytes (`await file.read()`) and compute its SHA-256 hash using `hashlib.sha256(file_content).hexdigest()`.
2. **Metadata Capture:** Alongside the hash, the system captures crucial context: the exact server timestamp (`datetime.now()`), the authenticated user's ID, and the original filename (`file.filename`).
3. **Atomic Ledger Commit (SQLite / SQLAlchemy):** The hash and metadata are instantly written to our append-only ledger table. We use **`SQLAlchemy`** (or raw `sqlite3`) to execute an `INSERT` statement into our SQLite database. This is designed as an atomic transaction—if the database insert fails for any reason, an HTTP 500/400 error is returned, and the entire upload process is aborted. This guarantees that no file can ever enter the analytical pipeline without first being cryptographically sealed in the ledger.