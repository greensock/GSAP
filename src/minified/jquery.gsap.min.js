/*!
 * VERSION: 0.1.6
 * DATE: 2013-02-13
 * JavaScript
 * UPDATES AND DOCS AT: http://www.greensock.com/jquery-gsap-plugin/
 *
 * Requires TweenLite version 1.8.0 or higher and CSSPlugin. For staggerTo(), staggerFrom(), and staggerFromTo(), it also
 * requires TimelineLite. If TweenMax or TimelineMax is loaded, they will be preferred over TweenLite and TimelineLite internally
 * so that you get the most features possible (like repeat, yoyo, repeatDelay, etc.)
 *
 * @license Copyright (c) 2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
(function(a){"use strict";var e,f,g,b=a.fn.animate,c=a.fn.stop,d=!0,h=function(a,b){"function"==typeof a&&this.each(a),b()},i=function(a,b,c,d,e){e="function"==typeof e?e:null,b="function"==typeof b?b:null,(b||e)&&(d[a]=e?h:c.each,d[a+"Scope"]=c,d[a+"Params"]=e?[b,e]:[b])},j={overwrite:1,delay:1,useFrames:1,runBackwards:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,autoCSS:1},k=function(a,b){for(var c in j)j[c]&&void 0!==a[c]&&(b[c]=a[c])},l=function(a){return function(b){return a.getRatio(b)}},m={},n=function(){var c,d,h,b=window.GreenSockGlobals||window;if(e=b.TweenMax||b.TweenLite,e&&(c=(e.version+".0.0").split("."),d=!(Number(c[0])>0&&Number(c[1])>7),b=b.com.greensock,f=b.plugins.CSSPlugin,m=b.easing.Ease.map||{}),!e||!f||d)return e=null,!g&&window.console&&(window.console.log("The jquery.gsap.js plugin requires the TweenMax (or at least TweenLite and CSSPlugin) JavaScript file(s)."+(d?" Version "+c.join(".")+" is too old.":"")),g=!0),void 0;if(a.easing){for(h in m)a.easing[h]=l(m[h]);n=!1}};a.fn.animate=function(c,g,h,j){if(c=c||{},n&&(n(),!e||!f))return b.call(this,c,g,h,j);if(!d||c.skipGSAP===!0||"object"==typeof g&&"function"==typeof g.step||null!=c.scrollTop||null!=c.scrollLeft)return b.call(this,c,g,h,j);var r,s,t,u,l=a.speed(g,h,j),o={ease:m[l.easing]||(l.easing===!1?m.linear:m.swing)},p=this,q="object"==typeof g?g.specialEasing:null;for(s in c){if(r=c[s],r instanceof Array&&m[r[1]]&&(q=q||{},q[s]=r[1],r=r[0]),"toggle"===r||"hide"===r||"show"===r)return b.call(this,c,g,h,j);o[-1===s.indexOf("-")?s:a.camelCase(s)]=r}if(q){u=[];for(s in q)r=u[u.length]={},k(o,r),r.ease=m[q[s]]||o.ease,-1!==s.indexOf("-")&&(s=a.camelCase(s)),r[s]=o[s];0===u.length&&(u=null)}return t=function(b){if(u)for(var c=u.length;--c>-1;)e.to(p,a.fx.off?0:l.duration/1e3,u[c]);i("onComplete",l.old,p,o,b),e.to(p,a.fx.off?0:l.duration/1e3,o)},l.queue!==!1?p.queue(l.queue,t):t(),p},a.fn.stop=function(a,b){if(c.call(this,a,b),e){if(b)for(var g,d=e.getTweensOf(this),f=d.length;--f>-1;)g=d[f].totalTime()/d[f].totalDuration(),g>0&&1>g&&d[f].seek(d[f].totalDuration());e.killTweensOf(this)}return this},a.gsap={enabled:function(a){d=a},version:"0.1.6"}})(jQuery);