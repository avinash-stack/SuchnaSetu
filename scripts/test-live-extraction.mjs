import { GOV_JOB_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/sources.config.ts';
import { StandardGovJobSourceAdapter } from '../src/modules/ingestion/adapters/standard-gov-job.adapter.ts';

const mockContext = {
  log: async (level, stage, msg) => {
    console.log(`[${level.toUpperCase()}][${stage}] ${msg}`);
  }
};

async function testExtraction() {
  console.log('='.repeat(80));
  console.log('TESTING LIVE ADAPTER EXTRACTION ACROSS OFFICIAL PORTALS');
  console.log('='.repeat(80));

  const targetSources = ['bpsc_official_feed', 'csbc_bihar_police_feed', 'uppsc_official_feed', 'ssc_official_feed'];

  for (const srcKey of targetSources) {
    const config = GOV_JOB_SOURCES_CONFIG.find(s => s.key === srcKey);
    if (!config) continue;

    console.log(`\n>>> Testing Adapter: ${config.name} (${config.baseUrl}${config.recruitmentPath})`);
    const adapter = new StandardGovJobSourceAdapter(config);
    
    try {
      const result = await adapter.extract(mockContext);
      console.log(`Extracted Items Count: ${result.items.length}`);
      console.log(`Metadata Total: ${result.metadata.total_extracted}`);

      if (result.items.length > 0) {
        console.log('Sample Extracted Item:');
        const sample = result.items[0].rawPayload;
        console.log(`  - Title: ${sample.title}`);
        console.log(`  - Advt No: ${sample.advertisement_number}`);
        console.log(`  - PDF URL: ${sample.pdf_url}`);
        console.log(`  - Apply URL: ${sample.apply_url}`);
      }
    } catch (err) {
      console.error(`Adapter extraction threw error: ${err.message}`);
    }
  }
}

testExtraction().catch(console.error);
