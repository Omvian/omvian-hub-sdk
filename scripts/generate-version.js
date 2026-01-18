const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = pkg.version;

// Generate version.json
const versionJson = {
    version: version,
    buildTime: new Date().toISOString()
};
fs.writeFileSync(path.join(__dirname, '../version.json'), JSON.stringify(versionJson, null, 2));

// Generate version.go
const versionGo = `package sdk

// SDKVersion is the current version of the SDK
const SDKVersion = "${version}"
`;
fs.writeFileSync(path.join(__dirname, '../version.go'), versionGo);

console.log(`Generated version files for version ${version}`);
