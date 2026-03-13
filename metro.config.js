const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Use polling-based file watcher for compatibility with network/shared filesystems
// (e.g. Parallels shared folders). The native fs.watch fails on these mounts.
config.watcher = {
  ...config.watcher,
  watchman: false,
  additionalExts: config.watcher?.additionalExts || [],
};

config.resolver = {
  ...config.resolver,
  nodeModulesPaths: config.resolver?.nodeModulesPaths || [],
};

module.exports = config;
