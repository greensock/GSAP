/*!
 * VERSION: 0.4.0
 * DATE: 2015-05-06
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
	
	"use strict";

	var _numExp = /(?:\d|\-|\+|=|#|\.)*/g,
		_suffixExp = /[A-Za-z%]/g;

	_gsScope._gsDefine.plugin({
		propName: "attr",
		API: 2,
		version: "0.4.0",

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			var p, start, end, suffix, i;
			if (typeof(target.setAttribute) !== "function") {
				return false;
			}
			this._target = target;
			this._proxy = {};
			this._start = {}; // we record start and end values exactly as they are in case they're strings (not numbers) - we need to be able to revert to them cleanly.
			this._end = {};
			this._suffix = {};
			for (p in value) {
				this._start[p] = this._proxy[p] = start = target.getAttribute(p) + "";
				this._end[p] = end = value[p] + "";
				this._suffix[p] = suffix = _suffixExp.test(end) ? end.replace(_numExp, "") : _suffixExp.test(start) ? start.replace(_numExp, "") : "";
				if (suffix) {
					i = end.indexOf(suffix);
					if (i !== -1) {
						end = end.substr(0, i);
					}
				}
				if(!this._addTween(this._proxy, p, parseFloat(start), end, p)) {
					this._suffix[p] = ""; //not a valid tween - perhaps something like an <img src=""> attribute.
				}
				if (end.charAt(1) === "=") {
					this._end[p] = (this._firstPT.s + this._firstPT.c) + suffix;
				}
				this._overwriteProps.push(p);
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			this._super.setRatio.call(this, ratio);
			var props = this._overwriteProps,
				i = props.length,
				lookup = (ratio === 1) ? this._end : ratio ? this._proxy : this._start,
				useSuffix = (lookup === this._proxy),
				p;
			while (--i > -1) {
				p = props[i];
				this._target.setAttribute(p, lookup[p] + (useSuffix ? this._suffix[p] : ""));
			}
		}

	});

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }