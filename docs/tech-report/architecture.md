> 📂 **Arxiu/Ruta:** `./docs/tech-report/architecture.md`

# Data Architecture: Rhizome DB 🧬

The backbone of Sóc de Poble is the **Rhizome DB**, a data layer designed for extreme resilience and offline independence.

## 1. Local-First Engine
We follow the **Local-First** principles from Ink & Switch [Source 7]. Every action is first persisted in the local SQLite @ Edge instance and then asynchronously synchronized with the mesh.

## 2. Synchronization (CRDTs)
To handle concurrent edits without central coordination, we utilize **Conflict-free Replicated Data Types (CRDTs)**.

### Eg-walker Algorithm
Most CRDTs suffer from metadata bloat. Sóc de Poble implements a modified **Eg-walker** algorithm [Source 11, 14] optimized for mobile devices with limited storage. It allows for efficient causal tracking without the history-bloating overhead.

## 3. Semantic Rich Text (Peritext)
For collaboratively edited documents (like the Catalog annotations), we integrate the **Peritext** algorithm [Source 93]. This ensures that formatting intentions (bold, citations) are preserved correctly when merging edits from different neighbors, even if they occurred offline.

---
*Status: [MASTER] Core Architecture*
