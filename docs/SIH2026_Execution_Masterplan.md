# AI-Powered Criminal Network Analysis System
## SIH 2026 Internal College Evaluation — 6-Day Execution Master Plan

**Team size:** 6 | **Time to evaluation:** 6 days | **Guardrail:** investigative decision-support tool, not predictive policing / not a black box

**Operating rule for the whole sprint:** every feature must survive this test — *"Can I demo this live in under 20 seconds and defend it in one sentence if a judge pushes back?"* If not, cut it or fake it with pre-staged data. Judges reward a tight, coherent, explainable story over a long feature list.

---

## SECTION 1 — Team Role Division & Responsibility Matrix

### Member 1 — Lead Fullstack / UI Engineer (also Integration Owner)
**Stack:** React 18 + Vite + TypeScript, TailwindCSS, shadcn/ui, Zustand (state), TanStack Query (data fetching), React Router.

- **Day 1:** Scaffold repo (frontend + backend monorepo), agree on folder structure and Git branching (`main` protected, feature branches, PR into `dev`), build app shell (nav, upload page, graph page, report page placeholders), lock UI wireframes with Member 6.
- **Day 2:** Build Upload & Ingestion screen (drag-drop FIR/PDF/CSV, upload progress, source tagging), stub API calls against the frozen contract from Member 4.
- **Day 3:** Build Entity Resolution review screen — side-by-side candidate pairs, similarity % badge, shared-attribute chips (phone/location), Approve/Reject buttons wired to backend.
- **Day 4:** Integrate graph canvas component built by Member 3; wire time-slider, entity-type/date/confidence filters, verified-vs-unverified toggle.
- **Day 5:** Full end-to-end integration pass with all members; fix cross-component bugs; add loading/empty/error states so nothing looks broken on stage; responsive layout for projector resolution.
- **Day 6:** Final polish (consistent spacing, color for confidence levels, no console errors visible), freeze UI, support rehearsals, own the laptop/demo environment setup.
- **Handoffs owed:** working upload UI (by end D2) so Backend can test against it; resolution UI (by end D3) so NLP's fuzzy scores have somewhere to render; graph shell (by end D4) so Analytics can plug in data.

### Member 2 — NLP / NER & Entity Extraction Engineer
**Stack:** Python, spaCy (`en_core_web_sm` + custom `EntityRuler`), `pytesseract` + `pdf2image` (OCR for scanned FIRs), `dateparser`, `RapidFuzz` (fuzzy scoring), a small hand-built Hindi-name transliteration lookup table (safer than training a real Indic NER model in 6 days).

- **Day 1:** List entity types to extract (Person, Alias, Phone, Vehicle Plate, Location, Date, Event). Write regex patterns for phone numbers and Indian vehicle plates (`[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}`). Agree on JSON output contract with Member 4.
- **Day 2:** Build the extraction pipeline: OCR → text → spaCy NER + EntityRuler → structured entities. Test on 3–4 sample FIR-style paragraphs (including transliterated Hindi names).
- **Day 3:** Build the RapidFuzz-based candidate scoring function for entity resolution — combine name similarity (token_sort_ratio) with shared-attribute boosts (same phone / same location = score bump). Output candidate pairs with a confidence 0–1.
- **Day 4:** Tune thresholds against the synthetic dataset (Member 5) so the "Ravi Kumar vs R. Kumar" style demo pair lands cleanly around 80–90%. Add "why matched" reasoning strings (which attributes drove the score) — this feeds Explainability.
- **Day 5:** Bug-fix extraction on the real demo documents used in rehearsal; freeze thresholds.
- **Day 6:** Support rehearsal, be ready to explain "how does NER work" and "how accurate is it" for Q&A.
- **Handoffs owed:** entity extraction JSON (by end D2) to Backend; scored candidate pairs + reasoning strings (by end D3) to Backend/UI.

### Member 3 — Graph & Analytics Engineer
**Stack:** Python, NetworkX (in-memory graph, no external graph DB — avoids live-demo network/infra risk), Cytoscape.js on the frontend (best plugin support for time filtering + layouts like `cytoscape-fcose`).

