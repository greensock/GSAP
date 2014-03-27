/*!
 * VERSION: beta 0.6.1
 * DATE: 2014-01-20
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("plugins.CSSRulePlugin",["plugins.TweenPlugin","TweenLite","plugins.CSSPlugin"],function(t,e,i){var r=function(){t.call(this,"cssRule"),this._overwriteProps.length=0},s=window.document,n=i.prototype.setRatio,a=r.prototype=new i;return a._propName="cssRule",a.constructor=r,r.version="0.6.1",r.API=2,r.getRule=function(t){var e,i,r,n,a=s.all?"rules":"cssRules",o=s.styleSheets,l=o.length,h=":"===t.charAt(0);for(t=(h?"":",")+t.toLowerCase()+",",h&&(n=[]);--l>-1;){try{i=o[l][a]}catch(u){console.log(u);continue}for(e=i.length;--e>-1;)if(r=i[e],r.selectorText&&-1!==(","+r.selectorText.split("::").join(":").toLowerCase()+",").indexOf(t)){if(!h)return r.style;n.push(r.style)}}return n},a._onInitTween=function(t,e,r){if(void 0===t.cssText)return!1;var n=t._gsProxy=t._gsProxy||s.createElement("div");return this._ss=t,this._proxy=n.style,n.style.cssText=t.cssText,i.prototype._onInitTween.call(this,n,e,r),!0},a.setRatio=function(t){n.call(this,t),this._ss.cssText=this._proxy.cssText},t.activate([r]),r},!0)}),window._gsDefine&&window._gsQueue.pop()();