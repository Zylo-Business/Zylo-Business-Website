// Renders the actual emails (with sample data) to HTML files you can open in your
// editor / browser to review before anything goes out.
//   Run:  npm run preview:emails
// Output: webinar/templates/previews/*.html  (git-ignored; local review only)

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildThankYouHtml, buildReminderHtml } from "../src/email.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "templates", "previews");
mkdirSync(outDir, { recursive: true });

const sample = {
  name: "Kwame Mensah",
  email: "kwame@example.com",
  reference: "ZYLO-WMC26-DEMO-123456",
  priceGhs: 200,
  createdAt: new Date().toISOString(),
};

const files = {
  "confirmation-paid.html": buildThankYouHtml({ ...sample, status: "paid" }),
  "confirmation-registered.html": buildThankYouHtml({ ...sample, status: "registered" }),
  "reminder.html": buildReminderHtml({ ...sample, status: "paid" }),
};

for (const [name, html] of Object.entries(files)) {
  writeFileSync(path.join(outDir, name), html);
  console.log("wrote templates/previews/" + name);
}
console.log("\nOpen those files in your editor, or preview them rendered at:");
console.log("  http://localhost:4000/preview/confirmation");
console.log("  http://localhost:4000/preview/reminder");
