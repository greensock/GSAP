/*!
 * VERSION: beta 1.7.1
 * DATE: 2013-10-23
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";var t=document.documentElement,e=window,i=function(i,s){var r="x"===s?"Width":"Height",n="scroll"+r,a="client"+r,o=document.body;return i===e||i===t||i===o?Math.max(t[n],o[n])-(e["inner"+r]||Math.max(t[a],o[a])):i[n]-i["offset"+r]},s=window._gsDefine.plugin({propName:"scrollTo",API:2,init:function(t,s,r){return this._wdw=t===e,this._target=t,this._tween=r,"object"!=typeof s&&(s={y:s}),this._autoKill=s.autoKill!==!1,this.x=this.xPrev=this.getX(),this.y=this.yPrev=this.getY(),null!=s.x?this._addTween(this,"x",this.x,"max"===s.x?i(t,"x"):s.x,"scrollTo_x",!0):this.skipX=!0,null!=s.y?this._addTween(this,"y",this.y,"max"===s.y?i(t,"y"):s.y,"scrollTo_y",!0):this.skipY=!0,!0},set:function(t){this._super.setRatio.call(this,t);var i=this._wdw||!this.skipX?this.getX():this.xPrev,s=this._wdw||!this.skipY?this.getY():this.yPrev,r=s-this.yPrev,n=i-this.xPrev;this._autoKill&&(!this.skipX&&(n>7||-7>n)&&(this.skipX=!0),!this.skipY&&(r>7||-7>r)&&(this.skipY=!0),this.skipX&&this.skipY&&this._tween.kill()),this._wdw?e.scrollTo(this.skipX?i:this.x,this.skipY?s:this.y):(this.skipY||(this._target.scrollTop=this.y),this.skipX||(this._target.scrollLeft=this.x)),this.xPrev=this.x,this.yPrev=this.y}}),r=s.prototype;s.max=i,r.getX=function(){return this._wdw?null!=e.pageXOffset?e.pageXOffset:null!=t.scrollLeft?t.scrollLeft:document.body.scrollLeft:this._target.scrollLeft},r.getY=function(){return this._wdw?null!=e.pageYOffset?e.pageYOffset:null!=t.scrollTop?t.scrollTop:document.body.scrollTop:this._target.scrollTop},r._kill=function(t){return t.scrollTo_x&&(this.skipX=!0),t.scrollTo_y&&(this.skipY=!0),this._super._kill.call(this,t)}}),window._gsDefine&&window._gsQueue.pop()();