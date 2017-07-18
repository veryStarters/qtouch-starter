/**
 * Created by taoqili on 15/8/24.
 * 一个小型静态服务器
 */
var fs = require('fs'),
    path = require('path');
module.exports = function (grunt) {
    var mineTypes = {
        "js": "text/javascript",
        "css": "text/css",
        "gif": "image/gif",
        "ico": "image/x-icon",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "html": "text/html",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tiff": "image/tiff",
        "ttf": "font/x-font-ttf",
        "woff": "font/x-font-woff",
        "txt": "text/plain",
        "wav": "audio/x-wav",
        "wma": "audio/x-ms-wma",
        "wmv": "video/x-ms-wmv",
        "xml": "text/xml",
        "mp3":"audio/mpeg"
    };

    return function (req, res, next) {var urlInfo = req._parsedUrl,
            controller = urlInfo.pathname,
            ext = path.extname(controller);


        //不存在扩展名的或者以/hotel/api/开头的都认为是访问页面或者数据接口
        if (!ext || /^\/api\//.test(controller)) {
            next();
            return;
        }
        var env = grunt.option('env') || grunt.config('cfg.env'),
            statics = grunt.config('cfg.statics'),
            qzzUrl;
        if (statics && statics[controller]) {
            qzzUrl = statics[controller];
            var request = require('sync-request'),
                response = request('GET', qzzUrl ),
                result = response.getBody('utf8').toString();

            res.write(result);
            res.end();
        } else {
            var realPath = path.join(grunt.config('cfg.path.dev'), controller),
                contentType = mineTypes[ext.substr(1)] || mineTypes['txt'];
            if (!fs.existsSync(realPath)) {
                next();
                return;
            }
            res.writeHead(200, {'Content-Type': contentType});
            res.write(fs.readFileSync(realPath), 'binary');
            res.end();
        }
    }
};