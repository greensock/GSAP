/**
 * VERSION: beta 0.1.0
 * DATE: 2013-02-28
 * JavaScript
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push( function() {

	"use strict";

	window._gsDefine.plugin({
		propName: "directionalRotation",
		API: 2,

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			if (typeof(value) !== "object") {
				value = {rotation:value};
			}
			this.finals = {};
			this._tween = tween;
			var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
				p, v, start, end, dif, split, type;
			for (p in value) {
				if (p !== "useRadians") {
					split = (value[p] + "").split("_");
					v = split[0];
					type = split[1];
					start = parseFloat( (typeof(target[p]) !== "function") ? target[p] : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() );
					end = this.finals[p] = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
					dif = end - start;
					if (type === "short") {
						dif = dif % cap;
						if (dif !== dif % (cap / 2)) {
							dif = (dif < 0) ? dif + cap : dif - cap;
						}
					} else if (type === "cw" && dif < 0) {
						dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
					} else if (type === "ccw" && dif > 0) {
						dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
					}
					this._addTween(target, p, start, start + dif, p);
					this._overwriteProps.push(p);
				}
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			var pt;
			if (ratio !== 1) {
				this._super.setRatio.call(this, ratio);
			} else {
				pt = this._firstPT;
				while (pt) {
					if (pt.f) {
						pt.t[pt.p](this.finals[pt.p]);
					} else {
						pt.t[pt.p] = this.finals[pt.p];
					}
					pt = pt._next;
				}
			}
		}

	})._autoCSS = true;

}); if (window._gsDefine) { window._gsQueue.pop()(); }