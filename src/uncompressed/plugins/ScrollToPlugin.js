/**
 * VERSION: beta 1.30
 * DATE: 2012-07-25
 * JavaScript
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Copyright (c) 2008-2012, GreenSock. All rights reserved. 
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
			_getX = function() {
				return (window.pageXOffset != null) ? window.pageXOffset : (document.documentElement.scrollLeft != null) ? document.documentElement.scrollLeft : document.body.scrollLeft;
			}, 
			_getY = function() {
				return (window.pageYOffset != null) ? window.pageYOffset : (document.documentElement.scrollTop != null) ? document.documentElement.scrollTop : document.body.scrollTop;
			},
			_setRatio = TweenPlugin.prototype.setRatio; //speed optimization (quicker lookup)
		
		p.constructor = ScrollToPlugin;
		ScrollToPlugin.API = 2;
		
		p._onInitTween = function(target, value, tween) {
			this._wdw = (target == window);
			this._target = target;
			if (typeof(value) !== "object") {
				value = {y:Number(value)}; //if we don't receive an object as the parameter, assume the user intends "y".
			}
			this.x = this._wdw ? _getX() : target.scrollLeft;
			this.y = this._wdw ? _getY() : target.scrollTop;
			if (value.x != null) {
				this._addTween(this, "x", this.x, value.x, "scrollTo_x", true);
			} else {
				this.skipX = true;
			}
			if (value.y != null) {
				this._addTween(this, "y", this.y, value.y, "scrollTo_y", true);
			} else {
				this.skipY = true;
			}
			return true;
		};
		
		p._kill = function(lookup) {
			if (lookup.scrollTo_x) {
				this.skipX = true;
			}
			if (lookup.scrollTo_x) {
				this.skipY = true;
			}
			return TweenPlugin.prototype._kill.call(this, lookup);
		}
		
		p.setRatio = function(v) {
			_setRatio.call(this, v);
			if (this._wdw) {
				window.scrollTo((!this.skipX) ? this.x : _getX(), (!this.skipY) ? this.y : _getY());
			} else {
				if (!this.skipY) {
					this._target.scrollTop = this.y;
				}
				if (!this.skipX) {
					this._target.scrollLeft = this.x;
				}
			}
		};
		
		TweenPlugin.activate([ScrollToPlugin]);
		
		return ScrollToPlugin;
		
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }