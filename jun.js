function myAddEvent(obj,sEv,fn){
  if(obj.attachEvent){
    obj.attachEvent('on'+sEv,function(){
      if(false==fn.call(obj)){//阻止冒泡 默认事件
        event.cancelBubble=true;
        return false;
      }
      //fn.call(obj);//修复this指向问题
    });
  }else{
    obj.addEventListener(sEv,function(e){
      if(false==fn.call(obj)){//阻止冒泡 默认事件
        e.cancelBubble=true;
        e.preventDefault();
      }
    },false);
  }
}
function getByClass(oParent,sClass){
  var aEle=oParent.getElementsByTagName('*');
  var aResult=[];
  var i=0;
  for(i=0;i<aEle.length;i++){
    if(aEle[i].className==sClass){
      aResult.push(aEle[i]);
    }
  }
  return aResult;
}

function getStyle(obj,attr){
  return obj.currentStyle? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

function Jun(vArg){
  this.elements = [];
  switch(typeof vArg){
      case 'function':
       myAddEvent(window,'load',vArg);
       break;
      case 'string':
        switch(vArg.charAt(0)){
          case '#'://id
          this.elements.push(document.getElementById(vArg.substring(1)));
          break;
          case '.'://class
          this.elements=(getByClass(document,vArg.substring(1)));
          break;
          default://tagename
          this.elements=document.getElementsByTagName(vArg);
          break;
        }
       break;
      case 'object':
         this.elements.push(vArg);
       break;
  }
}
Jun.prototype.click=function(fn){
  var i=0;
  for(i=0;i<this.elements.length;i++){
    myAddEvent(this.elements[i],'click',fn);
  }
  return this; //实现链式操作
  
}
Jun.prototype.show=function(){
  var i=0;
  for(i=0;i<this.elements.length;i++){
    this.elements[i].style.display='block';
  }
  return this; //实现链式操作
  
}
Jun.prototype.hide=function(){
  var i=0;
  for(i=0;i<this.elements.length;i++){
    this.elements[i].style.display='none';
  }
  return this; //实现链式操作
  
}
Jun.prototype.hover=function(fn1,fn2){
  var i=0;
  for(i=0;i<this.elements.length;i++){
    myAddEvent(this.elements[i],'mouseover',fn1);
    myAddEvent(this.elements[i],'mouseout',fn2);
  }
  return this; //实现链式操作  
}
Jun.prototype.css=function(attr,value){
  if(arguments.length==2){
    var i =0;
    for(i=0;i<this.elements.length;i++){
      this.elements[i].style[attr]=value;
    }
  }else{
    if(typeof attr == 'string'){
     return getStyle(this.elements[0],attr);
    }else{
      for(var i=0;i<this.elements.length;i++){
        var k='';
        for(k in attr){
          this.elements[i].style[k]=attr[k];
        }
      }
    }
  }
  return this; //实现链式操作
}

Jun.prototype.toggle=function(){
  var count=0;
  var _arguments=arguments;
  var i=0;
  for(i=0;i<this.elements.length;i++){
    addToggle(this.elements[i]);
  }
  function addToggle(obj){
    myAddEvent(obj,'click',function(){
      _arguments[count++%_arguments.length].call(obj);
    })
  }
  return this; //实现链式操作
  
}

Jun.prototype.attr=function(attr,value){
  if(arguments==2){
    var i=0;
    for(i=0;i<this.elements.length;i++){
      this.elements[i][attr]=value;
    }
  }else{
    return this.elements[0][attr];
  }
  return this; //实现链式操作
  
}

Jun.prototype.eq=function(n){
  return $(this.elements[n]);
}
function appendArr(arr1,arr2){
  var i=0;
  for(i=0;i<arr2.length;i++){
    arr1.push(arr2[i]);
  }
}
Jun.prototype.find=function(str){
  var i=0;
  var aResult=[];
  for(i=0;i<this.elements.length;i++){
    switch(str.charAt(0)){
      case '.':
       var aEle = getByClass(this.elements[i],str.substring(1));
        aResult=aResult.concat(aEle);
        break;
      default:
       var aEle = this.elements[i].getElementsByTagName(str);
       appendArr(aResult,aEle);
       break;
    }
  }
  var newJun=$();
  newJun.elements=aResult;
  return newJun; 
};

function getIndex(obj){
  var aBorother = obj.parentNode.children;
  var i = 0;
  for(i=0;i<aBorother.length;i++){
    if(aBorother[i]==obj){
      return i;
    }
  }
};
Jun.prototype.index=function(){
  return getIndex(this.elements[0]);
};

Jun.prototype.on=function(sEv,fn){
  var i=0;
  for(i=0;i<this.elements.length;i++){
    myAddEvent(this.elements[i],sEv,fn);
  }
}


// 继承
Jun.prototype.extend=function(name,fn){
  Jun.prototype[name]=fn;
}

function $(vArg){
  return new Jun(vArg);
}