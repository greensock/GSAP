/*!
 * VERSION: 0.1.0
 * DATE: 2014-02-20
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
		propName: "endArray",
		API: 2,
		version: "0.1.0",

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			var i = value.length,
				a = this.a = [],
				start, end;
			this.target = target;
			this._round = false;
			if (!i) {
				return false;
			}
			while (--i > -1) {
				start = target[i];
				end = value[i];
				if (start !== end) {
					a.push({i:i, s:start, c:end - start});
				}
			}
			return true;
		},

		round: function(lookup) {
			if ("endArray" in lookup) {
				this._round = true;
			}
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			var target = this.target,
				a = this.a,
				i = a.length,
				e, val;
			if (this._round) {
				while (--i > -1) {
					e = a[i];
					val = e.s + e.c * ratio;
					target[e.i] = (val + ((val > 0) ? 0.5 : -0.5)) | 0; //about 4x faster than Math.round();
				}
			} else {
				while (--i > -1) {
					e = a[i];
					val = e.s + e.c * ratio;
					target[e.i] = (val < 0.000001 && val > -0.000001) ? 0 : val;
				}
			}
		}

	});

}); if (window._gsDefine) { window._gsQueue.pop()(); }