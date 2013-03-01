/*!
 * VERSION: beta 1.7.0
 * DATE: 2013-02-27
 * JavaScript 
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";var a=document.documentElement,b=window,c=function(c,d){var e="x"===d?"Width":"Height",f="scroll"+e,g="client"+e,h=document.body;return c===b||c===a||c===h?Math.max(a[f],h[f])-Math.max(a[g],h[g]):c[f]-c["offset"+e]},d=window._gsDefine.plugin({propName:"scrollTo",API:2,init:function(a,d,e){return this._wdw=a===b,this._target=a,this._tween=e,"object"!=typeof d&&(d={y:d}),this._autoKill=d.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=d.x?this._addTween(this,"x",this.x,"max"===d.x?c(a,"x"):d.x,"scrollTo_x",!0):this.skipX=!0,null!=d.y?this._addTween(this,"y",this.y,"max"===d.y?c(a,"y"):d.y,"scrollTo_y",!0):this.skipY=!0,!0},set:function(a){this._super.setRatio.call(this,a);var c=this._wdw||!this.skipX?this.getX():this.xPrev,d=this._wdw||!this.skipY?this.getY():this.yPrev,e=d-this.yPrev,f=c-this.xPrev;this._autoKill&&(!this.skipX&&(f>7||-7>f)&&(this.skipX=!0),!this.skipY&&(e>7||-7>e)&&(this.skipY=!0),this.skipX&&this.skipY&&this._tween.kill()),this._wdw?b.scrollTo(this.skipX?c:this.x,this.skipY?d:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),e=d.prototype;d.max=c,e.getX=function(){return this._wdw?null!=b.pageXOffset?b.pageXOffset:null!=a.scrollLeft?a.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},e.getY=function(){return this._wdw?null!=b.pageYOffset?b.pageYOffset:null!=a.scrollTop?a.scrollTop:document.body.scrollTop:this._target.scrollTop},e._kill=function(a){return a.scrollTo_x&&(this.skipX=!0),a.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,a)}}),window._gsDefine&&window._gsQueue.pop()();