import fs from "fs";

const data = JSON.parse(
  fs.readFileSync(
    "/Users/copious/.gemini/antigravity-ide/brain/bf6ed8fe-f734-465e-a406-f4b673c4e8d3/scratch/diagnostic_results.json",
    "utf8"
  )
);

console.log(`Total Official Sources: ${data.officialSourcesCount}`);
console.log(`Duplicate Groups: ${data.duplicateOfficialGroupsCount}`);

for (const group of data.duplicateOfficialGroups) {
  console.log(`\nURL: ${group.url} (Count: ${group.count})`);
  for (const r of group.records) {
    console.log(`  - ID: ${r.id} | Name: "${r.name}" | Org: "${r.org || 'NONE'}" (${r.slug || 'no-slug'}) | Type: ${r.portal_type} | Created: ${r.created_at}`);
  }
}