- **Day 1:** Finalize graph schema (node/edge types, properties — see Section 3) with Member 4. Decide snapshot approach for time-slider (edges carry `first_seen`/`last_seen`, filter by range rather than rebuilding graph per frame).
- **Day 2:** Build NetworkX graph builder that ingests resolved entities + relationships into nodes/edges with provenance fields.
- **Day 3:** Implement centrality metrics (betweenness, degree) and shortest-path query; expose via API. Start Cytoscape.js rendering component (nodes styled by type, edges by verified/unverified).
- **Day 4:** Build time-slider filtering (client-side filter on `first_seen`/`last_seen` against slider value) and the entity-type/confidence filters. Wire "click edge → evidence" hook for Explainability.
- **Day 5:** Integration with UI; performance pass so the graph doesn't stutter with ~50 nodes / 200 edges; visually highlight the "bridge suspect" path for the demo story.
- **Day 6:** Support rehearsal, be ready to explain algorithmic choices and scaling roadmap (Q&A trap on scale).
- **Handoffs owed:** graph API endpoints + Cytoscape-ready JSON format (by end D3) to Lead/UI; centrality/shortest-path endpoints (by end D3) to Backend.

### Member 4 — Backend / API Engineer
**Stack:** FastAPI (Python 3.11) + Uvicorn, Pydantic v2 schemas, SQLite (chosen over Postgres/Neo4j deliberately — zero ops, single file, trivial to reset before a demo, no server to keep alive on stage).

- **Day 1:** Own the API contract (endpoints, request/response schemas) and publish it to the whole team by end of day — this is the **first freeze point**. Endpoints: upload, get-entities, get-candidate-pairs, resolve-entity (approve/reject), get-graph, get-evidence/{edge_id}, export-report.
- **Day 2:** Implement upload + storage endpoints, SQLite schema migrations, wire NLP pipeline (Member 2) into an ingestion job.
- **Day 3:** Implement entity resolution endpoints (approve/reject persists `verified_status`), wire graph endpoints from Member 3.
- **Day 4:** Implement evidence/explainability endpoint (returns source doc snippet, timestamps, call frequency, confidence for a given edge) and the report export endpoint (templated PDF/markdown via `reportlab` or `weasyprint`).
- **Day 5:** Integration bug-fixing across all pipelines; add basic error handling so a bad upload doesn't crash the live demo.
- **Day 6:** Freeze backend; only critical-path fixes; support rehearsal.
- **Handoffs owed:** **API contract by end of Day 1** (blocks everyone), working ingestion endpoint (by end D2), resolution + graph endpoints (by end D3), evidence + report endpoints (by end D4).

### Member 5 — Security / Data & Hash-Ledger Engineer
**Stack:** Python `hashlib` (SHA-256), `Faker` (`en_IN` locale) for synthetic data generation, SQLite append-only ledger table.

- **Day 1:** Design the synthetic dataset spec with Member 6 (the case narrative — two clusters + one bridge suspect) so data generation and pitch story are the same story. Design the hash-ledger schema: `ledger_entry(id, evidence_id, sha256_hash, prev_hash, timestamp, uploader)` — an append-only hash chain, explicitly **not** a real blockchain (no consensus, no distributed nodes — keep it simple and defensible).
- **Day 2:** Write and run the synthetic dataset generator script (see Section 3) — 30–50 persons, 10–15 alias variants, 100–200 calls/transactions, one clearly plantable bridge suspect connecting two crime clusters, with a call-frequency spike before the key event date.
- **Day 3:** Implement the hash-ledger: hash every uploaded evidence file on ingestion, chain it to the previous hash, expose a "verify integrity" endpoint/UI badge.
- **Day 4:** Build the small "chain of custody" panel (list of evidence files with hash + verified/tamper-flag) and DPDP-alignment notes (field-level redaction toggle for non-relevant PII) — this becomes ammunition for the privacy Q&A.
- **Day 5:** Full QA pass — deliberately try to break the pipeline (bad file types, duplicate uploads, empty CSVs) and file bugs to the right owner. Own the "backup dataset" that will be used if live upload fails on stage.
- **Day 6:** Freeze data; verify the exact demo dataset loads cleanly from a cold start (fresh SQLite file) at least 3 times in a row.
- **Handoffs owed:** synthetic dataset files (by end D2) to everyone; hash-ledger endpoints (by end D3) to Backend/UI.

