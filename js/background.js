"use strict";



var Chrome = {
    // 通知弹窗
    createNotification:function(title){
        var options = {
          type: "basic",
          title: '你订阅的房子有新消息啦！',
          message: title,
          iconUrl: "/icons/zufang.png"
        };
        chrome.notifications.create('null',options, function(){
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

function playMusic(){
    $("#player")[0].play();
}


var keywords = ['九龙山','七号线','14号线','7号线','独卫','四惠','九龙','整租','一室','一室一厅'];
var names     = ['beijingzufang','zhufang','279962','26926','sweethome'];
var crt_ids  = [];
var titles   = [];
var block_user = ['小房东','Chase丶Am']; //屏蔽用户
var timer    = 60*1000; // 一分钟一次

var autoNotice = function(keywords,names){

    crt_ids  = [];
    titles = [];

    names.map(function(id){
        let crt_url = `http://api.douban.com/v2/group/${id}/topics`;
        $.get(crt_url,function(data){
            $.each(data.topics,function(i,data){
                for(var j=0;j<keywords.length;j++){
                    var string = data.title + data.content;
                    // 包括关键字 并且发布时间不能大于两天
                    if(string.indexOf(keywords[j]) > -1 && (new Date(data.updated) - new Date(data.created) < 48*3600000)){
                        if(block_user.indexOf(data.author.name) == -1){
                            titles.push(data.title);
                            crt_ids.push(data.id);
                        };
                        break;
                    }
                }
            });
        },"json");
    });



    setTimeout(function(){

        var local_ids = localStorage.getItem('view_ids') || '';
        if(crt_ids.length){
            for(var k=0;k<crt_ids.length;k++){
                if(local_ids.indexOf(crt_ids[k]) == -1){
                    Chrome.createNotification(titles.join("\n"));
                    // playMusic();
                    break;
                }
            }
        }
        crt_ids.map(function(id){
            if(localStorage.getItem('view_ids').indexOf(id) == -1){
                chrome.tabs.create({ "url": "http://www.douban.com/group/topic/"+id,"selected":false });
            }
        });
        localStorage.setItem('view_ids',local_ids+crt_ids);
        autoNotice(keywords,names);
    },timer);

};
localStorage.setItem('view_ids','');

chrome.notifications.onClicked.addListener(function(id){
    var local_ids = localStorage.getItem('view_ids') || '';
    crt_ids.map(function(id){
        if(localStorage.getItem('view_ids').indexOf(id) == -1){
            chrome.tabs.create({ "url": "http://www.douban.com/group/topic/"+id,"selected":false });
        }
    });
    localStorage.setItem('view_ids',local_ids+crt_ids);
    chrome.notifications.clear(id);
});

autoNotice(keywords,names);












