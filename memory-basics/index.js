import readline from "readline";
import {
  initializeMemory,
  storeMemory,
  retrieveMemory,
} from "./memory.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  await initializeMemory();
  console.log(
    "🧠 Memory system ready.\nType 'remember ...' to store something, or ask a question like 'what is my name?'."
  );
  ask();
}

function ask() {
  rl.question("> ", async (input) => {
    const text = input.trim();
    if (!text) return ask();

    const lower = text.toLowerCase();

    if (lower.startsWith("remember")) {
      const content = text.slice("remember".length).trim();
      if (!content) {
        console.log("👉 Example: remember my favorite color is blue");
      } else {
        await storeMemory(content);
      }
    } else if (
      lower.startsWith("what") ||
      lower.startsWith("who") ||
      lower.startsWith("where") ||
      lower.startsWith("when") ||
      lower.startsWith("why") ||
      lower.startsWith("how")
    ) {
      const results = await retrieveMemory(text);

      if (!results.length) {
        console.log("😶 I don't remember anything yet.");
      } else {
        console.log("📌 Top memories:");
        for (const m of results) {
          console.log(`  - (${m.score.toFixed(3)}) ${m.text}`);
        }
      }
    } else {
      console.log(
        "🤖 Use 'remember ...' to store a memory, or ask a question to retrieve."
      );
    }

    ask();
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
