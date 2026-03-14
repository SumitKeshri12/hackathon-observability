# 📋 Hackathon 2.0: Granular Demo Flow

Follow this flow exactly to hit all the scoring marks. **Total Duration: ~10 Minutes**.

---

## ⏱ 00:00 - 01:00: Intro & Infrastructure

1. **Screen**: Show [infrastructure/docker-compose/docker-compose.yml](file:///c:/Kombee/Saturday%20Hackathon/infrastructure/docker-compose/docker-compose.yml) in VS Code.
2. **Action**: Open terminal and run `docker-compose ps`.
3. **Narration**: "Hi, I'm [Your Name]. This is my project for Hackathon 2.0. We have a full-stack Laravel/Vue application orchestrated with Docker, but the real focus today is on the observability pipeline: Prometheus, Grafana, Loki, and Tempo."

## ⏱ 01:00 - 02:30: The Application in Action

1. **Screen**: Open the Web App (`localhost`).
2. **Action**: Register a new user -> Login -> Go to the "Products" list.
3. **Action**: Create a new sale for a product.
4. **Narration**: "The app is a premium sales tracker. It's fully functional with user authentication and real-time inventory management. Every action you see here is being instrumented via OpenTelemetry."

## ⏱ 02:30 - 04:30: The 3 Pillars (Dashboards)

1. **Screen**: Switch to Grafana -> **Application Health** Dashboard.
2. **Narration**: "Pillar 1: Metrics. We are tracking throughput and latency here. Notice the business metrics at the bottom—we are capturing real-time sales volume directly from our backend meters."
3. **Screen**: Switch to **Database Performance** Dashboard.
4. **Narration**: "Pillar 2: Database health. We track every query duration. This allows us to see exactly which queries are slow before they become a problem."
5. **Screen**: Switch to **Observability Deep Dive** Dashboard.
6. **Narration**: "Pillar 3: Logs. We use Loki for structured logging. Notice the logs are clean and contain a Trace ID. This brings us to Traces."

## ⏱ 04:30 - 06:00: Trace Correlation & Request Journey

1. **Action**: Click the **Trace ID** link next to a log entry (or copy the ID into the Tempo panel).
2. **Screen**: Show the full **Tempo Trace View**.
3. **Narration**: "This is the 'Journey of a Request'. We can see the request coming through Nginx, hitting the Laravel Controller, the Service layer, and even individual DB queries. No more guessing—we have the data."

## ⏱ 06:00 - 09:00: The "2 AM" Proof (Anomaly Injection)

1. **Action**: Open a terminal window *next* to the Grafana dashboard.
2. **Action**: Run the helper script: `.\toggle_anomaly.ps1 -State on`
3. **Action**: Refresh the "Products" page in the app (it will be slow - 2.5s).
4. **Action**: Show the **Application Health** dashboard spiking.
5. **Narration**: "Now, imagine it's 2 AM. Latency has just spiked from 50ms to nearly 3 seconds. The system is struggling."
6. **Action**: Find the slow log entry -> Click Trace ID.
7. **Action**: Point to the `get-all-products` span taking 2.5s.
8. **Narration**: "Found it. The trace shows a 2.5s delay in our [ProductService](file:///c:/Kombee/Saturday%20Hackathon/backend/app/Services/ProductService.php#8-95). I can prove exactly WHERE the bottleneck is with 100% certainty. That is Production Engineering."
9. **Action**: Clear the anomaly: `.\toggle_anomaly.ps1 -State off`

## ⏱ 09:00 - 10:00: Conclusion

1. **Action**: Show the health dashboard returning to normal.
2. **Narration**: "We built a system that doesn't just work—it's observable. If it breaks, we can prove why. Thank you for watching my Hackathon 2.0 demonstration."

---

### ✅ Preparation Steps before recording:on

1. Run `docker-compose up -d` to ensure everything is hot.
2. Run `docker-compose run --rm k6 run /scripts/basic_load_test.js` once to populate initial data on your dashboards.
3. Have your terminal ready with the [toggle_anomaly.ps1](file:///c:/Kombee/Saturday%20Hackathon/toggle_anomaly.ps1) command.
