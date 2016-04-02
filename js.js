
//封装ajax请求
function get(url,options,callback){
	var pairs=[];
	for(var name in options){
		var value=options[name].toString();
		name=encodeURIComponent(name);
		value=encodeURIComponent(value);
		pairs.push(name+'='+value);
	}
    var myoptions=pairs.join('&');
    var xhr;
    if(window.XMLHttpRequest)
    	xhr=new XMLHttpRequest();
    else{
    	xhr=new ActiveXObjext("Microsoft.XMLHTTP");
    }
    xhr.onreadystatechange=function(){
    	if(xhr.readyState==4){
    		if((xhr.status>=200&xhr.status<300)||xhr.status==304){
               console.log('OK!');
               var data=JSON.parse(xhr.responseText);
               console.log(data);
               if(typeof callback=='function'){
               	      callback(data,options);
               }
               return data;
    		}
    		else{
    		 	console.log('not ok!');
    		 	return '';
    		}
    	}
    }
    xhr.open('get',url+'?'+myoptions,true);
    xhr.send(null);
}

//轮播淡入
function initImg(){
	var slide=document.getElementById("my-banner"),
	    startIndex=0,
	    ntags=document.getElementsByClassName("my-tag"),
	    value,
	    t,
	    autoChange=function(){
	    var toId=(startIndex==2)?0:startIndex+1;
	    fadeImg(startIndex,toId,ntags);
        startIndex=toId;
        };
    var id=setInterval(autoChange,5000);
    slide.onmouseover=function(){
    	clearInterval(id);
    }
    slide.onmouseout=function(){
    	id=setInterval(autoChange,5000);
    }
    for(i=0;i<ntags.length;i++){
    	(function(i){
    		ntags[i].onclick=function(){
    		fadeImg(startIndex,i,ntags);
    		startIndex=i;
    	}
        })(i);
    }
}

//淡入效果
function fadeImg(fromId,toId,ntags){
	var lists=document.getElementsByClassName("turn");
	var fromImg=lists[fromId],
	    toImg=lists[toId],
	    deg=0;
	    toImg.style.zIndex='3';
	    toImg.style.display='block';

	    ntags[toId].className='act-tag my-tag';
	    ntags[fromId].className='my-tag';
	    fromImg.style.opacity=1;//初始图显示
	    fromImg.style.filter='alpha(opacity:100)'//兼容老版本IE
	    var t=setInterval(change, 100);
	    function change(){
	    	if(deg<10){
	    		deg+=2;
	    		toImg.style.opacity=deg/10;
	    		toImg.style.filter='alpha(opacity:'+deg*10+')';
	    	}
	    	else{
	    		clearInterval(t);
	    		toImg.style.zIndex='2';
	    		fromImg.style.zIndex='1';
	    		fromImg.style.display='none';
	    		fromImg.style.opacity=0;
	    		fromImg.style.filter='alpha(opacity:0)';
	    	}
	    }
	    return t;
}

//获取cookie
function getCookies(){
	var cookie={};
	var coo=document.cookie;
	if(coo=='')
		return cookie;
	var list=coo.split(';');
	for (var i=0;i<list.length;i++){
		var item=list[i];
		var p=item.indexOf('=');
		var name=item.subString(0,p);
		name=decodeURIComponent(name);
		var value=item.subString(p+1);
		value=decodeURIComponent(value);
		cookie[name]=value;
	}
	return cookie;
}


//setcookie的格式
function setCookie(name,value,path,domain,secure,expires){
	var cookie=encodeURIComponent(name)+'='+encodeURIComponent(value);
	if(expires){
		cookies+=';expires='+expires.toGMTString();
	}
	if(path){
		cookie+=';path='+path;
	}
	if(domain){
		cookie+=';domain='+domain;
	}
	if(secure){
		cookie+=';secure='+secure;
	}
	document.cookie=cookie;
}

