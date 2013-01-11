/*!
 * VERSION: beta 1.675
 * DATE: 2013-01-10
 * JavaScript (ActionScript 3 and 2 also available)
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Copyright (c) 2008-2013, GreenSock. All rights reserved. 
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
	
(window._gsQueue || (window._gsQueue = [])).push( function() {

	_gsDefine("TimelineLite", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {
		
		"use strict";
		
		var TimelineLite = function(vars) {
				SimpleTimeline.call(this, vars);
				this._labels = {};
				this.autoRemoveChildren = (this.vars.autoRemoveChildren == true);
				this.smoothChildTiming = (this.vars.smoothChildTiming == true);
				this._sortChildren = true;
				this._onUpdate = this.vars.onUpdate;
				var i = _paramProps.length,
					j, a;
				while (--i > -1) {
					if ((a = this.vars[_paramProps[i]])) {
						j = a.length;
						while (--j > -1) {
							if (a[j] === "{self}") {
								a = this.vars[_paramProps[i]] = a.concat(); //copy the array in case the user referenced the same array in multiple timelines/tweens (each {self} should be unique)
								a[j] = this;
							}
						}
					}
				}
				if (this.vars.tweens instanceof Array) {
					this.insertMultiple(this.vars.tweens, 0, this.vars.align || "normal", this.vars.stagger || 0);
				}
			},
			_paramProps = ["onStartParams","onUpdateParams","onCompleteParams","onReverseCompleteParams","onRepeatParams"],
			_blankArray = [],
			_copy = function(vars) {
				var copy = {}, p;
				for (p in vars) {
					copy[p] = vars[p];
				}
				return copy;
			},
			p = TimelineLite.prototype = new SimpleTimeline();

		TimelineLite.version = 1.675;
		p.constructor = TimelineLite;
		p.kill()._gc = false;
		
		p.to = function(target, duration, vars, offsetOrLabel, baseTimeOrLabel) {
			return this.insert( new TweenLite(target, duration, vars), this._parseTimeOrLabel(baseTimeOrLabel, offsetOrLabel, true));
		};
		
		p.from = function(target, duration, vars, offsetOrLabel, baseTimeOrLabel) {
			return this.insert( TweenLite.from(target, duration, vars), this._parseTimeOrLabel(baseTimeOrLabel, offsetOrLabel, true));
		};
		
		p.fromTo = function(target, duration, fromVars, toVars, offsetOrLabel, baseTimeOrLabel) {
			return this.insert( TweenLite.fromTo(target, duration, fromVars, toVars), this._parseTimeOrLabel(baseTimeOrLabel, offsetOrLabel, true));
		};
		
		p.staggerTo = function(targets, duration, vars, stagger, offsetOrLabel, baseTimeOrLabel, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			var tl = new TimelineLite({onComplete:onCompleteAll, onCompleteParams:onCompleteAllParams, onCompleteScope:onCompleteAllScope});
			stagger = stagger || 0;
			for (var i = 0; i < targets.length; i++) {
				if (vars.startAt != null) {
					vars.startAt = _copy(vars.startAt);
				}
				tl.insert( new TweenLite(targets[i], duration, _copy(vars)), i * stagger);
			}
			return this.insert(tl, this._parseTimeOrLabel(baseTimeOrLabel, offsetOrLabel, true));
		};
		
		p.staggerFrom = function(targets, duration, vars, stagger, offsetOrLabel, baseTimeOrLabel, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			if (vars.immediateRender == null) {
				vars.immediateRender = true;
			}
			vars.runBackwards = true;
			return this.staggerTo(targets, duration, vars, stagger, offsetOrLabel, baseTimeOrLabel, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
		
		p.staggerFromTo = function(targets, duration, fromVars, toVars, stagger, offsetOrLabel, baseTimeOrLabel, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			if (fromVars.immediateRender) {
				toVars.immediateRender = true;
			}
			return this.staggerTo(targets, duration, toVars, stagger, offsetOrLabel, baseTimeOrLabel, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
		
		p.call = function(callback, params, scope, offsetOrLabel, baseTimeOrLabel) {
			return this.insert( TweenLite.delayedCall(0, callback, params, scope), this._parseTimeOrLabel(baseTimeOrLabel, offsetOrLabel, true));
		};
		
		p.set = function(target, vars, offsetOrLabel, baseTimeOrLabel) {
			vars.immediateRender = false;
			return this.insert( new TweenLite(target, 0, vars), this._parseTimeOrLabel(baseTimeOrLabel, offsetOrLabel, true));
		};
		
		TimelineLite.exportRoot = function(vars, ignoreDelayedCalls) {
			vars = vars || {};
			if (vars.smoothChildTiming == null) {
				vars.smoothChildTiming = true;
			}
			var tl = new TimelineLite(vars),
				root = tl._timeline;
			if (ignoreDelayedCalls == null) {
				ignoreDelayedCalls = true;
			}
			root._remove(tl, true);
			tl._startTime = 0;
			tl._rawPrevTime = tl._time = tl._totalTime = root._time;
			var tween = root._first, next;
			while (tween) {
				next = tween._next;
				if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
					tl.insert(tween, tween._startTime - tween._delay);
				}
				tween = next;
			}
			root.insert(tl, 0);
			return tl;
		};
		
		p.insert = function(value, timeOrLabel) {
			if (value instanceof Animation) {
				//continue...
			} else if (value instanceof Array) {
				return this.insertMultiple(value, timeOrLabel);
			} else if (typeof(value) === "string") {
				return this.addLabel(value, this._parseTimeOrLabel(timeOrLabel || 0, 0, true));
			} else if (typeof(value) === "function") {
				value = TweenLite.delayedCall(0, value);
			} else {
				throw ("ERROR: Cannot insert() " + value + " into the TimelineLite/Max because it is neither a tween, timeline, function, nor a String.");
				return this;
			}
			
			SimpleTimeline.prototype.insert.call(this, value, this._parseTimeOrLabel(timeOrLabel || 0, 0, true, value));
			
			//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly.  
			if (this._gc) if (!this._paused) if (this._time === this._duration) if (this._time < this.duration()) {
				//in case any of the anscestors had completed but should now be enabled...
				var tl = this;
				while (tl._gc && tl._timeline) {
					if (tl._timeline.smoothChildTiming) {
						tl.totalTime(tl._totalTime, true); //also enables them
					} else {
						tl._enabled(true, false);
					}
					tl = tl._timeline;
				}
			}
			return this;
		};
		
		p.remove = function(value) {
			if (value instanceof Animation) {
				return this._remove(value, false);
			} else if (value instanceof Array) {
				var i = value.length;
				while (--i > -1) {
					this.remove(value[i]);
				}
				return this;
			} else if (typeof(value) === "string") {
				return this.removeLabel(value);
			}
			return this.kill(null, value);
		};
		
		p.append = function(value, offsetOrLabel) {
			return this.insert(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
		};
		
		p.insertMultiple = function(tweens, timeOrLabel, align, stagger) {
			align = align || "normal";
			stagger = stagger || 0;
			var i, tween, curTime = this._parseTimeOrLabel(timeOrLabel || 0, 0, true, tweens), l = tweens.length;
			for (i = 0; i < l; i++) {
				if ((tween = tweens[i]) instanceof Array) {
					tween = new TimelineLite({tweens:tween});
				}
				this.insert(tween, curTime);
				if (typeof(tween) === "string" || typeof(tween) === "function") {
					//do nothing
				} else if (align === "sequence") {
					curTime = tween._startTime + (tween.totalDuration() / tween._timeScale);
				} else if (align === "start") {
					tween._startTime -= tween.delay();
				}
				curTime += stagger;
			}
			return this._uncache(true);
		};
		
		p.appendMultiple = function(tweens, offsetOrLabel, align, stagger) {
			return this.insertMultiple(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
		};
		
		p.addLabel = function(label, time) {
			this._labels[label] = time;
			return this;
		};
	
		p.removeLabel = function(label) {
			delete this._labels[label];
			return this;
		};
		
		p.getLabelTime = function(label) {
			return (this._labels[label] != null) ? this._labels[label] : -1;
		};
		
		p._parseTimeOrLabel = function(timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
			//if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
			if (ignore instanceof Animation && ignore.timeline === this) {
				this.remove(ignore);
			} else if (ignore instanceof Array) {
				var i = ignore.length;
				while (--i > -1) {
					if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
						this.remove(ignore[i]);
					}
				}
			}
			if (typeof(offsetOrLabel) === "string") {
				return this._parseTimeOrLabel(offsetOrLabel, ((appendIfAbsent && typeof(timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - this.duration() : 0), appendIfAbsent);
			}
			offsetOrLabel = offsetOrLabel || 0;
			if (timeOrLabel == null) {
				return this.duration() + offsetOrLabel;
			} else if (typeof(timeOrLabel) === "string" && isNaN(timeOrLabel)) {
				if (this._labels[timeOrLabel] == null) {
					return (appendIfAbsent) ? (this._labels[timeOrLabel] = this.duration() + offsetOrLabel) : offsetOrLabel;
				}
				return this._labels[timeOrLabel] + offsetOrLabel;
			}
			return Number(timeOrLabel) + offsetOrLabel;
		};
		
		p.seek = function(timeOrLabel, suppressEvents) {
			return this.totalTime(this._parseTimeOrLabel(timeOrLabel), (suppressEvents != false));
		}
		
		p.stop = function() {
			return this.paused(true);
		};
	
		p.gotoAndPlay = function(timeOrLabel, suppressEvents) {
			return SimpleTimeline.prototype.play.call(this, timeOrLabel, suppressEvents);
		};
		
		p.gotoAndStop = function(timeOrLabel, suppressEvents) {
			return this.pause(timeOrLabel, suppressEvents);
		};
		
		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			this._active = !this._paused; 
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(), 
				prevTime = this._time, 
				prevStart = this._startTime, 
				prevTimeScale = this._timeScale, 
				prevPaused = this._paused,
				tween, isComplete, next, callback;
			if (time >= totalDur) {
				this._totalTime = this._time = totalDur;
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					if (this._duration === 0) if (time === 0 || this._rawPrevTime < 0) if (this._rawPrevTime !== time) { //In order to accommodate zero-duration timelines, we must discern the momentum/direction of time in order to render values properly when the "playhead" goes past 0 in the forward direction or lands directly on it, and also when it moves past it in the backward direction (from a postitive time to a negative time).
						force = true;
					}
				}
				this._rawPrevTime = time;
				time = totalDur + 0.000001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off)

			} else if (time <= 0) {
				this._totalTime = this._time = 0;
				if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._duration === 0) if (this._rawPrevTime >= 0) { //zero-duration timelines are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						force = true;
					}
				} else if (!this._initted) {
					force = true;
				}
				this._rawPrevTime = time;
				time = -0.000001; //to avoid occasional floating point rounding errors in Flash - sometimes child tweens/timelines were not being rendered at the very beginning (their progress might be 0.000000000001 instead of 0 because when Flash performed _time - tween._startTime, floating point errors would return a value that was SLIGHTLY off)
				
			} else {
				this._totalTime = this._time = this._rawPrevTime = time;
			}
			
			if (this._time === prevTime && !force) {
				return;
			} else if (!this._initted) {
				this._initted = true;
			}
			if (prevTime === 0) if (this.vars.onStart) if (this._time !== 0) if (!suppressEvents) {
				this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
			}
			
			if (this._time > prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
						
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, false);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, false);
						}
						
					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
						
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, false);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, false);
						}
						
					}
					tween = next;
				}
			}
			
			if (this._onUpdate) if (!suppressEvents) {
				this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
			}
			
			if (callback) if (!this._gc) if (prevStart === this._startTime || prevTimeScale != this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents) if (this.vars[callback]) {
					this.vars[callback].apply(this.vars[callback + "Scope"] || this, this.vars[callback + "Params"] || _blankArray);
				}
			}
		};
		
		p._hasPausedChild = function() {
			var tween = this._first;
			while (tween) {
				if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
					return true;
				}
				tween = tween._next;
			}
			return false;
		};
		
		p.getChildren = function(nested, tweens, timelines, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || -9999999999;
			var a = [], 
				tween = this._first, 
				cnt = 0;
			while (tween) {
				if (tween._startTime < ignoreBeforeTime) {
					//do nothing
				} else if (tween instanceof TweenLite) {
					if (tweens != false) {
						a[cnt++] = tween;
					}
				} else {
					if (timelines != false) {
						a[cnt++] = tween;
					}
					if (nested != false) {
						a = a.concat(tween.getChildren(true, tweens, timelines));
						cnt = a.length;
					}
				}
				tween = tween._next;
			}
			return a;
		};
		
		p.getTweensOf = function(target, nested) {
			var tweens = TweenLite.getTweensOf(target), 
				i = tweens.length, 
				a = [], 
				cnt = 0;
			while (--i > -1) {
				if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
					a[cnt++] = tweens[i];
				}
			}
			return a;
		};
		
		p._contains = function(tween) {
			var tl = tween.timeline;
			while (tl) {
				if (tl === this) {
					return true;
				}
				tl = tl.timeline;
			}
			return false;
		};
		
		p.shiftChildren = function(amount, adjustLabels, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || 0;
			var tween = this._first;
			while (tween) {
				if (tween._startTime >= ignoreBeforeTime) {
					tween._startTime += amount;
				}
				tween = tween._next;
			}
			if (adjustLabels) {
				for (var p in this._labels) {
					if (this._labels[p] >= ignoreBeforeTime) {
						this._labels[p] += amount;
					}
				}
			}
			return this._uncache(true);
		};
		
		p._kill = function(vars, target) {
			if (vars == null) if (target == null) {
				return this._enabled(false, false);
			}
			var tweens = (target == null) ? this.getChildren(true, true, false) : this.getTweensOf(target),
				i = tweens.length, 
				changed = false;
			while (--i > -1) {
				if (tweens[i]._kill(vars, target)) {
					changed = true;
				}
			}
			return changed;
		};
		
		p.clear = function(labels) {
			var tweens = this.getChildren(false, true, true),
				i = tweens.length;
			this._time = this._totalTime = 0;
			while (--i > -1) {
				tweens[i]._enabled(false, false);
			}
			if (labels != false) {
				this._labels = {};
			}
			return this._uncache(true);
		};
		
		p.invalidate = function() {
			var tween = this._first;
			while (tween) {
				tween.invalidate();
				tween = tween._next;
			}
			return this;
		};
		
		p._enabled = function(enabled, ignoreTimeline) {
			if (enabled === this._gc) {
				var tween = this._first;
				while (tween) {
					tween._enabled(enabled, true);
					tween = tween._next;
				}
			}
			return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
		};
		
		p.progress = function(value) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime(this.duration() * value, false);
		};
		
		p.duration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					this.totalDuration(); //just triggers recalculation
				}
				return this._duration;
			}
			if (this.duration() !== 0) if (value !== 0) {
				this.timeScale(this._duration / value);
			}
			return this;
		};
		
		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					var max = 0, 
						tween = this._first, 
						prevStart = -999999999999, 
						next, end;
					while (tween) {
						next = tween._next; //record it here in case the tween changes position in the sequence...
						
						if (tween._startTime < prevStart && this._sortChildren) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
							this.insert(tween, tween._startTime - tween._delay);
						} else {
							prevStart = tween._startTime;
						}
						if (tween._startTime < 0) {//children aren't allowed to have negative startTimes, so adjust here if one is found.
							max -= tween._startTime;
							this.shiftChildren(-tween._startTime, false, -9999999999);
						}
						end = tween._startTime + ((!tween._dirty ? tween._totalDuration : tween.totalDuration()) / tween._timeScale);
						if (end > max) {
							max = end;
						}
						
						tween = next;
					}
					this._duration = this._totalDuration = max;
					this._dirty = false;
				}
				return this._totalDuration;
			}
			if (this.totalDuration() !== 0) if (value !== 0) {
				this.timeScale(this._totalDuration / value);
			}
			return this;
		};
		
		p.usesFrames = function() {
			var tl = this._timeline;
			while (tl._timeline) {
				tl = tl._timeline;
			}
			return (tl === Animation._rootFramesTimeline);
		};
		
		p.rawTime = function() {
			return (this._paused || (this._totalTime !== 0 && this._totalTime !== this._totalDuration)) ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
		};
		
		return TimelineLite;
		
	}, true);


}); if (window._gsDefine) { _gsQueue.pop()(); }