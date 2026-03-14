# Project Overview: Hackathon 2.0 - Production Engineering & Observability

## 🏎 The Mission
Our project wasn’t just about building a "functioning app"—it was about building an **observable, industrial-grade system**. In a production environment, "it works" isn't enough; you need to prove *how* it's working and *why* it fails at 2 AM.

## 🛠 The Architecture
We orchestrated a multi-tenant Laravel & Vue ecosystem powered by a robust Observability stack:
- **Telemetry**: OpenTelemetry (OTel) instrumentation across all backend services.
- **Metrics**: Prometheus capturing high-resolution system and business metrics.
- **Logs**: Loki for structured, high-speed log management.
- **Traces**: Tempo for distributed request tracing (The "Journey of a Request").
- **Ingress**: Nginx optimized for high-concurrency throughput.

## 📈 The Proof: 74,000 Requests per Minute
During our stress testing phase, we pushed the local infrastructure to its limit, successfully processing over **74,000 requests in a single minute**. This demonstrates the efficiency of our Nginx proxy and PHP-FPM worker pool, even under extreme saturation.

## 🕵️‍♂️ The Hero Moment: Anomaly Detection
The highlight of our showcase is the **Anomaly Injection system**. We intentionally injected a 2.5-second bottleneck into the Product Service to simulate a real-world infrastructure failure.
- **The Finding**: Using our Grafana "Deep Dive" dashboard, we instantly saw the latency spike in our Metrics.
- **The Correlation**: We pivoted from the Logs directly to a Trace ID.
- **The Resolution**: The Tempo trace proved exactly that the `get-all-products` span was the culprit. No more "guessing"—just data-driven engineering.

## 🎯 Conclusion
This project represents "Production Engineering Maturity." We have 100% visibility into our application's health, ensuring that we are ready for the most demanding real-world scales.
