const tsc = require('typescript');
const tsConfig = require('./tsconfig.json');
const stubLoader = require('proxyrequire').webpackStubLoader;

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      let res = tsc.transpile(
        src,
        tsConfig.compilerOptions,
        path,
        []
      );
      res = stubLoader(res);
      res = 'const proxyRequire = require("proxyrequire").proxyRequire\n' + res;
      return res;
    }
    return src;
  },
};