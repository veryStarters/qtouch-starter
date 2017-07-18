/**
 * Created by taoqili on 15/9/28.
 */
module.exports = function (grunt) {
    return {
        files: {
            cwd: '<%=cfg.path.tmp%>',
            src: ['**/*.{vm,js,css}'],
            //3bTDeMOIWun9DELpjhsfeO9W 是本地的baiduMapKey
            matches: /(?:('|"|\()((?:\/(?:common|pages)\/)(?:.*?)\.(?:ttf|eot|otf|svg|woff|woff2|swf|mp3|png|jpg|jpeg|gif|css|js)))|(3bTDeMOIWun9DELpjhsfeO9W)/g
        }
    }
};