### Member 6 — Product / Presentation & Pitch Lead
**Stack:** Slides (Google Slides/PowerPoint), no code ownership — full-time on narrative, positioning, and rehearsal from Day 3 onward.

- **Day 1:** Research ICJS/CCTNS positioning (how this complements, not duplicates, existing systems) and DPDP Act basics; co-design the demo case narrative (Extortion Case A + Illegal Arms Case B linked via a bridge alias) with Member 5 so the data supports the story exactly.
- **Day 2:** Draft the 8–10 slide deck skeleton (Section 4) and the one-sentence problem statement the whole team will repeat consistently.
- **Day 3:** Write the 120-second live demo script (Section 4) in exact click-by-click detail; hand to Member 1 to validate every click is technically feasible by then.
- **Day 4:** Build slide visuals (architecture diagram, before/after story graphic); compile the Q&A "trap question" answer sheet (Section 4) and drill it with the team.
- **Day 5:** Run rehearsal #1 end-to-end with a stopwatch; cut anything over time; record a backup demo video in case live wifi/hardware fails.
- **Day 6:** Run rehearsal #2 and #3, drill Q&A cold-call style, confirm who answers which question type, final timing check (target under 5:30 to leave buffer).
- **Handoffs owed:** locked demo narrative (by end D3) so engineering builds toward one story, not generic features.

---

## SECTION 2 — Day-by-Day Sprint Plan & Integration Checkpoints

| Day | Theme | Key Milestones | Freeze / Checkpoint | End-of-Day Integration Test |
|---|---|---|---|---|
| **Day 1** | Foundation | Repo scaffolded, schema agreed, **API contract published**, demo narrative + synthetic data spec agreed | API contract freeze (evening) | Everyone can run the empty scaffold locally |
| **Day 2** | Core pipelines | Upload UI live, NER pipeline extracting entities, synthetic dataset generator running, ledger schema built | — | Raw file → extracted entities works end-to-end (no UI polish yet) |
| **Day 3** | Resolution + Graph v1 | Entity resolution UI + fuzzy scoring wired, graph builder producing NetworkX graph, Cytoscape rendering first pass, full synthetic dataset loaded | **First full pipeline integration test** | Upload → extract → resolve → graph renders, end to end |
| **Day 4** | Explainability + polish | Time-slider, filters, evidence cards, report export, hash-ledger UI, deck v1 draft | **Feature freeze** (no new features after today) | Full user journey walkable without a developer narrating fixes |
| **Day 5** | Integration & rehearsal #1 | Full bug bash, cross-browser/projector check, rehearsal with stopwatch, backup demo video recorded | **Code freeze** (bug fixes only) | Cold-start demo run 3x in a row without crashing |
| **Day 6** | Rehearse & harden | 2–3 more full rehearsals, Q&A drilling, laptop/backup setup, sample exported report printed | Go/No-Go check morning of | Final dry run mimicking exact evaluation room conditions |

**Daily process (cheap but non-negotiable):** 15-minute morning sync (what's blocking you) + 15-minute evening integration check (does the pipeline still work end-to-end after today's changes). This catches integration rot before it becomes a Day-5 fire.

---

## SECTION 3 — Technical Stack, Architecture, Schema & Synthetic Data

### 3.1 Stack (deliberately minimal — no infra you have to babysit on stage)

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + TypeScript, Tailwind, shadcn/ui | Fast to build, looks polished with little effort |
| Graph viz | Cytoscape.js (+ `cytoscape-fcose` layout) | Best time-filter/plugin support of the JS graph libraries |
| Backend | FastAPI (Python) | Fast to write, auto docs, easy Pydantic validation |
| Database | SQLite | Zero ops, single file, trivial to reset before a demo — Postgres/Neo4j add real infra risk for no MVP benefit |
| Graph engine | NetworkX (in-memory) | No server dependency; schema is DB-agnostic so swapping to Neo4j later is a stated roadmap item, not a Day-1 requirement |
| NLP/NER | spaCy + custom `EntityRuler`, `RapidFuzz`, `pytesseract`/`pdf2image` | Reliable, well-documented, no model training needed |
| Hash ledger | Python `hashlib.sha256`, append-only SQLite table | Achieves tamper-evidence without deploying a real blockchain |
| Deployment | Single process serving API + built frontend, run locally; optional Render/Railway link as a fallback for judges to browse independently | Removes conference-wifi risk from the live demo |

