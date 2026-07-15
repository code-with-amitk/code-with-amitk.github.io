import mermaid from "mermaid";
import fs from "fs";

const content = fs.readFileSync("System_Design/Scalable/Box.com/index.html", "utf8");
const match = content.match(/<pre class="mermaid">([\s\S]*?)<\/pre>/);
try {
  await mermaid.parse(match[1].trim());
  console.log("PARSE OK");
} catch (e) {
  console.log("PARSE ERROR:", e.message || e);
}
