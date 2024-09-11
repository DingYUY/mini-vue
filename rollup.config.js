import typescript from '@rollup/plugin-typescript'

export default {
  input: "./packages/vue/src/index.ts",
  output: [
    {
      format: "cjs",
      file: "packages/vue/dist/mini-vue.cjs.js",
    },
    {
      format: "esm",
      file: "packages/vue/dist/mini-vue.esm.js",
    },
  ],
  plugins: [typescript()],
};