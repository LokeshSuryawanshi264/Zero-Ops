# Team Callidus - SIH 2026

![Smart India Hackathon](https://img.shields.io/badge/Smart_India_Hackathon-2026-blue.svg)
![Status](https://img.shields.io/badge/Status-Development-orange.svg)

## 📌 Project Overview: AI-Powered Criminal Network Analysis System

This repository contains the solution developed by **Team Callidus** for the Smart India Hackathon (SIH) 2026. 

Our solution is an **investigative decision-support tool** designed to assist law enforcement agencies in unearthing hidden connections across vast and fragmented datasets. By analyzing multi-modal data such as First Information Reports (FIRs) and Call Detail Records (CDRs), the system significantly reduces manual investigation time and helps prevent critical evidence from slipping through the cracks.

### 🚨 The Problem
Law enforcement investigators frequently face the bottleneck of manually cross-referencing hundreds of pages of unstructured text (FIRs) and tabular data (CDRs).
- **Time Inefficiency:** Manual verification takes days or even weeks.
- **Missed Connections:** Subtle linkages between apparently unrelated crimes (e.g., shared aliases or secondary phone numbers) are easily overlooked.
- **Lack of Provenance:** Tracing manually found links back to the original source document for court evidence is highly cumbersome.

### 💡 Our Solution
An intelligent analyst's workbench that automatically extracts, resolves, and visualizes connections between entities across multiple cases without acting as a "black box".

#### Key Features:
- **Automated Ingestion & Extraction:** Supports uploads of FIRs (including scanned PDFs), CDRs, and CSVs using advanced OCR and NLP for Named Entity Recognition (NER).
- **Human-in-the-Loop Entity Resolution:** Employs fuzzy matching for potential entity links while ensuring an analyst must explicitly **Approve or Reject** the connection, maintaining human oversight.
- **Temporal Knowledge Graph:** Visualizes extracted entities with a unique time-slider to filter by date and uncover temporal patterns (e.g., communication spikes prior to an event).
- **Explainable Evidence:** Every graph connection provides an "Evidence Card" that traces back to the exact document and line source.
- **Tamper-Evident Ledger:** Implements a hash-based, append-only SQLite ledger to ensure a verifiable chain of custody for all uploaded files.

> **Crucial Guardrail:** This system is **NOT** a predictive policing tool. It does not calculate "guilt scores" or make autonomous decisions. It purely surfaces candidate links requiring human validation, ensuring court-admissible defensibility.

## 🛠️ Architecture & Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** FastAPI (Python)
- **Data & Graph Processing:** NetworkX (in-memory graph analysis), SQLite (tamper-evident ledger)

## 📁 Repository Structure

- `/frontend` - The React-based user interface and visualization dashboard.
- `/docs` - Contains all project planning, workflow details, problem statements, and technical documentation.

## 🚀 Getting Started

*Instructions for running the frontend and backend locally will be added here.*

---

**Team Callidus** - Building defensible link-discovery for modern investigations.
