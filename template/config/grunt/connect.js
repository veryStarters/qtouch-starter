/**
 * Created by taoqili on 15/8/6.
 */
module.exports = function (grunt) {
    var host = grunt.option('host') || 'localhost',
        port = grunt.option('port') || 3001,
        open = grunt.option('open') || false;

    return {
        //本地服务器配置
        options: {
            hostname: host,
            //需要配合watch插件才能实现自动刷新
            livereload: 35729,
            //默认为false，即connect启动后不会保持启动状态，但可以配合watch插件来实现。若此处设置为true，则会保持启动状态
            //keepalive: true,
            //开起调试模式
            debug: true,
            onCreateServer: function (server, connect, options) {
                console.log("服务启动成功，请按照下方提示进行操作……");
            }
        },
        //app主工程
        app: {
            options: {
                port: port,
                base: {
                    path: '<%=cfg.path.dev%>',
                    options: {
                        extensions: ['html', 'htm']
                    }
                },
                open: !!open ? 'http://' + host + ':' + port : false,
                middleware: function () {
                    return [
                        //路由分发
                        require('./connect-route')(grunt),

                        //静态文件处理
                        require('./connect-static')(grunt),

                        require('./connect-ajax')(grunt),

                        function (req, res, next) {
                            next();
                        }

                    ];
                }()

            }
        }

    };
};