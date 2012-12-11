/**
 * VERSION: 0.51
 * DATE: 2012-11-10
 * JavaScript (also available in ActionScript 3 and 2)
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Copyright (c) 2008-2012, GreenSock. All rights reserved.
 * ThrowPropsPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://www.greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push( function() {

	_gsDefine("plugins.ThrowPropsPlugin", ["plugins.TweenPlugin", "TweenLite", "easing.Ease"], function(TweenPlugin, TweenLite, Ease) {
		
		var ThrowPropsPlugin = function(props, priority) {
				TweenPlugin.call(this, "throwProps");
				this._overwriteProps.length = 0;
			},
			_calculateChange = ThrowPropsPlugin.calculateChange = function(velocity, ease, duration, checkpoint) {
				if (checkpoint == null) {
					checkpoint = 0.05;
				}
				var e = (ease instanceof Ease) ? ease : (!ease) ? TweenLite.defaultEase : new Ease(ease);
				return (duration * checkpoint * velocity) / e.getRatio(checkpoint);
			},
			_calculateDuration = ThrowPropsPlugin.calculateDuration = function(start, end, velocity, ease, checkpoint) {
				checkpoint = checkpoint || 0.05;
				var e = (ease instanceof Ease) ? ease : (!ease) ? TweenLite.defaultEase : new Ease(ease);
				return Math.abs( (end - start) * e.getRatio(checkpoint) / velocity / checkpoint );
			},
			_calculateTweenDuration = ThrowPropsPlugin.calculateTweenDuration = function(target, vars, maxDuration, minDuration, overshootTolerance) {
				var duration = 0,
					clippedDuration = 9999999999,
					throwPropsVars = vars.throwProps || vars,
					ease = (vars.ease instanceof Ease) ? vars.ease : (!vars.ease) ? TweenLite.defaultEase : new Ease(vars.ease),
					checkpoint = isNaN(throwPropsVars.checkpoint) ? 0.05 : Number(throwPropsVars.checkpoint),
					resistance = isNaN(throwPropsVars.resistance) ? ThrowPropsPlugin.defaultResistance : Number(throwPropsVars.resistance),
					p, curProp, curDuration, curVelocity, curResistance, curVal, end, curClippedDuration;
					
				for (p in throwPropsVars) {
					
					if (p !== "resistance" && p !== "checkpoint") {
						curProp = throwPropsVars[p];
						if (typeof(curProp) === "number") {
							curVelocity = Number(curProp);
							curDuration = (curVelocity * resistance > 0) ? curVelocity / resistance : curVelocity / -resistance;
							
						} else {
							curVelocity = Number(curProp.velocity) || 0;
							curResistance = isNaN(curProp.resistance) ? resistance : Number(curProp.resistance);
							curDuration = (curVelocity * curResistance > 0) ? curVelocity / curResistance : curVelocity / -curResistance;
							curVal = (typeof(target[p]) === "function") ? target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() : target[p];
							end = curVal + _calculateChange(curVelocity, ease, curDuration, checkpoint);
							if (curProp.max != null && end > Number(curProp.max)) {
								//if the value is already exceeding the max or the velocity is too low, the duration can end up being uncomfortably long but in most situations, users want the snapping to occur relatively quickly (0.75 seconds), so we implement a cap here to make things more intuitive.
								curClippedDuration = (curVal > curProp.max || (curVelocity > -15 && curVelocity < 45)) ? 0.75 : _calculateDuration(curVal, curProp.max, curVelocity, ease, checkpoint);
								if (curClippedDuration + overshootTolerance < clippedDuration) {
									clippedDuration = curClippedDuration + overshootTolerance;
								}
								
							} else if (curProp.min != null && end < Number(curProp.min)) {
								//if the value is already exceeding the min or if the velocity is too low, the duration can end up being uncomfortably long but in most situations, users want the snapping to occur relatively quickly (0.75 seconds), so we implement a cap here to make things more intuitive.
								curClippedDuration = (curVal < curProp.min || (curVelocity > -45 && curVelocity < 15)) ? 0.75 : _calculateDuration(curVal, curProp.min, curVelocity, ease, checkpoint);
								if (curClippedDuration + overshootTolerance < clippedDuration) {
									clippedDuration = curClippedDuration + overshootTolerance;
								}
							}
							
							if (curClippedDuration > duration) {
								duration = curClippedDuration;
							}
						}
						
						if (curDuration > duration) {
							duration = curDuration;
						}
						
					}
				}
				if (duration > clippedDuration) {
					duration = clippedDuration;
				}
				if (duration > maxDuration) {
					return maxDuration;
				} else if (duration < minDuration) {
					return minDuration;
				}
				return duration;
			},
			p = ThrowPropsPlugin.prototype = new TweenPlugin("throwProps"),
			_cssProxy, _cssVars, _last, _lastValue; //these serve as a cache of sorts, recording the last css-related proxy and the throwProps vars that get calculated in the _cssRegister() method. This allows us to grab them in the ThrowPropsPlugin.to() function and calculate the duration. Of course we could have structured things in a more "clean" fashion, but performance is of paramount importance.
			
		
		p.constructor = ThrowPropsPlugin;
		ThrowPropsPlugin.API = 2;
		ThrowPropsPlugin.defaultResistance = 100;

		ThrowPropsPlugin._cssRegister = function() {
			var CSSPlugin = window.com.greensock.plugins.CSSPlugin;
			if (!CSSPlugin) {
				return;
			}
			var _internals = CSSPlugin._internals,
				_parseToProxy = _internals._parseToProxy,
				_setPluginRatio = _internals._setPluginRatio,
				CSSPropTween = _internals.CSSPropTween;
			_internals._registerComplexSpecialProp("throwProps", null, function(t, e, prop, cssp, pt, plugin) {
				plugin = new ThrowPropsPlugin();
				var velocities = {},
					min = {},
					max = {},
					res = {},
					hasResistance, val, p, data;
				_cssVars = {};
				for (p in e) {
					val = e[p];
					if (typeof(val) === "object") {
						velocities[p] = val.velocity;
						if (val.min != null) {
							min[p] = val.min;
						}
						if (val.max != null) {
							max[p] = val.max;
						}
						if (val.resistance != null) {
							hasResistance = true;
							res[p] = val.resistance;
						}
					} else {
						velocities[p] = val;
					}
				}
				data = _parseToProxy(t, velocities, cssp, pt, plugin);
				_cssProxy = data.proxy;
				velocities = data.end;
				min = _parseToProxy(t, min, cssp, pt, plugin, true).end;
				max = _parseToProxy(t, max, cssp, pt, plugin, true).end;
				if (hasResistance) {
					res = _parseToProxy(t, res, cssp, pt, plugin, true).end;
				}
				for (p in _cssProxy) {
					_cssVars[p] = {velocity:velocities[p], min:min[p], max:max[p], resistance:res[p]};
				}
				if (e.resistance != null) {
					_cssVars.resistance = e.resistance;
				}
				pt = new CSSPropTween(t, "throwProps", 0, 0, data.pt, 2);
				pt.plugin = plugin;
				pt.setRatio = _setPluginRatio;
				pt.data = data;
				plugin._onInitTween(_cssProxy, _cssVars, cssp._tween);
				return pt;
			});
		};

		
		ThrowPropsPlugin.to = function(target, vars, maxDuration, minDuration, overshootTolerance) {
			if (!vars.throwProps) {
				if (vars.css) {
					var tween = new TweenLite(target, 1, vars);
					tween.render(0, true, true); //we force a render so that the CSSPlugin instantiates and populates the _cssProxy and _cssVars which we need in order to calculate the tween duration. Remember, we can't use the regular target for calculating the duration because the current values wouldn't be able to be grabbed like target["propertyName"], as css properties can be complex like boxShadow:"10px 10px 20px 30px red" or backgroundPosition:"25px 50px". The proxy is the result of breaking all that complex data down and finding just the numeric values and assigning them to a generic proxy object with unique names. THAT is what the _calculateTweenDuration() can look at. We also needed to to the same break down of any min or max or velocity data
					tween.duration(_calculateTweenDuration(_cssProxy, _cssVars, maxDuration, minDuration, overshootTolerance));
					if (tween._delay && !tween.vars.immediateRender) {
						tween.invalidate(); //if there's a delay, the starting values could be off, so invalidate() to force reinstantiation when the tween actually starts.
					} else {
						_last._onInitTween(_cssProxy, _lastValue, tween);
					}
					return tween;
				} else {
					vars = {throwProps:vars};
				}
			}
			return new TweenLite(target, _calculateTweenDuration(target, vars, maxDuration, minDuration, overshootTolerance), vars);
		};
		
		p._onInitTween = function(target, value, tween) {
			this._target = target;
			this._props = [];
			_last = this;
			_lastValue = value;
			var ease = tween._ease,
				checkpoint = isNaN(value.checkpoint) ? 0.05 : Number(value.checkpoint),
				duration = tween._duration, 
				cnt = 0,
				p, curProp, curVal, isFunc, velocity, change1, end, change2;
			for (p in value) {
				if (p !== "resistance" && p !== "checkpoint") {
					curProp = value[p];
					if (typeof(curProp) === "number") {
						velocity = Number(curProp);
					} else if (!isNaN(curProp.velocity)) {
						velocity = Number(curProp.velocity);
					} else {
						velocity = 0;
						throw("ERROR: No velocity was defined in the throwProps tween of " + target + " property: " + p);
					}
					change1 = _calculateChange(velocity, ease, duration, checkpoint);
					change2 = 0;
					isFunc = (typeof(target[p]) === "function");
					curVal = (isFunc) ? target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() : target[p];
					if (typeof(curProp) !== "number") {
						end = curVal + change1;
						if (curProp.max != null && Number(curProp.max) < end) {
							change2 = (curProp.max - curVal) - change1;
							
						} else if (curProp.min != null && Number(curProp.min) > end) {							
							change2 = (curProp.min - curVal) - change1;
						}
					}
					this._props[cnt++] = {p:p, s:curVal, c1:change1, c2:change2, f:isFunc, r:false};
					this._overwriteProps[cnt] = p;
				}
			}
			return true;
		};
		
		p._kill = function(lookup) {
			var i = this._props.length;
			while (--i > -1) {
				if (lookup[this._props[i].p] != null) {
					this._props.splice(i, 1);
				}
			}
			return TweenPlugin.prototype._kill.call(this, lookup);
		};
		
		p._roundProps = function(lookup, value) {
			var p = this._props,
				i = p.length;
			while (--i > -1) {
				if (lookup[p[i]] || lookup.throwProps) {
					p[i].r = value;
				}
			}
		};
		
		p.setRatio = function(v) {
			var i = this._props.length, 
				cp, val;
			while (--i > -1) {
				cp = this._props[i];
				val = cp.s + cp.c1 * v + cp.c2 * v * v;
				//console.log("cp: "+this._props[i].p+": "+cp.s);
				if (cp.r) {
					val = (val + ((val > 0) ? 0.5 : -0.5)) >> 0;
				}
				if (cp.f) {
					this._target[cp.p](val);
				} else {
					this._target[cp.p] = val;
				}
			}	
		};
		
		TweenPlugin.activate([ThrowPropsPlugin]);
		
		return ThrowPropsPlugin;
		
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }