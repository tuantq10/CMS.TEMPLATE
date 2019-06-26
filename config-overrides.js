const {override, fixBabelImports, addLessLoader, disableEsLint} = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
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
        },
    }),
);
