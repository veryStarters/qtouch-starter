/**
 * Created by taoqili on 15/9/28.
 */
var path = require('path');
module.exports = function (grunt) {
    return function () {
        if (!grunt.filerev || !grunt.filerev.summary) {
            throw new Error('Grunt task `filerev` is required.');
        }

        var opt = this.options({
                root: '.'
            }),
            qzzUrl = (grunt.config('cfg.qzzUrl')[grunt.option('env') || grunt.config('cfg.env')] || ''),
            summary = grunt.filerev.summary;

        this.files.forEach(function (file) {
            var root = opt.root,
                orig = file.orig;
            if (orig.cwd) {
                root = path.join(root, orig.cwd);
            }

            file.src.forEach(function (filepath) {
                filepath = path.join(root, filepath);
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('源文件"' + filepath + '" 未找到！');
                    return false;
                }
                grunt.log.writeln('✔ '.green + filepath);

                var source = grunt.file.read(filepath);
                source = source.replace(orig.matches, function (match, prefix, matchUrl) {
                    //线上需要替换成qunar.com域名绑定的baiduMapKey
                    if(match==='3bTDeMOIWun9DELpjhsfeO9W'){
                        return 'IyPuQAKzp2j4O4SKGCepImBd';
                    }
                    matchUrl = path.join(root, matchUrl);
                    var newUrl = summary[matchUrl] || matchUrl;

                    return prefix + (grunt.config('cfg.qzzUrl')[grunt.option('env') || grunt.config('cfg.env')] || '') + newUrl.substr(newUrl.indexOf('/'))
                });
                grunt.file.write(filepath, source);
            });
        });
    }
};