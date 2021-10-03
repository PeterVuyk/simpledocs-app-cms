const getNextVersion = (currentVersion: string) => {
  const currentDate = new Date();
  const monthLastRelease = parseInt(currentVersion.split('.')[1], 10);
  const nextVersion = parseInt(currentVersion.split('.')[2], 10) + 1;
  const releaseVersion =
    monthLastRelease === currentDate.getMonth() + 1 ? nextVersion : 1;
  return `${currentDate.getFullYear()}.${
    currentDate.getMonth() + 1
  }.${releaseVersion}`;
};

const getNewVersion = () => {
  const currentDate = new Date();
  return `${currentDate.getFullYear()}.${currentDate.getMonth() + 1}.1`;
};

const publicationHelper = {
  getNewVersion,
  getNextVersion,
};

export default publicationHelper;