**Explicitly avoid:** deploying Neo4j/Postgres servers, a real blockchain/Hyperledger stack, training a custom Indic NER model, Kubernetes/Docker Compose multi-service orchestration for the demo machine. None of these move the judging needle in 6 days; all of them add failure surface.

### 3.2 Architecture (text diagram)

```
[Upload UI] --> [FastAPI: /upload] --> [Hash Ledger: sha256 + chain]
                                    --> [OCR (if PDF)] --> [NER/EntityRuler]
                                                              |
                                                              v
                                            [Entity Resolution: RapidFuzz scoring]
                                                              |
                                        [Resolution UI: analyst approve/reject]
                                                              |
                                                              v
                                              [NetworkX Graph Builder]
                                                    |             |
                                    [Centrality/Shortest Path]  [Evidence/Explainability API]
                                                    |             |
                                                    v             v
                                    [Cytoscape.js Graph UI + Time-slider + Filters]
                                                              |
                                                              v
                                                [Report Generator: PDF export]
```

### 3.3 Graph Data Schema

**Node types**
- `Person` — `name`, `aliases[]`, `phone_numbers[]`, `addresses[]`, `cluster_id` (optional, for demo visualization)
- `Vehicle` — `plate`, `type`, `owner_person_id`
- `Location` — `name`, `area_code` / `lat,lng`
- `Event` — `type` (FIR / Call / Transaction / Sighting), `timestamp`
- `CrimeCase` — `fir_number`, `section_of_law`, `cluster_id`

**Edge types** — `COMMUNICATED_WITH`, `TRANSACTED_WITH`, `SEEN_AT`, `OWNS`, `LINKED_TO_CASE`, `ALIAS_OF` (the resolved-identity link)

**Edge properties (common to every edge — this is the provenance layer judges will ask about):**

| Property | Purpose |
|---|---|
| `source` | which document/CDR row/transaction log this edge came from |
| `first_seen` / `last_seen` | drives the time-slider |
| `frequency` / `weight` | e.g. call count, transaction count |
| `confidence` | 0–1 score from resolution/extraction |
| `verified_status` | `unverified` / `analyst_approved` / `analyst_rejected` |
| `evidence_refs[]` | document IDs backing this edge, used by the "why linked" card |
| `created_by` | `system` or an analyst ID — accountability trail |

### 3.4 Synthetic Dataset Generator — script structure

```
generate_dataset.py
├── generate_persons(n=40)                     # Faker('en_IN'), 10–15 with alias variants
│     - includes deliberate near-duplicates: "Ravi Kumar" / "R. Kumar" / "Raviz"
├── define_two_crime_clusters(persons)          # Cluster A: extortion case, Cluster B: arms case
│     - pick ONE bridge_suspect present in both clusters (shared phone + alias)
├── generate_cdr(persons, n_calls=150)          # timestamped calls
│     - inject a call-frequency spike for bridge_suspect in the 48h before the "event" date
├── generate_transactions(persons, n=100)       # timestamped financial transfers
├── generate_locations_and_sightings(persons)
├── generate_fir_documents(clusters)            # templated text, some Hindi-transliterated names,
│                                                #   a couple rendered as scanned-look PDFs for OCR demo
├── write_outputs()                             # /data/*.csv, *.json, *.pdf
└── write_ground_truth.json                     # records bridge_suspect + expected resolved links
                                                 #   — used to sanity-check the pipeline and to script the demo
```

Keep the dataset small and deterministic (fixed random seed) so every rehearsal produces the identical story.

---

## SECTION 4 — 6-Minute Pitch & Live Demo

### 4.1 Slide Structure (8–10 slides)

1. **Title** — team name, problem statement ID, one-line tagline
2. **Problem framing** — the cost of manually cross-referencing FIRs, CDRs, and financial logs by hand; time lost, links missed
3. **What this is NOT** — explicit guardrail slide: decision-support and link-discovery, not a guilt/risk score, not predictive policing (this slide pre-empts your hardest Q&A)
4. **Solution overview** — one clean diagram of the flow (ingest → extract → resolve → graph → explain)
5. **Innovation highlights** — investigator-in-the-loop resolution, explainable "why linked" evidence cards, temporal graph
6. **Architecture & stack** — the diagram from Section 3.2, kept simple
7. **Live demo** — transition slide only
8. **Security & compliance** — chain-of-custody hash ledger, DPDP-aligned access/redaction, complements ICJS/CCTNS
9. **Impact & roadmap** — scale to production graph DB, real Indic NER, ICJS API integration
10. **Thank you / ask** — what you need next (mentor time, data partner, pilot precinct)

