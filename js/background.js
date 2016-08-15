"use strict";

var Chrome = {
    // 通知弹窗
    createNotification:function(title,Obj){
        var options = {
          type: "basic",
          title: '你订阅的房子有新消息啦！',
          message: title,
          iconUrl: "/icons/zufang.png"
        };
        chrome.notifications.create('null',options, function(){
        });
        chrome.notifications.onClicked.addListener(function(id){
            Obj.map(function(item){
                chrome.tabs.create({ "url": item,"selected":false });
            });
            chrome.notifications.clear(id);
        });
    },
    // 获取background页面
    getBackgroundPage:function(){
        return chrome.extension.getBackgroundPage();
    },
    // 设置图标文字提示
    setTip:function(string_num){
        var title = "",
            num   = string_num || "";
        if(num){
            title = "您有"+num+"条未读信息";
        }else{
            title = "";
        }
        //设置鼠标经过title
        chrome.browserAction.setTitle({"title":title});
        //背景颜色
        chrome.browserAction.setBadgeBackgroundColor({color:'#ff0000'});
        //将实时气温显示在icon上面
        chrome.browserAction.setBadgeText({text:num});
        return this;
    }
};

var keywords = ['九龙山','七号线','14号线'];
var urls     = ['http://api.douban.com/v2/group/beijingzufang/topics'];
var crt_url  = [];
var titles = [];

var autoNotice = function(keywords,urls){

    
    urls.map(function(url){
        $.get(url,function(data){
            $.each(data.topics,function(i,data){
                for(var j=0;j<keywords.length;i++){
                    var string = data.title+data.content;
                    if(string.indexOf(keywords[j]) > -1){
                        titles.push(data.title);
                        crt_url.push(`http://www.douban.com/group/topic/${data.id}`);
                        break;
                    }
                }
            });
        },"json");
    });


    // setTimeout(function(){
        if(crt_url.length){
            Chrome.createNotification(titles.join('\n'),crt_url);
        }
        crt_url = [];
        titles = [];
        // autoNotice(keywords,urls);
    // },60000);

};

// autoNotice(keywords,urls);














