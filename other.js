/*
* 公共方法js
* autor shizhouyu 
* time  2016-7-20
* $$ 需要绑定的全局对象
* strictFlg 是否使用严格模式
*/
;(function($$,strictFlg){
	/*
		声明插件是否使用严格模式
	*/
	if(strictFlg){
		'use strict';
	}
	/*
	* 保存计算机最大值 最小值
	*/
	$$.MAXUNM = Number.MAX_VALUE;
	$$.MINUNM = Number.MIN_VALUE;
	/*
	* 去除字符串首尾空格方法封装
	*/
	if(typeof(String.prototype.trim) !== 'function'){
		String.prototype.trim = function(){
			var _this = this;
			return _this.replace(/(^\s*|\s*$)/,'');
		}
	}
	/*
	* 计算数字阶乘
	*/
	$$.factorial = function(num){
		if(typeof(num) !== 'number'){
			throw('计算阶乘参数不合法，必须为数字！');
			return;
		}
		if(num <= 1){
			return 1;
		}else{
			if(strictFlg){
				return num*$$.factorial(num-1);
			}
			return num*arguments.callee(num-1);
		}
	}
	/*
	* 数组去重
	* 
	*/
	Array.prototype.weight = function(){
		var d = {};
		var b = [];
		var _this = this;
		if(_this.length <= 1) {
			return _this;
		}
		d[_this[0]] = _this[0];
		b.push(_this[0]);
		for(var i=1,len = _this.length;i<len;i++){
			if(_this[i] != d[_this[i]]){
				d[_this[i]] = _this[i];
				b.push(_this[i]);
			}else{
				continue;
			}
		}
		return b;
	}
	/*
	*  模板系统 MPT
	*/
    $$.MPT = new function() {
   		/*
   		* 存储模板的对象
   		*/
        var tmplobj = {};
        /*
			*  事件绑定
			*  elm 要绑定事件的dom元素
			*  eventName 事件名
			*  fn 需要执行的方法
		*/
        $$.bind = this.bind = function(elm, eventName, fn) {
	        if (elm.attachEvent) {
	            elm.attachEvent("on" + eventName, fn);
	        } else {
	            elm.addEventListener(eventName, fn, false);
	        }
	    };
	    /*
	    *  模板的入口方法
	    *  actionName 入口方法名
	    *  fn 需要执行的方法
	    */
        this.addAction = function(actionName, fn) {
            if (tmplobj[actionName]) {
                alert("[错误]您新增的动作名已经存在！");
                return;
            } else {
                tmplobj[actionName] = fn;
            }
        };
        /*
		*  执行模板的动作方法
		*  actname 动作名
		*/
		this.excAction = function(actname) {
			var actionArr = getElmAction(actname);
			for (var i = 0; i < actionArr.length; i++) {
				//执行方法  actionName(parm);
				tmplobj[actionArr[i]["action_name"]](actionArr[i]["element"]);
			}
		};
		/*
		*  获取绑定入口方法的elm元素
		*  actname 一个字符串（actionName）
		*  返回值 数组 包含入口方法名和包含入口方法的dom元素
		*/
		var getElmAction = function(actname) {
			var elmArr = [];
			var parm = document;
			if (parm.getElementsByClassName) {
				var domArr = parm.getElementsByClassName("mpt");
			} else {
				var domArr = parm.getElementsByTagName("*");
			}
			var domArrL = domArr.length;
			for (var i = 0; i < domArrL; i++) {
				var className = domArr[i].getAttribute("class") || domArr[i].getAttribute("classname");
				if (!className) {
					continue;
				}
				var patternStr = 'a_'+ actname;
				var pattern = new RegExp(patternStr);
				if (pattern.test(className)){
					if (tmplobj[actname]) {
						elmArr.push({
							action_name: actname,
							element: domArr[i]
						});
					} else {
						alert("[错误]动作列表中未找到" + actname + "方法");
					}
				}
			}
			return elmArr;
		};
        var saveTmplD = {};
        /*
       	* 添加模板
		* tmplName 模板名
		* fnName  绑定的回调函数
        */
        this.addTmpl = function(tmplName, fnName) {
            judgeTmname(saveTmplD, tmplName, 'addTmpl("' + tmplName + '", ...) 添加模板重名！',function() {
                saveTmplD[tmplName] = fnName;
            });
        };
        /*
        *	获取模板
		*   tmplName 获取的模板名
		*   bindData 模板绑定的数据 对象格式
        */
        this.getTmpl = function(tmplName, bindData) {
            return saveTmplD[tmplName]((!bindData ? {}: bindData));
        };
        /*
        * 判断添加模板的名称是否重复
        * saveTmplD 保存模板名及模板函数的对象
        * tmplName  模板名称
        * errorMsg  错误提示
        * fn 如果不重名需要执行的方法
        */
        var judgeTmname = function(saveTmplD, tmplName, errorMsg, fn) {
            if (saveTmplD.hasOwnProperty(tmplName)) {
                throw errorMsg;
                return;
            } else {
                fn();
            }
        }
		/*路由对象*/
		var routerObj = {}; 
		/*
		* 添加路由
		* 路由名
		*/
		this.addRoute = function(routeName,fnName){
			if(routerObj[routeName]){
				 alert("[错误]您新增的路由名已经存在！");
                return;
			}else{
				routerObj[routeName] = fnName;
			}
		};
		/*
		* 路由跳转
		*/
		this.RouteJump = function(routeName,bindData){
			if(!routerObj[routeName]){
				alert('[错误]您还没有添加此路由！');
				return;
			}
			window.location.hash = '/'+routeName;
			routerObj[routeName]((!bindData ? {}: bindData));
		};
		/*
		*  定义上一个跳转的hash
		*/
		var oldHash = '';
		/*
		* 判断hash是否改变（只针对于不兼容的浏览器）
		*/
		var isHashChanged = function(){
			var nowHash = window.location.hash;
			if(nowHash != oldHash){
				return true;
			}
			return false;
		};
		/*
		* 定义路由默认跳转
		*/
		this.routeDefault = function(routeN){
			var nowHash = window.location.hash;
			if(nowHash == ''){
				if(!routerObj[routeN]){
					alert('[错误]您还没有添加默认页面路由！');
					return;
				}else{
					routerObj[routeN]();
				}
			}else{
				var roten = nowHash.split('/')[1];
				MPT.RouteJump(roten);
				oldHash = nowHash;
			}
		};
		/*
		* 浏览器地址变化处理方法
		*/
		var hashChangeHandle = function(){
			var now = window.location.hash;
			var roten = now.split('/')[1];
			MPT.RouteJump(roten);
			oldHash = now;
		}
		/*
		* 监控路由变化
		*/
		if( ('onhashchange' in window) && ((typeof document.documentMode==='undefined') || document.documentMode==8)) {
		    // 浏览器支持onhashchange事件
		    window.onhashchange = hashChangeHandle;
		} else {
		    // 不支持则用定时器检测的办法
		    setInterval(function() {
		        var ischanged = isHashChanged();
		        if(ischanged) {
		            hashChangeHandle();
		        }
		    }, 150);
		}
    };
    /*默认执行页面绑定路由方法*/
    $$.MPT.bind($$, "load",function() {
        MPT.excAction(document);
    });
    /*
    * 方法工具类
    */
	$$.szyApi = {
		/*
		* 过滤文本格式 保留图片
		* str待过滤的文本
		* callback 过滤成功后的回调方法
		*/
		filterHtml:function(str,callback){
		    var s = '';
		    var imgWidth = 200;
		    var d = str.replace(/(&nbsp;)/ig,'');//先过滤空格
		    var sd = d.replace(/<br([^<>]+|\s?)>/ig,'||||');//替换br标签
		    var div = document.createElement('div');
		    div.id = 'cache_Id2016';
		    div.style.display = 'none';
		    div.innerHTML = sd;
		    document.body.appendChild(div);
		    var dssD = document.getElementById('cache_Id2016');
		    var text = dssD.innerText;//过滤html标签
		    text = text.replace(/\|\|\|\|/g,'<br>');//还原br
		    var imagesCount = 0;
		    try{
		        var temp = '';
		        var img = dssD.getElementsByTagName('img');
		        if(img.length > 0){
		            for(var i=0;i<img.length;i++){
		                var imgObj = new Image();
		                imgObj.onload = function(){
		                    imagesCount++;
		                    var w = this.width;
		                    var h = this.height;
		                    if(w > imgWidth){
		                        temp += '<img src="'+ this.src +'" width="'+ imgWidth +'" />';
		                    }else{
		                        temp += '<img src="'+ this.src +'" width="'+ w +'" />';
		                    }
		                    if(imagesCount == img.length){
		                        text+=temp;
		                        s = text;
		                        var n = document.getElementById('cache_Id');
		                        if(n && n.parentNode && n.tagName != 'BODY'){  
		                            n.parentNode.removeChild(n);  
		                        }
		                        if(callback){
		                            callback(s);
		                        }
		                    }
		                }
		                imgObj.onerror = onabort = function(){
		                    imagesCount++;
		                     if(imagesCount == img.length){
		                        s = text;
		                        var n = document.getElementById('cache_Id');
		                        if(n && n.parentNode && n.tagName != 'BODY'){  
		                            n.parentNode.removeChild(n);  
		                        }
		                        if(callback){
		                            callback(s);
		                        }
		                    }
		                }
		                imgObj.src = img[i].src;
		            }
		        }else{
		             s = text;
		            var n = document.getElementById('cache_Id');
		            if(n && n.parentNode && n.tagName != 'BODY'){  
		                n.parentNode.removeChild(n);  
		            }
		            if(callback){
		                callback(s);
		            }
		        }
		    }catch(e){
		       console.log(e);
		    }
		},
		/*
		* cookie相关的方法
		*/
		cookie:{
			/*
			* 设置cookie
			* 参数 name 名称
			* val 值
			* parm 对象{
				G：过期时间毫秒(以当前时间开始计算)
				domin：域名
				path :表示cookie所在的目录
			}
			*/
		    set:function(name, val, parm) {
	            var d;
	            parm.G && (d = new Date, d.setTime(d.getTime() + parm.G));
	            document.cookie = name + "=" + val +(d ? "; expires=" + d.toGMTString() : "") +'; domain='+ (parm.domin ? parm.domin : '') +'; path='+(parm.path ? parm.path : '')+';';
		    },
		    /*
		    *	获取cookie
		    * 	参数name cookie名
		    */
		    get:function(name) {
		        return (name = RegExp("(^| )" + name + "=([^;]*)(;|$)").exec(document.cookie)) ? name[2] : null;
		    },
		    /*
		    * 删除cookie
		    * 参数name cookie名
		    */
		    del:function(name){
		    	var cookieVal = szyApi.cookie.get(name);
		    	if(cookieVal){
		    		 szyApi.cookie.set(name,cookieVal,{'G':-1});
		    	}else{
		    		throw '您要删除的cookie'+name+'没有找到！';
		    	}
		    }
		},
		/*
		*  UUID 唯一ID生成
		*  返回值 ID
		*/
		uuidGrow:function(){
	        var s = [];
	        var hexDigits = "0123456789abcdef";
	        for (var i = 0; i < 36; i++) {
	            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	        }
	        s[14] = "4"; 
	        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	        s[8] = s[13] = s[18] = s[23] = "-";
	        var uuid = s.join("");
	        return uuid;
	    },
	    /*
	    *  获取浏览器?后参数名称
	    */
	    getSearName:function(name){
	        var b = [];
	        var temp = location.search.substring(1);
	        b = temp.split('&');
	        for(var i=0;i<b.length;i++){
	            if(name == b[i].split('=')[0]){
	                return b[i].split('=')[1];
	            }
	        }
	        return '';
	    },
	    /*
	    * placeHolder相关
	    * 兼容IE6-11 及其他浏览器
	    */
	    placeHolder:{
	    	/*
	    	* 获取满足条件的标签
	    	*/
		    box:function(){
		        var obj = [];
		        var text = document.getElementsByTagName('input');
		        var textarea = document.getElementsByTagName('textarea');
		        for(var i=0;i < text.length;i++){
		            if(!!text[i].getAttribute('placeholder')){
		                obj.push(text[i]);
		            }else{
		                continue;
		            }
		        }
		        for(var j=0;j < textarea.length;j++){
		            if(!!textarea[j].getAttribute('placeholder')!=''){
		                obj.push(textarea[j]);
		            }else{
		                continue;
		            }
		        }
		        return obj;
		    },
		    /*
		    * 判断浏览器是否支持placeholder
		    */
		    IsSpport:function(){
		        var input = document.createElement('input');
		        return "placeholder" in input;
		    },
		    /*
		    * 初始化placeholder插件
		    */
		    init:function(){
		    	var _this = szyApi.placeHolder;
		        if(!_this.IsSpport()){
		            var obj = _this.box();
		            for(var i = 0;i < obj.length;i++){
		                obj[i].value = obj[i].getAttribute('placeholder');
		                obj[i].onfocus = function(e){
		                    if(this.value == this.getAttribute('placeholder')){
		                        this.value = '';
		                    }
		                }
		                obj[i].onblur = function(){
		                    if(this.value == ''){
		                        this.value = this.getAttribute('placeholder');
		                    }
		                } 
		            }
		        }
		    }
		},
		/*
		* tooltip相关
		*/
		tooltip:{
			/*定义延时变量*/
		    timer:null,
		    /*
		    * 获取元素位置
		    * element 需要获取位置的元素
		    * dom 相对于那个父元素
		    */
		    getpos:function(element,dom){
		        if ( arguments.length == 0 || element == null ) { 
		            return null; 
		        } 
		        var offsetTop = element.offsetTop; 
		        var offsetLeft = element.offsetLeft; 
		        var offsetWidth = element.offsetWidth; 
		        var offsetHeight = element.offsetHeight; 
		        while( element = element.offsetParent ) { 
					if(element == dom){
						  return { absoluteTop: offsetTop, absoluteLeft: offsetLeft, 
						offsetWidth: offsetWidth, offsetHeight: offsetHeight }; 
					}
		            offsetTop += element.offsetTop; 
		            offsetLeft += element.offsetLeft; 
		        }
		        return { absoluteTop: offsetTop, absoluteLeft: offsetLeft, 
		            offsetWidth: offsetWidth, offsetHeight: offsetHeight }; 
		    },
		    /*
		    *  判断是否支持h5 选择器
		    */
		    isSelector:function(){
		        return !! document.querySelector ? true : false;
		    },
		    /*
		    *  判断元素是否含有tooltip
		    */
		    isHasClassName:function(dom,classname){
		        if(dom){
		            var classnameA = dom.className;
		            var pattern = /tooltip\s*/;
		            if(pattern.test(classnameA)){
		                return true;
		            }
		        }else{
		             throw 'error:没有传dom对象：isHasClassName';
		            return false;
		        }
		    },
		    /*
		    *  移除指定ID元素
		    */
		    removeElement:function(id){
		        var n = document.getElementById(id);
		        if(n && n.parentNode && n.tagName != 'BODY'){  
		            n.parentNode.removeChild(n);  
		        }
		    },
		    /*
		    * 初始化tooltip
		    */
		    init:function(dom){
		        var parentBox = null;
		        if(dom){
		            parentBox = dom;
		        }else{
		            parentBox = document.getElementsByTagName("body")[0];
		        }
		        parentBox.onmouseover = function(e){
		            var e = e || window.event;
		            var target = e.target || e.srcElement;
		            if(szyApi.tooltip.isHasClassName(target,'tooltip')){
		                szyApi.tooltip.removeElement('pos_h_cread');
		                var _this = target;
		                var pos = szyApi.tooltip.getpos(_this,dom);
		                var div = document.createElement('div');
		                var p = document.createElement('p');
		                var span = document.createElement('span');
		                var text = _this.getAttribute('rel');
		                p.innerHTML = text;
		                div.appendChild(p);
		                div.appendChild(span);
		                div.id = 'pos_h_cread';
		                div.style.left = pos.absoluteLeft + 'px';
		                div.style.top = (pos.absoluteTop + pos.offsetHeight)+ 'px';
		                parentBox.appendChild(div);
		                var toolbox = document.getElementById('pos_h_cread');
		                toolbox.onmouseleave = null;
		                toolbox.onmouseover = null;
		                toolbox.onmouseleave = function(){
		                    clearTimeout(szyApi.tooltip.timer);
		                    szyApi.tooltip.timer = setTimeout(function(){
		                        szyApi.tooltip.removeElement('pos_h_cread');
		                    },2000);
		                }
		                toolbox.onmouseover = function(){
		                    clearTimeout(szyApi.tooltip.timer);
		                }
		            }
		        }
		    }
		}
	};
})(window,false)