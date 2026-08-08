# Sthanu — Real-Time Emergency Logistics & Family Health Shield

> An event-driven, fault-tolerant emergency radar designed to eliminate data latency in Indian blood banks and snakebite anti-venom centers during critical care windows.

---

##  The Systemic Problem

* **Isolated Hospital Silos:** Over 77% of Indian blood banks are attached directly to individual hospitals with zero automated inter-facility data synchronization.
* **The "Static Snapshot" Failure:** Existing public portals function as administrative ledgers updated manually at shift handovers. At 2 AM, static data creates "ghost inventory"—showing stock on-screen that was depleted hours earlier in surgery.
* **The Snakebite Crisis:** India suffers ~58,000 annual snakebite deaths, primarily in Tier-3 and rural perimeters, driven by "blind routing" to primary health centers lacking cold-chain anti-venom stock.
* **Cognitive Load & Exploitation:** High administrative friction (complex dropdowns, component classification) forces panicking families into chaotic social media groups and predatory black markets.

---

##  Core Architectural Solutions

### 1. Distributed Inventory Reservation (Anti-Ghost Engine)
To prevent two doctors or panicking relatives from claiming the same rare unit simultaneously:
* **Redis TTL Locking:** Triggering an emergency request places an atomic 20-minute distributed lock (Time-To-Live) on a specific unit in the hospital’s inventory.
* **Zero-Friction Ingestion:** Replaces web forms with single-tap PWA interfaces, physical IoT fridge buttons (ESP32), or SMS/WhatsApp shortcodes (`-1 ONEG`) so night-shift staff update stock in under a second.

### 2. 3-Tier Resilient Location Engine
Hospital ICUs and basements frequently drop GPS signals. Sthanu uses a non-blocking location fallback hierarchy:
* **Tier 1 (High-Accuracy GPS):** Hardware lock with a strict 5-second timeout.
* **Tier 2 (Cell-Tower / IP Triangulation):** Automatic fallback providing a 1–2 km radius fix when satellite signals fail indoors.
* **Tier 3 (Zero-Permission Manual Search):** Pincode and landmark override to ensure the UI never blocks a panicking user behind an OS permission prompt.

### 3. Family Incident & Multi-Runner Routing
When an emergency is declared, Sthanu generates an `IncidentSession` shared across family members:
* **Dynamic Route Optimization:** Calculates delivery vectors for distant relatives based on fastest total transit time:
  $$\text{Total Time} = \text{Time}(\text{Runner} \rightarrow \text{Blood Bank}) + \text{Time}(\text{Blood Bank} \rightarrow \text{Patient Hospital})$$
* **Single-Lock Authority:** Prevents family members from double-booking units across different hospitals by enforcing single-approval authority via the primary requester.

### 4. Cryptographic Donor Verification Pipeline
To automate non-emergency donor rewards without human review:
* **Lock 1 (Anti-Tamper):** `.NET 8` parses the embedded PKCS#7 signature dictionary of uploaded government e-RaktKosh certificates, recalculating the byte-range hash to detect document edits.
* **Lock 2 (PKI Trust Chain):** Validates the signing certificate chain against India's Controller of Certifying Authorities (CCA) / C-DAC root certs.
* **Lock 3 (Replay Defense):** Performs transactional PostgreSQL checks on the unique Donation Identification Number (DIN) to prevent duplicate claims, automatically applying a mandatory 90-day medical cooldown.

---

## ⚡ High-Level System Architecture
```
[ Next.js PWA Client ]
│ (WebSocket / HTTPS)
▼
[ .NET 8 Web API Gateway ]
├──► [ Redis Cluster ] ──────────► (20-Min Distributed Inventory Locks)
├──► [ Supabase PostgreSQL ] ────► (PostGIS Spatial Queries & GiST Indexes)
└──► [ PKI Engine ] ─────────────► (iText7 / X509 Chain Verification)
```

---

## 🛠️ Tech Stack & Engineering Trade-offs

| Domain | Technology | Engineering Reason |
| :--- | :--- | :--- |
| **Backend API** | .NET 8 Web API | Enterprise-grade thread concurrency, low latency, native PKI cryptography libraries. |
| **Database & GIS** | PostgreSQL + Supabase (PostGIS) | Native `GEOGRAPHY` spatial types with GiST indexing (`ST_DWithin`) for sub-millisecond radius searches. |
| **State & Caching** | Redis | Atomic distributed locking with auto-expiring TTL keys to handle high-concurrency inventory reservation. |
| **Frontend** | Next.js (TypeScript) PWA | Offline-first capabilities, service worker queueing for poor connectivity, ultra-low bundle size. |

---

## Project & Roadmap

- High-concurrency system architecture and domain design
- Database schema & PostGIS spatial indexing setup
- .NET 8 3-Lock PKI Certificate Verification engine implementation
- Redis distributed reservation locking API implementation
- Next.js PWA offline-first lab tech interface
- End-to-end WebSocket real-time incident orchestration
