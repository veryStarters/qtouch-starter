/**
 * Created by changan.song on 2016/1/9.
 */
import qt from 'qt';

;(function() {
    let couponResult = qt.requestData.couponResult ;
    let couponId = qt.requestData.couponId;
    let userId = qt.commonParam.userId || 'default';
    let springgift = qt.util.localStorage.getItem('springgift');

    springgift = springgift ? JSON.parse(springgift) : {};
    if(couponResult != 0) {
        couponResult = -1;
    }
    springgift[userId] = couponResult;
    qt.util.localStorage.setItem('springgift',JSON.stringify(springgift));
    location.href = '/activity/springgift/' + randdir() + '?couponId='+ couponId;

    function randdir() {
        return ('00000' + Math.ceil(Math.random()*100000)).slice(-5);
    }
})();