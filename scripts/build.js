const { execSync } = require('child_process');
const path = require('path');

try {
    console.log('Building SDK...');
    execSync('npx tsc', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('Build completed successfully.');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
