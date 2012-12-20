/*!
 * VERSION: beta 1.663
 * DATE: 2012-12-20
 * JavaScript (ActionScript 3 and 2 also available)
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Copyright (c) 2008-2012, GreenSock. All rights reserved. 
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(function(window) {
	
		"use strict";
		var _namespace = function(ns) {
				var a = ns.split("."), 
					p = window, i;
				for (i = 0; i < a.length; i++) {
					p[a[i]] = p = p[a[i]] || {};
				}
				return p;
			},
			gs = _namespace("com.greensock"),
			a, i, e, e2, p, _gsInit,
			_classLookup = {},
			
			//_DepClass is for defining a dependent class. ns = namespace (leaving off "com.greensock." as that's assumed), dep = an array of namespaces that are required, def = the function that will return the class definition (this function will be passed each dependency in order as soon as they arrive), global = if true, the class is added to the global scope (window) or if requirejs is being used, it will tap into that instead.
			_DepClass = function(ns, dep, def, global) {
				this.sc = (_classLookup[ns]) ? _classLookup[ns].sc : []; //subclasses
				_classLookup[ns] = this;
				this.gsClass = null;
				this.def = def;
				var _dep = dep || [],
					_classes = [];
				this.check = function(init) {
					var i = _dep.length, cnt = 0, cur;
					while (--i > -1) {
						if ((cur = _classLookup[_dep[i]] || new _DepClass(_dep[i])).gsClass) {
							_classes[i] = cur.gsClass;
						} else {
							cnt++;
							if (init) {
								cur.sc.push(this);
							}
						}
					}
					if (cnt === 0 && def) {
						var a = ("com.greensock." + ns).split("."),
							n = a.pop(),
							cl = _namespace(a.join("."))[n] = this.gsClass = def.apply(def, _classes);
						
						//exports to multiple environments
						if (global) {
							(window.GreenSockGlobals || window)[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
							if (typeof(define) === "function" && define.amd){ //AMD
								define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").join("/"), [], function() { return cl; });
							} else if (typeof(module) !== "undefined" && module.exports){ //node
								module.exports = cl;
							}
						}
						
						for (i = 0; i < this.sc.length; i++) {
							this.sc[i].check(false);
						}
						
					}
				};
				this.check(true);
			},
			//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
			_class = gs._class = function(ns, f, g) {
				f = f || function() {};
				var c = new _DepClass(ns, [], function(){ return f; }, g);
				return f;
			};
		
		//used to create _DepClass instances (which basically registers a class that has dependencies). ns = namespace, dep = dependencies (array), f = initialization function which should return the class, g = global (whether or not the class should be added to the global namespace (or if RequireJS is used, it will be defined as a named module instead)
		window._gsDefine = function(ns, dep, f, g) {
			return new _DepClass(ns, dep, f, g);
		};
		
	

/*
 * ----------------------------------------------------------------
 * Ease
 * ----------------------------------------------------------------
 */
		var _baseParams = [0, 0, 1, 1],
			_blankArray = [],
			Ease = _class("easing.Ease", function(func, extraParams, type, power) {
				this._func = func;
				this._type = type || 0;
				this._power = power || 0;
				this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
			}, true);
		
		p = Ease.prototype;
		p._calcEnd = false;
		p.getRatio = function(p) {
			if (this._func) {
				this._params[0] = p;
				return this._func.apply(null, this._params);
			} else {
				var t = this._type, 
					pw = this._power, 
					r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
				if (pw === 1) {
					r *= r;
				} else if (pw === 2) {
					r *= r * r;
				} else if (pw === 3) {
					r *= r * r * r;
				} else if (pw === 4) {
					r *= r * r * r * r;
				}
				return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
			}
		};
		
		//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
		a = ["Linear","Quad","Cubic","Quart","Quint"];
		i = a.length;
		while(--i > -1) {
			e = _class("easing." + a[i], null, true);
			e2 = _class("easing.Power" + i, null, true);
			e.easeOut = e2.easeOut = new Ease(null, null, 1, i);
			e.easeIn = e2.easeIn = new Ease(null, null, 2, i);
			e.easeInOut = e2.easeInOut = new Ease(null, null, 3, i);
		}
		_class("easing.Strong", gs.easing.Power4, true);
		gs.easing.Linear.easeNone = gs.easing.Linear.easeIn;
	

