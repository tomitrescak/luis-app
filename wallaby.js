const transform = require("jsx-controls-loader").loader;
module.exports = function (wallaby) {
  // var load = require;

  return {
    debug: true,
    files: [
      '!src/**/*.test.ts*',
    ],
    tests: [
      "src/**/*.test.ts*"

    ],
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({ jsx: 'react' })
    },
    // preprocessors: {
    //   "**/*.tsx": file => transform(file.content)
    // },
    env: {
      type: "node",
      runner: "node"
    },
    testFramework: "mocha"
  };
};