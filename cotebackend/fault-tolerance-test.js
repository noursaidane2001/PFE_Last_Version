// fault-tolerance-test-CORRECT.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 }, // Monte à 30 utilisateurs
    { duration: "1m", target: 80 }, // Monte à 80 utilisateurs
    { duration: "1m", target: 100 }, // Monte à 100 utilisateurs
    { duration: "30s", target: 0 }, // Descend à 0
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"], // Max 5% d'échec
    http_req_duration: ["p(95)<1000", "p(99)<2000"], // CORRIGÉ : fusionné en une seule propriété
  },
};

export default function () {
  const BASE_URL = "http://localhost:5000";

  // ═══════════════════════════════════════════════════════════
  // Test 1 : Route /games (API Twitch)
  // ═══════════════════════════════════════════════════════════
  let res1 = http.get(`${BASE_URL}/games`, {
    timeout: "10s",
  });

  check(res1, {
    "Games API - status 200": (r) => r.status === 200,
    "Games API - response < 2s": (r) => r.timings.duration < 2000,
    "Games API - has data": (r) => r.body && r.body.length > 100,
    "Games API - valid JSON": (r) => {
      try {
        const json = JSON.parse(r.body);
        return json && json.data;
      } catch {
        return false;
      }
    },
  });

  sleep(1);

  // ═══════════════════════════════════════════════════════════
  // Test 2 : Route /live/all-live (✅ CORRIGÉ)
  // ═══════════════════════════════════════════════════════════
  let res2 = http.get(`${BASE_URL}/live/all-live`, {
    timeout: "5s",
  });

  check(res2, {
    "Live API - status 200": (r) => r.status === 200,
    "Live API - response < 1s": (r) => r.timings.duration < 1000,
    "Live API - has data": (r) => r.body && r.body.length > 0,
    "Live API - valid JSON": (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });

  sleep(2);

  // ═══════════════════════════════════════════════════════════
  // Test 3 : Route /tournament/all-tournament (✅ CORRIGÉ)
  // ═══════════════════════════════════════════════════════════
  let res3 = http.get(`${BASE_URL}/tournament/all-tournament`, {
    timeout: "5s",
  });

  check(res3, {
    "Tournament API - status 200": (r) => r.status === 200,
    "Tournament API - response < 1s": (r) => r.timings.duration < 1000,
    "Tournament API - has data": (r) => r.body && r.body.length > 0,
    "Tournament API - valid JSON": (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });

  sleep(1);

  // ═══════════════════════════════════════════════════════════
  // Test 4 : Route /live/livenow (streams en cours)
  // ═══════════════════════════════════════════════════════════
  let res4 = http.get(`${BASE_URL}/live/livenow`, {
    timeout: "5s",
  });

  check(res4, {
    "Live Now API - status 200": (r) => r.status === 200,
    "Live Now API - response < 1s": (r) => r.timings.duration < 1000,
  });

  sleep(1);
}

// ═══════════════════════════════════════════════════════════
// RÉSUMÉ PERSONNALISÉ
// ═══════════════════════════════════════════════════════════
export function handleSummary(data) {
  const failRate = data.metrics.http_req_failed.values.rate * 100;
  const avgDuration = data.metrics.http_req_duration.values.avg;
  const p95Duration = data.metrics.http_req_duration.values["p(95)"];
  const p99Duration = data.metrics.http_req_duration.values["p(99)"]; // peut être undefined
  const totalReqs = data.metrics.http_reqs.values.count;
  const checksPass = data.metrics.checks.values.rate * 100;

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║       RÉSUMÉ DU TEST DE TOLÉRANCE AUX PANNES          ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log(`\n📊 MÉTRIQUES GLOBALES`);
  console.log(`   Requêtes totales: ${totalReqs}`);
  console.log(`   Taux d'échec: ${failRate.toFixed(2)}%`);
  console.log(`   Checks réussis: ${checksPass.toFixed(2)}%`);
  console.log(`\n⏱️  TEMPS DE RÉPONSE`);
  console.log(`   Moyenne: ${avgDuration.toFixed(2)}ms`);
  console.log(`   P95: ${p95Duration.toFixed(2)}ms`);

  if (p99Duration !== undefined && p99Duration !== null) {
    console.log(`   P99: ${p99Duration.toFixed(2)}ms`);
  } else {
    console.log("   P99: (non disponible dans les métriques k6)");
  }

  console.log(
    `\n🎯 VERDICT: ${failRate < 5 ? "✅ CONFORME" : "❌ NON CONFORME"
    } (seuil < 5%)`
  );
  console.log(
    `           ${checksPass > 95 ? "✅ CONFORME" : "❌ NON CONFORME"
    } pour checks (seuil > 95%)\n`
  );

  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function textSummary(data, options) {
  return JSON.stringify(data, null, 2);
}