/*
 * ----------------------------------------------------------------
 * EventDispatcher
 * ----------------------------------------------------------------
 */
		var EventDispatcher = _class("events.EventDispatcher", function(target) {
			this._listeners = {};
			this._eventTarget = target || this;
		});
		p = EventDispatcher.prototype;

		p.addEventListener = function(type, callback, scope, useParam, priority) {
			priority = priority || 0;
			var list = this._listeners[type],
				index = 0,
				listener, i;
			if (list == null) {
				this._listeners[type] = list = [];
			}
			i = list.length;
			while (--i > -1) {
				listener = list[i];
				if (listener.c === callback) {
					list.splice(i, 1);
				} else if (index === 0 && listener.pr < priority) {
					index = i + 1;
				}
			}
			list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
		};
		
		p.removeEventListener = function(type, callback) {
			var list = this._listeners[type], i;
			if (list) {
				i = list.length;
				while (--i > -1) {
					if (list[i].c === callback) {
						list.splice(i, 1);
						return;
					}
				}
			}
		};
		
		p.dispatchEvent = function(type) {
			var list = this._listeners[type];
			if (list) {
				var i = list.length,
					t = this._eventTarget,
					listener;
				while (--i > -1) {
					listener = list[i];
					if (listener.up) {
						listener.c.call(listener.s || t, {type:type, target:t});
					} else {
						listener.c.call(listener.s || t);
					}
				}
			}
		};


/*
 * ----------------------------------------------------------------
 * Ticker
 * ----------------------------------------------------------------
 */
 		var _reqAnimFrame = window.requestAnimationFrame, 
			_cancelAnimFrame = window.cancelAnimationFrame, 
			_getTime = Date.now || function() {return new Date().getTime();};
		
		//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
		a = ["ms","moz","webkit","o"];
		i = a.length;
		while (--i > -1 && !_reqAnimFrame) {
			_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
			_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
		}
		
		_class("Ticker", function(fps, useRAF) {
			var _self = this,
				_startTime = _getTime(),
				_useRAF = (useRAF !== false && _reqAnimFrame),
				_fps, _req, _id, _gap, _nextTime,
				_cancelReq = function() {
					if (_id == null) {
						return;
					}
					if (!_useRAF || !_cancelAnimFrame) {
						window.clearTimeout(_id);
					} else {
						_cancelAnimFrame(_id);
					}
					_id = null;
				},
				_tick = function(manual) {
					_self.time = (_getTime() - _startTime) / 1000;
					if (!_fps || _self.time >= _nextTime || (manual === true)) {
						_self.frame++;
						_nextTime = (_self.time > _nextTime) ? _self.time + _gap - (_self.time - _nextTime) : _self.time + _gap - 0.001;
						if (_nextTime < _self.time + 0.001) {
							_nextTime = _self.time + 0.001;
						}
						_self.dispatchEvent("tick");
					}
					if (manual !== true) {
						_id = _req(_tick);
					}
				};

			EventDispatcher.call(_self);
			this.time = this.frame = 0;
			this.tick = function() {
				_tick(true);
			};

			this.fps = function(value) {
				if (!arguments.length) {
					return _fps;
				}
				_fps = value;
				_gap = 1 / (_fps || 60);
				_nextTime = this.time + _gap;
				_req = (_fps === 0) ? function(f){} : (!_useRAF || !_reqAnimFrame) ? function(f) { return window.setTimeout( f, (((_nextTime - _self.time) * 1000 + 1) >> 0) || 1); } : _reqAnimFrame;
				_cancelReq();
				_id = _req(_tick);
			};

			this.useRAF = function(value) {
				if (!arguments.length) {
					return _useRAF;
				}
				_cancelReq();
				_useRAF = value;
				_self.fps(_fps);
			};
			_self.fps(fps);

			//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1-second timeout that automatically falls back to setTimeout() if it senses this condition.
			window.setTimeout(function() {
				if (_useRAF && !_id) {
					_self.useRAF(false);
				}
			}, 1000);
		});
		
		p = gs.Ticker.prototype = new gs.events.EventDispatcher();
		p.constructor = gs.Ticker;


