import { build, emptyDir } from "jsr:@deno/dnt"

const version = JSON.parse(Deno.readTextFileSync("./deno.json")).version

await emptyDir("./npm")

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {},
  test: false,
  scriptModule: false,
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
  },
})
