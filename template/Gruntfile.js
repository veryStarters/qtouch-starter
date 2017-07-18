/**
 * Created by WebStorm.
 * @date   : 14-7-26
 * @author : 陶启立(taoqili)
 * @link   : touch.qunar.com
 * @desc   : 构建任务集合
 */

var path = require('path');

module.exports = function (grunt) {
    //初始化配置导入
    var cfg = require('./config/app-config')(grunt);

    //环境变量定义
    var env = process.env.DEPLOY_TYPE = grunt.option('deploy-type') || '';

    //初始化grunt配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cfg: cfg,
        //监控文件变化
        watch: require('./config/grunt/watch')(grunt),
        //本地服务器,可能涉及比较多的自定义参数，传入grunt
        connect: require('./config/grunt/connect')(grunt),
        //模块化
        browserify: require('./config/grunt/browserify')(grunt),
        //less预处理
        less: require('./config/grunt/less')(grunt),
        //合并文件
        concat: require('./config/grunt/concat')(grunt),
        //复制文件
        copy: require('./config/grunt/copy')(grunt),

        //js优化
        uglify: require('./config/grunt/uglify')(grunt),

        //文件版本更新
        filerev: require('./config/grunt/filerev')(grunt),
        filerev_replace: require('./config/grunt/filerev-replace')(grunt),
        shell: require('./config/grunt/shell')(grunt),
        newer: require('./config/grunt/newer')(grunt),

        //清理编译缓存
        clean: require('./config/grunt/clean')(grunt)
    });


    //任务配置
    var serverTasks = [
            'clean:dev', 'concat:lib', 'uglify:lib', 'browserify', 'less', 'concat:common', 'copy:dev', 'connect', 'watch'
        ],
        buildTasks = [
            'clean:dev', 'concat:lib', 'uglify:lib', 'browserify', 'less', 'concat:common', 'copy:dev', 'clean:dist', (!env || env === "dev") ? 'copy:tmp_js' : 'uglify:dist', 'copy:tmp', 'filerev', 'filerev_replace', 'shell:yaml', 'copy:dist_vm', 'copy:dist_static', 'clean:tmp'
        ],
        hybridTask = [
            'clean:dev', 'concat:hybrid_lib', 'uglify:lib', 'browserify', 'less', 'concat:common', 'copy:dev', 'connect', 'watch'
        ];

    //自定义执行任务ddd
    grunt.registerTask('server', serverTasks);
    grunt.registerTask('build', buildTasks);
    grunt.registerTask('test', []);

    grunt.registerTask('hybrid', hybridTask);

    //自定义插件任务
    grunt.registerMultiTask('filerev_replace', 'filerev-replace', require('./config/grunt/filerev-replace-task')(grunt));

    // node-modules是提供给QDR编译环境使用的参数
    // 本机开发可以忽略
    var nodeModulesDir = grunt.option('node-modules') || '.',
        root = path.resolve('node_modules');
    // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    require('matchdep').filterAll('grunt-*').forEach(function (nodeModule) {
        var taskdir = path.join(root, nodeModule, 'tasks');
        if (grunt.file.exists(taskdir)) {
            // 优先从项目根目录下加载依赖包
            grunt.loadNpmTasks(nodeModule);
        } else if (nodeModulesDir) {
            // 项目根目录没找到的话就到外部公共目录找
            var cwd = process.cwd();
            process.chdir(nodeModulesDir);
            grunt.loadNpmTasks(nodeModule);
            process.chdir(cwd);
        }
    });

    // 各模块运行所消耗的时间，可以用来指导优化编译过程
    require(nodeModulesDir + '/node_modules/' + 'time-grunt')(grunt);
};
