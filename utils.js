//检测当前环境是否是在window环境下
var isWindow = function( obj ) {
        return obj != null && obj == obj.window;
}

//获取浏览器宽高 或者document下的
var getWindowWH = function(elem,name){
    if ( isWindow( elem ) ) {
        return elem.document.documentElement[ "client" + name ];
    }
    // Get document width or height
    if ( elem.nodeType === 9 ) {
        var doc = elem.documentElement;

        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
        // whichever is greatest
        // unfortunately, this causes bug #3838 in IE6/8 only,
        // but there is currently no good, small way to fix it.
        return Math.max(
            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
            elem.body[ "offset" + name ], doc[ "offset" + name ],
            doc[ "client" + name ]
        );
    }
}

//获取元素计算出来的样式属性大小
var getComputedStyplat = function(elm,prop){
    if(!elm){
        return null;
    }else{
        if(elm.currentStyle){
            return elm.currentStyle[prop].toString();
        }else if(window.getComputedStyle){
            return window.getComputedStyle(elm , null).getPropertyValue(prop).toString();
        }else{
            return null;
        }
    }
}


//拷贝对象
var copyObj = function(obj){
    var newObj;
    if(typeof obj === 'object'){
        if(!!obj.slice){
            newObj = [];
            //如果是数组
            for(var i=0;i<obj.length;i++){
                var listI = obj[i];
                newObj[i] = arguments.callee(listI);
            }
        }else{
            for(var key in obj){
                newObj[key] = arguments.callee(obj[key]);
            }
        }
    }else{
       newObj =  obj;
    }
    return newObj;
};
//参数扩展extend
var extendDeep = function(){
    var target = arguments[0] || {},
    that = this,
    i = 1,
    options,
    copy,
    src,
　　length = arguments.length,
　　deep = true;//深拷贝
    //循环
    for(;i < length;i++){
        if((options = arguments[i]) != null){
            for(name in options){
                src = target[ name ];
                copy = options[ name ];
                if(src === copy){
                    continue;
                }
                target[ name ] = copyObj(copy);
            }
        }
    }
    return target;
}

//数组的isArray方法
var isArray = Array.isArray || function (obj) {
    return ({}).toString.call(obj) === '[object Array]';
};


//each 循环函数
var each = function (data, callback) {
    var i, len;        
    if (isArray(data)) {
        for (i = 0, len = data.length; i < len; i++) {
            callback.call(data, data[i], i, data);
        }
    } else {
        for (i in data) {
            callback.call(data, data[i], i);
        }
    }
};


//事件绑定
var eventBind = function(elm,type,fn){
    elm = elm || null;
    if(!!elm){
        if(window.addEventListener){
            elm.addEventListener(type,fn,false);
        }else if(window.attachEvent){
            elm.attachEvent('on'+type,fn);
        }else{
            elm['on'+type] = fn;
        }
    }else{
        throw '待绑定的事件不存在';
    }
}

//class 移除
var removeClass = function(dom,claName){
    if(!!dom){
        var className = dom.className;
            pattern = new RegExp(claName,'g');
        if(pattern.test(className)){
            dom.className = dom.className.replace(pattern,'');
        }
    }
}


//class添加
var addClass = function(dom,claName){
    if(!!dom){
        var className = dom.className.split(/\s+/),
            claName = claName.split(/\s+/),
            className = className.concat(claName),
            returnClass = '';
            tempClass= {};
        for(var i=0;i<className.length;i++){
            var listI  = className[i];
            if(!tempClass[listI]){
                tempClass[listI] = true;
                returnClass += listI+' ';
            }
        }
        dom.className = returnClass;
    }
}


//判断浏览器是否是IE 且返回版本号
function IeCheck(){
	if(!-[1,]){//IE 
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);  
        var fIEVersion = parseFloat(RegExp["$1"]);
        return fIEVersion;
    }else{
        return false;
    }
}


/**
 * 检测属性是否被元素style属性包含
 *  
 * @param  {string} prop
 * 
 */
checkStyleElm:function(prop){
    var div = document.createElement('div');
    return prop in div.style;
}


//是否支持透明度设置
var isSpportOpacity = 'opacity' in document.createElement('div').style;
//透明度设置
var opacitySet = function(elm,opacity){
     if(isSpportOpacity){
        elm.style.opacity = opacity;
    }else{
        elm.style.filter = 'alpha(opacity='+ opacity*100 +')';
    }
}
//添加一个遮罩
var mask = (function(){
    var div = document.createElement('div'),
        styleObj = {'position':'fixed','zIndex':1000,'width':winW+'px','height':winH+'px','left':0,'top':0,'backgroundColor':'#000','display':'none'};
    for(var key in styleObj){
        div.style[key] = styleObj[key];
    }
    div.style.transition = 'opacity .15s ease-in-out';
    opacitySet(div,0.6);
    document.querySelectorAll('body')[0].appendChild(div);
    return div;
})();


//new Function 模板引擎的使用 仅供参考
formatFun:function(val){
	var formatArr = this.options.format.split('=>')[1].split('value');
	var code = 'var $data = "";\n';
	code += '$data += '+'"'+formatArr[0]+'"'+';\n';
	if(/\.replace/.test(formatArr[1])){
		code += '$data += ' + '$val'+formatArr[1] + ';\n';
	}else{
		code += '$data += ' + '$val+'+'"'+formatArr[1] + '";\n';
	}
	code += 'return $data;';
	var fn = new Function('$val',code);
	var str = fn(val.toString());
	return str;
}


//判断当前浏览器是否支持移动事件
var mobileFlg = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

//特殊字符转码函数
var stringifyCode = function(str){
    var pattern = /[\!\-\.\*\^\&\%\$\~\?\<\>\}\{\[\]\\\|\/]/g;
    str = str.replace(pattern,function(word){
        return '\\'+ word;
    });
    return str;
}

/*
* 检测浏览器版本信息:
* autor zyshi
*/
 var TreeBrowser = {
     //语言
     language:(navigator.browserLanguage || navigator.language).toLowerCase(),
     u:navigator.userAgent || navigator.appVersion,
     browType:{
         //IE
         isIE:false,
         //fireFox
         isFireFox:false,
         //chrome
         isChromeOrSafri:false,
         //opera
         isOPera:false,
         //mobile
         isMobile:false,
         //IOS
         isIOS:false,
         //Android
         isAndroid:false,
         //iphone
         isIphone:false,
         //ipad
         isIpad:false
     },
     //检查浏览器信息
     CheckBrow:function(){
        this.browType.isIE = this.u.indexOf('Trident') > -1;
        this.browType.isOPera = this.u.indexOf('Presto') > -1;
        this.browType.isChromeOrSafri = this.u.indexOf('AppleWebKit') > -1;
        this.browType.isFireFox = this.u.indexOf('Gecko') > -1 && this.u.indexOf('KHTML') == -1;
        this.browType.isMobile = !!this.u.match(/Mobile/i) && !!this.u.match(/AppleWebKit/);
        this.browType.isIOS = !!this.u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        this.browType.isAndroid = this.u.indexOf('Android') > -1 || this.u.indexOf('Linux') > -1; //android终端或者uc浏览器
        this.browType.isIphone = this.u.indexOf('iPhone') > -1 || this.u.indexOf('Mac') > -1; //是否为iPhone或者QQHD浏览器
        this.browType.isIpad = this.u.indexOf('iPad') > -1;
     },
     //获取浏览器信息
     getCurrBrowMes:function(isShowMess){
        this.CheckBrow();
        var mess = '';
        for(var i in this.browType){
            var o = this.browType[i];
            if(o){
                mess += i.toString()+'|';
            }
        }
        if(isShowMess){
            return mess.split('|')[0];
        }
     },
     //获取当前浏览器版本
     getBrowVersion:function(){
        var re =/(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        var Iere = /(msie\s|trident.*rv:)([\w.]+)/;
        var u = this.u.toLowerCase();
        if(re.test(u)){
            return RegExp.$2;
        }else if(Iere.test(u)){
            return RegExp.$2;
        }
     }
}

//删除一个元素
_removeElement:function(n){
    if(n && n.parentNode && n.tagName != 'BODY'){  
        n.parentNode.removeChild(n);  
    }
}


 //获取元素绝对位置
getElementPos:function(elm){
    var ua = navigator.userAgent.toLowerCase();
    var isOpera = (ua.indexOf('opera') != -1);
    var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
    var el = elm;
    
    if(el.parentNode === null || el.style.display == 'none') {
        return false;
    } 
    var parent = null;
    var pos = [];     
    var box;
    //Ie 
    if(el.getBoundingClientRect){         
        box = el.getBoundingClientRect();
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        return {x:box.left + scrollLeft, y:box.top + scrollTop};
    }
    // gecko
    else if(document.getBoxObjectFor){
        box = document.getBoxObjectFor(el); 
        var borderLeft = (el.style.borderLeftWidth)?parseInt(el.style.borderLeftWidth):0; 
        var borderTop = (el.style.borderTopWidth)?parseInt(el.style.borderTopWidth):0; 
        pos = [box.x - borderLeft, box.y - borderTop];
    }
    // safari & opera
    else{
        pos = [el.offsetLeft, el.offsetTop];  
        parent = el.offsetParent;   
        if (parent != el) { 
            while (parent) {  
                pos[0] += parent.offsetLeft; 
                pos[1] += parent.offsetTop; 
                parent = parent.offsetParent;
            }  
        } 
        if (ua.indexOf('opera') != -1 || ( ua.indexOf('safari') != -1 && el.style.position == 'absolute' )) { 
            pos[0] -= document.body.offsetLeft;
            pos[1] -= document.body.offsetTop;         
        }    
    }          
    if (el.parentNode) { 
        parent = el.parentNode;
    } 
    else {
        parent = null;
    }
    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') 
    {
        pos[0] -= parent.scrollLeft;
        pos[1] -= parent.scrollTop;
        if (parent.parentNode) {
            parent = parent.parentNode;
        } 
        else {
            parent = null;
        }
    }
    return {x:pos[0], y:pos[1]};
}


//获取元素text文本
var getInnerText = treeManager.fn.getInnerText = function(element) {
    return (typeof element.textContent == "string") ? element.textContent : element.innerText;
}


//阻止默认行为
var preventDefau = treeManager.fn.preventDefau = function(e){
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
}


