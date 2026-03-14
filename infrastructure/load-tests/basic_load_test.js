import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp up to 50 users
    { duration: '1m', target: 50 },  // Stay at 50 users
    { duration: '30s', target: 0 },  // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],    // Less than 1% failure rate
  },
};

const BASE_URL = 'http://nginx';

export default function () {
  // 1. Visit Home/Dashboard
  let res = http.get(`${BASE_URL}/`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);

  // 2. Simulate API check
  res = http.get(`${BASE_URL}/api/products`);
  check(res, { 'api status is 200 or 401': (r) => r.status === 200 || r.status === 401 });
  sleep(1);
}
