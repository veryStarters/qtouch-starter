/**
 * Created by taoqili on 16/3/2.
 */
/**
 * Created by taoqili on 15/8/25.
 */
module.exports = function (grunt) {
    //TODO 从外部获取
    var branchName = 'touch_hotel_yaml_' + Date.now();
    return {
        yaml: {
            command: function () {
                return  [
                    'mkdir .yaml && cd .yaml',
                    'git clone git@gitlab.corp.qunar.com:mobile_touch/yaml.git',
                    'cd yaml',
                    'git checkout -b ' + branchName,
                    'cp -r -f ../../index.yaml .',
                    'git add index.yaml',
                    'git commit -m "add a branch ' + branchName + '"',
                    'git push origin ' + branchName,
                    'cd ../../',
                    'rm -r -f ./.yaml/'
                ].join(' && ');
            }
        }
    }
};