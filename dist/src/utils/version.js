import versionInfo from '../../version.json';
export const getSDKVersion = () => {
    return versionInfo.version;
};
export const getSDKBuildTime = () => {
    return versionInfo.buildTime;
};
