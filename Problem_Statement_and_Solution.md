# Problem Statement & Solution Overview

## 🚨 The Problem Statement
In modern law enforcement, investigators are overwhelmed with disjointed data. During an investigation, officers have to manually cross-reference unstructured text from First Information Reports (FIRs), tabular data from Call Detail Records (CDRs), financial transaction logs, and more. 

**The core issues are:**
1. **Time Inefficiency:** Manually reading and finding connections across hundreds of pages of documents takes days or weeks.
2. **Missed Connections:** Subtle links between separate crimes (e.g., an extortion case and an illegal arms case sharing a secondary phone number or an alias) are easily missed by human eyes.
3. **Lack of Provenance:** When a link *is* found manually, tracing it back to the exact source document for court evidence is cumbersome.

The goal is to solve the bottleneck of manual link-discovery across multi-modal police data without creating an unexplainable "black box".

---

## 💡 Our Solution: AI-Powered Criminal Network Analysis System
Our solution is an **investigative decision-support tool**. It acts as an analyst's workbench that automatically extracts, resolves, and visualizes connections between entities across multiple cases.

**Key Features:**
- **Automated Ingestion & Extraction:** Upload FIRs (even scanned PDFs), CDRs, and CSVs. The system uses OCR and NLP (Named Entity Recognition) to pull out people, aliases, phone numbers, vehicles, locations, and events.
- **Human-in-the-Loop Entity Resolution:** Instead of automatically merging records, the system flags potential matches (e.g., "Ravi Kumar" in Case A and "R. Kumar" in Case B) with a fuzzy-match score. An analyst must explicitly **Approve or Reject** the link, keeping the human in control.
- **Temporal Knowledge Graph:** Extracted entities are plotted on a visual graph. A unique time-slider allows investigators to filter by date, revealing things like sudden spikes in call frequency right before a crime occurred.
- **Explainable Evidence:** Every line connecting two nodes on the graph can be clicked to open an "Evidence Card," showing exactly which document and line the connection came from. 
- **Tamper-Evident Ledger:** Every uploaded file is hashed and added to an append-only SQLite ledger to maintain a verifiable chain of custody.

**Crucial Guardrail (What this is NOT):**
This is **NOT** a predictive policing tool. It does not calculate "guilt scores" or make decisions. It only surfaces candidate links and requires human verification, making it fully defensible in court.

---

## 📊 Presentation Structure Guidelines
For our 6-minute pitch and live demo, the presentation should be tight, coherent, and focus heavily on the narrative. Here is the suggested 8-10 slide structure:

1. **Title Slide:** Team Name, Problem Statement ID, and a one-line tagline (e.g., "Defensible Link-Discovery for Modern Investigations").
2. **The Problem:** The cost of manual cross-referencing. Focus on the time lost and the critical links missed between separate cases.
3. **Guardrails (What this is NOT):** Address the judges' biggest fear immediately. Emphasize that this is decision-*support*, not a black box "guilt" predictor. 
4. **Solution Overview Flow:** A simple diagram showing the pipeline: `Ingest → Extract → Resolve → Graph → Explain`.
5. **Innovation Highlights:** Call out our unique technical choices:
   - Investigator-in-the-loop resolution.
   - Explainable "Why Linked" evidence cards.
   - Temporal Graph with time-slider.
6. **Architecture & Stack:** Keep it brief. Mention React, FastAPI, NetworkX (in-memory graph), and SQLite. Emphasize that it's designed to be zero-ops and reliable.
7. **Live Demo (The Story):** *Transition slide.*
   - **The Narrative:** Demo an Extortion Case (A) and an Illegal Arms Case (B).
   - Show how the system finds a bridge suspect connecting them. 
   - Demonstrate the analyst approving the match, the graph updating, and using the time-slider to find a pre-crime communication spike.
8. **Security & Compliance:** Explain the chain-of-custody hash ledger. Mention DPDP Act alignment (data is case-scoped, field-level redaction possible). Explain how it *complements* ICJS/CCTNS rather than duplicating them.
9. **Impact & Roadmap:** How we scale (moving to Neo4j graph database in production, adding better Indic language NER models).
10. **Thank You / The Ask:** Conclude with what we need next (e.g., pilot precinct, data partner).
