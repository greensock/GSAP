(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

	/*!
	 * PixiPlugin 3.0.5
	 * https://greensock.com
	 *
	 * @license Copyright 2008-2020, GreenSock. All rights reserved.
	 * Subject to the terms at https://greensock.com/standard-license or for
	 * Club GreenSock members, the agreement issued with that membership.
	 * @author: Jack Doyle, jack@greensock.com
	*/
	var gsap,
	    _win,
	    _splitColor,
	    _coreInitted,
	    _PIXI,
	    PropTween,
	    _getSetter,
	    _windowExists = function _windowExists() {
	  return typeof window !== "undefined";
	},
	    _getGSAP = function _getGSAP() {
	  return gsap || _windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap;
	},
	    _isFunction = function _isFunction(value) {
	  return typeof value === "function";
	},
	    _warn = function _warn(message) {
	  return console.warn(message);
	},
	    _idMatrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
	    _lumR = 0.212671,
	    _lumG = 0.715160,
	    _lumB = 0.072169,
	    _applyMatrix = function _applyMatrix(m, m2) {
	  var temp = [],
	      i = 0,
	      z = 0,
	      y,
	      x;

	  for (y = 0; y < 4; y++) {
	    for (x = 0; x < 5; x++) {
	      z = x === 4 ? m[i + 4] : 0;
	      temp[i + x] = m[i] * m2[x] + m[i + 1] * m2[x + 5] + m[i + 2] * m2[x + 10] + m[i + 3] * m2[x + 15] + z;
	    }

	    i += 5;
	  }

	  return temp;
	},
	    _setSaturation = function _setSaturation(m, n) {
	  var inv = 1 - n,
	      r = inv * _lumR,
	      g = inv * _lumG,
	      b = inv * _lumB;
	  return _applyMatrix([r + n, g, b, 0, 0, r, g + n, b, 0, 0, r, g, b + n, 0, 0, 0, 0, 0, 1, 0], m);
	},
	    _colorize = function _colorize(m, color, amount) {
	  var c = _splitColor(color),
	      r = c[0] / 255,
	      g = c[1] / 255,
	      b = c[2] / 255,
	      inv = 1 - amount;

	  return _applyMatrix([inv + amount * r * _lumR, amount * r * _lumG, amount * r * _lumB, 0, 0, amount * g * _lumR, inv + amount * g * _lumG, amount * g * _lumB, 0, 0, amount * b * _lumR, amount * b * _lumG, inv + amount * b * _lumB, 0, 0, 0, 0, 0, 1, 0], m);
	},
	    _setHue = function _setHue(m, n) {
	  n *= Math.PI / 180;
	  var c = Math.cos(n),
	      s = Math.sin(n);
	  return _applyMatrix([_lumR + c * (1 - _lumR) + s * -_lumR, _lumG + c * -_lumG + s * -_lumG, _lumB + c * -_lumB + s * (1 - _lumB), 0, 0, _lumR + c * -_lumR + s * 0.143, _lumG + c * (1 - _lumG) + s * 0.14, _lumB + c * -_lumB + s * -0.283, 0, 0, _lumR + c * -_lumR + s * -(1 - _lumR), _lumG + c * -_lumG + s * _lumG, _lumB + c * (1 - _lumB) + s * _lumB, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], m);
	},
	    _setContrast = function _setContrast(m, n) {
	  return _applyMatrix([n, 0, 0, 0, 0.5 * (1 - n), 0, n, 0, 0, 0.5 * (1 - n), 0, 0, n, 0, 0.5 * (1 - n), 0, 0, 0, 1, 0], m);
	},
	    _getFilter = function _getFilter(target, type) {
	  var filterClass = _PIXI.filters[type],
	      filters = target.filters || [],
	      i = filters.length,
	      filter;

	  if (!filterClass) {
	    _warn(type + " not found. PixiPlugin.registerPIXI(PIXI)");
	  }

	  while (--i > -1) {
	    if (filters[i] instanceof filterClass) {
	      return filters[i];
	    }
	  }

	  filter = new filterClass();

	  if (type === "BlurFilter") {
	    filter.blur = 0;
	  }

	  filters.push(filter);
	  target.filters = filters;
	  return filter;
	},
	    _addColorMatrixFilterCacheTween = function _addColorMatrixFilterCacheTween(p, plugin, cache, vars) {
	  plugin.add(cache, p, cache[p], vars[p]);

	  plugin._props.push(p);
	},
	    _applyBrightnessToMatrix = function _applyBrightnessToMatrix(brightness, matrix) {
	  var temp = new _PIXI.filters.ColorMatrixFilter();
	  temp.matrix = matrix;
	  temp.brightness(brightness, true);
	  return temp.matrix;
	},
	    _copy = function _copy(obj) {
	  var copy = {},
	      p;

	  for (p in obj) {
	    copy[p] = obj[p];
	  }

	  return copy;
	},
	    _CMFdefaults = {
	  contrast: 1,
	  saturation: 1,
	  colorizeAmount: 0,
	  colorize: "rgb(255,255,255)",
	  hue: 0,
	  brightness: 1
	},
	    _parseColorMatrixFilter = function _parseColorMatrixFilter(target, v, pg) {
	  var filter = _getFilter(target, "ColorMatrixFilter"),
	      cache = target._gsColorMatrixFilter = target._gsColorMatrixFilter || _copy(_CMFdefaults),
	      combine = v.combineCMF && !("colorMatrixFilter" in v && !v.colorMatrixFilter),
	      i,
	      matrix,
	      startMatrix;

	  startMatrix = filter.matrix;

	  if (v.resolution) {
	    filter.resolution = v.resolution;
	  }

	  if (v.matrix && v.matrix.length === startMatrix.length) {
	    matrix = v.matrix;

	    if (cache.contrast !== 1) {
	      _addColorMatrixFilterCacheTween("contrast", pg, cache, _CMFdefaults);
	    }

	    if (cache.hue) {
	      _addColorMatrixFilterCacheTween("hue", pg, cache, _CMFdefaults);
	    }

	    if (cache.brightness !== 1) {
	      _addColorMatrixFilterCacheTween("brightness", pg, cache, _CMFdefaults);
	    }

	    if (cache.colorizeAmount) {
	      _addColorMatrixFilterCacheTween("colorize", pg, cache, _CMFdefaults);

	      _addColorMatrixFilterCacheTween("colorizeAmount", pg, cache, _CMFdefaults);
	    }

	    if (cache.saturation !== 1) {
	      _addColorMatrixFilterCacheTween("saturation", pg, cache, _CMFdefaults);
	    }
	  } else {
	    matrix = _idMatrix.slice();

	    if (v.contrast != null) {
	      matrix = _setContrast(matrix, +v.contrast);

	      _addColorMatrixFilterCacheTween("contrast", pg, cache, v);
	    } else if (cache.contrast !== 1) {
	      if (combine) {
	        matrix = _setContrast(matrix, cache.contrast);
	      } else {
	        _addColorMatrixFilterCacheTween("contrast", pg, cache, _CMFdefaults);
	      }
	    }

	    if (v.hue != null) {
	      matrix = _setHue(matrix, +v.hue);

	      _addColorMatrixFilterCacheTween("hue", pg, cache, v);
	    } else if (cache.hue) {
	      if (combine) {
	        matrix = _setHue(matrix, cache.hue);
	      } else {
	        _addColorMatrixFilterCacheTween("hue", pg, cache, _CMFdefaults);
	      }
	    }

	    if (v.brightness != null) {
	      matrix = _applyBrightnessToMatrix(+v.brightness, matrix);

	      _addColorMatrixFilterCacheTween("brightness", pg, cache, v);
	    } else if (cache.brightness !== 1) {
	      if (combine) {
	        matrix = _applyBrightnessToMatrix(cache.brightness, matrix);
	      } else {
	        _addColorMatrixFilterCacheTween("brightness", pg, cache, _CMFdefaults);
	      }
	    }

	    if (v.colorize != null) {
	      v.colorizeAmount = "colorizeAmount" in v ? +v.colorizeAmount : 1;
	      matrix = _colorize(matrix, v.colorize, v.colorizeAmount);

	      _addColorMatrixFilterCacheTween("colorize", pg, cache, v);

	      _addColorMatrixFilterCacheTween("colorizeAmount", pg, cache, v);
	    } else if (cache.colorizeAmount) {
	      if (combine) {
	        matrix = _colorize(matrix, cache.colorize, cache.colorizeAmount);
	      } else {
	        _addColorMatrixFilterCacheTween("colorize", pg, cache, _CMFdefaults);

	        _addColorMatrixFilterCacheTween("colorizeAmount", pg, cache, _CMFdefaults);
	      }
	    }

	    if (v.saturation != null) {
	      matrix = _setSaturation(matrix, +v.saturation);

	      _addColorMatrixFilterCacheTween("saturation", pg, cache, v);
	    } else if (cache.saturation !== 1) {
	      if (combine) {
	        matrix = _setSaturation(matrix, cache.saturation);
	      } else {
	        _addColorMatrixFilterCacheTween("saturation", pg, cache, _CMFdefaults);
	      }
	    }
	  }

	  i = matrix.length;

	  while (--i > -1) {
	    if (matrix[i] !== startMatrix[i]) {
	      pg.add(startMatrix, i, startMatrix[i], matrix[i], "colorMatrixFilter");
	    }
	  }

	  pg._props.push("colorMatrixFilter");
	},
	    _renderColor = function _renderColor(ratio, _ref) {
	  var t = _ref.t,
	      p = _ref.p,
	      color = _ref.color,
	      set = _ref.set;
	  set(t, p, color[0] << 16 | color[1] << 8 | color[2]);
	},
	    _renderDirtyCache = function _renderDirtyCache(ratio, _ref2) {
	  var g = _ref2.g;

	  if (g) {
	    g.dirty++;
	    g.clearDirty++;
	  }
	},
	    _renderAutoAlpha = function _renderAutoAlpha(ratio, data) {
	  data.t.visible = !!data.t.alpha;
	},
	    _addColorTween = function _addColorTween(target, p, value, plugin) {
	  var currentValue = target[p],
	      startColor = _splitColor(_isFunction(currentValue) ? target[p.indexOf("set") || !_isFunction(target["get" + p.substr(3)]) ? p : "get" + p.substr(3)]() : currentValue),
	      endColor = _splitColor(value);

	  plugin._pt = new PropTween(plugin._pt, target, p, 0, 0, _renderColor, {
	    t: target,
	    p: p,
	    color: startColor,
	    set: _getSetter(target, p)
	  });
	  plugin.add(startColor, 0, startColor[0], endColor[0]);
	  plugin.add(startColor, 1, startColor[1], endColor[1]);
	  plugin.add(startColor, 2, startColor[2], endColor[2]);
	},
	    _colorProps = {
	  tint: 1,
	  lineColor: 1,
	  fillColor: 1
	},
	    _xyContexts = "position,scale,skew,pivot,anchor,tilePosition,tileScale".split(","),
	    _contexts = {
	  x: "position",
	  y: "position",
	  tileX: "tilePosition",
	  tileY: "tilePosition"
	},
	    _colorMatrixFilterProps = {
	  colorMatrixFilter: 1,
	  saturation: 1,
	  contrast: 1,
	  hue: 1,
	  colorize: 1,
	  colorizeAmount: 1,
	  brightness: 1,
	  combineCMF: 1
	},
	    _DEG2RAD = Math.PI / 180,
	    _degreesToRadians = function _degreesToRadians(value) {
	  return typeof value === "string" && value.charAt(1) === "=" ? value.substr(0, 2) + parseFloat(value.substr(2)) * _DEG2RAD : value * _DEG2RAD;
	},
	    _initCore = function _initCore() {
	  if (_windowExists()) {
	    _win = window;
	    gsap = _coreInitted = _getGSAP();
	    _PIXI = _PIXI || _win.PIXI;
	    _splitColor = gsap.utils.splitColor;
	  }
	},
	    i,
	    p;

	for (i = 0; i < _xyContexts.length; i++) {
	  p = _xyContexts[i];
	  _contexts[p + "X"] = p;
	  _contexts[p + "Y"] = p;
	}

	var PixiPlugin = {
	  version: "3.0.5",
	  name: "pixi",
	  register: function register(core, Plugin, propTween) {
	    gsap = core;
	    PropTween = propTween;
	    _getSetter = Plugin.getSetter;

	    _initCore();
	  },
	  registerPIXI: function registerPIXI(pixi) {
	    _PIXI = pixi;
	  },
	  init: function init(target, values, tween, index, targets) {
	    if (!_PIXI) {
	      _initCore();
	    }

	    if (!target instanceof _PIXI.DisplayObject) {
	      return false;
	    }

	    var isV4 = _PIXI.VERSION.charAt(0) === "4",
	        context,
	        axis,
	        value,
	        colorMatrix,
	        filter,
	        p,
	        padding,
	        i,
	        data;

	    for (p in values) {
	      context = _contexts[p];
	      value = values[p];

	      if (context) {
	        axis = ~p.charAt(p.length - 1).toLowerCase().indexOf("x") ? "x" : "y";
	        this.add(target[context], axis, target[context][axis], context === "skew" ? _degreesToRadians(value) : value);
	      } else if (p === "scale" || p === "anchor" || p === "pivot" || p === "tileScale") {
	        this.add(target[p], "x", target[p].x, value);
	        this.add(target[p], "y", target[p].y, value);
	      } else if (p === "rotation") {
	        this.add(target, p, target.rotation, _degreesToRadians(value));
	      } else if (_colorMatrixFilterProps[p]) {
	        if (!colorMatrix) {
	          _parseColorMatrixFilter(target, values.colorMatrixFilter || values, this);

	          colorMatrix = true;
	        }
	      } else if (p === "blur" || p === "blurX" || p === "blurY" || p === "blurPadding") {
	        filter = _getFilter(target, "BlurFilter");
	        this.add(filter, p, filter[p], value);

	        if (values.blurPadding !== 0) {
	          padding = values.blurPadding || Math.max(filter[p], value) * 2;
	          i = target.filters.length;

	          while (--i > -1) {
	            target.filters[i].padding = Math.max(target.filters[i].padding, padding);
	          }
	        }
	      } else if (_colorProps[p]) {
	        if ((p === "lineColor" || p === "fillColor") && target instanceof _PIXI.Graphics) {
	          data = (target.geometry || target).graphicsData;
	          this._pt = new PropTween(this._pt, target, p, 0, 0, _renderDirtyCache, {
	            g: target.geometry || target
	          });
	          i = data.length;

	          while (--i > -1) {
	            _addColorTween(isV4 ? data[i] : data[i][p.substr(0, 4) + "Style"], isV4 ? p : "color", value, this);
	          }
	        } else {
	          _addColorTween(target, p, value, this);
	        }
	      } else if (p === "autoAlpha") {
	        this._pt = new PropTween(this._pt, target, "visible", 0, 0, _renderAutoAlpha);
	        this.add(target, "alpha", target.alpha, value);

	        this._props.push("alpha", "visible");
	      } else {
	        this.add(target, p, "get", value);
	      }

	      this._props.push(p);
	    }
	  }
	};
	_getGSAP() && gsap.registerPlugin(PixiPlugin);

	exports.PixiPlugin = PixiPlugin;
	exports.default = PixiPlugin;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
