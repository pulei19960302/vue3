// 获取打包文件
import path from "node:path";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import resolvePlugin from "@rollup/plugin-node-resolve";

const packagesDir = path.resolve("packages");

// 获取需要打包的路径
const packageDir = path.resolve(packagesDir, process.env.TARGET);

const resolve = (p) => path.resolve(packageDir, p);

const pkg = require(resolve(`package.json`));
const packageOptions = pkg.buildOptions || {};
const name = packageOptions.name || path.basename(packageDir);

const outputConfigs = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`,
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`,
  },
};

const pkgBuildOptions = packageOptions.formats || [];

console.log(path.resolve("tsconfig.json"));

function createConfig(buildType, output) {
  return {
    input: resolve("src/index.ts"),
    output: {
      ...output,
      name,
      sourcemap: true,
    },
    plugins: [
      json(),
      typescript({
        tsconfig: path.resolve("tsconfig.json"),
      }),
      resolvePlugin(),
    ],
  };
}

export default pkgBuildOptions.map((format) =>
  createConfig(format, outputConfigs[format])
);
