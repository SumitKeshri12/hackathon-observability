# Showcase Strategy & Recording Script - Hackathon 2.0

Based on the guidelines, the judges (AI-driven) are looking for **Production Engineering Maturity**. The focus is 75% on Observability.

## 🏆 Scoring Checklist (Top Priority)
- [ ] **Traces (20 Marks)**: Captured a full request end-to-end? (YES, via Product/Sale service)
- [ ] **Metrics (15 Marks)**: Response time, active users, and business metrics included? (YES)
- [ ] **Logs (15 Marks)**: Structured logging with Trace Correlation? (YES)
- [ ] **Dashboards (15 Marks)**: Logic layout and insightful interpretation? (YES)
- [ ] **Anomaly Injection (10 Marks)**: Intentionally broke the app and proved it? (ACTION REQUIRED)
- [ ] **Load Testing (5 Marks)**: Used k6 for spike/stress testing? (YES)

---

## 🛠 Action Required: Anomaly Injection
To get the full 10 marks for Anomaly Injection, we need to create a "Problem" that we can solve live on the video.

**How to toggle**: Use the helper script in the root directory:
- To turn **ON** (Inject 2.5s delay): `.\toggle_anomaly.ps1 -State on`
- To turn **OFF** (Clear delay): `.\toggle_anomaly.ps1 -State off`

---

## 🎬 Video Recording Script (Total ~10-12 Mins)

### Section 1: Intro (1 Min)
- **Goal**: Professional setup.
- **Narrate**: "Hi, I'm [Your Name]. This is my project for Hackathon 2.0. The objective is: 'If it breaks at 2 AM, can I prove why?' Let's look at the stack." 
- **Show**: Docker Compose file and the running containers.

### Section 2: The Working App (2 Mins)
- **Goal**: Prove basic CRUD.
- **Show**: UI, register a user, login, and create a sale.
- **Narrate**: "The app is a premium sales tracker. It's clean, responsive, and fully functional."

### Section 3: The 3 Pillars of Observability (4 Mins) - IMPORTANT
- **Show**: Grafana "Application Health" Dashboard.
- **Narrate**: "Here are my Metrics. I'm tracking Requests per Minute, Error Rates, and P95 latency. Notice the business metrics - we are tracking real-time sales."
- **Show**: Grafana "Observability Deep Dive" (Logs).
- **Narrate**: "Notice the Logs. They are structured and, most importantly, correlated. See this Trace ID? Let's use it to find the source of the request."
- **Show**: Grafana "Tempo/Traces".
- **Narrate**: "Here is the full journey of a request. You can see exactly how long the Controller, the Service, and the DB Query took."

### Section 4: Load Testing & The Anomaly (3 Mins) - MARKS HERE
- **Step 1**: Run k6 test in terminal.
- **Show**: "Application Health" dashboard spiking under load.
- **Step 2**: **INJECT ANOMALY** (Trigger a delay).
- **Show**: The dashboard showing latency jumping from 50ms to 5s.
- **Narrate**: "Now, I've injected an intentional bottleneck. Our latency has spiked. Why? Let's look at the traces."
- **Show**: Trace breakdown showing the `sleep()` span or slow DB query.
- **Narrate**: "Found it. The Service layer is causing a 5-second delay. I've proved exactly WHERE and WHY it broke."

### Section 5: Conclusion (1 Min)
- **Narrate**: "That is real backend engineering. Proving findings with data. Thank you."

---

## 📹 How to Record?
1. **Tool**: Use OBS Studio or QuickTime.
2. **Resolution**: 1080p.
3. **Sound**: Clear microphone narration is 50% of the score.
4. **Speed**: Explain slowly and precisely. Avoid skipping steps.

---
**Next Step**: Should I implement the Anomaly Injection endpoint for you so you can trigger it during your recording?
