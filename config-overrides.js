const {
    override,
    fixBabelImports,
    addLessLoader,
    disableEsLint,
    addWebpackAlias
} = require("customize-cra");
const path = require("path");

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true
    }),
    addWebpackAlias({
        ["~"]: path.resolve(__dirname, "src")
    }),
    disableEsLint(),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            "@primary-color": "#1890ff",
            "@table-padding-vertical": "6px",
            "@table-padding-horizontal": "8px",
            "@link-color": "#1890ff",
            "@font-family": "'Helvetica Neue', Arial, sans-serif",
            "@form-item-margin-bottom": "0px",
            "@animation-duration-slow": "0s",
            "@animation-duration-base": "0s",
            "@animation-duration-fast": "0s"
        }
    })
);
