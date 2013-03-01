/*!
 * VERSION: beta 0.3.0
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
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";var a=function(b){var c=b.nodeType,d="";if(1===c||9===c||11===c){if("string"==typeof b.textContent)return b.textContent;for(b=b.firstChild;b;b=b.nextSibling)d+=a(b)}else if(3===c||4===c)return b.nodeValue;return d},b=window._gsDefine.plugin({propName:"text",API:2,init:function(b,c){if(!("innerHTML"in b))return!1;this._target=b,"object"!=typeof c&&(c={value:c}),this._delimiter=c.delimiter||"",this._original=a(b).replace(/\s+/g," ").split(this._delimiter),this._text=c.value.replace(/\s+/g," ").split(this._delimiter),"string"==typeof c.newClass&&(this._newClass=c.newClass,this._hasClass=!0),"string"==typeof c.oldClass&&(this._oldClass=c.oldClass,this._hasClass=!0);var e=this._original.length-this._text.length,f=0>e?this._original:this._text;for(this._fillChar=c.fillChar||e>0&&""===this._delimiter?"&nbsp;":"",0>e&&(e=-e);--e>-1;)f.push(this._fillChar);return!0},set:function(a){a>1?a=1:0>a&&(a=0);var d,e,f,b=this._text.length,c=a*b+.5>>0;this._hasClass?(d=this._newClass&&0!==c,e=this._oldClass&&c!==b,f=(d?"<span class='"+this._newClass+"'>":"")+this._text.slice(0,c).join(this._delimiter)+(d?"</span>":"")+(e?"<span class='"+this._oldClass+"'>":"")+this._delimiter+this._original.slice(c).join(this._delimiter)+(e?"</span>":"")):f=this._text.slice(0,c).join(this._delimiter)+this._delimiter+this._original.slice(c).join(this._delimiter),this._target.innerHTML="&nbsp;"===this._fillChar&&-1!==f.indexOf("  ")?f.split("  ").join("&nbsp;&nbsp;"):f}}),c=b.prototype;c._newClass=c._oldClass=""}),window._gsDefine&&window._gsQueue.pop()();