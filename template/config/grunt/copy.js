/**
 * Created by taoqili on 15/9/25.
 */
module.exports = function (grunt) {
    var extList = 'ttf,eot,otf,svg,woff,woff2,swf,mp3,ico,png,jpg,jpeg,gif,ico,vm,css';
    return {
        dev: {
            expand: true,
            cwd: '<%= cfg.path.app %>/',
            dest: '<%= cfg.path.dev %>/',
            src: ['**/*.{' + extList + '}','**/qunarApi.js']
        },
        tmp:{
            expand: true,
            cwd: '<%= cfg.path.dev %>/',
            dest: '<%= cfg.path.tmp %>/',
            src: '**/*.{' + extList + '}'
        },
        tmp_js:{
            expand: true,
            cwd: '<%= cfg.path.dev %>/',
            dest: '<%= cfg.path.tmp %>/',
            src: '**/*.js'
        },
        dist_vm: {
            expand: true,
            cwd: '<%= cfg.path.tmp %>/',
            dest: '<%= cfg.path.dist %>/templates/',
            src: '**/*.vm'
        },
        dist_static:{
            expand: true,
            cwd: '<%= cfg.path.tmp %>/',
            dest: '<%= cfg.path.dist %>/',
            src: ['**/*.{' + extList + '}','**/*.js','!**/*.vm']
        }

    }
};