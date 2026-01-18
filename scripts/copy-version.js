const fs = require('fs');
const path = require('path');

const sdkDir = path.join(__dirname, '..');
const backendDir = path.join(sdkDir, '../backend');

// Ensure sdk package exists in backend
const backendSdkDir = path.join(backendDir, 'sdk');
if (!fs.existsSync(backendSdkDir)) {
    fs.mkdirSync(backendSdkDir, { recursive: true });
}

// Copy version.go
fs.copyFileSync(
    path.join(sdkDir, 'version.go'),
    path.join(backendSdkDir, 'version.go')
);

// Copy sdk.go
fs.copyFileSync(
    path.join(sdkDir, 'src/go/sdk.go'),
    path.join(backendSdkDir, 'sdk.go')
);

// Copy version.json
fs.copyFileSync(
    path.join(sdkDir, 'version.json'),
    path.join(backendSdkDir, 'version.json')
);

console.log('SDK files copied to backend/sdk/');
