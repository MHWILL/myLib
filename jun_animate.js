$().extend('animate',function(json,fn){
    var i=0;
    for(i=0;i<this.elements.length;i++){
        move(this.elements[i], json, fn);
    }
    function getStyle(obj,attr){
	    return obj.currentStyle? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
    }
    function move(obj,json,fn) {
        clearInterval(obj.timer);
        obj.timer=setInterval(function(){
            var bStop = true;
            for (var attr in json) {
                var iCur = 0;
                if(attr == 'opacity'){
                    iCur = parseInt(parseFloat(getStyle(obj,attr))*100);
                }else{
                    iCur = parseInt(getStyle(obj,attr));
                }
                var iSpeed = (json[attr]-iCur)/8;
                iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
                if(iCur!=json[attr]){
                    bStop = false;
                }
                if(attr == 'opacity'){
                    obj.style.filter = 'alpha(opacity:'+ (iCur+iSpeed) +')';
                    obj.style[attr] = (iCur+iSpeed)/100;
                }else{
                    obj.style[attr] = iCur+iSpeed +'px';
                }
            }
            if(bStop){
                clearInterval(obj.timer);
                fn&&fn();
            }
        },30)
    }
})