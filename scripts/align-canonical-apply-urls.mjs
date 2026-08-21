import fs from 'fs';

let content = fs.readFileSync('src/modules/ingestion/adapters/sources.config.ts', 'utf-8');

// For any source with an applyUrl, ensure canonicalNotices also have apply_url matching that applyUrl
const sourceBlocks = content.split(/\{\s*key:\s*"/g);
let updatedContent = sourceBlocks[0];

for (let i = 1; i < sourceBlocks.length; i++) {
  let block = '{ key: "' + sourceBlocks[i];
  const applyUrlMatch = block.match(/applyUrl:\s*"([^"]+)"/);
  if (applyUrlMatch) {
    const applyUrl = applyUrlMatch[1];
    // Replace apply_url inside canonicalNotices
    block = block.replace(/apply_url:\s*"https?:\/\/[^"]+"/g, `apply_url: "${applyUrl}"`);
  }
  updatedContent += (i === 1 ? '' : '') + block.substring(i === 1 ? 0 : 0);
}

fs.writeFileSync('src/modules/ingestion/adapters/sources.config.ts', updatedContent, 'utf-8');
console.log('Successfully aligned all canonicalNotices apply_url with authentic source applyUrl!');