//时间转换
function getTime(time){
	time=Math.ceil(time);
	var min=parseInt(time/60);
	min=min<10?'0'+min:min;
	var snd =time%60;
	snd=snd<10?'0'+snd:snd;
	return min+':'+snd;
}

//关闭通知条
function ifshow(){
	var cookie=getCookies();
	var notice=document.querySelector('.my-notice');
	var xbtn=document.querySelector('.my-notice .close');
	if(cookie.noticeNoMore){
		console.log('exist!');
		notice.style.display='none';
	}
	else{
		xbtn.onclick=function(){
			setCookie('noticeNoMore',true,'/','');
			notice.style.display='none';
		}
	}
}

//登录
function initLogin(){
	var loginDiv=document.querySelector('.my-login');
	var closeBtn=loginDiv.querySelector('.close');
	var form=document.getElementById('myForm');
	var loginUrl="http://study.163.com/webDev/login.htm";
	loginDiv.style.display='block';
	closeBtn.onclick=function(){
		loginDiv.style.display='none';
	}
	//为submit绑定事件,加密用户名和密码，登录成功设置登录cookie,否则显示错误
    EventUtil.addHandler(form,"submit",function(event){
    	event=EventUtil.getEvent(event);
    	EventUtil.preventDefault(event);
    	var name=form.elements['urname'];
    	var password=form.elements['psw'];
    	options={userName:md5(name.value),password:md5(password.value)};
    	get(loginUrl,options,function(data,options){
             if(data&&data==1){
             	loginDiv.style.display='none';
             	setCookie('loginSuc',true,'/','');
             	follow();
             }else{
             	var tips=document.querySelector('#tips');
             	tips.style.display='block';
             }
    	});
    });
}

//初始化关注,点击关注时如未登录则先登录,如已登录则关注
function initfollow(){
	var follow=document.querySelector('.u-follow');
	
	follow.onclick=function(){
		var myCookie=getCookies();
		if(!myCookie.loginSuc){
			initLogin();
		}else{
              	follow();	
		}
	}; 	
}

//关注
function follow(){
	var followed=document.querySelector('.u-followed');
	var follow=document.querySelector('.u-follow');
	followUrl="http://study.163.com/webDev/attention.htm";
    get(followUrl,'',function(data,options){
         if(data==1){
	     follow.style.display='none';
	     followed.style.display='';
	     setCookie('followSuc',true,'/','');
	     }
    });
}

//获取当前左边位置，用于视频快进
/*function getElementLeft(elem){
    var actualLeft=elem.offsetLeft;
    var current=elem.offsetParent;
    while(current!==null){
    	actualLeft+=current.offsetLeft;
    	current=current.offsetParent;
    }
    return
      actualLeft;
}*/
//初始化视频

function setVideo(srcUrl){
    var doc=document;
    var videoDiv=doc.querySelector('.my-video');
    var closeBtn=videoDiv.querySelector('.my-video .close');
    var video=doc.getElementById("myVideo");
    var openNode=doc.querySelector('.infor-s2 i');
    openNode.onclick=function(){
    	videoDiv.style.display='block';
    	video.setAttribute('src',srcUrl);
    }
    closeBtn.onclick=function(){
    	videoDiv.style.display='none';
    	video.pause();
    };
    var crtTime=document.getElementsByClassName("crtTime")[0];
    var duration=document.getElementsByClassName("duration")[0];
    var buffer=document.getElementsByClassName("bar-buffered")[0];
    var switchBtn=document.getElementsByClassName("switchBtn")[0];
    var barfill=document.getElementsByClassName("bar-fill")[0];
    var bar=document.getElementsByClassName("bar")[0];
    var pause=document.getElementsByClassName("pause")[0];
    var g_video=document.getElementsByClassName("g-video")[0];
    function videoOnOff(){
    	if(video.paused){
    		video.play();
    		pause.style.display='none';
    	}else{
    		video.pause();
            pause.style.display='';
    	}
    }
    video.onclick=videoOnOff;
    switchBtn.onclick=videoOnOff;
    pause.onclick=videoOnOff;
    video.oncanplay=function(){
    	duration.innerHTML=getTime(video.duration);
    	setInterval(function(){
    		crtTime.innerHTML=getTime(video.currentTime);
    		buffer.style.width=video.buffered.end(0)/video.duration*890+'px';
    		barfill.style.width=video.currentTime/video.duration*890+'px';
    	},100);
    }
}

