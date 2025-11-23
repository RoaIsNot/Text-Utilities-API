import crypto from "crypto";
import fs from "fs";

interface ApiKeyEntry {
  key: string;
  email: string;
  requests: number;
}

function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

const email = process.argv[2];
if (!email) {
  console.error("Please provide an email.");
  process.exit(1);
}

const keysFile = "./keys.json";

let keysData = {keys: [] as ApiKeyEntry[]};
if (fs.existsSync(keysFile)) {
  keysData = JSON.parse(fs.readFileSync(keysFile, "utf-8"));
}

const existing = keysData.keys.find(entry => entry.email === email);

if (existing) {
  console.log("Email already has a key.");
  console.log(`Existing key: ${existing.key}`);
  process.exit(0);
}

const newKey = generateApiKey();
console.log("New API key: ", newKey);

const newEntry: ApiKeyEntry = {
  key: newKey,
  email,
  requests: 0
}

keysData.keys.push(newEntry);

fs.writeFileSync(keysFile, JSON.stringify(keysData, null, 2));
console.log("API key saved to keys.json");
