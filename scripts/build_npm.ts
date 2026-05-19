import { build, emptyDir } from "jsr:@deno/dnt"

const version = JSON.parse(Deno.readTextFileSync("./deno.json")).version

const subpathEntries: Array<{ name: string; path: string }> = [
  { name: "./at", path: "./src/at.ts" },
  { name: "./batch", path: "./src/batch.ts" },
  { name: "./branch", path: "./src/branch.ts" },
  { name: "./concat", path: "./src/concat.ts" },
  { name: "./count", path: "./src/count.ts" },
  { name: "./createReadable", path: "./src/createReadable.ts" },
  { name: "./createWritable", path: "./src/createWritable.ts" },
  { name: "./drop", path: "./src/drop.ts" },
  { name: "./every", path: "./src/every.ts" },
  { name: "./filter", path: "./src/filter.ts" },
  { name: "./flat", path: "./src/flat.ts" },
  { name: "./flatMap", path: "./src/flatMap.ts" },
  { name: "./forEach", path: "./src/forEach.ts" },
  { name: "./includes", path: "./src/includes.ts" },
  { name: "./indexOf", path: "./src/indexOf.ts" },
  { name: "./iterate", path: "./src/generators/iterate.ts" },
  { name: "./join", path: "./src/join.ts" },
  { name: "./lines", path: "./src/lines.ts" },
  { name: "./list", path: "./src/list.ts" },
  { name: "./map", path: "./src/map.ts" },
  { name: "./merge", path: "./src/merge.ts" },
  { name: "./pipe", path: "./src/pipe.ts" },
  { name: "./range", path: "./src/generators/range.ts" },
  { name: "./reduce", path: "./src/reduce.ts" },
  { name: "./slice", path: "./src/slice.ts" },
  { name: "./some", path: "./src/some.ts" },
  { name: "./splice", path: "./src/splice.ts" },
  { name: "./take", path: "./src/take.ts" },
  { name: "./tap", path: "./src/tap.ts" },
  { name: "./toBuffer", path: "./src/toBuffer.ts" },
  { name: "./words", path: "./src/generators/words.ts" },
  { name: "./zip", path: "./src/zip.ts" },
]

await emptyDir("./npm")

await build({
  entryPoints: ["./mod.ts", ...subpathEntries],
  outDir: "./npm",
  shims: {},
  test: false,
  typeCheck: false,
  package: {
    name: "@sgmonda/streamfu",
    version,
    description: "Functional programming utilities for working with streams in JS/TS",
    license: "MIT",
    repository: { type: "git", url: "git+https://github.com/sgmonda/streamfu.git" },
    keywords: ["streams", "functional", "web-streams", "readable-stream", "pipe", "map", "filter", "reduce"],
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE")
    Deno.copyFileSync("README.md", "npm/README.md")
    // dnt does not emit `types` when there are multiple entry points;
    // patch the manifest so every subpath also exposes its `.d.ts`.
    // deno-lint-ignore no-explicit-any
    const pkg = JSON.parse(Deno.readTextFileSync("./npm/package.json")) as any
    pkg.types = "./script/mod.d.ts"
    for (const [key, value] of Object.entries(pkg.exports as Record<string, { import: string; require: string }>)) {
      const dts = value.require.replace(/\.js$/, ".d.ts")
      pkg.exports[key] = { types: dts, import: value.import, require: value.require }
    }
    Deno.writeTextFileSync("./npm/package.json", JSON.stringify(pkg, null, 2) + "\n")
  },
})
