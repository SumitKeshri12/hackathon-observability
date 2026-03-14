import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5000 }, // Rapidly ramp up to 5k users
    { duration: '30s', target: 5000 }, // Hold at 5k users
    { duration: '5s', target: 0 },    // Quick cool down
  ],
  thresholds: {
    http_req_failed: ['rate<0.1'],   // Allow up to 10% failure during this extreme stress
  },
};

const BASE_URL = 'http://nginx';

export default function () {
  // Minimize sleep to maximize throughput
  const res = http.get(`${BASE_URL}/api/products`);
  
  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  // Small random sleep to prevent total synchronization
  sleep(Math.random() * 0.5);
}
