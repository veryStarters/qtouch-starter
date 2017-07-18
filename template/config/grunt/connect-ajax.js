/**
 * Created by taoqili on 15/8/27.
 */
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');
module.exports = function (grunt) {
    return function (req, res, next) {
        var request = require('sync-request');
        var urlInfo = req._parsedUrl,
            controller = urlInfo.pathname,
            ext = path.extname(controller);
        //存在扩展名的或者不是以/api/开头的都认为是静态文件或者页面请求
        if (ext || !/^\/api\//.test(controller)) {
            next();
            return;
        }
        var apiAdapter = grunt.config('cfg.apiAdapter'),
            result = {};
        if (apiAdapter[controller]) {
            var api = apiAdapter[controller],
                response = request('GET', api + (api.indexOf('?') !== -1 ? '&' : '?') + urlInfo.query, {
                    headers: function () {
                        return _.extend(req.headers, {
                            host: function () {
                                var match = api.match(/\/\/(.*?)\//);
                                return match && match[1] ? match[1] : req.headers.host;
                            }()
                        })
                    }()
                });
            result = response.getBody('utf8').toString().replace(/\n|\r|\t/g, '');
        } else {
            result = require('../..' + controller + '.js');
            result = JSON.stringify(result);
        }
        res.setHeader('Content-Type', 'text/html;charset=UTF-8');
        res.end(result);
    };
};