const argv = process.argv
const shell = require('shelljs')
// easepack.set 设置全局属性
easepack
    .set('alias', {
        'vue$':'node_modules/vue/dist/vue.esm.js',
        '@components': './components',
        '@styles': './css',
        '@images': './images',
        '@store': './store',
        '@service': './service',
    })

    //设置 autoprefixer，默认 ['iOS >= 7', 'Android >= 4.1']
    .set('useAutoprefixer', true)
    .set('useExtract', true)
    .set('useCommonsChunk', true)

easepack
    .media('dev')
    .set('port', 8086)
    .set('webpackDevServer', true)
    .set('useSourceMap', true)
    .set('nodeEnv', '"development"')

easepack.media('build')
    .set('useSourceMap', false)
    .set('useUglifyjs', true)
    .set('useCleancss', true)
    .set('publicPath', './')
    .set('output', './dist')
    .set('nodeEnv', '"production"');

easepack.match('popup.html');
easepack.match('background.html');

easepack
    .match('images/*.{png,jpg}', {
        url: '[path][name].[ext]?[hash]'
    })
    .match('./js/main.js', {
        url: 'js/[name].[ext]?[hash]'
    })
    .match('entries/*.swf',{
        url: '[path][name].[ext]?[hash]'
    })
    .match('fonts/*.*',{
        url: '[path][name].[ext]?[hash]'
    })

easepack
    .media('build')
    .match('images/*.{png,jpg}', {
        url: '[path][name].[hash].[ext]'
    })
    .match('./js/main.js', {
        url: 'js/[name].[hash].[ext]'
    })
    .match('./js/background.js', {
        url: '[name].[ext]'
    })
    .match('fonts/*.*',{
        url: '[path][name].[hash].[ext]'
    })

const output = easepack.set('useEs2015', true).output;

if (output) {
  shell.rm('-rf', output)
}

