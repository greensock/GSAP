/*!
 * VERSION: 0.1.2
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine.plugin({propName:"endArray",API:2,version:"0.1.2",init:function(t,e){var i,r,s=e.length,n=this.a=[];if(this.target=t,this._round=!1,!s)return!1;for(;--s>-1;)i=t[s],r=e[s],i!==r&&n.push({i:s,s:i,c:r-i});return!0},round:function(t){"endArray"in t&&(this._round=!0)},set:function(t){var e,i,r=this.target,s=this.a,n=s.length;if(this._round)for(;--n>-1;)e=s[n],r[e.i]=Math.round(e.s+e.c*t);else for(;--n>-1;)e=s[n],i=e.s+e.c*t,r[e.i]=1e-6>i&&i>-1e-6?0:i}})}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();