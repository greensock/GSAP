/*!
 * VERSION: beta 0.1.0
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
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine.plugin({propName:"attr",API:2,init:function(a,b){var d;if("function"!=typeof a.setAttribute)return!1;this._target=a,this._proxy={};for(d in b)this._addTween(this._proxy,d,parseFloat(a.getAttribute(d)),b[d],d),this._overwriteProps.push(d);return!0},set:function(a){this._super.setRatio.call(this,a);for(var d,b=this._overwriteProps,c=b.length;--c>-1;)d=b[c],this._target.setAttribute(d,this._proxy[d]+"")}})}),window._gsDefine&&window._gsQueue.pop()();