/*
 * ----------------------------------------------------------------
 * Animation
 * ----------------------------------------------------------------
 */
		var Animation = _class("core.Animation", function(duration, vars) {
				this.vars = vars || {};
				this._duration = this._totalDuration = duration || 0;
				this._delay = Number(this.vars.delay) || 0;
				this._timeScale = 1;
				this._active = (this.vars.immediateRender === true);
				this.data = this.vars.data;
				this._reversed = (this.vars.reversed === true);
				
				if (!_rootTimeline) {
					return;
				}
				if (!_gsInit) {
					_ticker.tick(); //the first time an animation (tween or timeline) is created, we should refresh the time in order to avoid a gap. The Ticker's initial time that it records might be very early in the load process and the user may have loaded several other large scripts in the mean time, but we want tweens to act as though they started when the page's onload was fired. Also remember that the requestAnimationFrame likely won't be called until the first screen redraw.
					_gsInit = true;
				}

				var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
				tl.insert(this, tl._time);
				
				if (this.vars.paused) {
					this.paused(true);
				}
			}),
			_ticker = Animation.ticker = new gs.Ticker();
		
		p = Animation.prototype;
		p._dirty = p._gc = p._initted = p._paused = false;
		p._totalTime = p._time = 0;
		p._rawPrevTime = -1;
		p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
		p._paused = false;
		
		p.play = function(from, suppressEvents) {
			if (arguments.length) {
				this.seek(from, suppressEvents);
			}
			this.reversed(false);
			return this.paused(false);
		};
		
		p.pause = function(atTime, suppressEvents) {
			if (arguments.length) {
				this.seek(atTime, suppressEvents);
			}
			return this.paused(true);
		};
		
		p.resume = function(from, suppressEvents) {
			if (arguments.length) {
				this.seek(from, suppressEvents);
			}
			return this.paused(false);
		};
		
		p.seek = function(time, suppressEvents) {
			return this.totalTime(Number(time), (suppressEvents !== false));
		};
		
		p.restart = function(includeDelay, suppressEvents) {
			this.reversed(false);
			this.paused(false);
			return this.totalTime((includeDelay) ? -this._delay : 0, (suppressEvents !== false));
		};
		
		p.reverse = function(from, suppressEvents) {
			if (arguments.length) {
				this.seek((from || this.totalDuration()), suppressEvents);
			}
			this.reversed(true);
			return this.paused(false);
		};
		
		p.render = function() {
			
		};
		
		p.invalidate = function() {
			return this;
		};
		
		p._enabled = function (enabled, ignoreTimeline) {
			this._gc = !enabled; 
			this._active = (enabled && !this._paused && this._totalTime > 0 && this._totalTime < this._totalDuration);
			if (ignoreTimeline !== true) {
				if (enabled && this.timeline == null) {
					this._timeline.insert(this, this._startTime - this._delay);
				} else if (!enabled && this.timeline != null) {
					this._timeline._remove(this, true);
				}
			}
			return false;
		};
	
		
		p._kill = function(vars, target) {
			return this._enabled(false, false);
		};
		
		p.kill = function(vars, target) {
			this._kill(vars, target);
			return this;
		};
		
		p._uncache = function(includeSelf) {
			var tween = includeSelf ? this : this.timeline;
			while (tween) {
				tween._dirty = true;
				tween = tween.timeline;
			}
			return this;
		};
	
