/**
 * Created by taoqili on 15/9/28.
 */
module.exports = function (grunt) {
    return {
        options: {
            algorithm: 'md5',
            length: 8
        },
        files: {
            src: '<%=cfg.path.tmp%>/**/*.{js,css,png,jpg,jpeg,gif,ttf,eot,otf,svg,woff,woff2}'
        }
    }
};