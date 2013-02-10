/*!
 * VERSION: beta 0.5
 * DATE: 2012-12-20
 * JavaScript 
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("plugins.CSSRulePlugin",["plugins.TweenPlugin","TweenLite","plugins.CSSPlugin"],function(a,b,c){var d=function(){a.call(this,"cssRule"),this._overwriteProps.length=0},e=window.document,f=c.prototype.setRatio,g=d.prototype=new c;return g._propName="cssRule",g.constructor=d,d.API=2,d.getRule=function(a){var g,h,i,j,b=e.all?"rules":"cssRules",c=e.styleSheets,d=c.length,f=":"===a.charAt(0);for(a=(f?"":",")+a.toLowerCase()+",",f&&(j=[]);--d>-1;)for(h=c[d][b],g=h.length;--g>-1;)if(i=h[g],i.selectorText&&-1!==(","+i.selectorText.split("::").join(":").toLowerCase()+",").indexOf(a)){if(!f)return i.style;j.push(i.style)}return j},g._onInitTween=function(a,b,d){if(void 0===a.cssText)return!1;var f=e.createElement("div");return this._ss=a,this._proxy=f.style,f.style.cssText=a.cssText,c.prototype._onInitTween.call(this,f,b,d),!0},g.setRatio=function(a){f.call(this,a),this._ss.cssText=this._proxy.cssText},a.activate([d]),d},!0)}),window._gsDefine&&window._gsQueue.pop()();