//----Animation getters/setters --------------------------------------------------------
		
		p.eventCallback = function(type, callback, params, scope) {
			if (type == null) {
				return null;
			} else if (type.substr(0,2) === "on") {
				if (arguments.length === 1) {
					return this.vars[type];
				}
				if (callback == null) {
					delete this.vars[type];
				} else {
					this.vars[type] = callback;
					this.vars[type + "Params"] = params;
					this.vars[type + "Scope"] = scope;
					if (params) {
						var i = params.length;
						while (--i > -1) {
							if (params[i] === "{self}") {
								params = this.vars[type + "Params"] = params.concat(); //copying the array avoids situations where the same array is passed to multiple tweens/timelines and {self} doesn't correctly point to each individual instance.
								params[i] = this;
							}
						}
					}
				}
				if (type === "onUpdate") {
					this._onUpdate = callback;
				}
			}
			return this;
		};
		
		p.delay = function(value) {
			if (!arguments.length) {
				return this._delay;
			}
			if (this._timeline.smoothChildTiming) {
				this.startTime( this._startTime + value - this._delay );
			}
			this._delay = value;
			return this;
		};
		
		p.duration = function(value) {
			if (!arguments.length) {
				this._dirty = false;
				return this._duration;
			}
			this._duration = this._totalDuration = value;
			this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration. 
			if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
				this.totalTime(this._totalTime * (value / this._duration), true);
			}
			return this;
		};
		
		p.totalDuration = function(value) {
			this._dirty = false;
			return (!arguments.length) ? this._totalDuration : this.duration(value);
		};
		
		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			return this.totalTime(value, suppressEvents);
		};
		
		p.totalTime = function(time, suppressEvents) {
			if (!arguments.length) {
				return this._totalTime;
			}
			if (this._timeline) {
				if (time < 0) {
					time += this.totalDuration();
				}
				if (this._timeline.smoothChildTiming) {
					if (this._dirty) {
						this.totalDuration();
					}
					if (time > this._totalDuration) {
						time = this._totalDuration;
					}
					this._startTime = (this._paused ? this._pauseTime : this._timeline._time) - ((!this._reversed ? time : this._totalDuration - time) / this._timeScale);
					if (!this._timeline._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the anscestors as dirty too, so skip the function call here.
						this._uncache(false);
					}
					if (!this._timeline._active) {
						//in case any of the anscestors had completed but should now be enabled...
						var tl = this._timeline;
						while (tl._timeline) {
							tl.totalTime(tl._totalTime, true);
							tl = tl._timeline;
						}
					}
				}
				if (this._gc) {
					this._enabled(true, false);
				}
				if (this._totalTime !== time) {
					this.render(time, suppressEvents, false);
				}
			}
			return this;
		};
		
		p.startTime = function(value) {
			if (!arguments.length) {
				return this._startTime;
			}
			if (value !== this._startTime) {
				this._startTime = value;
				if (this.timeline) if (this.timeline._sortChildren) {
					this.timeline.insert(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			return this;
		};
		
		p.timeScale = function(value) {
			if (!arguments.length) {
				return this._timeScale;
			}
			value = value || 0.000001; //can't allow zero because it'll throw the math off
			if (this._timeline && this._timeline.smoothChildTiming) {
				var t = (this._pauseTime || this._pauseTime === 0) ? this._pauseTime : this._timeline._totalTime;
				this._startTime = t - ((t - this._startTime) * this._timeScale / value);
			}
			this._timeScale = value;
			return this._uncache(false);
		};
		
		p.reversed = function(value) {
			if (!arguments.length) {
				return this._reversed;
			}
			if (value !== this._reversed) {
				this._reversed = value;
				this.totalTime(this._totalTime, true);
			}
			return this;
		};
		
		p.paused = function(value) {
			if (!arguments.length) {
				return this._paused;
			}
			if (value !== this._paused) if (this._timeline) {
				if (!value && this._timeline.smoothChildTiming) {
					this._startTime += this._timeline.rawTime() - this._pauseTime;
					this._uncache(false);
				}
				this._pauseTime = (value) ? this._timeline.rawTime() : null;
				this._paused = value;
				this._active = (!this._paused && this._totalTime > 0 && this._totalTime < this._totalDuration);
			}
			if (this._gc) if (!value) {
				this._enabled(true, false);
			}
			return this;
		};
	

/*
 * ----------------------------------------------------------------
 * SimpleTimeline
 * ----------------------------------------------------------------
 */
		var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
			Animation.call(this, 0, vars);
			this.autoRemoveChildren = this.smoothChildTiming = true;
		});
		
		p = SimpleTimeline.prototype = new Animation();
		p.constructor = SimpleTimeline;
		p.kill()._gc = false;
		p._first = p._last = null;
		p._sortChildren = false;
		
		p.insert = function(tween, time) {
			tween._startTime = Number(time || 0) + tween._delay;
			if (tween._paused) if (this !== tween._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order). 
				tween._pauseTime = tween._startTime + ((this.rawTime() - tween._startTime) / tween._timeScale);
			}
			if (tween.timeline) {
				tween.timeline._remove(tween, true); //removes from existing timeline so that it can be properly added to this one.
			}
			tween.timeline = tween._timeline = this;
			if (tween._gc) {
				tween._enabled(true, true);
			}
			
			var prevTween = this._last;
			if (this._sortChildren) {
				var st = tween._startTime;
				while (prevTween && prevTween._startTime > st) {
					prevTween = prevTween._prev;
				}
			}
			if (prevTween) {
				tween._next = prevTween._next;
				prevTween._next = tween;
			} else {
				tween._next = this._first;
				this._first = tween;
			}
			if (tween._next) {
				tween._next._prev = tween;
			} else {
				this._last = tween;
			}
			tween._prev = prevTween;
			
			if (this._timeline) {
				this._uncache(true);
			}
			return this;
		};
		
		p._remove = function(tween, skipDisable) {
			if (tween.timeline === this) {
				if (!skipDisable) {
					tween._enabled(false, true);
				}
				tween.timeline = null;
				
				if (tween._prev) {
					tween._prev._next = tween._next;
				} else if (this._first === tween) {
					this._first = tween._next;
				}
				if (tween._next) {
					tween._next._prev = tween._prev;
				} else if (this._last === tween) {
					this._last = tween._prev;
				}
				
				if (this._timeline) {
					this._uncache(true);
				}
			}
			return this;
		};
		
		p.render = function(time, suppressEvents, force) {
			var tween = this._first, 
				next;
			this._totalTime = this._time = this._rawPrevTime = time;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (tween._active || (time >= tween._startTime && !tween._paused)) {
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, false);
					} else {
						tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, false);
					}
				}
				tween = next;
			}
		};
				
		p.rawTime = function() {
			return this._totalTime;			
		};
	
	
