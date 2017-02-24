const rootFolder = 'build/app';
const fsbx = require('fuse-box');

fsbx.FuseBox.init({
  homeDir: "src",
  log: false,
  sourceMap: {
    bundleReference: 'app.js.map',
    outFile: `${rootFolder}/app.js.map`
  },
  plugins: [
    fsbx.JSONPlugin(),
    fsbx.CSSPlugin()
  ],
  outFile: `${rootFolder}/app.js`,
}).devServer("> index.tsx", {
    root: rootFolder,
    port: 3000
});