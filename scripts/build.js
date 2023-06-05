// 打包配置文件
import fs from "node:fs";
import path from "node:path";
import { execa } from "execa";

const packagesPath = path.resolve("packages");

const dirs = fs.readdirSync(packagesPath) || [];

const finalDirs = dirs.filter((dir) => {
  return fs.statSync(path.join(packagesPath, dir)).isDirectory();
});

async function build(target) {
  await execa(
    "rollup",
    ["-c", "--bundleConfigAsCjs", "--environment", `TARGET:${target}`],
    {
      stdio: "inherit",
    }
  );
}

function runParallel(dirs, buildFn) {
  const result = [];
  for (let item of dirs) {
    result.push(buildFn(item));
  }
  return Promise.all(result);
}

runParallel(finalDirs, build).then((res) => {
  console.log("构建成功");
});
