/**
 * Created by taoqili on 15/8/25.
 */
module.exports = function (grunt) {
    var libs = ['<%= cfg.path.app %>/common/lib/zepto.src.js','<%= cfg.path.app %>/common/lib/zepto.extend.js'];
    return {
        //代码打包配置
        lib:{
            src:libs,
            dest:'<%= cfg.path.app %>/common/lib/zepto.js'
        },
        hybrid_lib:{
            src:libs.concat(['<%= cfg.path.app %>/common/lib/QunarAPI.js']),
            dest:'<%= cfg.path.app %>/common/lib/zepto.js'
        },
        common: {
            src: ['<%= cfg.path.dev %>/common/__*.js'],
            dest: '<%= cfg.path.dev %>/common/common.js'
        }
    }
};