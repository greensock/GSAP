/*!
 * VERSION: 0.5.0
 * DATE: 2015-08-29
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
	
	"use strict";

	_gsScope._gsDefine.plugin({
		propName: "attr",
		API: 2,
		version: "0.5.0",

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			var p;
			if (typeof(target.setAttribute) !== "function") {
				return false;
			}
			for (p in value) {
				this._addTween(target, "setAttribute", target.getAttribute(p) + "", value[p] + "", p, false, p);
				this._overwriteProps.push(p);
			}
			return true;
		}

	});

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }