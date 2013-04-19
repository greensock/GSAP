/*!
 * VERSION: 0.2.1
 * DATE: 2013-04-18
 * JavaScript 
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue || (window._gsQueue = [])).push( function() {
	
	"use strict";

	var _specialProps = {setScale:1, setShadowOffset:1, setFillPatternOffset:1, setOffset:1, setFill:2, setStroke:2, setShadowColor:2},//type 1 is one that has "x" and "y" components that can be split apart but in order to set them, they must be combined into a single object and passed to one setter (like setScale({x:0.5, y:0.6})). Type 2 is for colors.
		_getters = {},
		_numExp = /(\d|\.)+/g,
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
			transparent:[255,255,255,0]},
		_hue = function(h, m1, m2) {
			h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
			return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
		},
		_parseColor = function(color) {
			if (color === "" || color == null || color === "none") {
				return _colorLookup.transparent;
			}
			if (_colorLookup[color]) {
				return _colorLookup[color];
			}
			if (typeof(color) === "number") {
				return [color >> 16, (color >> 8) & 255, color & 255];
			}
			if (color.charAt(0) === "#") {
				if (color.length === 4) { //for shorthand like #9F0
					color = "#" + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3);
				}
				color = parseInt(color.substr(1), 16);
				return [color >> 16, (color >> 8) & 255, color & 255];
			}
			if (color.substr(0, 3) === "hsl") {
				color = color.match(_numExp);
				var h = (Number(color[0]) % 360) / 360,
					s = Number(color[1]) / 100,
					l = Number(color[2]) / 100,
					m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s,
					m1 = l * 2 - m2;
				if (color.length > 3) {
					color[3] = Number(color[3]);
				}
				color[0] = _hue(h + 1 / 3, m1, m2);
				color[1] = _hue(h, m1, m2);
				color[2] = _hue(h - 1 / 3, m1, m2);
				return color;
			}
			var a = color.match(_numExp) || _colorLookup.transparent,
				i = a.length;
			while (--i > -1) {
				a[i] = Number(a[i]);
			}
			return a;
		},
		SpecialProp = function(target, getter, next) {
			this.target = target;
			this.getter = getter;
			this.setter = "set" + getter.substr(3);
			this.type = _specialProps[this.setter];
			var val = target[this.getter]();
			if (this.type === 1) {
				this.proxy = {x:val.x, y:val.y};
				this.x = this.y = false;
			} else {
				val = _parseColor(val);
				this.proxy = {r:val[0], g:val[1], b:val[2], a:(val.length > 3 ? val[3] : 1)};
			}
			if (next) {
				this._next = next;
				next._prev = this;
			}
		},
		_layersToDraw = [],
		_ticker, _listening,
		_onTick = function() {
			var i = _layersToDraw.length;
			if (i !== 0) {
				while (--i > -1) {
					_layersToDraw[i].draw();
					_layersToDraw[i]._gsDraw = false;
				}
				_layersToDraw.length = 0;
			} else {
				_ticker.removeEventListener("tick", _onTick);
				_listening = false;
			}
		},
		p;

	for (p in _specialProps) {
		_getters[p] = "get" + p.substr(3);
		if (_specialProps[p] === 1) {
			_getters[p + "X"] = _getters[p + "Y"] = _getters[p];
		}
	}

	window._gsDefine.plugin({
		propName: "kinetic",
		API: 2,

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			var p, val, gp, sp;
			this._target = target;
			this._layer = (value.autoDraw !== false) ? target.getLayer() : null;
			if (!_ticker && this._layer) {
				_ticker = tween.constructor.ticker;
			}
			for (p in value) {
				val = value[p];
				//allow users to pass in shorter names like "x" instead of "setX" and "rotationDeg" instead of "setRotationDeg"
				if (p.substr(0,3) !== "set" && target[p] === undefined) {
					p = "set" + p.charAt(0).toUpperCase() + p.substr(1);
				}
				gp = _getters[p];
				//some special properties need to be handled differently, like scale, scaleX, scaleY, shadowOffset, fill, stroke, etc.
				if (gp) {
					this._special = this._special || {};
					sp = this._special[gp];
					if (!sp) {
						sp = this._special[gp] = this._firstSP = new SpecialProp(target, gp, this._firstSP);
					}
					if (sp.type === 1) {
						gp = p.substr(p.length - 1).toLowerCase();
						if (_specialProps[p] || gp === "x") {
							this._addTween(sp.proxy, "x", sp.proxy.x, val, p);
							sp.x = true;
						}
						if (_specialProps[p] || gp === "y") {
							this._addTween(sp.proxy, "y", sp.proxy.y, val, p);
							sp.y = true;
						}
					} else {
						val = _parseColor(val);
						if (sp.proxy.r !== val[0]) {
							this._addTween(sp.proxy, "r", sp.proxy.r, val[0], p);
						}
						if (sp.proxy.g !== val[1]) {
							this._addTween(sp.proxy, "g", sp.proxy.g, val[1], p);
						}
						if (sp.proxy.b !== val[2]) {
							this._addTween(sp.proxy, "b", sp.proxy.b, val[2], p);
						}
						if ((val.length > 3 || sp.proxy.a !== 1) && sp.proxy.a !== val[3]) {
							this._addTween(sp.proxy, "a", sp.proxy.a, (val.length > 3 ? val[3] : 1), p);
						}
					}

				} else if (p !== "autoDraw") {
					this._addTween(target, p, ((typeof(target[p]) === "function") ? target["get" + p.substr(3)]() || target[p]() : target[p]) || 0, val, p);
				}
				this._overwriteProps.push(p);
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			this._super.setRatio.call(this, ratio);
			var sp = this._firstSP,
				layer = this._layer,
				t, proxy;
			if (sp) {
				t = this._target;
				while (sp) {
					proxy = sp.proxy;

					//positional (x/y)
					if (sp.type === 1) {
						if (!sp.x) {
							proxy.x = t[sp.getter]().x;
						}
						if (!sp.y) {
							proxy.y = t[sp.getter]().y;
						}
						t[sp.setter](proxy);

					//color
					} else {
						t[sp.setter]( (proxy.a !== 1 ? "rgba(" : "rgb(") + (proxy.r | 0) + ", " + (proxy.g | 0) + ", " + (proxy.b | 0) + (proxy.a !== 1 ? ", " + proxy.a : "") + ")");
					}
					sp = sp._next;
				}
			}
			if (layer && !layer._gsDraw) {
				_layersToDraw.push(layer);
				layer._gsDraw = true; //a flag indicating that we need to draw() this layer as soon as all the tweens have finished updating (using a "tick" event listener)
				if (!_listening) {
					_ticker.addEventListener("tick", _onTick);
					_listening = true;
				}
			}
		}

	});

}); if (window._gsDefine) { window._gsQueue.pop()(); }