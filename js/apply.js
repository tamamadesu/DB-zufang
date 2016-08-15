"use strict";

window.console = {
        log:function(txt){
            document.getElementsByTagName('body')[0].innerHTML = txt;
        }
};
