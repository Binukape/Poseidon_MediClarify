import { readFileSync, appendFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logPath = resolve(root, "debug-169f79.log");
const url =
  "https://znoxgyhsyotzxckwyidb.supabase.co/storage/v1/object/public/medical-documents/e269c46e-7772-440f-a17c-5c76ba393f11/83305562-d366-4487-9be1-fe58176d0544.webm";

function writeLog(payload) {
  appendFileSync(logPath, JSON.stringify({ sessionId: "169f79", timestamp: Date.now(), ...payload }) + "\n");
}

async function main() {
  const getRes = await fetch(url);
  const buf = Buffer.from(await getRes.arrayBuffer());
  const header = buf.subarray(0, 16).toString("hex");
  writeLog({
    location: "debug-audio-check.mjs:getAudio",
    message: "GET audio file bytes",
    data: {
      status: getRes.status,
      contentType: getRes.headers.get("content-type"),
      contentLength: getRes.headers.get("content-length"),
      byteLength: buf.length,
      headerHex: header,
      hasWebmSignature: header.startsWith("1a45dfa3"),
    },
    hypothesisId: "D",
  });

  const corsRes = await fetch(url, {
    method: "GET",
    headers: { Origin: "http://localhost:8081" },
  });
  writeLog({
    location: "debug-audio-check.mjs:corsProbe",
    message: "GET with Origin header",
    data: {
      status: corsRes.status,
      acao: corsRes.headers.get("access-control-allow-origin"),
      acam: corsRes.headers.get("access-control-allow-methods"),
    },
    hypothesisId: "E",
  });
}

main().catch((err) => writeLog({ location: "debug-audio-check.mjs:error2", message: String(err) }));