### 4.2 120-Second Live Demo Narrative

A single coherent story: **Extortion Case A** and **Illegal Arms Case B**, connected through an intermediary alias, with a communication spike before the extortion event.

- **0:00–0:15** — Open on an empty graph. Upload the two pre-staged FIRs + CDR + transaction CSV (fast, not typed live).
- **0:15–0:35** — Extracted entities populate the side panel; call out the bilingual extraction catching a Hindi-transliterated alias.
- **0:35–0:55** — Entity Resolution screen: the system flags "Ravi Kumar" (Case A) against "R. Kumar / Raviz" (Case B) at ~84% match, shared phone digits highlighted. Click **Approve**.
- **0:55–1:20** — Graph updates live: the bridge node now connects both clusters. Drag the time-slider to reveal the call-frequency spike in the 48 hours before the extortion event.
- **1:20–1:45** — Click the spiking edge → evidence card opens: source CDR rows, timestamps, call count, confidence 0.84, `unverified` badge until an analyst signs off.
- **1:45–2:00** — One click to export the investigation summary report, showing the SHA-256 chain-of-custody hash for the source evidence file. Close on: *"This isn't a probability score — it's a transparent, evidence-backed trail an investigator can defend in court."*

### 4.3 Trap Questions & Model Answers

**Q: "Isn't this just predictive policing with extra steps?"**
A: No individual is ever scored for "criminality." The system only proposes that a *link* between two records might exist, with the evidence attached, and every link needs analyst approval before it's treated as real. That approval is logged — the opposite of a black box.

**Q: "How is an AI-suggested link legally admissible?"**
A: It isn't, on its own — and it doesn't claim to be. The system never asserts a fact; it surfaces a candidate connection with its source evidence. Only what an analyst reviews, approves, and signs off on enters the case file — the same process as manual link-charting today, just faster and with a recorded trail.

**Q: "What about the privacy of everyone whose data gets pulled in, under the DPDP Act?"**
A: Access is scoped per case and per authorized investigator, non-relevant PII can be redacted at field level, and data doesn't get used outside the case it was ingested for. Retention is tied to the case lifecycle, matching purpose-limitation principles under the DPDP Act.

**Q: "How do you handle false-positive matches?"**
A: Nothing merges automatically above a threshold — a human always approves or rejects. A rejected match is remembered and won't resurface, and the evidence card lets the analyst see exactly what drove the score before deciding.

**Q: "Does this scale past 1,000 nodes? Why NetworkX and SQLite?"**
A: We chose them deliberately for a reliable, dependency-free demo — the graph schema itself is provenance-first and database-agnostic, so moving to Neo4j/Postgres in production is a swap, not a redesign. Investigations are also naturally case-scoped, so the real-world graph per case stays small even as the platform scales across many cases.

**Q: "Why not use real blockchain for the evidence ledger?"**
A: A hash chain already gives us the property we actually need — tamper evidence — without the operational cost of a distributed consensus network. Real blockchain would matter for a multi-agency, zero-trust deployment, which we've scoped as future work, not an MVP requirement.

**Q: "How does this fit with ICJS/CCTNS instead of duplicating them?"**
A: This sits on top of, not instead of, those systems — it's an analyst's workbench that ingests exports already collected under legal process (FIRs, CDRs) and turns them into a queryable graph. The natural next step is API-based ingestion adapters directly from ICJS/CCTNS rather than file upload.

**Q: "How accurate is the Hindi/regional-language extraction, really?"**
A: Honestly: for this prototype we used rule-based extraction plus a transliteration lookup table for reliability in the demo, not a trained Indic NER model. The roadmap is to integrate an AI4Bharat/IndicNER model for broader regional-language coverage — we're not overclaiming accuracy we haven't measured.

---

### Final note
Cut anything that doesn't serve the single demo story. A smaller system that runs flawlessly and tells one clear, defensible story beats a longer feature list that risks breaking on stage.
