/**
 * Created by taoqili on 15/8/25.
 */
module.exports = function (grunt) {
    return {
        options: {
            compress: true,
            //yuicompress: true,
            plugins: [
                new (require('less-plugin-autoprefix'))({browsers: ['> 1%']})
                //new (require('less-plugin-clean-css'))(cleanCssOptions)
            ]
        },
        common: {
            files: {
                '<%= cfg.path.dev %>/common/common.css': ['<%= cfg.path.app %>/common/**/*.less','!<%= cfg.path.app %>/common/component/**/*.less']
            }
        },
        pages: {
            files: [{
                expand: true,
                ext: '.css',
                cwd: '<%= cfg.path.app %>/',
                src: [
                    'pages/**/*.less'
                ],
                dest: '<%= cfg.path.dev %>/'
            }]
        }
    }
};