# Deep Analysis: FE & BE Hackathon 2.0

This analysis breaks down the core requirements and strategic priorities for the **Kombee Frontend & Backend Team Hackathon 2.0**.

## 🎯 Primary Objective: Production Engineering
The hackathon shifts focus from building features to **System Health and Reliability**. Success is measured by your ability to *prove* the system is working (or failing) using data.

---

## 🏗️ Technical Pillar 1: Infrastructure (Docker)
The entire stack must be containerized and orchestrated via `docker-compose`.

### Critical Components:
- **Application Services:** Frontend (SPA/SSR) and Backend (API).
- **Data Layer:** Database (PostgreSQL/MySQL) and Cache (Redis).
- **Observability Stack:**
    - **Prometheus:** Metrics scraping.
    - **Grafana:** Visualization and Alerting.
    - **Loki + Promtail:** Log aggregation.
    - **Jaeger/Tempo:** Distributed Tracing.

> [!IMPORTANT]
> Your `docker-compose.yml` is the backbone. It shouldn't just run the app; it should provide a "turn-key" production-ready environment.

---

## 📊 Technical Pillar 2: The Three Pillars of Observability
75% of your score depends on how well you implement and use these:

| Pillar | Technology | What to Track |
| :--- | :--- | :--- |
| **Metrics** | Prometheus & Grafana | Request volume, Latency (p95/p99), CPU/Memory, DB connection pool. |
| **Logs** | Loki & Promtail | Structured JSON logs. Focus on "Audit Trails" (who did what) and "Error Context". |
| **Traces** | Jaeger | Request flow from Frontend → Backend → DB/Redis. Essential for finding bottlenecks. |

---

## 💻 Technical Pillar 3: Application Features
The app itself is a simple "Hackathon Idea Management" system:
1.  **Idea Submission:** Title, description, category.
2.  **Idea List:** Dashboard view with status (Pending, Approved, Rejected).
3.  **Status Management:** Admin capability to move ideas through the lifecycle.

---

## 🧪 The "X-Factor": Anomaly Injection
To win, you must **prove** your system can detect failures.
- **Artificial Latency:** Inject 2-3s delays in specific DB queries.
- **Forced Failures:** Randomly return `500 Internal Server Error` on 10% of requests.
- **Goal:** Show a Grafana dashboard where these spikes are visible and use Jaeger to trace exactly which line of code or service caused the delay.

---

## 🏆 Scoring Strategy (Prioritization)
1.  **Observability (40%):** Spend the most time here. Create beautiful, functional Grafana dashboards. Set up alerts that trigger when anomalies occur.
2.  **Production Engineering (25%):** Ensure Docker images are optimized and volumes are handled correctly.
3.  **Stability/Anomalies (20%):** Prepare your "demonstration of failure".
4.  **Features (15%):** Keep the UI clean but simple. Don't over-engineer the CRUD.

---

## 📅 Suggested 8-Hour Roadmap

| Time | Phase | Focus |
| :--- | :--- | :--- |
| **H1-H2** | **Boilerplate** | Basic React/Vue + Laravel/Node CRUD. Dockerize immediately. |
| **H3-H4** | **Observability** | Integrate Prometheus and Loki. Set up Grafana dashboards. |
| **H5** | **Tracing** | Implement Jaeger/OpenTelemetry for end-to-end tracing. |
| **H6** | **Anomalies** | Inject delays/errors. Verify they appear in dashboards. |
| **H7** | **Load Testing** | Use `k6` or `Locust` to hit the 5000+ request target. |
| **H8** | **Crowning** | Record the 7-minute Loom video and polish `README.md`. |

---

## 💡 Key Tips for Success
- **README is Documentation:** A clean README with screenshots of your dashboards is worth more than "perfect" CSS.
- **Label Everything:** Ensure your logs and traces have descriptive metadata (User IDs, Request IDs).
- **Proactive Alerting:** In your Loom video, show an alert firing in Slack/Email when you inject a failure.
