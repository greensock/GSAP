/**
 * VERSION: beta 1.52
 * DATE: 2012-12-17
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

	_gsDefine("plugins.ScrollToPlugin", ["plugins.TweenPlugin"], function(TweenPlugin) {
		
		var ScrollToPlugin = function(props, priority) {
				TweenPlugin.call(this, "scrollTo");
				this._overwriteProps.pop();
			},
			p = ScrollToPlugin.prototype = new TweenPlugin("scrollTo"),
			_doc = document.documentElement,
			_window = window,
			_max = ScrollToPlugin.max = function(element, axis) {
				var dim = (axis === "x") ? "Width" : "Height",
					scroll = "scroll" + dim,
					client = "client" + dim,
					body = document.body;
				return (element === _window || element === _doc || element === body) ? Math.max(_doc[scroll], body[scroll]) - Math.max(_doc[client], body[client]) : element[scroll] - element["offset" + dim];
			},
			_setRatio = TweenPlugin.prototype.setRatio; //speed optimization (quicker lookup)
		
		p.constructor = ScrollToPlugin;
		ScrollToPlugin.API = 2;

		p._onInitTween = function(target, value, tween) {
			var val;
			this._wdw = (target === _window);
			this._target = target;
			this._tween = tween;
			if (typeof(value) !== "object") {
				value = {y:value}; //if we don't receive an object as the parameter, assume the user intends "y".
			}
			this._autoKill = value.autoKill;
			this.x = this.xPrev = this.getX();
			this.y = this.yPrev = this.getY();
			if (value.x != null) {
				this._addTween(this, "x", this.x, (value.x === "max") ? _max(target, "x") : value.x, "scrollTo_x", true);
			} else {
				this.skipX = true;
			}
			if (value.y != null) {
				this._addTween(this, "y", this.y, (value.y === "max") ? _max(target, "y") : value.y, "scrollTo_y", true);
			} else {
				this.skipY = true;
			}
			return true;
		};

		p.getX = function() {
			return (!this._wdw) ? this._target.scrollLeft : (_window.pageXOffset != null) ? _window.pageXOffset : (_doc.scrollLeft != null) ? _doc.scrollLeft : document.body.scrollLeft;
		};

		p.getY = function() {
			return (!this._wdw) ? this._target.scrollTop : (_window.pageYOffset != null) ? _window.pageYOffset : (_doc.scrollTop != null) ? _doc.scrollTop : document.body.scrollTop;
		};
		
		p._kill = function(lookup) {
			if (lookup.scrollTo_x) {
				this.skipX = true;
			}
			if (lookup.scrollTo_y) {
				this.skipY = true;
			}
			return TweenPlugin.prototype._kill.call(this, lookup);
		};

		p._checkAutoKill = function() {
			if (this._autoKill && this.skipX && this.skipY) {
				this._tween.kill();
			}
		};
		
		p.setRatio = function(v) {
			_setRatio.call(this, v);

			var x = (this._wdw || !this.skipX) ? this.getX() : this.xPrev,
				y = (this._wdw || !this.skipY) ? this.getY() : this.yPrev,
				yDif = y - this.yPrev,
				xDif = x - this.xPrev;

			//note: iOS has a bug that throws off the scroll by several pixels, so we need to check if it's within 7 pixels of the previous one that we set instead of just looking for an exact match.
			if (!this.skipX && (xDif > 7 || xDif < -7)) {
				this.skipX = true; //if the user scrolls separately, we should stop tweening!
				this._checkAutoKill();
			}
			if (!this.skipY && (yDif > 7 || yDif < -7)) {
				this.skipY = true; //if the user scrolls separately, we should stop tweening!
				this._checkAutoKill();
			}
			if (this._wdw) {
				_window.scrollTo((!this.skipX) ? this.x : x, (!this.skipY) ? this.y : y);
			} else {
				if (!this.skipY) {
					this._target.scrollTop = this.y;
				}
				if (!this.skipX) {
					this._target.scrollLeft = this.x;
				}
			}
			this.xPrev = this.x;
			this.yPrev = this.y;
		};
		
		TweenPlugin.activate([ScrollToPlugin]);
		
		return ScrollToPlugin;
		
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }