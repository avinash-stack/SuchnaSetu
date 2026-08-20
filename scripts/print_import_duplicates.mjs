import fs from "fs";

const data = JSON.parse(
  fs.readFileSync(
    "/Users/copious/.gemini/antigravity-ide/brain/bf6ed8fe-f734-465e-a406-f4b673c4e8d3/scratch/diagnostic_results.json",
    "utf8"
  )
);

console.log(`Total import sources: ${data.importSourcesCount}`);
console.log("Duplicate import groups by (org, module):", JSON.stringify(data.duplicateImportGroups, null, 2));
