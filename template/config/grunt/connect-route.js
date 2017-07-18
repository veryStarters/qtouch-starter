/**
 * Created by taoqili on 15/8/11.
 */

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');


module.exports = function (grunt) {
    return function (req, res, next) {
        var urlInfo = req._parsedUrl,
            controller = urlInfo.pathname,
            ext = path.extname(controller),
            requestData = query2param(urlInfo.query),
            common = require('../../api/common'),
            request = require('sync-request');


        //存在扩展名的或者以/hotel/api/开头的都认为是静态文件或者数据接口
        if (ext || /^\/api\//.test(controller)) {
            next();
            return;
        }

        if (controller === '/') {
            //首页自动转到index
            controller = controller + 'index/';
        }

        //提供了一个通用的controller
        if (controller === '/hotel/view' && (requestData.name && (requestData.tpl||'index'))) {
            controller = (requestData.name.indexOf('/') === 0 ? '' : '/') + requestData.name + '/' + (requestData.tpl||'index');
        } else {
            //url请求格式规范化
            controller = controller + ((/\/$/.test(controller)) ? '' : '/') + (requestData.tpl ? requestData.tpl : "index");
        }

        var envMap = {
                local: grunt.config('cfg.path.app'),
                dev: grunt.config('cfg.path.app'),
                beta: grunt.config('cfg.path.dist'),
                prod: grunt.config('cfg.path.dist')
            },
            env = grunt.option('env') || grunt.config('cfg.env'),
            envPath = envMap[env];

        //如果以/形式结尾的controller下不存在对应的index.xx模板文件，
        //那么可能的原因是传入了诸如'/hotel/'这样的二级以上controller，
        //所以尝试在'/hotel/index/'下继续寻找index.xx
        var tplPath = envPath + '/pages' + controller,
            tplExt = '.' + grunt.config('cfg.template');

        if (!fs.existsSync(tplPath + tplExt)) {
            //再尝试一次
            tplPath = tplPath + '/index';
            if (!fs.existsSync(tplPath + tplExt)) {
                res.end('当前地址不存在！！');
                //跳转到404或者直接404
                return;
            }
        }
        tplPath = tplPath + tplExt;

        //响应头设置
        res.setHeader('Content-Type', 'text/html;charset=UTF-8');

        var controllerMap = grunt.config('cfg.controllerAdapter'),
            url = controllerMap[controller.replace('/index', '')],
            response,
            result;
        if (url) {
            response = request('GET', url + (url.indexOf('?') !== -1 ? '&' : '?') + urlInfo.query, {
                headers: function () {
                    return _.extend(req.headers, {})
                }()
            });
            result = response.getBody('utf8').toString().replace(/\n|\r|\t/g, '');
            common = JSON.parse(result || '{}')
        }
        var renderData = _.extend(common, requestData);

        res.end(getRenderResult(tplPath, renderData));

        //渲染本地模板并返回渲染后的数据
        function getRenderResult(tplPath, renderData) {
            var ext = tplPath.substr(tplPath.lastIndexOf('.') + 1) || '',
                engine, result;
            ext = ext.toLowerCase();
            if (ext === "jade") {
                engine = require('jade');
                result = engine.renderFile(tplPath, renderData);
            } else if (ext === "vm") {
                var Engine = require('velocity').Engine;
                engine = new Engine({
                    root: envPath,
                    macro: envPath + '/common/layout/mobile/default.vm',
                    template: tplPath
                });
                result = engine.render(renderData);
            } else if (ext === 'ejs') {
                engine = require('ejs');
                result = engine.render(fs.readFileSync(tplPath, 'utf8'), renderData);
            } else {
                result = '暂不支持的模板类型！';
            }
            return result;
        }

        function query2param(query) {
            if (typeof query !== "string")return {};
            var param = {},
                params, kv;
            params = query.split('&');
            for (var i = 0, len = params.length; i < len; i++) {
                if (!params[i])continue;
                kv = params[i].split('=');
                if (kv[0] && kv[1]) param[kv[0]] = decodeURIComponent(kv[1]);
            }
            return param;
        }

    };

};