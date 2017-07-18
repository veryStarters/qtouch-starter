/**
 * Created by taoqili on 15/8/6.
 */
module.exports = function (grunt) {
    return {
        dev: {
            src: ['<%=cfg.path.dev%>','<%=cfg.path.yaml%>']
        },
        tmp: {
            src: ['<%=cfg.path.tmp%>']
        },
        dist: {
            src: ['<%=cfg.path.dist%>']
        }

    };
};