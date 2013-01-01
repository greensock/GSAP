/**
 * VERSION: beta 0.11
 * DATE: 2012-10-26
 * JavaScript
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Copyright (c) 2008-2013, GreenSock. All rights reserved. 
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push( function() {

	_gsDefine("plugins.EaselPlugin", ["plugins.TweenPlugin"], function(TweenPlugin) {
		
		var EaselPlugin = function(props, priority) {
				TweenPlugin.call(this, "easel", -1);
				this._overwriteProps.pop();
			},
			p = EaselPlugin.prototype = new TweenPlugin("easel", -1),
			_numExp = /(\d|\.)+/g,
			_ColorFilter;
			
			_colorProps = ["redMultiplier","greenMultiplier","blueMultiplier","alphaMultiplier","redOffset","greenOffset","blueOffset","alphaOffset"],
			
			_parseColorFilter = function(t, v, pg) {
				if (!_ColorFilter) {
					_ColorFilter = (window.ColorFilter || window.createjs.ColorFilter);
					if (!_ColorFilter) {
						throw("EaselPlugin error: The EaselJS ColorFilter JavaScript file wasn't loaded.");
					}
				}
				var filters = t.filters || [],
					i = filters.length, 
					c, s, e, a, p;
				while (--i > -1) {
					if (filters[i] instanceof _ColorFilter) {
						s = filters[i];
						break;
					}
				}
				if (!s) {
					s = new _ColorFilter();
					filters.push(s);
					t.filters = filters;
				}
				e = s.clone();
				if (v.tint != null) {
					c = _parseColor(v.tint);
					a = (v.tintAmount != null) ? Number(v.tintAmount) : 1;
					e.redOffset = Number(c[0]) * a;
					e.greenOffset = Number(c[1]) * a;
					e.blueOffset = Number(c[2]) * a;
					e.redMultiplier = e.greenMultiplier = e.blueMultiplier = 1 - a;
				} else {
					for (p in v) {
						if (p !== "exposure") if (p !== "brightness") {
							e[p] = Number(v[p]);
						}
					}
				}
				if (v.exposure != null) {
					e.redOffset = e.greenOffset = e.blueOffset = 255 * (Number(v.exposure) - 1);
					e.redMultiplier = e.greenMultiplier = e.blueMultiplier = 1;
				} else if (v.brightness != null) {
					a = Number(v.brightness) - 1;
					e.redOffset = e.greenOffset = e.blueOffset = (a > 0) ? a * 255 : 0;
					e.redMultiplier = e.greenMultiplier = e.blueMultiplier = 1 - Math.abs(a);
				}
				i = 8;
				while (--i > -1) {
					p = _colorProps[i];
					if (s[p] !== e[p]) {
						pg._addTween(s, p, s[p], e[p], "easel_colorFilter");
					}
				}
				pg._overwriteProps.push("easel_colorFilter");
				if (!t.cacheID) {
					throw("EaselPlugin warning: for filters to display in EaselJS, you must call the object's cache() method first. "+t); 
				}
			},
			
			_parseColor = function(color) {
				if (color === "" || color == null || color === "none") {
					return _colorLookup.transparent;
				} else if (_colorLookup[color]) {
					return _colorLookup[color];
				} else if (typeof(color) === "number") {
					return [color >> 16, (color >> 8) & 255, color & 255];
				} else if (color.charAt(0) === "#") {
					if (color.length === 4) { //for shorthand like #9F0
						color = "#" + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3);
					}
					color = parseInt(color.substr(1), 16);
					return [color >> 16, (color >> 8) & 255, color & 255];
				} else {
					return color.match(_numExp) || _colorLookup.transparent;
				}
			},
			_colorLookup = {aqua:[0,255,255],
							lime:[0,255,0],
							silver:[192,192,192],
							black:[0,0,0],
							maroon:[128,0,0],
							teal:[0,128,128],
							blue:[0,0,255],
							navy:[0,0,128],
							white:[255,255,255],
							fuchsia:[255,0,255],
							olive:[128,128,0],
							yellow:[255,255,0],
							orange:[255,165,0],
							gray:[128,128,128],
							purple:[128,0,128],
							green:[0,128,0],
							red:[255,0,0],
							pink:[255,192,203],
							cyan:[0,255,255],
							transparent:[255,255,255,0]};
		
		p.constructor = EaselPlugin;
		EaselPlugin.API = 2;
		
		p._onInitTween = function(target, value, tween) {
			this._target = target;
			var p, pt, tint;
			for (p in value) {
				
				if (p === "colorFilter" || p === "tint" || p === "tintAmount" || p === "exposure" || p === "brightness") {
					if (!tint) {
						_parseColorFilter(target, value.colorFilter || value, this);
						tint = true;
					}
					
				} else if (target[p] != null) {
					this._firstPT = pt = {_next:this._firstPT, t:target, p:p, f:(typeof(target[p]) === "function"), n:p, pr:0, type:0};
					pt.s = (!pt.f) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
					pt.c = (typeof(value[p]) === "number") ? value[p] - pt.s : (typeof(value[p]) === "string") ? parseFloat(value[p].split("=").join("")) : 0;
					
					if (pt._next) {
						pt._next._prev = pt;
					}
				}
				
			}
			return true;
		}
		
		//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
		p.setRatio = function(v) {
			var pt = this._firstPT, val;
			while (pt) {
				val = pt.c * v + pt.s;
				if (pt.r) {
					val = (val + ((val > 0) ? 0.5 : -0.5)) >> 0; //about 4x faster than Math.round()
				}
				if (pt.f) {
					pt.t[pt.p](val);
				} else {
					pt.t[pt.p] = val;
				}
				pt = pt._next;
			}
			if (this._target.cacheID) {
				this._target.updateCache();
			}
		}
		
		TweenPlugin.activate([EaselPlugin]);
		return EaselPlugin;
		
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }