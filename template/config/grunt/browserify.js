/**
 * Created by taoqili on 15/8/6.
 */
module.exports = function (grunt) {
    return {
        //通用模块，包含zepto、underscore和qtouch核心库
        lib: {
            options: {
                watch: false,//统一采用watch插件，此处关闭
                transform: ['babelify'],
                require: [
                    '<%=cfg.path.app%>/common/lib/zepto.min.js',
                    '<%=cfg.path.app%>/common/lib/underscore.js'
                ],
                alias: {
                    "zepto": '<%=cfg.path.app%>/common/lib/zepto.min.js',
                    "underscore": '<%=cfg.path.app%>/common/lib/underscore.js'
                }
            },
            src: [],
            dest: '<%=cfg.path.dev%>/common/__lib.js'
        },
        core: {
            options: {
                watch: true,
                transform: ['babelify','stringify'],
                external: ['underscore', 'zepto'],
                alias: {
                    "qt": '<%=cfg.path.app%>/common/core/qtouch.js',
                    "qtouch": '<%=cfg.path.app%>/common/core/qtouch.js'
                }
            },
            src: [],
            dest: '<%=cfg.path.dev%>/common/__core.js'
        },
        //component:{
        //    options:{
        //        watch:true,
        //        transform:['babelify','stringify'],
        //        external:['qtouch','qt','underscore','zepto']
        //    },
        //    expand:true,
        //    cwd: '<%=cfg.path.app%>/component/',
        //    src: ['**/main.js'],
        //    dest: '<%=cfg.path.dev%>/component/'
        //},
        pages: {
            options: {
                watch: true,
                transform: ['babelify','stringify'],
                external: ['qtouch', 'qt', 'underscore', 'zepto']
            },
            expand: true,
            cwd: '<%=cfg.path.app%>/pages/',
            src: ['**/main.js','**/*.main.js'],
            dest: '<%=cfg.path.dev%>/pages/'
        }
    };
};