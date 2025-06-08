import ngrok from "ngrok";
import fs from "fs";

const PORT = 8787;
const url = await ngrok.connect(PORT);

const envFile = ".env";
let lines = [];

if (fs.existsSync(envFile)) {
  lines = fs.readFileSync(envFile, "utf-8").split("\n");
}

// Remove any existing NGROK_URL line
lines = lines.filter((line) => !line.startsWith("TWILIO_WEBHOOK_BASE_URL="));

// Add the new NGROK_URL
lines.push(`TWILIO_WEBHOOK_BASE_URL=${url}`);

// Remove any empty lines at the end
while (lines.length && lines[lines.length - 1].trim() === "") {
  lines.pop();
}

// Write back to the file
fs.writeFileSync(envFile, lines.join("\n"), { flag: "w" });

console.log(`TWILIO_WEBHOOK_BASE_URL set to: ${url}`);
