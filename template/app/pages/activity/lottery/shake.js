/**--
 - Created by Webstorm.
 - User: taoqili
 - Date: 16/4/27
 - Time: 下午12:15
 - To change this template use File | Settings | File Templates.
 */

/*
    用法：

    var canShake = true;
    var myShakeEvent = new Shake({
        threshold: 15,
        shakeFun: callback
    });

    function callback () {
        if (canShake) {
            canShake = false;

            //模拟ajax延时
            setTimeout(function(){
                canShake = true;
                alert('摇了！');
            }, 5000);
        } else {
            alert('你摇的太频繁了!');
        }
    }
*/
 import qt from 'qt';

 navigator.vibrate = navigator.vibrate ||
                          navigator.webkitVibrate ||
                          navigator.mozVibrate ||
                          navigator.msVibrate;

 function Shake(options) {
     //检测设备硬件
     this.hasDeviceMotion = 'ondevicemotion' in window;
     this.options = {
         threshold: options.threshold || 15 , //默认移动加速度
         timeout: options.timeout || 1000, //两次事件之间间隔时间
         shakeFun: options.shakeFun || new Function    //默认函数
     };

     //记载前一次事件发生时间
     this.lastTime = new Date();

     //x, y, z 初始值
     this.lastX = null;
     this.lastY = null;
     this.lastZ = null;

     this.start();
 }

 //重置
 Shake.prototype.reset = function () {
     this.lastTime = new Date();
     this.lastX = null;
     this.lastY = null;
     this.lastZ = null;
 };

 //开始监听
 Shake.prototype.start = function () {
     var me = this;
     me.reset();
     if (me.hasDeviceMotion) {
         window.addEventListener('devicemotion', function(e){

             e.preventDefault();
             e.stopPropagation();

             var current = e.accelerationIncludingGravity;   //加速度
             var currentTime;    //当前时间
             var timeDifference;     //时间差
             var deltaX = 0;
             var deltaY = 0;
             var deltaZ = 0;
             if ((me.lastX === null) && (me.lastY === null) && (me.lastZ === null)) {
                 me.lastX = current.x;
                 me.lastY = current.y;
                 me.lastZ = current.z;
                 return;
             }

             deltaX = Math.abs(me.lastX - current.x);
             deltaY = Math.abs(me.lastY - current.y);
             deltaZ = Math.abs(me.lastZ - current.z);

             //如果有移动
             if (!(deltaX < me.options.threshold) && (deltaY < me.options.threshold) && (deltaZ < me.options.threshold)){
                 currentTime = new Date();
                 timeDifference = currentTime.getTime() - me.lastTime.getTime();
                 if (timeDifference > me.options.timeout) {

                     //手机震动1秒钟
                     if (navigator.vibrate) {
                        navigator.vibrate(1000);
                     }
                     me.lastTime = new Date();

                     //触发shake要执行的回调函数
                     if (typeof (me.options.shakeFun) === 'function'){
                         me.options.shakeFun.call(me);
                     }
                 }
             }

             me.lastX = current.x;
             me.lastY = current.y;
             me.lastZ = current.z;

            //  e.preventDefault();
         });
     } else {
         qt.alert('您的设备不支持摇一摇！');
     }
 };

 //停止监听
 Shake.prototype.stop = function () {

     if (this.hasDeviceMotion) {
         window.removeEventListener('devicemotion', function(){

         }, false);
     }
     this.reset();
 };

 module.exports = Shake;
