package sdk

import (
	"encoding/json"
	"os"
)

// VersionInfo represents the version information structure
type VersionInfo struct {
	Version   string `json:"version"`
	BuildTime string `json:"buildTime"`
}

// GetVersion returns the version information from version.json
func GetVersion(versionFilePath string) (*VersionInfo, error) {
	data, err := os.ReadFile(versionFilePath)
	if err != nil {
		return nil, err
	}

	var info VersionInfo
	err = json.Unmarshal(data, &info)
	if err != nil {
		return nil, err
	}

	return &info, nil
}
