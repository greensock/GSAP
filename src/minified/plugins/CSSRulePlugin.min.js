/*!
 * VERSION: beta 0.6.0
 * DATE: 2013-07-03
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("plugins.CSSRulePlugin",["plugins.TweenPlugin","TweenLite","plugins.CSSPlugin"],function(t,e,i){var s=function(){t.call(this,"cssRule"),this._overwriteProps.length=0},r=window.document,n=i.prototype.setRatio,a=s.prototype=new i;return a._propName="cssRule",a.constructor=s,s.API=2,s.getRule=function(t){var e,i,s,n,a=r.all?"rules":"cssRules",o=r.styleSheets,l=o.length,h=":"===t.charAt(0);for(t=(h?"":",")+t.toLowerCase()+",",h&&(n=[]);--l>-1;){try{i=o[l][a]}catch(u){console.log(u);continue}for(e=i.length;--e>-1;)if(s=i[e],s.selectorText&&-1!==(","+s.selectorText.split("::").join(":").toLowerCase()+",").indexOf(t)){if(!h)return s.style;n.push(s.style)}}return n},a._onInitTween=function(t,e,s){if(void 0===t.cssText)return!1;var n=r.createElement("div");return this._ss=t,this._proxy=n.style,n.style.cssText=t.cssText,i.prototype._onInitTween.call(this,n,e,s),!0},a.setRatio=function(t){n.call(this,t),this._ss.cssText=this._proxy.cssText},t.activate([s]),s},!0)}),window._gsDefine&&window._gsQueue.pop()();