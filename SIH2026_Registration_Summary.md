# SIH 2026 — Plan Analysis & Registration Summary

---

## 1. Plan Analysis — Is It Good Enough?

### Verdict: The plan is **excellent for a manual-build team**, but **over-engineered for an AI-assisted workflow**.

### What's Good ✅
- **Razor-sharp demo philosophy** — "Can I demo this in 20 seconds and defend it in one sentence?" is the right filter.
- **Smart tech choices** — SQLite over Postgres, NetworkX over Neo4j, rule-based NER over trained models. Zero-ops mindset is perfect for a hackathon.
- **Detailed Q&A prep** — The trap-question section is one of the strongest parts. Keep it entirely.
- **Provenance-first graph schema** — `evidence_refs`, `verified_status`, `confidence` baked into every edge. Judges will love this.
- **Single coherent demo story** — Two crime clusters + one bridge suspect is a clean narrative.

### What's Over-Complicated (Given AI-Assisted Dev) ⚠️

| Area | Current Plan | Simplified Approach |
|---|---|---|
| **6-day timeline with daily handoffs** | Detailed per-member daily tasks with strict freeze gates | With AI coding, core pipeline (upload → NER → resolve → graph) can be built in **2–3 days** by 2–3 people, leaving more time for polish & rehearsal |
| **6 specialized roles** | Each member owns a narrow slice (NLP, Graph, Backend, etc.) | AI handles boilerplate. Reduce to **3 workstreams**: (1) Full-stack app, (2) NLP + data pipeline, (3) Presentation + testing. Pair up. |
| **Custom `EntityRuler` + transliteration table** | Hand-built regex + lookup tables for Hindi names | Use an LLM API (GPT/Gemini) for entity extraction — it handles multilingual text, aliases, and fuzzy matching out of the box with a single prompt. Falls back to spaCy if API is unavailable. |
| **RapidFuzz scoring + threshold tuning** | Token sort ratio + attribute boosts + manual threshold tuning on Day 4 | LLM-based entity resolution: send candidate pairs to the model and get a structured yes/no + reasoning. More accurate, zero tuning. |
| **Separate hash-ledger engineer (Member 5)** | Full-time role for SHA-256 chain + synthetic data + QA | Hash-chain is ~50 lines of code. Synthetic data gen is a single AI prompt. Fold this into Backend (Member 4) or make it a Day 1 task for anyone. |
| **Report export via `reportlab`/`weasyprint`** | Custom PDF templating | Use a markdown-to-PDF one-liner or just serve a print-friendly HTML page. |

### Recommended Simplified Team Structure (3 workstreams × 2 people)

| Workstream | People | Scope |
|---|---|---|
| **App (Fullstack)** | Member 1 + Member 4 | UI + FastAPI + SQLite + integration |
| **Intelligence Pipeline** | Member 2 + Member 3 | NER (LLM-based) + entity resolution + NetworkX graph + Cytoscape |
| **Story & QA** | Member 5 + Member 6 | Synthetic data, demo narrative, slides, hash-ledger (trivial), rehearsal, break-testing |

> [!TIP]
> With AI doing the heavy lifting on code generation, **shift freed-up time to rehearsal and demo polish**. A flawless 2-minute demo wins over a broader but shakier feature set.

---

## 2. Overall Idea (for Registration Form)

> **Title:** AI-Powered Criminal Network Analysis & Visualization System
>
> **Idea:** An investigative decision-support tool that automatically ingests FIRs, call detail records (CDRs), and financial transaction logs, uses NLP to extract entities (persons, aliases, phone numbers, vehicles, locations), performs AI-assisted entity resolution to link identities across cases, and renders the discovered criminal network as an interactive, time-aware graph — giving law enforcement analysts a transparent, evidence-backed view of cross-case connections that would take weeks to find manually.

---

## 3. Proposed Solution (for Registration Form)

> The system provides an end-to-end pipeline:
>
> 1. **Ingest** — Upload FIRs (including scanned PDFs via OCR), CDRs, and transaction data through a web interface.
> 2. **Extract** — AI/NLP automatically identifies persons, aliases, phone numbers, vehicle plates, locations, and events from unstructured text, including multilingual (Hindi/English) content.
> 3. **Resolve** — The system flags potential identity matches across documents (e.g., "Ravi Kumar" in Case A ↔ "R. Kumar" in Case B) with confidence scores and supporting evidence. An analyst reviews and approves/rejects each match — nothing merges automatically.
> 4. **Visualize** — Resolved entities and their relationships are rendered as an interactive network graph with time-slider filtering, centrality analysis, and shortest-path queries to surface key suspects and communication patterns.
> 5. **Explain** — Every link in the graph is backed by clickable evidence cards showing the source document, timestamps, confidence score, and analyst verification status — ensuring full transparency and auditability.
> 6. **Secure** — All ingested evidence is SHA-256 hashed into a tamper-evident chain-of-custody ledger, with DPDP Act-aligned access controls and field-level PII redaction.
>
> The tool complements (not replaces) existing systems like ICJS/CCTNS by acting as an analyst workbench that processes data already collected under legal process.

---

## 4. Key Features

| # | Feature | Description |
|---|---|---|
| 1 | **Multi-format Ingestion** | Drag-and-drop upload of FIRs (text & scanned PDF via OCR), CDRs (CSV), and financial transaction logs with automatic source tagging |
| 2 | **AI-Powered Entity Extraction** | NLP-based extraction of persons, aliases, phone numbers, vehicle plates, locations, dates, and events — including Hindi/English bilingual content |
| 3 | **Intelligent Entity Resolution** | AI flags cross-case identity matches with confidence scores and "why matched" reasoning; analyst approves/rejects each — human-in-the-loop, never automatic |
| 4 | **Interactive Criminal Network Graph** | Cytoscape.js-powered graph visualization with nodes by type (person, vehicle, location, event) and edges by relationship — drag, zoom, click for details |
| 5 | **Temporal Analysis (Time-Slider)** | Slide through time to reveal when connections formed, spot communication spikes before key events, and track network evolution |
| 6 | **Centrality & Path Analysis** | Betweenness/degree centrality to identify key intermediaries; shortest-path queries to trace how two suspects are connected |
| 7 | **Explainable Evidence Cards** | Click any graph link to see the exact source documents, timestamps, call frequency, confidence score, and verification status — no black box |
| 8 | **Tamper-Evident Chain of Custody** | SHA-256 hash ledger for all ingested evidence; verify integrity at any point; audit trail for who uploaded what and when |
| 9 | **DPDP Act-Aligned Privacy Controls** | Case-scoped access, field-level PII redaction for non-relevant data, purpose-limited retention |
| 10 | **One-Click Investigation Report** | Export a structured summary of the discovered network, key suspects, evidence trail, and chain-of-custody hashes as a shareable report |
