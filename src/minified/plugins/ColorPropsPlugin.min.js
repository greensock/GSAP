/*!
 * VERSION: beta 1.2.0
 * DATE: 2013-03-01
 * JavaScript 
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";var a=/(\d|\.)+/g,b={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},c=function(a,b,c){return a=0>a?a+1:a>1?a-1:a,0|255*(1>6*a?b+6*(c-b)*a:.5>a?c:2>3*a?b+6*(c-b)*(2/3-a):b)+.5},d=function(d){if(""===d||null==d||"none"===d)return b.transparent;if(b[d])return b[d];if("number"==typeof d)return[d>>16,255&d>>8,255&d];if("#"===d.charAt(0))return 4===d.length&&(d="#"+d.charAt(1)+d.charAt(1)+d.charAt(2)+d.charAt(2)+d.charAt(3)+d.charAt(3)),d=parseInt(d.substr(1),16),[d>>16,255&d>>8,255&d];if("hsl"===d.substr(0,3)){d=d.match(a);var e=Number(d[0])%360/360,f=Number(d[1])/100,g=Number(d[2])/100,h=.5>=g?g*(f+1):g+f-g*f,i=2*g-h;return d.length>3&&(d[3]=Number(d[3])),d[0]=c(e+1/3,i,h),d[1]=c(e,i,h),d[2]=c(e-1/3,i,h),d}return d.match(a)||b.transparent};window._gsDefine.plugin({propName:"colorProps",priority:-1,API:2,init:function(a,b){this._target=a;var e,f,g,h;for(e in b)g=d(b[e]),this._firstPT=h={_next:this._firstPT,p:e,f:"function"==typeof a[e],n:e,r:!1},f=d(h.f?a[e.indexOf("set")||"function"!=typeof a["get"+e.substr(3)]?e:"get"+e.substr(3)]():a[e]),h.s=Number(f[0]),h.c=Number(g[0])-h.s,h.gs=Number(f[1]),h.gc=Number(g[1])-h.gs,h.bs=Number(f[2]),h.bc=Number(g[2])-h.bs,(h.rgba=f.length>3||g.length>3)&&(h.as=4>f.length?1:Number(f[3]),h.ac=(4>g.length?1:Number(g[3]))-h.as),h._next&&(h._next._prev=h);return!0},set:function(a){for(var c,b=this._firstPT;b;)c=(b.rgba?"rgba(":"rgb(")+(b.s+a*b.c>>0)+", "+(b.gs+a*b.gc>>0)+", "+(b.bs+a*b.bc>>0)+(b.rgba?", "+(b.as+a*b.ac):"")+")",b.f?this._target[b.p](c):this._target[b.p]=c,b=b._next}})}),window._gsDefine&&window._gsQueue.pop()();