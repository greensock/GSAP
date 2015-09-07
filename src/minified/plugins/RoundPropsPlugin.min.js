/*!
 * VERSION: 1.5
 * DATE: 2015-08-28
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";var t=_gsScope._gsDefine.plugin({propName:"roundProps",version:"1.5",priority:-1,API:2,init:function(t,e,i){return this._tween=i,!0}}),e=function(t){for(;t;)t.f||t.blob||(t.r=1),t=t._next},i=t.prototype;i._onInitAllProps=function(){for(var t,i,r,s=this._tween,n=s.vars.roundProps.join?s.vars.roundProps:s.vars.roundProps.split(","),a=n.length,o={},l=s._propLookup.roundProps;--a>-1;)o[n[a]]=1;for(a=n.length;--a>-1;)for(t=n[a],i=s._firstPT;i;)r=i._next,i.pg?i.t._roundProps(o,!0):i.n===t&&(2===i.f&&i.t?e(i.t._firstPT):(this._add(i.t,t,i.s,i.c),r&&(r._prev=i._prev),i._prev?i._prev._next=r:s._firstPT===i&&(s._firstPT=r),i._next=i._prev=null,s._propLookup[t]=l)),i=r;return!1},i._add=function(t,e,i,r){this._addTween(t,e,i,i+r,e,!0),this._overwriteProps.push(e)}}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()();