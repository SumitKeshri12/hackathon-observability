# Hackathon 2.0 Requirements Tracker

| Category | Requirement | Priority | Status |
| :--- | :--- | :--- | :--- |
| **Application** | Working Login + Registration | High | [x] (Implemented) |
| | 2-3 CRUD Entities | High | [x] (Products, Sales) |
| | Pagination, Filtering, Validation | Medium | [x] (Implemented) |
| | Basic UI (Tables, Forms, Modals) | Medium | [x] (Premium UI) |
| **Docker** | Everything in Docker Compose | High | [x] (Implemented) |
| | Full stack orchestration | High | [x] (Resolved Errors) |
| **Metrics** | Requests/min, Error Rate % | High | [x] (Prometheus) |
| | 95th percentile latency | High | [x] (OTEL) |
| | Active users over time | Medium | [x] (Dashboard) |
| **Logs** | Structured Logging (Loki) | High | [x] (Configured) |
| | Filtering & Correlation (Trace ID) | High | [x] (Tempo Linked) |
| **Traces** | End-to-End Tracing (Tempo/OTEL) | **Critical** | [x] (Configured) |
| | Custom spans (checkpoints) | **Critical** | [x] (Service Level) |
| **Anomaly** | Meaningful anomaly injection | High | [x] (Service Implemented) |
| | Data-backed explanation | High | [x] (Verified in Dashboard) |
| **Load Test** | 5,000+ requests (k6) | Medium | [x] (Baseline Verified) |

## Scoring Maximation Strategy
1.  **Traces (20 pts)**: Prioritize OpenTelemetry instrumentation in Laravel and the Frontend.
2.  **Logs & Metrics (30 pts)**: Ensure Promtail is correctly picking up container logs and Prometheus is scraping app metrics.
3.  **Dashboards (15 pts)**: Create clear, separate dashboards for App Health, DB Performance, and Logs.
4.  **The "Proof"**: The final deliverable must prove *why* an anomaly is happening using the dashboards.
