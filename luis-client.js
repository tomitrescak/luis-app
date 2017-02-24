const rootFolder = 'build/luis';
const fsbx = require('fuse-box');
const StubPlugin = require('proxyrequire').FuseBoxStubPlugin(/[^(stories.tsx)]\.ts/);

fsbx.FuseBox.init({
  homeDir: "src",
  log: false,
  sourceMap: {
    bundleReference: 'app.js.map',
    outFile: `${rootFolder}/app.js.map`
  },
  shim: {
    // we need to shim crypto, as enzyme is using crypto
    "crypto": {
      exports: "{ randomBytes: () => crypto.getRandomValues(new global.Uint16Array(1))[0] }"
    }
  },
  plugins: [
    StubPlugin,
    fsbx.JSONPlugin(), [
      // fsbx.CSSResourcePlugin({
      //   dist: `${rootFolder}/resources`,
      //   resolve: (file) => `/resources/${file}`
      // }),
      fsbx.CSSPlugin({
        outFile: (file) => `${rootFolder}/${file}`
      })
    ]
  ],
  outFile: `${rootFolder}/app.js`,
}).devServer("> stories.tsx +indexof", {
  httpServer: false,
  port: 5680
});