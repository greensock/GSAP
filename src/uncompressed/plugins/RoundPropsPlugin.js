/**
 * VERSION: beta 1.31
 * DATE: 2012-11-19
 * JavaScript (ActionScript 3 and 2 also available)
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Copyright (c) 2008-2013, GreenSock. All rights reserved. 
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push( function() {

	_gsDefine("plugins.RoundPropsPlugin", ["plugins.TweenPlugin"], function(TweenPlugin) {
		
		var RoundPropsPlugin = function(props, priority) {
				TweenPlugin.call(this, "roundProps", -1);
				this._overwriteProps.length = 0;
			},
			p = RoundPropsPlugin.prototype = new TweenPlugin("roundProps", -1);
		
		p.constructor = RoundPropsPlugin;
		RoundPropsPlugin.API = 2;
		
		p._onInitTween = function(target, value, tween) {
			this._tween = tween;
			return true;
		};
		
		p._onInitAllProps = function() {
			var tween = this._tween,
				rp = (tween.vars.roundProps instanceof Array) ? tween.vars.roundProps : tween.vars.roundProps.split(","), 
				i = rp.length,
				lookup = {},
				rpt = tween._propLookup.roundProps,
				prop, pt, next;
			while (--i > -1) {
				lookup[rp[i]] = 1;
			}
			i = rp.length;
			while (--i > -1) {
				prop = rp[i];
				pt = tween._firstPT;
				while (pt) {
					next = pt._next; //record here, because it may get removed
					if (pt.pg) {
						pt.t._roundProps(lookup, true);
					} else if (pt.n === prop) {
						this._add(pt.t, prop, pt.s, pt.c);
						//remove from linked list
						if (next) {
							next._prev = pt._prev;
						}
						if (pt._prev) {
							pt._prev._next = next;
						} else if (tween._firstPT === pt) {
							tween._firstPT = next;
						}
						pt._next = pt._prev = null;
						tween._propLookup[prop] = rpt;
					}
					pt = next;
				}
			}
			return false;
		};
				
		p._add = function(target, p, s, c) {
			this._addTween(target, p, s, s + c, p, true);
			this._overwriteProps.push(p);
		};
		
		TweenPlugin.activate([RoundPropsPlugin]);
		
		return RoundPropsPlugin;
		
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }