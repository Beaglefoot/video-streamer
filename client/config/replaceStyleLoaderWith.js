// Mutates config object
const replaceStyleLoaderWith = replacementLoader => (testCondition, config) => {
  const stringifiedCondition = testCondition.toString();

  const stylesRule = config.module.rules.find(
    rule => rule.test.toString() === stringifiedCondition
  );

  stylesRule.use.some((loader, i, loaders) => {
    if (loader === 'style-loader') {
      loaders[i] = replacementLoader;
      return true;
    }
  });

  return config;
};

module.exports = replaceStyleLoaderWith;