/*
 * ----------------------------------------------------------------
 * TweenLite
 * ----------------------------------------------------------------
 */
		var TweenLite = _class("TweenLite", function(target, duration, vars) {
				Animation.call(this, duration, vars);
				
				if (target == null) {
					throw "Cannot tween an undefined reference.";
				}
				this.target = target;		
				
				this._overwrite = (this.vars.overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(this.vars.overwrite) === "number") ? this.vars.overwrite >> 0 : _overwriteLookup[this.vars.overwrite];
				
				var jq, i, targ;
				if ((target instanceof Array || target.jquery) && typeof(target[0]) === "object") { 
					this._targets = target.slice(0); //works for both jQuery and Array instances
					this._propLookup = [];
					this._siblings = [];
					for (i = 0; i < this._targets.length; i++) {
						targ = this._targets[i];
						//in case the user is passing in an array of jQuery objects, for example, we need to check one more level and pull things out if necessary...
						if (targ.jquery) { 
							this._targets.splice(i--, 1);
							this._targets = this._targets.concat(targ.constructor.makeArray(targ));
							continue;
						}
						this._siblings[i] = _register(targ, this, false);
						if (this._overwrite === 1) if (this._siblings[i].length > 1) {
							_applyOverwrite(targ, this, null, 1, this._siblings[i]);
						}
					}
					
				} else {
					this._propLookup = {};
					this._siblings = _register(target, this, false);
					if (this._overwrite === 1) if (this._siblings.length > 1) {
						_applyOverwrite(target, this, null, 1, this._siblings);
					}
				}
				
				if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
					this.render(-this._delay, false, true);
				}
			}, true);
	
		p = TweenLite.prototype = new Animation();
		p.constructor = TweenLite;
		p.kill()._gc = false;
	
//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------
	
		p.ratio = 0;
		p._firstPT = p._targets = p._overwrittenProps = null;
		p._notifyPluginsOfEnabled = false;
		
		TweenLite.version = 1.663;
		TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
		TweenLite.defaultOverwrite = "auto";
		TweenLite.ticker = _ticker;
		
		var _plugins = TweenLite._plugins = {},
			_tweenLookup = TweenLite._tweenLookup = {}, 
			_tweenLookupNum = 0,
			_reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, orientToBezier:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1},
			_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
			_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(), 
			_rootTimeline = Animation._rootTimeline = new SimpleTimeline();
			
		_rootTimeline._startTime = _ticker.time;
		_rootFramesTimeline._startTime = _ticker.frame;
		_rootTimeline._active = _rootFramesTimeline._active = true;
		
		Animation._updateRoot = function() {
				_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
				_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
				if (!(_ticker.frame % 120)) { //dump garbage every 120 frames...
					var i, a, p;
					for (p in _tweenLookup) {
						a = _tweenLookup[p].tweens;
						i = a.length;
						while (--i > -1) {
							if (a[i]._gc) {
								a.splice(i, 1);
							}
						}
						if (a.length === 0) {
							delete _tweenLookup[p];
						}
					}
				}
			};
		
		_ticker.addEventListener("tick", Animation._updateRoot);
		
		var _register = function(target, tween, scrub) {
				var id = target._gsTweenID, a, i;
				if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
					_tweenLookup[id] = {target:target, tweens:[]};
				}
				if (tween) {
					a = _tweenLookup[id].tweens;
					a[(i = a.length)] = tween;
					if (scrub) {
						while (--i > -1) {
							if (a[i] === tween) {
								a.splice(i, 1);
							}
						}
					}
				}
				return _tweenLookup[id].tweens;
			},
			
			_applyOverwrite = function(target, tween, props, mode, siblings) {
				var i, changed, curTween, l;
				if (mode === 1 || mode >= 4) {
					l = siblings.length;
					for (i = 0; i < l; i++) {
						if ((curTween = siblings[i]) !== tween) {
							if (!curTween._gc) if (curTween._enabled(false, false)) {
								changed = true;
							}
						} else if (mode === 5) {
							break;
						}
					}
					return changed;
				}
				//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
				var startTime = tween._startTime + 0.0000000001, 
					overlaps = [], 
					oCount = 0,
					zeroDur = (tween._duration === 0),
					globalStart;
				i = siblings.length;
				while (--i > -1) {
					if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
						//ignore
					} else if (curTween._timeline !== tween._timeline) {
						globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
						if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
							overlaps[oCount++] = curTween;
						}
					} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale + 0.0000000001 > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
						overlaps[oCount++] = curTween;
					}
				}
				
				i = oCount;
				while (--i > -1) {
					curTween = overlaps[i];
					if (mode === 2) if (curTween._kill(props, target)) {
						changed = true;
					}
					if (mode !== 2 || (!curTween._firstPT && curTween._initted)) { 
						if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
							changed = true;
						}
					}
				}
				return changed;
			},
			
			_checkOverlap = function(tween, reference, zeroDur) {
				var tl = tween._timeline, 
					ts = tl._timeScale, 
					t = tween._startTime;
				while (tl._timeline) {
					t += tl._startTime;
					ts *= tl._timeScale;
					if (tl._paused) {
						return -100;
					}
					tl = tl._timeline;
				}
				t /= ts;
				return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 0.0000000002)) ? 0.0000000001 : ((t = t + tween.totalDuration() / tween._timeScale / ts) > reference) ? 0 : t - reference - 0.0000000001;
			};

	
//---- TweenLite instance methods -----------------------------------------------------------------------------

		p._init = function() {
			if (this.vars.startAt) {
				this.vars.startAt.overwrite = 0;
				this.vars.startAt.immediateRender = true;
				TweenLite.to(this.target, 0, this.vars.startAt);
			}
			var i, initPlugins, pt;
			if (this.vars.ease instanceof Ease) {
				this._ease = (this.vars.easeParams instanceof Array) ? this.vars.ease.config.apply(this.vars.ease, this.vars.easeParams) : this.vars.ease;
			} else if (typeof(this.vars.ease) === "function") {
				this._ease = new Ease(this.vars.ease, this.vars.easeParams);
			} else {
				this._ease = TweenLite.defaultEase;
			}
			this._easeType = this._ease._type;
			this._easePower = this._ease._power;
			this._firstPT = null;
			
			if (this._targets) {
				i = this._targets.length;
				while (--i > -1) {
					if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (this._overwrittenProps ? this._overwrittenProps[i] : null)) ) {
						initPlugins = true;
					}
				}
			} else {
				initPlugins = this._initProps(this.target, this._propLookup, this._siblings, this._overwrittenProps);
			}
			
			if (initPlugins) {
				TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
			}
			if (this._overwrittenProps) if (this._firstPT == null) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
				this._enabled(false, false);
			}
			if (this.vars.runBackwards) {
				pt = this._firstPT;
				while (pt) {
					pt.s += pt.c;
					pt.c = -pt.c;
					pt = pt._next;
				}
			}
			this._onUpdate = this.vars.onUpdate;
			this._initted = true;
		};
		
		p._initProps = function(target, propLookup, siblings, overwrittenProps) {
			var p, i, initPlugins, plugin, a, pt, v;
			if (target == null) {
				return false;
			}
			for (p in this.vars) {
				if (_reservedProps[p]) { 
					if (p === "onStartParams" || p === "onUpdateParams" || p === "onCompleteParams" || p === "onReverseCompleteParams" || p === "onRepeatParams") if ((a = this.vars[p])) {
						i = a.length;
						while (--i > -1) {
							if (a[i] === "{self}") {
								a = this.vars[p] = a.concat(); //copy the array in case the user referenced the same array in multiple tweens/timelines (each {self} should be unique)
								a[i] = this;
							}
						}
					}
					
				} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this)) {
					
					//t - target 		[object]
					//p - property 		[string]
					//s - start			[number]
					//c - change		[number]
					//f - isFunction	[boolean]
					//n - name			[string]
					//pg - isPlugin 	[boolean]
					//pr - priority		[number]
					this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:true, n:p, pg:true, pr:plugin._priority};
					i = plugin._overwriteProps.length;
					while (--i > -1) {
						propLookup[plugin._overwriteProps[i]] = this._firstPT;
					}
					if (plugin._priority || plugin._onInitAllProps) {
						initPlugins = true;
					}
					if (plugin._onDisable || plugin._onEnable) {
						this._notifyPluginsOfEnabled = true;
					}
					
				} else {
					this._firstPT = propLookup[p] = pt = {_next:this._firstPT, t:target, p:p, f:(typeof(target[p]) === "function"), n:p, pg:false, pr:0};
					pt.s = (!pt.f) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
					v = this.vars[p];
					pt.c = (typeof(v) === "number") ? v - pt.s : (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0)+"1", 10) * Number(v.substr(2)) : Number(v) || 0; //previously, we used Number(v.split("=").join("")) but that wouldn't adequately handle a value like "+=-500" or "-=-500".
				}
				if (pt) if (pt._next) {
					pt._next._prev = pt;
				}
			}
			
			if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
				this._kill(propLookup, target);
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			return initPlugins;
		};
		
		p.render = function(time, suppressEvents, force) {
			var prevTime = this._time,
				isComplete, callback, pt;
			if (time >= this._duration) {
				this._totalTime = this._time = this._duration;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				if (!this._reversed) {
					isComplete = true;
					callback = "onComplete";
				}
				if (this._duration === 0) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (time === 0 || this._rawPrevTime < 0) if (this._rawPrevTime !== time) {
						force = true;
					}
					this._rawPrevTime = time;
				}
				
			} else if (time <= 0) {
				this._totalTime = this._time = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._duration === 0) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (this._rawPrevTime >= 0) {
							force = true;
						}
						this._rawPrevTime = time;
					}
				} else if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
				
			} else {
				this._totalTime = this._time = time;
				
				if (this._easeType) {
					var r = time / this._duration, type = this._easeType, pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}
					
					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (time / this._duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}
					
				} else {
					this.ratio = this._ease.getRatio(time / this._duration);
				}
				
			}

			if (this._time === prevTime && !force) {
				return;
			} else if (!this._initted) {
				this._init();
				if (!isComplete && this._time) { //_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
					this.ratio = this._ease.getRatio(this._time / this._duration);
				}
			}
			
			if (!this._active) if (!this._paused) {
				this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTime === 0) if (this.vars.onStart) if (this._time !== 0 || this._duration === 0) if (!suppressEvents) {
				this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || _blankArray);
			}
			
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}
			
			
			if (this._onUpdate) if (!suppressEvents) {
				this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || _blankArray);
			}
			
			if (callback) if (!this._gc) { //check _gc because there's a chance that kill() could be called in an onUpdate
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
		
		p._kill = function(vars, target) {
			if (vars === "all") {
				vars = null;
			}
			if (vars == null) if (target == null || target == this.target) {
				return this._enabled(false, false);
			}
			target = target || this._targets || this.target;
			var i, overwrittenProps, p, pt, propLookup, changed, killProps, record;
			if ((target instanceof Array || target.jquery) && typeof(target[0]) === "object") { 
				i = target.length;
				while (--i > -1) {
					if (this._kill(vars, target[i])) {
						changed = true;
					}
				}
			} else {
				if (this._targets) {
					i = this._targets.length;
					while (--i > -1) {
						if (target === this._targets[i]) {
							propLookup = this._propLookup[i] || {};
							this._overwrittenProps = this._overwrittenProps || [];
							overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
							break;
						}
					}
				} else if (target !== this.target) {
					return false;
				} else {
					propLookup = this._propLookup;
					overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
				}

				if (propLookup) {
					killProps = vars || propLookup;
					record = (vars != overwrittenProps && overwrittenProps != "all" && vars != propLookup && (vars == null || vars._tempKill != true)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
					for (p in killProps) {
						if ((pt = propLookup[p])) {
							if (pt.pg && pt.t._kill(killProps)) {
								changed = true; //some plugins need to be notified so they can perform cleanup tasks first
							}
							if (!pt.pg || pt.t._overwriteProps.length === 0) {
								if (pt._prev) {
									pt._prev._next = pt._next;
								} else if (pt === this._firstPT) {
									this._firstPT = pt._next;
								}
								if (pt._next) {
									pt._next._prev = pt._prev;
								}
								pt._next = pt._prev = null;
							}
							delete propLookup[p];
						}
						if (record) { 
							overwrittenProps[p] = 1;
						}
					}
				}
			}
			return changed;
		};
	
		p.invalidate = function() {
			if (this._notifyPluginsOfEnabled) {
				TweenLite._onPluginEvent("_onDisable", this);
			}
			this._firstPT = null;
			this._overwrittenProps = null;
			this._onUpdate = null;
			this._initted = this._active = this._notifyPluginsOfEnabled = false;
			this._propLookup = (this._targets) ? {} : [];
			return this;
		};
		
		p._enabled = function(enabled, ignoreTimeline) {
			if (enabled && this._gc) {
				if (this._targets) {
					var i = this._targets.length;
					while (--i > -1) {
						this._siblings[i] = _register(this._targets[i], this, true);
					}
				} else {
					this._siblings = _register(this.target, this, true);
				}
			}
			Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
			if (this._notifyPluginsOfEnabled) if (this._firstPT) {
				return TweenLite._onPluginEvent(((enabled) ? "_onEnable" : "_onDisable"), this);
			}
			return false;
		};
	
	
//----TweenLite static methods -----------------------------------------------------
		
		TweenLite.to = function(target, duration, vars) {
			return new TweenLite(target, duration, vars);
		};
		
		TweenLite.from = function(target, duration, vars) {
			vars.runBackwards = true;
			if (vars.immediateRender !== false) {
				vars.immediateRender = true;
			}
			return new TweenLite(target, duration, vars);
		};
		
		TweenLite.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			if (fromVars.immediateRender) {
				toVars.immediateRender = true;
			}
			return new TweenLite(target, duration, toVars);
		};
		
		TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, onCompleteScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, onReverseCompleteScope:scope, immediateRender:false, useFrames:useFrames, overwrite:0});
		};
		
		TweenLite.set = function(target, vars) {
			return new TweenLite(target, 0, vars);
		};
		
		TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, vars) {
			var a = TweenLite.getTweensOf(target), 
				i = a.length;
			while (--i > -1) {
				a[i]._kill(vars, target);
			}
		};
		
		TweenLite.getTweensOf = function(target) {
			if (target == null) { return; }
			var i, a, j, t;
			if ((target instanceof Array || target.jquery) && typeof(target[0]) === "object") { 
				i = target.length;
				a = [];
				while (--i > -1) {
					a = a.concat(TweenLite.getTweensOf(target[i]));
				}
				i = a.length;
				//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
				while (--i > -1) {
					t = a[i];
					j = i;
					while (--j > -1) {
						if (t === a[j]) {
							a.splice(i, 1);
						}
					}
				}
			} else {
				a = _register(target).concat();
				i = a.length;
				while (--i > -1) {
					if (a[i]._gc) {
						a.splice(i, 1);
					}
				}
			}
			return a;
		};
		
		
		
