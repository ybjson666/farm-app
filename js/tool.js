function requestFunc(param,callBack){
    $.ajax({
        url:common_url+param.url,
        data:param.datas,
        type:param.types?param.types:'post',
        dataType:"json",
        success:callBack
    })
    
}
function requestFunc2(param,callBack){
    $.ajax({
        url:common_url+param.url,
        data:param.datas,
        type:param.types?param.types:'post',
        dataType:"json",
        contentType: false,
        processData: false,
        success:callBack
    })
    
}
function toggleModal(msg){
    var modal=document.createElement("div");
    var style=`position: fixed;width: 8rem;background: rgba(0, 0, 0, 0.5);top:60%;left: 50%;
    margin-left: -4.5rem;padding: .5rem;text-align: center;border-radius:5px;color: #fafafa; z-index: 1000;
    opacity: 0;transition:.3s;font-size: .1.4rem;`;

    modal.className="error-block";
    modal.style.cssText=style;
    var child=document.createElement("span");
    child.className="error-txt";
    modal.appendChild(child);
    child.innerHTML=msg;
    document.body.appendChild(modal);
    modal.style.opacity="1";
    setTimeout(function(){
        child.innerHTML="";
        modal.style.opacity="0";
        setTimeout(function(){
            document.body.removeChild(modal);
        },500);
    },1000);
}

function reCalHeight(){
    setTimeout(function (){
       var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
       window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
}

function getRequest(){
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }

    }
    return theRequest;
}

function formatTime(date) {
    var time = new Date();
    var month = time.getMonth() + 1;
    var strDate = time.getDate();
    var hour=time.getHours();
    var min=time.getMinutes();
    var sec=time.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (min >= 0 && min <= 9) {
        min = "0" + min;
    }
    if (sec >= 0 && sec <= 9) {
        sec = "0" + sec;
    }
    //获取日期对象 time 的年、月、日，并拼接为字符串 yyyy-mm-dd ,再返回
    return time.getFullYear() + "-" + month + "-" + strDate + "\xa0"+hour+":"+min+":"+sec;
}

function tranStamp(dateStr){//将日期字符串转为时间戳
    var dateTmp = dateStr.replace(/-/g,'/')   //为了兼容IOS，需先将字符串转换为'2018/9/11 9:11:23'
    return Date.parse(dateTmp)                 //返回'2018-9-12 9:11:23'的时间戳
}
function judgeEnviron(){//判断环境
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return 'android';
    }else if (isIOS) {
    　　return 'ios';
    }else{
        return 'pc';
    }
}
/*压缩图片*/
function compressImg(r,callBack){
    var count = 1;
    var scale = 1;
    var oldW;
    var oldH;
    var image = new Image();
    var compImage;
    image.src= r;
    image.onload=function(){
        scale = scale - 0.1;
        let canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d');
        var w = image.naturalWidth;
        var h = image.naturalHeight;
        if(!oldW && !oldH){
            oldW = w;
            oldH = h;
        }
        canvas.width = oldW * scale;
        canvas.height = oldH * scale;
        ctx.drawImage(image, 0, 0, oldW * scale, oldH * scale);
        compImage = canvas.toDataURL('image/jpeg', scale);
        if(compImage.length > 30000 && count < 9){
            count++;
            compressImg(compImage,callBack);
        } else {
            ctx.drawImage(image, 0, 0, oldW, oldH);
            callBack&&callBack(compImage)
        }
    }

 }