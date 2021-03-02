module.exports = {
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("tailwindcss")(require("@project/tailwind")),
    require("postcss-nested"),
    require("autoprefixer")
  ]
};
