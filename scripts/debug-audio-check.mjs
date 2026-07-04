import { readFileSync, appendFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(resolve(root, "mediclarify/.env"), "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);

const { SUPABASE_URL, SUPABASE_KEY } = env;
const logPath = resolve(root, "debug-169f79.log");

function writeLog(payload) {
  appendFileSync(logPath, JSON.stringify({ sessionId: "169f79", timestamp: Date.now(), ...payload }) + "\n");
}

async function main() {
  const recordsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/doctor_records?select=id,raw_audio_url&order=id.desc&limit=5`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );
  const records = await recordsRes.json();
  writeLog({
    location: "debug-audio-check.mjs:records",
    message: "doctor_records from DB",
    data: { status: recordsRes.status, records },
    hypothesisId: "B",
  });

  const bucketsRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  const buckets = await bucketsRes.json();
  writeLog({
    location: "debug-audio-check.mjs:buckets",
    message: "storage buckets",
    data: {
      status: bucketsRes.status,
      buckets: Array.isArray(buckets)
        ? buckets.map((b) => ({ id: b.id, name: b.name, public: b.public }))
        : buckets,
    },
    hypothesisId: "A",
  });

  const firstUrl = Array.isArray(records) ? records.find((r) => r.raw_audio_url)?.raw_audio_url : null;
  if (firstUrl) {
    const headRes = await fetch(firstUrl, { method: "HEAD" });
    writeLog({
      location: "debug-audio-check.mjs:headPublicUrl",
      message: "HEAD on stored public audio URL",
      data: {
        url: firstUrl,
        status: headRes.status,
        ok: headRes.ok,
        contentType: headRes.headers.get("content-type"),
      },
      hypothesisId: "A,C,E",
    });
  } else {
    writeLog({
      location: "debug-audio-check.mjs:headPublicUrl",
      message: "no raw_audio_url found in records",
      data: { recordCount: Array.isArray(records) ? records.length : 0 },
      hypothesisId: "B",
    });
  }
}

main().catch((err) => {
  writeLog({ location: "debug-audio-check.mjs:error", message: String(err) });
  process.exit(1);
});
