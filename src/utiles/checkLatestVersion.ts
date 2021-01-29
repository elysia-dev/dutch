const checkLatestVersion = (appVersion: string, responseVersion: string) => {
  const appVersionInt = parseInt(appVersion.replace(/\./g, ''), 10);
  const responseVersionInt = parseInt(responseVersion.replace(/\./g, ''), 10);
  return responseVersionInt > appVersionInt;
};

export default checkLatestVersion;
