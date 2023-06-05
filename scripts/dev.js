// 打包配置文件
import { execa } from "execa";

async function build(target) {
  await execa(
    "rollup",
    ["-cw", "--bundleConfigAsCjs", "--environment", `TARGET:${target}`],
    {
      stdio: "inherit",
    }
  );
}

function runParallel(item, buildFn) {
  const result = [];
  result.push(buildFn(item));
  return Promise.all(result);
}

runParallel("reactivity", build).then((res) => {
  console.log("构建成功");
});
