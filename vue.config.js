module.exports = {

    // Setting this to false can speed up production builds if you don't need source maps for production.
    productionSourceMap: false,

    // By default, generated static assets contains hashes in their filenames for better caching control.
    // However, this requires the index HTML to be auto-generated by Vue CLI. If you cannot make use of the index HTML
    // generated by Vue CLI, you can disable filename hashing by setting this option to false,
    filenameHashing: false,
    lintOnSave: false,

    // https://cli.vuejs.org/config/#chainwebpack
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "Crown's Dilemma";
                return args;
            })
    }
};