/*
A Node.js pre-push hook script that checks for changes in the "/unit_testing" directory
and runs tests if changes are detected. It handles both recent commits and staged changes.
It was added because:
- Module 6 task required unit test pre-push hook
- It is not reasonable to run unit tests for every push to this multi-project repository
- Node.js script is cross-platform
*/

const { execSync } = require('child_process');
const fs = require('fs');

try {
  let changes = [];
  
  try {
    const recentChanges = execSync('git diff --name-only HEAD~5..HEAD', { encoding: 'utf8' })
      .split('\n')
      .filter(file => file.startsWith('unit_testing/') && file.trim());
    changes = changes.concat(recentChanges);
  } catch (e) {
    // Ignore if no commits exist yet
  }
  
  try {
    const stagedChanges = execSync('git diff --name-only --cached', { encoding: 'utf8' })
      .split('\n')
      .filter(file => file.startsWith('unit_testing/') && file.trim());
    changes = changes.concat(stagedChanges);
  } catch (e) {
    // Ignore if no staged changes
  }

  if (changes.length > 0) {
    console.log('Changes detected in unit_testing folder. Running unit tests.');
    
    if (fs.existsSync('unit_testing')) {
      process.chdir('unit_testing');
      execSync('npm test', { stdio: 'inherit' });
      process.chdir('..');
    }
  }
} catch (error) {
  console.error('Pre-push hook failed:', error.message);
  process.exit(1);
}
