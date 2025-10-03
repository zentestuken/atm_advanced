const fs = require('fs');

const testPlanKey = process.env.JIRA_TESTPLAN || 'ATMADV-13';
const summary = process.env.JIRA_SUMMARY || 'Automated test results import';

const raw = fs.readFileSync('artifacts/temp-results.json', 'utf8');
const report = JSON.parse(raw);

const tests = [];

for (const suite of report.suites) {
  for (const spec of suite.specs) {
    const match = spec.title.match(/\[([A-Z]+-\d+)\]/);
    if (!match) continue;
    const testKey = match[1];

    let finalStatus = 'TODO';
    for (const t of spec.tests) {
      if (t.results && t.results.length > 0) {
        const lastRun = t.results[t.results.length - 1];

        switch (lastRun.status) {
          case 'passed':
            finalStatus = 'PASSED';
            break;
          case 'failed':
            finalStatus = 'FAILED';
            break;
          case 'skipped':
            finalStatus = 'TODO';
            break;
          case 'timedOut':
            finalStatus = 'FAILED';
            break;
          case 'interrupted':
            finalStatus = 'ABORTED';
            break;
          default:
            finalStatus = 'TODO';
        }
      }
    }

    tests.push({ testKey, status: finalStatus });
  }
}

const payload = {
  info: {
    testPlanKey,
    summary,
  },
  tests,
};

fs.writeFileSync('artifacts/xray-results.json', JSON.stringify(payload, null, 2));
// eslint-disable-next-line no-console
console.log(`Generated xray-results.json with ${tests.length} tests`);