/*
 * ----------------------------------------------------------------
 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another <script> call before loading plugins which is easy to forget)
 * ----------------------------------------------------------------
 */
		var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
					this._overwriteProps = (props || "").split(",");
					this._propName = this._overwriteProps[0];
					this._priority = priority || 0;
				}, true);
		
		p = TweenPlugin.prototype;
		TweenPlugin.version = 12;
		TweenPlugin.API = 2;
		p._firstPT = null;		
			
		p._addTween = function(target, prop, start, end, overwriteProp, round) {
			var c, pt;
			if (end != null && (c = (typeof(end) === "number" || end.charAt(1) !== "=") ? Number(end) - start : parseInt(end.charAt(0)+"1", 10) * Number(end.substr(2)))) {
				this._firstPT = pt = {_next:this._firstPT, t:target, p:prop, s:start, c:c, f:(typeof(target[prop]) === "function"), n:overwriteProp || prop, r:round};
				if (pt._next) {
					pt._next._prev = pt;
				}
			}
		};
			
		p.setRatio = function(v) {
			var pt = this._firstPT, 
				val;
			while (pt) {
				val = pt.c * v + pt.s;
				if (pt.r) {
					val = (val + ((val > 0) ? 0.5 : -0.5)) >> 0; //about 4x faster than Math.round()
				}
				if (pt.f) {
					pt.t[pt.p](val);
				} else {
					pt.t[pt.p] = val;
				}
				pt = pt._next;
			}
		};
			
		p._kill = function(lookup) {
			if (lookup[this._propName] != null) {
				this._overwriteProps = [];
			} else {
				var i = this._overwriteProps.length;
				while (--i > -1) {
					if (lookup[this._overwriteProps[i]] != null) {
						this._overwriteProps.splice(i, 1);
					}
				}
			}
			var pt = this._firstPT;
			while (pt) {
				if (lookup[pt.n] != null) {
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
						pt._prev = null;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
					}
				}
				pt = pt._next;
			}
			return false;
		};
			
		p._roundProps = function(lookup, value) {
			var pt = this._firstPT;
			while (pt) {
				if (lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ])) { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
					pt.r = value;
				}
				pt = pt._next;
			}
		};
		
		TweenLite._onPluginEvent = function(type, tween) {
			var pt = tween._firstPT, 
				changed;
			if (type === "_onInitAllProps") {
				//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
				var pt2, first, last, next;
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				pt = tween._firstPT = first;
			}
			while (pt) {
				if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
					changed = true;
				}
				pt = pt._next;
			}
			return changed;
		};
		
		TweenPlugin.activate = function(plugins) {
			var i = plugins.length;
			while (--i > -1) {
				if (plugins[i].API === TweenPlugin.API) {
					TweenLite._plugins[(new plugins[i]())._propName] = plugins[i];
				}
			}
			return true;
		};
		
		
		
		//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you. 
		if ((a = window._gsQueue)) {
			for (i = 0; i < a.length; i++) {
				a[i]();
			}
			for (p in _classLookup) {
				if (!_classLookup[p].def) {
					console.log("Warning: TweenLite encountered missing dependency: com.greensock."+p);
				}
			}
		}
		
	
})(window);