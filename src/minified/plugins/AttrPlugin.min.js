/*!
 * VERSION: 0.4.0
 * DATE: 2015-05-06
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";var t=/(?:\d|\-|\+|=|#|\.)*/g,e=/[A-Za-z%]/g;_gsScope._gsDefine.plugin({propName:"attr",API:2,version:"0.4.0",init:function(i,r){var s,n,a,o,l;if("function"!=typeof i.setAttribute)return!1;this._target=i,this._proxy={},this._start={},this._end={},this._suffix={};for(s in r)this._start[s]=this._proxy[s]=n=i.getAttribute(s)+"",this._end[s]=a=r[s]+"",this._suffix[s]=o=e.test(a)?a.replace(t,""):e.test(n)?n.replace(t,""):"",o&&(l=a.indexOf(o),-1!==l&&(a=a.substr(0,l))),this._addTween(this._proxy,s,parseFloat(n),a,s)||(this._suffix[s]=""),"="===a.charAt(1)&&(this._end[s]=this._firstPT.s+this._firstPT.c+o),this._overwriteProps.push(s);return!0},set:function(t){this._super.setRatio.call(this,t);for(var e,i=this._overwriteProps,r=i.length,s=1===t?this._end:t?this._proxy:this._start,n=s===this._proxy;--r>-1;)e=i[r],this._target.setAttribute(e,s[e]+(n?this._suffix[e]:""))}})}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();