/**
 * Created by taoqili on 15/9/25.
 */
module.exports = function (grunt) {
    return {
        dist: {
            files: [{
                expand: true,
                cwd: '<%= cfg.path.dev %>',
                src: ['**/*.js', '!**/__*.js'],
                dest: '<%= cfg.path.tmp %>'
            }]
        },
        lib: {
            files: {
                '<%= cfg.path.app %>/common/lib/zepto.min.js': ['<%= cfg.path.app %>/common/lib/zepto.js'],
                '<%= cfg.path.app %>/common/lib/qunarApi.js': ['<%= cfg.path.app %>/common/lib/qunar-api.js']
            }
        }
    }
};