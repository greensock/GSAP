/**
 * VERSION: beta 1.0
 * DATE: 2012-06-08
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

	_gsDefine("plugins.ColorPropsPlugin", ["plugins.TweenPlugin"], function(TweenPlugin) {
		
		var ColorPropsPlugin = function(props, priority) {
				TweenPlugin.call(this, "colorProps", -1);
				this._overwriteProps.pop();
			},
			p = ColorPropsPlugin.prototype = new TweenPlugin("colorProps", -1),
			_numExp = /(\d|\.)+/g,
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
		
		p.constructor = ColorPropsPlugin;
		ColorPropsPlugin.API = 2;
		
		p._onInitTween = function(target, value, tween) {
			this._target = target;
			var p, s, c, pt;
			for (p in value) {
				c = _parseColor(value[p]);
				this._firstPT = pt = {_next:this._firstPT, p:p, f:(typeof(target[p]) === "function"), n:p, r:false};
				s = _parseColor( (!pt.f) ? target[p] : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() );
				pt.s = Number(s[0]);
				pt.c = Number(c[0]) - pt.s;
				pt.gs = Number(s[1]);
				pt.gc = Number(c[1]) - pt.gs;
				pt.bs = Number(s[2]);
				pt.bc = Number(c[2]) - pt.bs;
				if ((pt.rgba = (s.length > 3 || c.length > 3))) { //detect an rgba() value
					pt.as = (s.length < 4) ? 1 : Number(s[3]);
					console.log("as "+pt.as);
					pt.ac = ((c.length < 4) ? 1 : Number(c[3])) - pt.as;
				}
				if (pt._next) {
					pt._next._prev = pt;
				}
			}
			return true;
		}
		
		//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
		p.setRatio = function(v) {
			var pt = this._firstPT, val;
			while (pt) {
				val = (pt.rgba ? "rgba(" : "rgb(") + ((pt.s + (v * pt.c)) >> 0) + ", " + ((pt.gs + (v * pt.gc)) >> 0) + ", " + ((pt.bs + (v * pt.bc)) >> 0) + (pt.rgba ? ", " + (pt.as + (v * pt.ac)) : "") + ")";
				if (pt.f) {
					this._target[pt.p](val);
				} else {
					this._target[pt.p] = val;
				}
				pt = pt._next;
			}
		}
		
		TweenPlugin.activate([ColorPropsPlugin]);
		return ColorPropsPlugin;
		
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }