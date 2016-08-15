"use strict";



var start = 0;
var datas = [];
var url   = 'http://api.douban.com/v2/group/beijingzufang/topics'; // 北京租房
var $load = $('.load-spinner');
var html  = function(data){
        var imgs = '';

        if(data.photos.length){
            imgs = '&emsp;<span class="show-imgs">显示图片</span> <div class="imgs"><div class="inner">';
            $.each(data.photos,function(i,item){
                imgs += '<img src="'+item.alt+'" /><br/>';
            });
            imgs += '<span class="show-imgs">收起图片</span></div></div>';
        }

        return '<tr><td>'+data.author.name+'</td><td><a href="http://www.douban.com/group/topic/'+data.id+'">'+data.title+"</a>"+imgs+'</td><td>'+data.updated+'</td></tr>';
};


function fillItem(topics,type) {
    var str  = '';
    type = type || 'append';
    $.each(topics,function(i,item){
        datas.push(item);
        str += html(item);
    });
    $("#list tbody")[type](str);
}

function loadItem(start,isFirst){
    var isFirst = isFirst || false;
    var type = '';
    if(isFirst){
        type = 'html';
    }
    $load.show();
    $.get(url+"?start="+start,function(data){
        $load.hide();
        fillItem(data.topics,type);
    },"json");
}

loadItem(0);

$(document).on('scroll',function(){
    if($(window).scrollTop() + $(window).height() >= $(document).height()){
        start += 20;
        loadItem(start);
    }
});

$(".search-query").on("submit",function(e){

    var val = $("input[name='filter']").val();
    var filter = datas.filter(function(item){
        var index = item.title.indexOf(val);
        var t     = item.title;
        if(index > 0){
            item.title = t.replace(val,"<span style='color:red'> "+val+" </span>");
        }

        return item.title.indexOf(val) !== -1;
    });
    fillItem(filter,'prepend');
    return false;
});

$("#list").on("click",".show-imgs",function(){
    var $imgs = $(this).parents('tr').find('.imgs');
    $imgs.fadeToggle();
});

$(".btn-group button").on("click",function(){
    var name = $(this).data("name");
    let current_url = 'http://api.douban.com/v2/group/'; // 北京租房
    $(".btn-group button").removeClass("active");
    $(this).addClass("active");
    url = current_url + name+"/topics";
    loadItem(0,true);
})

$("#list").on("click",'a',function(){
    var url = $(this).attr("href");
    chrome.tabs.create({ "url": url,"selected":false });
    return false;
})
