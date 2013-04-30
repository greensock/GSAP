/*!
 * VERSION: 0.3.2
 * DATE: 2013-04-26
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue || (window._gsQueue = [])).push( function() {
	
	"use strict";

	var _specialProps = {setScale:1, setShadowOffset:1, setFillPatternOffset:1, setOffset:1, setFill:2, setStroke:2, setShadowColor:2}, //type 1 is one that has "x" and "y" components that can be split apart but in order to set them, they must be combined into a single object and passed to one setter (like setScale({x:0.5, y:0.6})). Type 2 is for colors.
		_getterNames = {},
		_getterFuncs = {},
		_setterFuncs = {},
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
		ColorProp = function(target, getter, setter, next) {
			this.getter = getter;
			this.setter = setter;
			var val = _parseColor( target[getter]() );
			this.proxy = {r:val[0], g:val[1], b:val[2], a:(val.length > 3 ? val[3] : 1)};
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
		_prepDimensionProp = function(p, dimension) {
			var alt = (dimension === "x") ? "y" : "x",
				uc = dimension.toUpperCase(),
				getter = "get" + p.substr(3),
				proxyName = "_gs_" + p;
			_getterNames[p + uc] = getter + uc;
			_getterFuncs[p + uc] = function() {
				return this[getter]()[dimension];
			};
			_setterFuncs[p + uc] =  function(value) {
				var cur = this[getter](),
					proxy = this[proxyName];
				if (!proxy) {
					proxy = this[proxyName] = {};
				}
				proxy[dimension] = value;
				proxy[alt] = cur[alt];
				this[p](proxy);
				return this;
			};
		},
		//looks at every property in the vars and converts them (when appropriate) to the KineticJS equivalent, like "x" would become "setX", "rotation" would be "setRotation", etc. If it finds a special property for which "x" and "y" must be split apart (like scale, offset, shadowOffset, etc.), it will do that as well, and if the getters and setters aren't already on the object (like setScaleX, setScaleY, getScaleX, and getScaleY), it'll add those to the target itself (actually, its prototype if available). This method returns an array of any names it had to change (like "x", "y", "scale", etc.) so that they can be used in the overwriteProps array.
		_convertProps = function(target, vars) {
			var converted = [],
				p, gp, val, i, proto;
			for (p in vars) {
				val = vars[p];
				if (p !== "bezier" && p !== "autoDraw" && p.substr(0,3) !== "set" && target[p] === undefined) {
					converted.push(p);
					delete vars[p];
					p = "set" + p.charAt(0).toUpperCase() + p.substr(1);
					vars[p] = val;
				}
				gp = _getterNames[p];
				if (gp) {
					if (_specialProps[p] === 1) {
						vars[p + "X"] = vars[p + "Y"] = vars[p];
						delete vars[p];
						return _convertProps(target, vars);
					} else if (!target[p] && _setterFuncs[p]) {
						proto = target.prototype || target;
						proto[p] = _setterFuncs[p];
						proto[gp] = _getterFuncs[p];
					}
				} else if (p === "bezier") {
					val = (val instanceof Array) ? val : val.values || [];
					i = val.length;
					while (--i > -1) {
						if (i === 0) {
							converted = converted.concat( _convertProps(target, val[i]) );
						} else {
							_convertProps(target, val[i]);
						}
					}
				}
			}
			return converted;
		},
		_copy = function(obj) {
			var result = {},
				p;
			for (p in obj) {
				result[p] = obj[p];
			}
			return result;
		},
		p;

	for (p in _specialProps) {
		_getterNames[p] = "get" + p.substr(3);
		if (_specialProps[p] === 1) {
			_prepDimensionProp(p, "x");
			_prepDimensionProp(p, "y");
		}
	}

	window._gsDefine.plugin({
		propName: "kinetic",
		API: 2,

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			var p, val, gp, sp, bezierPlugin, bp;
			this._overwriteProps = _convertProps(target, value); //allow users to pass in shorter names like "x" instead of "setX" and "rotationDeg" instead of "setRotationDeg"
			this._target = target;
			this._layer = (value.autoDraw !== false) ? target.getLayer() : null;
			if (!_ticker && this._layer) {
				_ticker = tween.constructor.ticker;
			}
			for (p in value) {
				val = value[p];
				//we must handle colors in a special way, splitting apart the red, green, blue, and alpha.
				if (_specialProps[p] === 2) {
					gp = _getterNames[p];
					sp = this._firstSP = new ColorProp(target, gp, p, this._firstSP);
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
				} else if (p === "bezier") {
					bezierPlugin = window._gsDefine.globals.BezierPlugin;
					if (!bezierPlugin) {
						throw("BezierPlugin not loaded");
					}
					bezierPlugin = this._bezier = new bezierPlugin();
					if (typeof(val) === "object" && val.autoRotate === true) {
						val.autoRotate = ["setX","setY","setRotation",0,true];
					}
					bezierPlugin._onInitTween(target, val, tween);
					this._overwriteProps = this._overwriteProps.concat(bezierPlugin._overwriteProps);
					this._addTween(bezierPlugin, "setRatio", 0, 1, p);

				} else if (p !== "autoDraw") {
					this._addTween(target, p, ((typeof(target[p]) === "function") ? target["get" + p.substr(3)]() : target[p]) || 0, val, p);
				}
				this._overwriteProps.push(p);
			}
			return true;
		},

		kill: function(lookup) {
			lookup = _copy(lookup);
			_convertProps(this._target, lookup);
			if (this._bezier) {
				this._bezier._kill(lookup);
			}
			return this._super._kill.call(this, lookup);
		},

		round:function(lookup, value) {
			lookup = _copy(lookup);
			_convertProps(this._target, lookup);
			if (this._bezier) {
				this._bezier._roundProps(lookup, value);
			}
			return this._super._roundProps.call(this, lookup, value);
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
					t[sp.setter]( (proxy.a !== 1 ? "rgba(" : "rgb(") + (proxy.r | 0) + ", " + (proxy.g | 0) + ", " + (proxy.b | 0) + (proxy.a !== 1 ? ", " + proxy.a : "") + ")");
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