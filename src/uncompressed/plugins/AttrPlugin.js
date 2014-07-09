/*!
 * VERSION: 0.3.2
 * DATE: 2014-05-23
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue || (window._gsQueue = [])).push( function() {
	
	"use strict";

	window._gsDefine.plugin({
		propName: "attr",
		API: 2,
		version: "0.3.2",

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			var p, start, end;
			if (typeof(target.setAttribute) !== "function") {
				return false;
			}
			this._target = target;
			this._proxy = {};
			this._start = {}; // we record start and end values exactly as they are in case they're strings (not numbers) - we need to be able to revert to them cleanly.
			this._end = {};
			for (p in value) {
				this._start[p] = this._proxy[p] = start = target.getAttribute(p);
				end = this._addTween(this._proxy, p, parseFloat(start), value[p], p);
				this._end[p] = end ? end.s + end.c : value[p];
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
				p;
			while (--i > -1) {
				p = props[i];
				this._target.setAttribute(p, lookup[p] + "");
			}
		}

	});

}); if (window._gsDefine) { window._gsQueue.pop()(); }