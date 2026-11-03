const { Namer } = require('@parcel/plugin');
const path = require('path');

const filenames = new Set();

const handleDuplicatedName = (filename) => {
  if (filenames.has(filename)) {
    const ext = path.extname(filename);
    const regEx = new RegExp(`${ext}$`);
    filenames.add(filename.replace(regEx, `.d${ext}`));
  } else {
    filenames.add(filename);
  }
  return Array.from(filenames).pop();
};

module.exports = new Namer({
  name({ bundle }) {
    const filePath = bundle.getMainEntry().filePath;
    const ext = path.extname(filePath);
    if (ext.endsWith('css')) {
      return path.basename(filePath);
    }
    if (filePath.includes('src/static/fonts')) {
      return `fonts/${path.basename(filePath)}`;
    }
    if (path.dirname(filePath).endsWith('/src')) {
      return handleDuplicatedName(path.basename(filePath));
    }
    return null;
  },
});