//获取热门课程
function getHotCourses(data){
	var hot=document.querySelectorAll('.hot');
	var img=document.querySelectorAll('.hot img');
	var p=document.querySelectorAll('.hot p');
	var urcount=document.querySelectorAll('.urcount');
	for(var i=0;i<10;i++){
	    img[i].src=data[i].smallPhotoUrl;
	    img[i].alt=data[i].name;
	    p[i].innerHTML=data[i].name;
	    urcount[i].innerHTML=data[i].learnerCount;	
	}
        var count=0;
	setInterval((function(){
		autochangeCourses(hot,count=(count+1)%20,data);
	}),5000);
    
}

//热门自动变化
function autochangeCourses(ele,num,data){
    var img=document.querySelectorAll('.hot img');
	var p=document.querySelectorAll('.hot p');
	var urcount=document.querySelectorAll('.urcount');
	for(var j=0;j<10;j++){
		var pre=j<data.length-1?j+num:0;
                if(pre>19){
                      pre=(pre-1)%19;}
        img[j].src=data[pre].smallPhotoUrl;
        img[j].alt=data[pre].name;
        p[j].innerHTML=data[pre].name;
	    urcount[j].innerHTML=data[pre].learnerCount;	
    }
}

//获取课程卡片
function getCourses(mydata,options){
    var courseCard=document.querySelector('.my-course');
    for(var i=0;i<mydata.list.length;i++){
    	courseCard.insertBefore(getCourse(mydata.list[i]),courseCard.fistChild);
    }
    var pageList=document.querySelector('.page-list');
    var pager=document.querySelector('.pages');
    if(pager===null){
    	createPager(mydata,pageList,options);
    }
}

//解析课程数据
function getCourse(data){
	var card=document.createElement('div');
	card.setAttribute('class','course-card');	
	var price;
	if(data.price==0){
		price="免费";
	}else if(data.price%1==0){
		price='&yen'+data.price+'.00';
	}else{
		price='&yen'+data.price;
	}
	var html='<div class="card-img"><img src=';
	    html+=data.middlePhotoUrl;
	    html+='></div>'
	    html+='<div><p class="card-title">';
        html+=data.name;
	    html+='</p><p class="provider">'+data.provider+'</p>';
	    html+='<div class="learnerCount"><i class="s-picon"></i>';
	    html+=data.learnerCount;
	    html+='</div><div class="price">'+price+'</div></div>';
	    html+='<div class="detail"><div class="uppart"><img class="detail-img" src=';
	    html+=data.middlePhotoUrl;
	    html+='><div class="courseInfo"><p class="card-title">';
        html+=data.name;
	    html+='</p><div class="people s-cd"><i class="s-picon"></i>';
	    html+=data.learnerCount+"人在学";
	    html+= '</div><p class="s-cd">' + '发布者：' + data.provider;
	    html+= '</p><p class="s-cd">' + '分类：' + data.categoryName;
	    html+= '</p></div></div><div class="description clearfix"><p>';
	    html+= data.description;
	    html+= '</p></div></div>';
	    card.innerHTML=html;
	    return card;
}
/*//点击课程卡片链接跳转
function cardClick(){
	var card=document.querySelectorAll(".course-card");
	var url;
	card.onclick=function(){
	  url=card.getAttribute("data.url");
	  window.open("url");
	}	
}*/
//判断是否有此类名
function hasClass(ele,className){
   if(ele.classList)
   	 return ele.classList.contains(className);
   else
   	 return new RegExp('(^|)'+className+'(|$)','gi').test(ele.className);
}
//遍历方法
function forEach(list,fn){
	for(var i=0;i<list.length;i++){
		fn(list[i],i);
	}
}

