/**
 * Created by taoqili on 15/8/5.
 */
module.exports = function (grunt) {
    return {
        options: {
            //开启reload
            livereload: true
        },

        //TPL
        tpl: {
            files: ['<%=cfg.path.app%>/**/*.{jade,html,tpl,vm}'],
            tasks: []
        },

        //CSS
        commonCss: {
            files: ['<%=cfg.path.app%>/**/*.less', '!<%=cfg.path.app%>/pages/**/*.less','!<%=cfg.path.app%>/common/component/**/*.less'],
            tasks: ['newer:less:common']
        },
        pagesCss: {
            files: ['<%=cfg.path.app%>/pages/**/*.less','<%=cfg.path.app%>/common/component/**/*.less'],
            tasks: ['newer:less:pages']
        },
        libJs: {
            files: ['<%=cfg.path.app%>/common/lib/zepto.extend.js'],
            tasks: ['newer:concat:lib', 'newer:browserify:lib', 'newer:concat:common']
        },
        //JS
        commonJs: {
            files: ['<%=cfg.path.app%>/common/core/*.js','<%=cfg.path.app%>/common/component/**/*.js','<%=cfg.path.app%>/common/adapter/**/*.js'],
            tasks: ['browserify:core', 'newer:concat:common']
        },
        pagesJs: {
            files: ['<%=cfg.path.app%>/pages/**/*.js'],
            tasks: ['newer:browserify:pages']
        },
        //监控grunt本身的变化并自动重启
        grunt: {
            files: ['Gruntfile.js', './config/**/*.js','./api/**/*.js'],
            options: {
                reload: true
            }
        }

    }
};