//除本身之外的兄弟节点
function eleSibing(x){
    var parent=x.parentNode;
    var elementSibling=[];
    forEach(parent.childNodes,function(e){
    	if(e.nodeType===1&&x!==e){
    		elementSibling.push(e);
    	}
    });
    return elementSibling;
}

//tab切换课程
function changeCourses(options,url2){
	var tabs=document.querySelectorAll('.my-tab li');
	var courses=document.querySelector('.my-course')
	forEach(tabs,function(tab){
	    tab.onclick=function(){
        if(!hasClass(tab,'s-zact')){
       	courses.innerHTML='';
       	options.type=tab.getAttribute('data-type');
       	get(url2,options,getCourses);
       	tab.setAttribute('class','s-zact');
       	eleSibing(tab)[0].setAttribute('class','');
        }
        }; 
	});
}

//创建翻页器
function createPager(data,pNode,options){
	var pager=document.createElement('div');
	var totalPage=data.totalPage;
	var html='<i class="last"></i><span class="s-pact">1</span>';
	var spanNum=(totalPage>5)?5:totalPage-1;
	pager.setAttribute('class','pages clearfix');
	if(totalPage>=2){
		for(var i=0;i<spanNum-1;i++){
			html+='<span>'+(i+2)+'</span>';
		}
	    html+='<span>'+totalPage+'</span>';
	}
	html+='<i class="next"></i>';
	pNode.appendChild(pager);
	pager.innerHTML=html;
	pager.onclick=function(){
		changePager(totalPage,pager,options)
	}
}
//获取翻页后显示的页数
function getSpanList(i,last){
	i=Number(i);
	last=Number(last);
	var list1=[1,2,3,4,5];
	if(last<=5){
		return list1.splice(0,last);
	}
	if(i<=3){
		list1.push(last);
		return list1;
	}else{
		var list=[i-2,i-1,i,i+1,i+2];
		var list2=[];
		forEach(list,function(n){
			if(n<=last)
				list2.push(n);
		});
		if(last-i>=3){
			list.push(last);
			return list;
		}else{
			list1=list1.splice(0,6-list2.length);
			return list1.concat(list2);
		}
	}
}
//翻页函数
function changePager(totalPage,pager,options){
    var url2='http://study.163.com/webDev/couresByCategory.htm';
    var event=event||window.event;
    var target=event.target||event.srcElement;
    var crtSpan=document.querySelector('.s-pact');
    var toPage;
    if(target===crtSpan||target===this) return;
    switch(target.getAttribute('class')) {
    	case 'last':
    		toPage=crtSpan.innerHTML-1;
    		break;
    	case 'next':
    		toPage=Number(crtSpan.innerHTML+1);
    		break;
    	default:
    	    toPage=target.innerHTML;
    }
    if(toPage>=1&&toPage<=Number(totalPage)){
    	crtSpan.setAttribute('class','');
    	var courseCards=document.querySelectorAll('.course-card');
    	var spans=pager.getElementsByTagName('span');
    	var myCourse=document.querySelector('.my-course')
    	forEach(courseCards,function(card){
    		card.parentNode.removeChild(card);
    	});
    	options.pageNo=toPage;
    	get(url2,options,getCourses);
    	var spanValueList=getSpanList(toPage,totalPage);
    	forEach(spans,function(span,index){
    		span.innerHTML=spanValueList[index];
    		if(toPage==spanValueList[index]){
    			span.setAttribute('class','s-pact');
    	    }
    	})

    }

}
//需要网页载入时调用的函数
ifshow();
initfollow();
initImg();
setVideo('http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4');
var url1='http://study.163.com/webDev/hotcouresByCategory.htm'
get(url1,'',getHotCourses);
var url2='http://study.163.com/webDev/couresByCategory.htm';
myOption = {
		pageNo:1,
		psize:20,
		type:10
	}
get(url2, myOption, getCourses);
changeCourses(myOption,url2);

