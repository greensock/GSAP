/*!
 * GSAP 3.4.2
 * https://greensock.com
 *
 * @license Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
/* eslint-disable */

let _config = {
		autoSleep: 120,
		force3D: "auto",
		nullTargetWarn: 1,
		units: {lineHeight:""}
	},
	_defaults = {
		duration: .5,
		overwrite: false,
		delay: 0
	},
	_bigNum = 1e8,
	_tinyNum = 1 / _bigNum,
	_2PI = Math.PI * 2,
	_HALF_PI = _2PI / 4,
	_gsID = 0,
	_sqrt = Math.sqrt,
	_cos = Math.cos,
	_sin = Math.sin,
	_isString = value => typeof(value) === "string",
	_isFunction = value => typeof(value) === "function",
	_isNumber = value => typeof(value) === "number",
	_isUndefined = value => typeof(value) === "undefined",
	_isObject = value => typeof(value) === "object",
	_isNotFalse = value => value !== false,
	_windowExists = () => typeof(window) !== "undefined",
	_isFuncOrString = value => _isFunction(value) || _isString(value),
	_isArray = Array.isArray,
	_strictNumExp = /(?:-?\.?\d|\.)+/gi, //only numbers (including negatives and decimals) but NOT relative values.
	_numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-\+]*\d*/g, //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
	_numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
	_complexStringNumExp = /[-+=.]*\d+(?:\.|e-|e)*\d*/gi, //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
	_parenthesesExp = /\(([^()]+)\)/i, //finds the string between parentheses.
	_relExp = /[+-]=-?[\.\d]+/,
	_delimitedValueExp = /[#\-+.]*\b[a-z\d-=+%.]+/gi,
	_globalTimeline, _win, _coreInitted, _doc,
	_globals = {},
	_installScope = {},
	_coreReady,
	_install = scope => (_installScope = _merge(scope, _globals)) && gsap,
	_missingPlugin = (property, value) => console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()"),
	_warn = (message, suppress) => !suppress && console.warn(message),
	_addGlobal = (name, obj) => (name && (_globals[name] = obj) && (_installScope && (_installScope[name] = obj))) || _globals,
	_emptyFunc = () => 0,
	_reservedProps = {},
	_lazyTweens = [],
	_lazyLookup = {},
	_lastRenderedFrame,
	_plugins = {},
	_effects = {},
	_nextGCFrame = 30,
	_harnessPlugins = [],
	_callbackNames = "",
	_harness = targets => {
		let target = targets[0],
			harnessPlugin, i;
		if (!_isObject(target) && !_isFunction(target)) {
			targets = [targets];
		}
		if (!(harnessPlugin = (target._gsap || {}).harness)) {
			i = _harnessPlugins.length;
			while (i-- && !_harnessPlugins[i].targetTest(target)) {	}
			harnessPlugin = _harnessPlugins[i];
		}
		i = targets.length;
		while (i--) {
			(targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin)))) || targets.splice(i, 1);
		}
		return targets;
	},
	_getCache = target => target._gsap || _harness(toArray(target))[0]._gsap,
	_getProperty = (target, property) => {
		let currentValue = target[property];
		return _isFunction(currentValue) ? target[property]() : (_isUndefined(currentValue) && target.getAttribute(property)) || currentValue;
	},
	_forEachName = (names, func) => ((names = names.split(",")).forEach(func)) || names, //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
	_round = value => Math.round(value * 100000) / 100000 || 0,
	_arrayContainsAny = (toSearch, toFind) => { //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
		let l = toFind.length,
			i = 0;
		for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) { }
		return (i < l);
	},
	_parseVars = (params, type, parent) => { //reads the arguments passed to one of the key methods and figures out if the user is defining things with the OLD/legacy syntax where the duration is the 2nd parameter, and then it adjusts things accordingly and spits back the corrected vars object (with the duration added if necessary, as well as runBackwards or startAt or immediateRender). type 0 = to()/staggerTo(), 1 = from()/staggerFrom(), 2 = fromTo()/staggerFromTo()
		let isLegacy = _isNumber(params[1]),
			varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
			vars = params[varsIndex],
			irVars;
		if (isLegacy) {
			vars.duration = params[1];
		}
		vars.parent = parent;
		if (type) {
			irVars = vars;
			while (parent && !("immediateRender" in irVars)) { // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
				irVars = parent.vars.defaults || {};
				parent = _isNotFalse(parent.vars.inherit) && parent.parent;
			}
			vars.immediateRender = _isNotFalse(irVars.immediateRender);
			if (type < 2) {
				vars.runBackwards = 1;
			} else {
				vars.startAt = params[varsIndex - 1]; // "from" vars
			}
		}
		return vars;
	},
	_lazyRender = () => {
		let l = _lazyTweens.length,
			a = _lazyTweens.slice(0),
			i, tween;
		_lazyLookup = {};
		_lazyTweens.length = 0;
		for (i = 0; i < l; i++) {
			tween = a[i];
			tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
		}
	},
	_lazySafeRender = (animation, time, suppressEvents, force) => {
		_lazyTweens.length && _lazyRender();
		animation.render(time, suppressEvents, force);
		_lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
	},
	_numericIfPossible = value => {
		let n = parseFloat(value);
		return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : value;
	},
	_passThrough = p => p,
	_setDefaults = (obj, defaults) => {
		for (let p in defaults) {
			(p in obj) || (obj[p] = defaults[p]);
		}
		return obj;
	},
	_setKeyframeDefaults = (obj, defaults) => {
		for (let p in defaults) {
			if (!(p in obj) && p !== "duration" && p !== "ease") {
				obj[p] = defaults[p];
			}
		}
	},
	_merge = (base, toMerge) => {
		for (let p in toMerge) {
			base[p] = toMerge[p];
		}
		return base;
	},
	_mergeDeep = (base, toMerge) => {
		for (let p in toMerge) {
			base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p];
		}
		return base;
	},
	_copyExcluding = (obj, excluding) => {
		let copy = {},
			p;
		for (p in obj) {
			(p in excluding) || (copy[p] = obj[p]);
		}
		return copy;
	},
	_inheritDefaults = vars => {
		let parent = vars.parent || _globalTimeline,
			func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;
		if (_isNotFalse(vars.inherit)) {
			while (parent) {
				func(vars, parent.vars.defaults);
				parent = parent.parent || parent._dp;
			}
		}
		return vars;
	},
	_arraysMatch = (a1, a2) => {
		let i = a1.length,
			match = i === a2.length;
		while (match && i-- && a1[i] === a2[i]) { }
		return i < 0;
	},
	_addLinkedListItem = (parent, child, firstProp = "_first", lastProp = "_last", sortBy) => {
		let prev = parent[lastProp],
			t;
		if (sortBy) {
			t = child[sortBy];
			while (prev && prev[sortBy] > t) {
				prev = prev._prev;
			}
		}
		if (prev) {
			child._next = prev._next;
			prev._next = child;
		} else {
			child._next = parent[firstProp];
			parent[firstProp] = child;
		}
		if (child._next) {
			child._next._prev = child;
		} else {
			parent[lastProp] = child;
		}
		child._prev = prev;
		child.parent = child._dp = parent;
		return child;
	},
	_removeLinkedListItem = (parent, child, firstProp = "_first", lastProp = "_last") => {
		let prev = child._prev,
			next = child._next;
		if (prev) {
			prev._next = next;
		} else if (parent[firstProp] === child) {
			parent[firstProp] = next;
		}
		if (next) {
			next._prev = prev;
		} else if (parent[lastProp] === child) {
			parent[lastProp] = prev;
		}
		child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
	},
	_removeFromParent = (child, onlyIfParentHasAutoRemove) => {
		child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove(child);
		child._act = 0;
	},
	_uncache = animation => {
		let a = animation;
		while (a) {
			a._dirty = 1;
			a = a.parent;
		}
		return animation;
	},
	_recacheAncestors = animation => {
		let parent = animation.parent;
		while (parent && parent.parent) { //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
			parent._dirty = 1;
			parent.totalDuration();
			parent = parent.parent;
		}
		return animation;
	},
	_hasNoPausedAncestors = animation => !animation || (animation._ts && _hasNoPausedAncestors(animation.parent)),
	_elapsedCycleDuration = animation => animation._repeat ? _animationCycle(animation._tTime, (animation = animation.duration() + animation._rDelay)) * animation : 0,
	// feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
	_animationCycle = (tTime, cycleDuration) => (tTime /= cycleDuration) && (~~tTime === tTime) ? ~~tTime - 1 : ~~tTime,
	_parentToChildTotalTime = (parentTime, child) => (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : (child._dirty ? child.totalDuration() : child._tDur)),
	_setEnd = animation => (animation._end = _round(animation._start + ((animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum)) || 0))),
	_alignPlayhead = (animation, totalTime) => { // adjusts the animation's _start and _end according to the provided totalTime (only if the parent's smoothChildTiming is true and the animation isn't paused). It doesn't do any rendering or forcing things back into parent timelines, etc. - that's what totalTime() is for.
		let parent = animation._dp;
		if (parent && parent.smoothChildTiming && animation._ts) {
			animation._start = _round(animation._dp._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
			_setEnd(animation);
			parent._dirty || _uncache(parent); //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
		}
		return animation;
	},
	/*
	_totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
		let cycleDuration = duration + repeatDelay,
			time = _round(clampedTotalTime % cycleDuration);
		if (time > duration) {
			time = duration;
		}
		return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
	},
	*/
	_postAddChecks = (timeline, child) => {
		let t;
		if (child._time || (child._initted && !child._dur)) { //in case, for example, the _start is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
			t = _parentToChildTotalTime(timeline.rawTime(), child);
			if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
				child.render(t, true);
			}
		}
		//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
		if (_uncache(timeline)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
			//in case any of the ancestors had completed but should now be enabled...
			if (timeline._dur < timeline.duration()) {
				t = timeline;
				while (t._dp) {
					(t.rawTime() >= 0) && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.
					t = t._dp;
				}
			}
			timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
		}
	},
	_addToTimeline = (timeline, child, position, skipChecks) => {
		child.parent && _removeFromParent(child);
		child._start = _round(position + child._delay);
		child._end = _round(child._start + ((child.totalDuration() / Math.abs(child.timeScale())) || 0));
		_addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
		timeline._recent = child;
		skipChecks || _postAddChecks(timeline, child);
		return timeline;
	},
	_scrollTrigger = (animation, trigger) => (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation),
	_attemptInitTween = (tween, totalTime, force, suppressEvents) => {
		_initTween(tween, totalTime);
		if (!tween._initted) {
			return 1;
		}
		if (!force && tween._pt && ((tween._dur && tween.vars.lazy !== false) || (!tween._dur && tween.vars.lazy)) && _lastRenderedFrame !== _ticker.frame) {
			_lazyTweens.push(tween);
			tween._lazy = [totalTime, suppressEvents];
			return 1;
		}
	},
	_renderZeroDurationTween = (tween, totalTime, suppressEvents, force) => {
		let prevRatio = tween.ratio,
			ratio = totalTime < 0 || (!totalTime && (prevRatio && !tween._start && tween._zTime > _tinyNum && !tween._dp._lock) || (tween._ts < 0 || tween._dp._ts < 0)) ? 0 : 1, // check parent's _lock because when a timeline repeats/yoyos and does its artificial wrapping, we shouldn't force the ratio back to 0. Also, if the tween or its parent is reversed and the totalTime is 0, we should go to a ratio of 0.
			repeatDelay = tween._rDelay,
			tTime = 0,
			pt, iteration, prevIteration;
		if (repeatDelay && tween._repeat) { // in case there's a zero-duration tween that has a repeat with a repeatDelay
			tTime = _clamp(0, tween._tDur, totalTime);
			iteration = _animationCycle(tTime, repeatDelay);
			prevIteration = _animationCycle(tween._tTime, repeatDelay);
			if (iteration !== prevIteration) {
				prevRatio = 1 - ratio;
				tween.vars.repeatRefresh && tween._initted && tween.invalidate();
			}
		}
		if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) { // if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
			return;
		}
		if (ratio !== prevRatio || force || tween._zTime === _tinyNum || (!totalTime && tween._zTime)) {
			prevIteration = tween._zTime;
			tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); // when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.
			suppressEvents || (suppressEvents = totalTime && !prevIteration); // if it was rendered previously at exactly 0 (_zTime) and now the playhead is moving away, DON'T fire callbacks otherwise they'll seem like duplicates.
			tween.ratio = ratio;
			tween._from && (ratio = 1 - ratio);
			tween._time = 0;
			tween._tTime = tTime;
			suppressEvents || _callback(tween, "onStart");
			pt = tween._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}
			tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true);
			tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
			tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
			if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
				ratio && _removeFromParent(tween, 1);
				if (!suppressEvents) {
					_callback(tween, (ratio ? "onComplete" : "onReverseComplete"), true);
					tween._prom && tween._prom();
				}
			}
		} else if (!tween._zTime) {
			tween._zTime = totalTime;
		}
	},
	_findNextPauseTween = (animation, prevTime, time) => {
		let child;
		if (time > prevTime) {
			child = animation._first;
			while (child && child._start <= time) {
				if (!child._dur && child.data === "isPause" && child._start > prevTime) {
					return child;
				}
				child = child._next;
			}
		} else {
			child = animation._last;
			while (child && child._start >= time) {
				if (!child._dur && child.data === "isPause" && child._start < prevTime) {
					return child;
				}
				child = child._prev;
			}
		}
	},
	_setDuration = (animation, duration, skipUncache) => {
		let repeat = animation._repeat,
			dur = _round(duration) || 0;
		animation._dur = dur;
		animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _round(dur * (repeat + 1) + (animation._rDelay * repeat));
		if (animation._time > dur) {
			animation._time = dur;
			animation._tTime = Math.min(animation._tTime, animation._tDur);
		}
		!skipUncache && _uncache(animation.parent);
		animation.parent && _setEnd(animation);
		return animation;
	},
	_onUpdateTotalDuration = animation => (animation instanceof Timeline) ? _uncache(animation) : _setDuration(animation, animation._dur),
	_zeroPosition = {_start:0, endTime:_emptyFunc},
	_parsePosition = (animation, position) => {
		let labels = animation.labels,
			recent = animation._recent || _zeroPosition,
			clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur, //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
			i, offset;
		if (_isString(position) && (isNaN(position) || (position in labels))) { //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
			i = position.charAt(0);
			if (i === "<" || i === ">") {
				return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
			}
			i = position.indexOf("=");
			if (i < 0) {
				(position in labels) || (labels[position] = clippedDuration);
				return labels[position];
			}
			offset = +(position.charAt(i-1) + position.substr(i+1));
			return (i > 1) ? _parsePosition(animation, position.substr(0, i-1)) + offset : clippedDuration + offset;
		}
		return (position == null) ? clippedDuration : +position;
	},
	_conditionalReturn = (value, func) => value || value === 0 ? func(value) : func,
	_clamp = (min, max, value) => value < min ? min : value > max ? max : value,
	getUnit = value => (value + "").substr((parseFloat(value) + "").length),
	clamp = (min, max, value) => _conditionalReturn(value, v => _clamp(min, max, v)),
	_slice = [].slice,
	_isArrayLike = (value, nonEmpty) => value && (_isObject(value) && "length" in value && ((!nonEmpty && !value.length) || ((value.length - 1) in value && _isObject(value[0]))) && !value.nodeType && value !== _win),
	_flatten = (ar, leaveStrings, accumulator = []) => ar.forEach(value => (_isString(value) && !leaveStrings) || _isArrayLike(value, 1) ? accumulator.push(...toArray(value)) : accumulator.push(value)) || accumulator,
	//takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
	toArray = (value, leaveStrings) => _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [],
	shuffle = a => a.sort(() => .5 - Math.random()), // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = Math.floor(Math.random() * i), v = a[--i], a[i] = a[j], a[j] = v); return a;
	//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
	distribute = v => {
		if (_isFunction(v)) {
			return v;
		}
		let vars = _isObject(v) ? v : {each:v}, //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
			ease = _parseEase(vars.ease),
			from = vars.from || 0,
			base = parseFloat(vars.base) || 0,
			cache = {},
			isDecimal = (from > 0 && from < 1),
			ratios = isNaN(from) || isDecimal,
			axis = vars.axis,
			ratioX = from,
			ratioY = from;
		if (_isString(from)) {
			ratioX = ratioY = {center:.5, edges:.5, end:1}[from] || 0;
		} else if (!isDecimal && ratios) {
			ratioX = from[0];
			ratioY = from[1];
		}
		return (i, target, a) => {
			let l = (a || vars).length,
				distances = cache[l],
				originX, originY, x, y, d, j, max, min, wrapAt;
			if (!distances) {
				wrapAt = (vars.grid === "auto") ? 0 : (vars.grid || [1, _bigNum])[1];
				if (!wrapAt) {
					max = -_bigNum;
					while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) { }
					wrapAt--;
				}
				distances = cache[l] = [];
				originX = ratios ? (Math.min(wrapAt, l) * ratioX) - .5 : from % wrapAt;
				originY = ratios ? l * ratioY / wrapAt - .5 : (from / wrapAt) | 0;
				max = 0;
				min = _bigNum;
				for (j = 0; j < l; j++) {
					x = (j % wrapAt) - originX;
					y = originY - ((j / wrapAt) | 0);
					distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs((axis === "y") ? y : x);
					(d > max) && (max = d);
					(d < min) && (min = d);
				}
				(from === "random") && shuffle(distances);
				distances.max = max - min;
				distances.min = min;
				distances.v = l = (parseFloat(vars.amount) || (parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt)) || 0) * (from === "edges" ? -1 : 1);
				distances.b = (l < 0) ? base - l : base;
				distances.u = getUnit(vars.amount || vars.each) || 0; //unit
				ease = (ease && l < 0) ? _invertEase(ease) : ease;
			}
			l = ((distances[i] - distances.min) / distances.max) || 0;
			return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
		};
	},
	_roundModifier = v => { //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
		let p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1; //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed()
		return raw => Math.floor(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw));
	},
	snap = (snapTo, value) => {
		let isArray = _isArray(snapTo),
			radius, is2D;
		if (!isArray && _isObject(snapTo)) {
			radius = isArray = snapTo.radius || _bigNum;
			if (snapTo.values) {
				snapTo = toArray(snapTo.values);
				if ((is2D = !_isNumber(snapTo[0]))) {
					radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
				}
			} else {
				snapTo = _roundModifier(snapTo.increment);
			}
		}
		return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? raw => {is2D = snapTo(raw); return Math.abs(is2D - raw) <= radius ? is2D : raw; } : raw => {
			let x = parseFloat(is2D ? raw.x : raw),
				y = parseFloat(is2D ? raw.y : 0),
				min = _bigNum,
				closest = 0,
				i = snapTo.length,
				dx, dy;
			while (i--) {
				if (is2D) {
					dx = snapTo[i].x - x;
					dy = snapTo[i].y - y;
					dx = dx * dx + dy * dy;
				} else {
					dx = Math.abs(snapTo[i] - x);
				}
				if (dx < min) {
					min = dx;
					closest = i;
				}
			}
			closest = (!radius || min <= radius) ? snapTo[closest] : raw;
			return (is2D || closest === raw || _isNumber(raw)) ? closest : closest + getUnit(raw);
		});
	},
	random = (min, max, roundingIncrement, returnFunction) => _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, () => _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? 10 ** ((roundingIncrement + "").length - 2) : 1) && (Math.floor(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction)),
	pipe = (...functions) => value => functions.reduce((v, f) => f(v), value),
	unitize = (func, unit) => value => func(parseFloat(value)) + (unit || getUnit(value)),
	normalize = (min, max, value) => mapRange(min, max, 0, 1, value),
	_wrapArray = (a, wrapper, value) => _conditionalReturn(value, index => a[~~wrapper(index)]),
	wrap = function(min, max, value) { // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
		let range = max - min;
		return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, value => ((range + (value - min) % range) % range) + min);
	},
	wrapYoyo = (min, max, value) => {
		let range = max - min,
			total = range * 2;
		return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, value => {
			value = (total + (value - min) % total) % total || 0;
			return min + ((value > range) ? (total - value) : value);
		});
	},
	_replaceRandom = value => { //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
		let prev = 0,
			s = "",
			i, nums, end, isArray;
		while (~(i = value.indexOf("random(", prev))) {
			end = value.indexOf(")", i);
			isArray = value.charAt(i + 7) === "[";
			nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
			s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], +nums[1], +nums[2] || 1e-5);
			prev = end + 1;
		}
		return s + value.substr(prev, value.length - prev);
	},
	mapRange = (inMin, inMax, outMin, outMax, value) => {
		let inRange = inMax - inMin,
			outRange = outMax - outMin;
		return _conditionalReturn(value, value => outMin + ((((value - inMin) / inRange) * outRange) || 0));
	},
	interpolate = (start, end, progress, mutate) => {
		let func = isNaN(start + end) ? 0 : p => (1 - p) * start + p * end;
		if (!func) {
			let isString = _isString(start),
				master = {},
				p, i, interpolators, l, il;
			progress === true && (mutate = 1) && (progress = null);
			if (isString) {
				start = {p: start};
				end = {p: end};

			} else if (_isArray(start) && !_isArray(end)) {
				interpolators = [];
				l = start.length;
				il = l - 2;
				for (i = 1; i < l; i++) {
					interpolators.push(interpolate(start[i-1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
				}
				l--;
				func = p => {
					p *= l;
					let i = Math.min(il, ~~p);
					return interpolators[i](p - i);
				};
				progress = end;
			} else if (!mutate) {
				start = _merge(_isArray(start) ? [] : {}, start);
			}
			if (!interpolators) {
				for (p in end) {
					_addPropTween.call(master, start, p, "get", end[p]);
				}
				func = p => _renderPropTweens(p, master) || (isString ? start.p : start);
			}
		}
		return _conditionalReturn(progress, func);
	},
	_getLabelInDirection = (timeline, fromTime, backward) => { //used for nextLabel() and previousLabel()
		let labels = timeline.labels,
			min = _bigNum,
			p, distance, label;
		for (p in labels) {
			distance = labels[p] - fromTime;
			if ((distance < 0) === !!backward && distance && min > (distance = Math.abs(distance))) {
				label = p;
				min = distance;
			}
		}
		return label;
	},
	_callback = (animation, type, executeLazyFirst) => {
		let v = animation.vars,
			callback = v[type],
			params, scope;
		if (!callback) {
			return;
		}
		params = v[type + "Params"];
		scope = v.callbackScope || animation;
		executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
		return params ? callback.apply(scope, params) : callback.call(scope);
	},
	_interrupt = animation => {
		_removeFromParent(animation);
		if (animation.progress() < 1) {
			_callback(animation, "onInterrupt");
		}
		return animation;
	},
	_quickTween,
	_createPlugin = config => {
		config = !config.name && config.default || config; //UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.
		let name = config.name,
			isFunc = _isFunction(config),
			Plugin = (name && !isFunc && config.init) ? function() { this._props = []; } : config, //in case someone passes in an object that's not a plugin, like CustomEase
			instanceDefaults = {init:_emptyFunc, render:_renderPropTweens, add:_addPropTween, kill:_killPropTweensOf, modifier:_addPluginModifier, rawVars:0},
			statics = {targetTest:0, get:0, getSetter:_getSetter, aliases:{}, register:0};
		_wake();
		if (config !== Plugin) {
			if (_plugins[name]) {
				return;
			}
			_setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics)); //static methods
			_merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods
			_plugins[(Plugin.prop = name)] = Plugin;
			if (config.targetTest) {
				_harnessPlugins.push(Plugin);
				_reservedProps[name] = 1;
			}
			name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
		}
		_addGlobal(name, Plugin);
		if (config.register) {
			config.register(gsap, Plugin, PropTween);
		}
	},
















/*
 * --------------------------------------------------------------------------------------
 * COLORS
 * --------------------------------------------------------------------------------------
 */

	_255 = 255,
	_colorLookup = {
		aqua:[0,_255,_255],
		lime:[0,_255,0],
		silver:[192,192,192],
		black:[0,0,0],
		maroon:[128,0,0],
		teal:[0,128,128],
		blue:[0,0,_255],
		navy:[0,0,128],
		white:[_255,_255,_255],
		olive:[128,128,0],
		yellow:[_255,_255,0],
		orange:[_255,165,0],
		gray:[128,128,128],
		purple:[128,0,128],
		green:[0,128,0],
		red:[_255,0,0],
		pink:[_255,192,203],
		cyan:[0,_255,_255],
		transparent:[_255,_255,_255,0]
	},
	_hue = (h, m1, m2) => {
		h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
		return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < .5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255) + .5) | 0;
	},
	splitColor = (v, toHSL, forceAlpha) => {
		let a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, (v >> 8) & _255, v & _255] : 0,
			r, g, b, h, s, l, max, min, d, wasHSL;
		if (!a) {
			if (v.substr(-1) === ",") { //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
				v = v.substr(0, v.length - 1);
			}
			if (_colorLookup[v]) {
				a = _colorLookup[v];
			} else if (v.charAt(0) === "#") {
				if (v.length === 4) { //for shorthand like #9F0
					r = v.charAt(1);
					g = v.charAt(2);
					b = v.charAt(3);
					v = "#" + r + r + g + g + b + b;
				}
				v = parseInt(v.substr(1), 16);
				a = [v >> 16, (v >> 8) & _255, v & _255];
			} else if (v.substr(0, 3) === "hsl") {
				a = wasHSL = v.match(_strictNumExp);
				if (!toHSL) {
					h = (+a[0] % 360) / 360;
					s = +a[1] / 100;
					l = +a[2] / 100;
					g = (l <= .5) ? l * (s + 1) : l + s - l * s;
					r = l * 2 - g;
					if (a.length > 3) {
						a[3] *= 1; //cast as number
					}
					a[0] = _hue(h + 1 / 3, r, g);
					a[1] = _hue(h, r, g);
					a[2] = _hue(h - 1 / 3, r, g);
				} else if (~v.indexOf("=")) { //if relative values are found, just return the raw strings with the relative prefixes in place.
					a = v.match(_numExp);
					forceAlpha && a.length < 4 && (a[3] = 1);
					return a;
				}
			} else {
				a = v.match(_strictNumExp) || _colorLookup.transparent;
			}
			a = a.map(Number);
		}
		if (toHSL && !wasHSL) {
			r = a[0] / _255;
			g = a[1] / _255;
			b = a[2] / _255;
			max = Math.max(r, g, b);
			min = Math.min(r, g, b);
			l = (max + min) / 2;
			if (max === min) {
				h = s = 0;
			} else {
				d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				h = (max === r) ? (g - b) / d + (g < b ? 6 : 0) : (max === g) ? (b - r) / d + 2 : (r - g) / d + 4;
				h *= 60;
			}
			a[0] = ~~(h + .5);
			a[1] = ~~(s * 100 + .5);
			a[2] = ~~(l * 100 + .5);
		}
		forceAlpha && a.length < 4 && (a[3] = 1);
		return a;
	},
	_colorOrderData = v => { // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
		let values = [],
			c = [],
			i = -1;
		v.split(_colorExp).forEach(v => {
			let a = v.match(_numWithUnitExp) || [];
			values.push(...a);
			c.push(i += a.length + 1);
		});
		values.c = c;
		return values;
	},
	_formatColors = (s, toHSL, orderMatchData) => {
		let result = "",
			colors = (s + result).match(_colorExp),
			type = toHSL ? "hsla(" : "rgba(",
			i = 0,
			c, shell, d, l;
		if (!colors) {
			return s;
		}
		colors = colors.map(color => (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")");
		if (orderMatchData) {
			d = _colorOrderData(s);
			c = orderMatchData.c;
			if (c.join(result) !== d.c.join(result)) {
				shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
				l = shell.length - 1;
				for (; i < l; i++) {
					result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
				}
			}
		}
		if (!shell) {
			shell = s.split(_colorExp);
			l = shell.length - 1;
			for (; i < l; i++) {
				result += shell[i] + colors[i];
			}
		}
		return result + shell[l];
	},
	_colorExp = (function() {
		let s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b", //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
			p;
		for (p in _colorLookup) {
			s += "|" + p + "\\b";
		}
		return new RegExp(s + ")", "gi");
	})(),
	_hslExp = /hsl[a]?\(/,
	_colorStringFilter = a => {
		let combined = a.join(" "),
			toHSL;
		_colorExp.lastIndex = 0;
		if (_colorExp.test(combined)) {
			toHSL = _hslExp.test(combined);
			a[1] = _formatColors(a[1], toHSL);
			a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.
			return true;
		}
	},
















/*
 * --------------------------------------------------------------------------------------
 * TICKER
 * --------------------------------------------------------------------------------------
 */
	_tickerActive,
	_ticker = (function() {
		let _getTime = Date.now,
			_lagThreshold = 500,
			_adjustedLag = 33,
			_startTime = _getTime(),
			_lastUpdate = _startTime,
			_gap = 1 / 240,
			_nextTime = _gap,
			_listeners = [],
			_id, _req, _raf, _self,
			_tick = v => {
				let elapsed = _getTime() - _lastUpdate,
					manual = (v === true),
					overlap, dispatch;
				if (elapsed > _lagThreshold) {
					_startTime += elapsed - _adjustedLag;
				}
				_lastUpdate += elapsed;
				_self.time = (_lastUpdate - _startTime) / 1000;
				overlap = _self.time - _nextTime;
				if (overlap > 0 || manual) {
					_self.frame++;
					_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
					dispatch = 1;
				}
				manual || (_id = _req(_tick)); //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
				dispatch && _listeners.forEach(l => l(_self.time, elapsed, _self.frame, v));
			};
		_self = {
			time:0,
			frame:0,
			tick() {
				_tick(true);
			},
			wake() {
				if (_coreReady) {
					if (!_coreInitted && _windowExists()) {
						_win = _coreInitted = window;
						_doc = _win.document || {};
						_globals.gsap = gsap;
						(_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);
						_install(_installScope || _win.GreenSockGlobals || (!_win.gsap && _win) || {});
						_raf = _win.requestAnimationFrame;
					}
					_id && _self.sleep();
					_req = _raf || (f => setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0));
					_tickerActive = 1;
					_tick(2);
				}
			},
			sleep() {
				(_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
				_tickerActive = 0;
				_req = _emptyFunc;
			},
			lagSmoothing(threshold, adjustedLag) {
				_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
				_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
			},
			fps(fps) {
				_gap = 1 / (fps || 240);
				_nextTime = _self.time + _gap;
			},
			add(callback) {
				_listeners.indexOf(callback) < 0 && _listeners.push(callback);
				_wake();
			},
			remove(callback) {
				let i;
				~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1);
			},
			_listeners:_listeners
		};
		return _self;
	})(),
	_wake = () => !_tickerActive && _ticker.wake(), //also ensures the core classes are initialized.














/*
* -------------------------------------------------
* EASING
* -------------------------------------------------
*/
	_easeMap = {},
	_customEaseExp = /^[\d.\-M][\d.\-,\s]/,
	_quotesExp = /["']/g,
	_parseObjectInString = value => { //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
		let obj = {},
			split = value.substr(1, value.length-3).split(":"),
			key = split[0],
			i = 1,
			l = split.length,
			index, val, parsedVal;
		for (; i < l; i++) {
			val = split[i];
			index = i !== l-1 ? val.lastIndexOf(",") : val.length;
			parsedVal = val.substr(0, index);
			obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
			key = val.substr(index+1).trim();
		}
		return obj;
	},
	_configEaseFromString = name => { //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
		let split = (name + "").split("("),
			ease = _easeMap[split[0]];
		return (ease && split.length > 1 && ease.config) ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _parenthesesExp.exec(name)[1].split(",").map(_numericIfPossible)) : (_easeMap._CE && _customEaseExp.test(name)) ? _easeMap._CE("", name) : ease;
	},
	_invertEase = ease => p => 1 - ease(1 - p),
	// allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
	_propagateYoyoEase = (timeline, isYoyo) => {
		let child = timeline._first, ease;
		while (child) {
			if (child instanceof Timeline) {
				_propagateYoyoEase(child, isYoyo);
			} else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
				if (child.timeline) {
					_propagateYoyoEase(child.timeline, isYoyo);
				} else {
					ease = child._ease;
					child._ease = child._yEase;
					child._yEase = ease;
					child._yoyo = isYoyo;
				}
			}
			child = child._next;
		}
	},
	_parseEase = (ease, defaultEase) => !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase,
	_insertEase = (names, easeIn, easeOut = p => 1 - easeIn(1 - p), easeInOut = (p => p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2)) => {
		let ease = {easeIn, easeOut, easeInOut},
			lowercaseName;
		_forEachName(names, name => {
			_easeMap[name] = _globals[name] = ease;
			_easeMap[(lowercaseName = name.toLowerCase())] = easeOut;
			for (let p in ease) {
				_easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
			}
		});
		return ease;
	},
	_easeInOutFromOut = easeOut => (p => p < .5 ? (1 - easeOut(1 - (p * 2))) / 2 : .5 + easeOut((p - .5) * 2) / 2),
	_configElastic = (type, amplitude, period) => {
		let p1 = (amplitude >= 1) ? amplitude : 1, //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
			p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
			p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
			easeOut = p => p === 1 ? 1 : p1 * (2 ** (-10 * p)) * _sin((p - p3) * p2) + 1,
			ease = (type === "out") ? easeOut : (type === "in") ? p => 1 - easeOut(1 - p) : _easeInOutFromOut(easeOut);
		p2 = _2PI / p2; //precalculate to optimize
		ease.config = (amplitude, period) => _configElastic(type, amplitude, period);
		return ease;
	},
	_configBack = (type, overshoot = 1.70158) => {
		let easeOut = p => p ? ((--p) * p * ((overshoot + 1) * p + overshoot) + 1) : 0,
			ease = (type === "out") ? easeOut : (type === "in") ? p => 1 - easeOut(1 - p) : _easeInOutFromOut(easeOut);
		ease.config = overshoot => _configBack(type, overshoot);
		return ease;
	};
	// a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
	// _weightedEase = ratio => {
	// 	let y = 0.5 + ratio / 2;
	// 	return p => (2 * (1 - p) * p * y + p * p);
	// },
	// a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
	// _weightedEaseStrong = ratio => {
	// 	ratio = .5 + ratio / 2;
	// 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
	// 		b = ratio - o,
	// 		c = ratio + o;
	// 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
	// };

_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", (name, i) => {
	let power = i < 5 ? i + 1 : i;
	_insertEase(name + ",Power" + (power - 1), i ? p => p ** power : p => p, p => 1 - (1 - p) ** power, p => p < .5 ? (p * 2) ** power / 2 : 1 - ((1 - p) * 2) ** power / 2);
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
((n, c) => {
	let n1 = 1 / c,
		n2 = 2 * n1,
		n3 = 2.5 * n1,
		easeOut = p => (p < n1) ? n * p * p : (p < n2) ? n * (p - 1.5 / c) ** 2 + .75 : (p < n3) ? n * (p -= 2.25 / c) * p + .9375 : n * (p - 2.625 / c) ** 2 + .984375;
	_insertEase("Bounce", p => 1 - easeOut(1 - p), easeOut);
})(7.5625, 2.75);
_insertEase("Expo", p => p ? 2 ** (10 * (p - 1)) : 0);
_insertEase("Circ", p => -(_sqrt(1 - (p * p)) - 1));
_insertEase("Sine", p => p === 1 ? 1 : -_cos(p * _HALF_PI) + 1);
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
	config(steps = 1, immediateStart) {
		let p1 = 1 / steps,
			p2 = steps + (immediateStart ? 0 : 1),
			p3 = immediateStart ? 1 : 0,
			max = 1 - _tinyNum;
		return p => (((p2 * _clamp(0, max, p)) | 0) + p3) * p1;
	}
};
_defaults.ease = _easeMap["quad.out"];


_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", name => _callbackNames += name + "," + name + "Params,");














/*
 * --------------------------------------------------------------------------------------
 * CACHE
 * --------------------------------------------------------------------------------------
 */
export class GSCache {

	constructor(target, harness) {
		this.id = _gsID++;
		target._gsap = this;
		this.target = target;
		this.harness = harness;
		this.get = harness ? harness.get : _getProperty;
		this.set = harness ? harness.getSetter : _getSetter;
	}

}















/*
 * --------------------------------------------------------------------------------------
 * ANIMATION
 * --------------------------------------------------------------------------------------
 */

export class Animation {

	constructor(vars, time) {
		let parent = vars.parent || _globalTimeline;
		this.vars = vars;
		this._delay = +vars.delay || 0;
		if ((this._repeat = vars.repeat || 0)) {
			this._rDelay = vars.repeatDelay || 0;
			this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
		}
		this._ts = 1;
		_setDuration(this, +vars.duration, 1);
		this.data = vars.data;
		_tickerActive || _ticker.wake();
		parent && _addToTimeline(parent, this, (time || time === 0) ? time : parent._time, 1);
		vars.reversed && this.reverse();
		vars.paused && this.paused(true);
	}

	delay(value) {
		if (value || value === 0) {
			this.parent && this.parent.smoothChildTiming && (this.startTime(this._start + value - this._delay));
			this._delay = value;
			return this;
		}
		return this._delay;
	}

	duration(value) {
		return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
	}

	totalDuration(value) {
		if (!arguments.length) {
			return this._tDur;
		}
		this._dirty = 0;
		let t = (this._time / this._dur) || 0;
		_setDuration(this, this._repeat < 0 ? value : (value - (this._repeat * this._rDelay)) / (this._repeat + 1));
		return this._tTime ? _alignPlayhead(this, t * value + _elapsedCycleDuration(this)) : this; // in case the animation hasn't even started yet and it has a delay. Aligning the playhead in that case would make it appear to lose the delay.
	}

	totalTime(totalTime, suppressEvents) {
		_wake();
		if (!arguments.length) {
			return this._tTime;
		}
		let parent = this._dp;
		if (parent && parent.smoothChildTiming && this._ts) {
			_alignPlayhead(this, totalTime);
			//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.
			while (parent.parent) {
				if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
					parent.totalTime(parent._tTime, true);
				}
				parent = parent.parent;
			}
			if (!this.parent && this._dp.autoRemoveChildren && ((this._ts > 0 && totalTime < this._tDur) || (this._ts < 0 && totalTime > 0) || (!this._tDur && !totalTime) )) { //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
				_addToTimeline(this._dp, this, this._start - this._delay);
			}
		}
        if (this._tTime !== totalTime || (!this._dur && !suppressEvents) || (this._initted && Math.abs(this._zTime) === _tinyNum) || (!totalTime && !this._initted)) {
			this._ts || (this._pTime = totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause
			_lazySafeRender(this, totalTime, suppressEvents);
		}
		return this;
	}

	time(value, suppressEvents) {
		return arguments.length ? this.totalTime((Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur) || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
	}

	totalProgress(value, suppressEvents) {
		return arguments.length ? this.totalTime( this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
	}

	progress(value, suppressEvents) {
		return arguments.length ? this.totalTime( this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : (this.duration() ? Math.min(1, this._time / this._dur) : this.ratio);
	}

	iteration(value, suppressEvents) {
		let cycleDuration = this.duration() + this._rDelay;
		return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
	}

	// potential future addition:
	// isPlayingBackwards() {
	// 	let animation = this,
	// 		orientation = 1; // 1 = forward, -1 = backward
	// 	while (animation) {
	// 		orientation *= animation.reversed() || (animation.repeat() && !(animation.iteration() & 1)) ? -1 : 1;
	// 		animation = animation.parent;
	// 	}
	// 	return orientation < 0;
	// }

	timeScale(value) {
		if (!arguments.length) {
			return this._rts === -_tinyNum ? 0 : this._rts; // recorded timeScale. Special case: if someone calls reverse() on an animation with timeScale of 0, we assign it -_tinyNum to remember it's reversed.
		}
		if (this._rts === value) {
			return this;
		}
		let tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.
		// prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.
		this._rts = +value || 0;
		this._ts = (this._ps || value === -_tinyNum) ? 0 : this._rts; // _ts is the functional timeScale which would be 0 if the animation is paused.
		return _recacheAncestors(this.totalTime(_clamp(-this._delay, this._tDur, tTime), true));
	}

	paused(value) {
		if (!arguments.length) {
			return this._ps;
		}
		if (this._ps !== value) {
			this._ps = value;
			if (value) {
				this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.
				this._ts = this._act = 0; // _ts is the functional timeScale, so a paused tween would effectively have a timeScale of 0. We record the "real" timeScale as _rts (recorded time scale)
			} else {
				_wake();
				this._ts = this._rts;
				//only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.
				this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, (this.progress() === 1) && (this._tTime -= _tinyNum) && Math.abs(this._zTime) !== _tinyNum); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
			}
		}
		return this;
	}

	startTime(value) {
		if (arguments.length) {
			this._start = value;
			let parent = this.parent || this._dp;
			parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
			return this;
		}
		return this._start;
	}

	endTime(includeRepeats) {
		return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts);
	}

	rawTime(wrapRepeats) {
		let parent = this.parent || this._dp; // _dp = detatched parent
		return !parent ? this._tTime : (wrapRepeats && (!this._ts || (this._repeat && this._time && this.totalProgress() < 1))) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
	}

	globalTime(rawTime) {
		let animation = this,
			time = arguments.length ? rawTime : animation.rawTime();
		while (animation) {
			time = animation._start + time / (animation._ts || 1);
			animation = animation._dp;
		}
		return time;
	}

	repeat(value) {
		if (arguments.length) {
			this._repeat = value;
			return _onUpdateTotalDuration(this);
		}
		return this._repeat;
	}

	repeatDelay(value) {
		if (arguments.length) {
			this._rDelay = value;
			return _onUpdateTotalDuration(this);
		}
		return this._rDelay;
	}

	yoyo(value) {
		if (arguments.length) {
			this._yoyo = value;
			return this;
		}
		return this._yoyo;
	}

	seek(position, suppressEvents) {
		return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
	}

	restart(includeDelay, suppressEvents) {
		return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
	}

	play(from, suppressEvents) {
		if (from != null) {
			this.seek(from, suppressEvents);
		}
		return this.reversed(false).paused(false);
	}

	reverse(from, suppressEvents) {
		if (from != null) {
			this.seek(from || this.totalDuration(), suppressEvents);
		}
		return this.reversed(true).paused(false);
	}

	pause(atTime, suppressEvents) {
		if (atTime != null) {
			this.seek(atTime, suppressEvents);
		}
		return this.paused(true);
	}

	resume() {
		return this.paused(false);
	}

	reversed(value) {
		if (arguments.length) {
			if (!!value !== this.reversed()) {
				this.timeScale(-this._rts || (value ? -_tinyNum : 0)); // in case timeScale is zero, reversing would have no effect so we use _tinyNum.
			}
			return this;
		}
		return this._rts < 0;
	}

	invalidate() {
		this._initted = 0;
		this._zTime = -_tinyNum;
		return this;
	}

	isActive() {
		let parent = this.parent || this._dp,
			start = this._start,
			rawTime;
		return !!(!parent || (this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum));
	}

	eventCallback(type, callback, params) {
		let vars = this.vars;
		if (arguments.length > 1) {
			if (!callback) {
				delete vars[type];
			} else {
				vars[type] = callback;
				if (params) {
					vars[type + "Params"] = params;
				}
				if (type === "onUpdate") {
					this._onUpdate = callback;
				}
			}
			return this;
		}
		return vars[type];
	}

	then(onFulfilled) {
		let self = this;
		return new Promise(resolve => {
			let f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
				_resolve = () => {
					let _then = self.then;
					self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)
					_isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
					resolve(f);
					self.then = _then;
				};
			if (self._initted && (self.totalProgress() === 1 && self._ts >= 0) || (!self._tTime && self._ts < 0)) {
				_resolve();
			} else {
				self._prom = _resolve;
			}
		});
	}

	kill() {
		_interrupt(this);
	}

}

_setDefaults(Animation.prototype, {_time:0, _start:0, _end:0, _tTime:0, _tDur:0, _dirty:0, _repeat:0, _yoyo:false, parent:null, _initted:false, _rDelay:0, _ts:1, _dp:0, ratio:0, _zTime:-_tinyNum, _prom:0, _ps:false, _rts:1});


















/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */

export class Timeline extends Animation {

	constructor(vars = {}, time) {
		super(vars, time);
		this.labels = {};
		this.smoothChildTiming = !!vars.smoothChildTiming;
		this.autoRemoveChildren = !!vars.autoRemoveChildren;
		this._sort = _isNotFalse(vars.sortChildren);
		this.parent && _postAddChecks(this.parent, this);
		vars.scrollTrigger && _scrollTrigger(this, vars.scrollTrigger);
	}

	to(targets, vars, position) {
		new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
		return this;
	}

	from(targets, vars, position) {
		new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
		return this;
	}

	fromTo(targets, fromVars, toVars, position) {
		new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
		return this;
	}

	set(targets, vars, position) {
		vars.duration = 0;
		vars.parent = this;
		_inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
		vars.immediateRender = !!vars.immediateRender;
		new Tween(targets, vars, _parsePosition(this, position), 1);
		return this;
	}

	call(callback, params, position) {
		return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position));
	}

	//ONLY for backward compatibility! Maybe delete?
	staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
		vars.duration = duration;
		vars.stagger = vars.stagger || stagger;
		vars.onComplete = onCompleteAll;
		vars.onCompleteParams = onCompleteAllParams;
		vars.parent = this;
		new Tween(targets, vars, _parsePosition(this, position));
		return this;
	}

	staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
		vars.runBackwards = 1;
		_inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
		return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
	}

	staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
		toVars.startAt = fromVars;
		_inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
		return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
	}

	render(totalTime, suppressEvents, force) {
		let prevTime = this._time,
			tDur = this._dirty ? this.totalDuration() : this._tDur,
			dur = this._dur,
			tTime = (this !== _globalTimeline && totalTime > tDur - _tinyNum && totalTime >= 0) ? tDur : (totalTime < _tinyNum) ? 0 : totalTime,
			crossingStart = (this._zTime < 0) !== (totalTime < 0) && (this._initted || !dur),
			time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
		if (tTime !== this._tTime || force || crossingStart) {
			if (prevTime !== this._time && dur) { //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
				tTime += this._time - prevTime;
				totalTime += this._time - prevTime;
			}
			time = tTime;
			prevStart = this._start;
			timeScale = this._ts;
			prevPaused = !timeScale;
			if (crossingStart) {
				dur || (prevTime = this._zTime);
				 //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.
				(totalTime || !suppressEvents) && (this._zTime = totalTime);
			}
			if (this._repeat) { //adjust the time for repeats and yoyos
				yoyo = this._yoyo;
				cycleDuration = dur + this._rDelay;
				time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)
				if (time > dur || tDur === tTime) {
					time = dur;
				}
				iteration = ~~(tTime / cycleDuration);
				if (iteration && iteration === tTime / cycleDuration) {
					time = dur;
					iteration--;
				}
				prevIteration = _animationCycle(this._tTime, cycleDuration);
				!prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration); // edge case - if someone does addPause() at the very beginning of a repeating timeline, that pause is technically at the same spot as the end which causes this._time to get set to 0 when the totalTime would normally place the playhead at the end. See https://greensock.com/forums/topic/23823-closing-nav-animation-not-working-on-ie-and-iphone-6-maybe-other-older-browser/?tab=comments#comment-113005
				if (yoyo && (iteration & 1)) {
					time = dur - time;
					isYoyo = 1;
				}
				/*
				make sure children at the end/beginning of the timeline are rendered properly. If, for example,
				a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
				would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
				could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
				we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
				ensure that zero-duration tweens at the very beginning or end of the Timeline work.
				*/
				if (iteration !== prevIteration && !this._lock) {
					let rewinding = (yoyo && (prevIteration & 1)),
						doesWrap = (rewinding === (yoyo && (iteration & 1)));
					if (iteration < prevIteration) {
						rewinding = !rewinding;
					}
					prevTime = rewinding ? 0 : dur;
					this._lock = 1;
					this.render(prevTime || (isYoyo ? 0 : _round(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
					if (!suppressEvents && this.parent) {
						_callback(this, "onRepeat");
					}
					this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
					if (prevTime !== this._time || prevPaused !== !this._ts) {
						return this;
					}
					if (doesWrap) {
						this._lock = 2;
						prevTime = rewinding ? dur + 0.0001 : -0.0001;
						this.render(prevTime, true);
						this.vars.repeatRefresh && !isYoyo && this.invalidate();
					}
					this._lock = 0;
					if (!this._ts && !prevPaused) {
						return this;
					}
					//in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.
					_propagateYoyoEase(this, isYoyo);
				}
			}
			if (this._hasPause && !this._forcing && this._lock < 2) {
				pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));
				if (pauseTween) {
					tTime -= time - (time = pauseTween._start);
				}
			}

			this._tTime = tTime;
			this._time = time;
			this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

			if (!this._initted) {
				this._onUpdate = this.vars.onUpdate;
				this._initted = 1;
				this._zTime = totalTime;
			}
			if (!prevTime && time && !suppressEvents) {
				_callback(this, "onStart");
			}
			if (time >= prevTime && totalTime >= 0) {
				child = this._first;
				while (child) {
					next = child._next;
					if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
						if (child.parent !== this) { // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
							return this.render(totalTime, suppressEvents, force);
						}
						child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
						if (time !== this._time || (!this._ts && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
							pauseTween = 0;
							next && (tTime += (this._zTime = -_tinyNum));  // it didn't finish rendering, so flag zTime as negative so that so that the next time render() is called it'll be forced (to render any remaining children)
							break;
						}
					}
					child = next;
				}
			} else {
				child = this._last;
				let adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.
				while (child) {
					next = child._prev;
					if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
						if (child.parent !== this) { // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
							return this.render(totalTime, suppressEvents, force);
						}
						child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);
						if (time !== this._time || (!this._ts && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
							pauseTween = 0;
							next && (tTime += (this._zTime = adjustedTime ? -_tinyNum : _tinyNum)); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)
							break;
						}
					}
					child = next;
				}
			}
			if (pauseTween && !suppressEvents) {
				this.pause();
				pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
				if (this._ts) { //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
					this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.
					_setEnd(this);
					return this.render(totalTime, suppressEvents, force);
				}
			}
			this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
			if ((tTime === tDur && tDur >= this.totalDuration()) || (!tTime && prevTime)) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
				(totalTime || !dur) && ((tTime === tDur && this._ts > 0) || (!tTime && this._ts < 0)) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.
				if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
					_callback(this, (tTime === tDur ? "onComplete" : "onReverseComplete"), true);
					this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
				}
			}
		}
		return this;
	}

	add(child, position) {
		if (!_isNumber(position)) {
			position = _parsePosition(this, position);
		}
		if (!(child instanceof Animation)) {
			if (_isArray(child)) {
				child.forEach(obj => this.add(obj, position));
				return _uncache(this);
			}
			if (_isString(child)) {
				return this.addLabel(child, position);
			}
			if (_isFunction(child)) {
				child = Tween.delayedCall(0, child);
			} else {
				return this;
			}
		}
		return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
	}

	getChildren(nested = true, tweens = true, timelines = true, ignoreBeforeTime = -_bigNum) {
		let a = [],
			child = this._first;
		while (child) {
			if (child._start >= ignoreBeforeTime) {
				if (child instanceof Tween) {
					tweens && a.push(child);
				} else {
					timelines && a.push(child);
					nested && a.push(...child.getChildren(true, tweens, timelines));
				}
			}
			child = child._next;
		}
		return a;
	}

	getById(id) {
		let animations = this.getChildren(1, 1, 1),
			i = animations.length;
		while(i--) {
			if (animations[i].vars.id === id) {
				return animations[i];
			}
		}
	}

	remove(child) {
		if (_isString(child)) {
			return this.removeLabel(child);
		}
		if (_isFunction(child)) {
			return this.killTweensOf(child);
		}
		_removeLinkedListItem(this, child);
		if (child === this._recent) {
			this._recent = this._last;
		}
		return _uncache(this);
	}

	totalTime(totalTime, suppressEvents) {
		if (!arguments.length) {
			return this._tTime;
		}
		this._forcing = 1;
		if (!this._dp && this._ts) { //special case for the global timeline (or any other that has no parent or detached parent).
			this._start = _round(_ticker.time - (this._ts > 0 ? totalTime / this._ts : (this.totalDuration() - totalTime) / -this._ts));
		}
		super.totalTime(totalTime, suppressEvents);
		this._forcing = 0;
		return this;
	}

	addLabel(label, position) {
		this.labels[label] = _parsePosition(this, position);
		return this;
	}

	removeLabel(label) {
		delete this.labels[label];
		return this;
	}

	addPause(position, callback, params) {
		let t = Tween.delayedCall(0, callback || _emptyFunc, params);
		t.data = "isPause";
		this._hasPause = 1;
		return _addToTimeline(this, t, _parsePosition(this, position));
	}

	removePause(position) {
		let child = this._first;
		position = _parsePosition(this, position);
		while (child) {
			if (child._start === position && child.data === "isPause") {
				_removeFromParent(child);
			}
			child = child._next;
		}
	}

	killTweensOf(targets, props, onlyActive) {
		let tweens = this.getTweensOf(targets, onlyActive),
			i = tweens.length;
		while (i--) {
			(_overwritingTween !== tweens[i]) && tweens[i].kill(targets, props);
		}
		return this;
	}

	getTweensOf(targets, onlyActive) {
		let a = [],
			parsedTargets = toArray(targets),
			child = this._first,
			isGlobalTime = _isNumber(onlyActive), // a number is interpreted as a global time. If the animation spans
			children;
		while (child) {
			if (child instanceof Tween) {
				if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || (child._initted && child._ts)) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) { // note: if this is for overwriting, it should only be for tweens that aren't paused and are initted.
					a.push(child);
				}
			} else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
				a.push(...children);
			}
			child = child._next;
		}
		return a;
	}

	tweenTo(position, vars) {
		vars = vars || {};
		let tl = this,
			endTime = _parsePosition(tl, position),
			{ startAt, onStart, onStartParams } = vars,
			tween = Tween.to(tl, _setDefaults(vars, {
				ease: "none",
				lazy: false,
				time: endTime,
				duration: vars.duration || (Math.abs((endTime - ((startAt && "time" in startAt) ? startAt.time : tl._time)) / tl.timeScale())) || _tinyNum,
				onStart: () => {
					tl.pause();
					let duration = vars.duration || Math.abs((endTime - tl._time) / tl.timeScale());
					(tween._dur !== duration) && _setDuration(tween, duration).render(tween._time, true, true);
					onStart && onStart.apply(tween, onStartParams || []); //in case the user had an onStart in the vars - we don't want to overwrite it.
				}
			}));
		return tween;
	}

	tweenFromTo(fromPosition, toPosition, vars) {
		return this.tweenTo(toPosition, _setDefaults({startAt:{time:_parsePosition(this, fromPosition)}}, vars));
	}

	recent() {
		return this._recent;
	}

	nextLabel(afterTime = this._time) {
		return _getLabelInDirection(this, _parsePosition(this, afterTime));
	}

	previousLabel(beforeTime = this._time) {
		return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
	}

	currentLabel(value) {
		return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
	}

	shiftChildren(amount, adjustLabels, ignoreBeforeTime = 0) {
		let child = this._first,
			labels = this.labels,
			p;
		while (child) {
			if (child._start >= ignoreBeforeTime) {
				child._start += amount;
			}
			child = child._next;
		}
		if (adjustLabels) {
			for (p in labels) {
				if (labels[p] >= ignoreBeforeTime) {
					labels[p] += amount;
				}
			}
		}
		return _uncache(this);
	}

	invalidate() {
		let child = this._first;
		this._lock = 0;
		while (child) {
			child.invalidate();
			child = child._next;
		}
		return super.invalidate();
	}

	clear(includeLabels = true) {
		let child = this._first,
			next;
		while (child) {
			next = child._next;
			this.remove(child);
			child = next;
		}
		this._time = this._tTime = this._pTime = 0;
		if (includeLabels) {
			this.labels = {};
		}
		return _uncache(this);
	}

	totalDuration(value) {
		let max = 0,
			self = this,
			child = self._last,
			prevStart = _bigNum,
			prev, end, start, parent;
		if (arguments.length) {
			return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
		}
		if (self._dirty) {
			parent = self.parent;
			while (child) {
				prev = child._prev; //record it here in case the tween changes position in the sequence...
				child._dirty && child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.
				start = child._start;
				if (start > prevStart && self._sort && child._ts && !self._lock) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
					self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().
					_addToTimeline(self, child, start - child._delay, 1)._lock = 0;
				} else {
					prevStart = start;
				}
				if (start < 0 && child._ts) { //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
					max -= start;
					if ((!parent && !self._dp) || (parent && parent.smoothChildTiming)) {
						self._start += start / self._ts;
						self._time -= start;
						self._tTime -= start;
					}
					self.shiftChildren(-start, false, -1e999);
					prevStart = 0;
				}
				end = _setEnd(child);
				if (end > max && child._ts) {
					max = end;
				}
				child = prev;
			}
			_setDuration(self, (self === _globalTimeline && self._time > max) ? self._time : max, 1);
			self._dirty = 0;
		}
		return self._tDur;
	}

	static updateRoot(time) {
		if (_globalTimeline._ts) {
			_lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
			_lastRenderedFrame = _ticker.frame;
		}
		if (_ticker.frame >= _nextGCFrame) {
			_nextGCFrame += _config.autoSleep || 120;
			let child = _globalTimeline._first;
			if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
				while (child && !child._ts) {
					child = child._next;
				}
				child || _ticker.sleep();
			}
		}
	}

}

_setDefaults(Timeline.prototype, {_lock:0, _hasPause:0, _forcing:0});




















let _addComplexStringPropTween = function(target, prop, start, end, setter, stringFilter, funcParam) { //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
		let pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
			index = 0,
			matchIndex = 0,
			result,	startNums, color, endNum, chunk, startNum, hasRandom, a;
		pt.b = start;
		pt.e = end;
		start += ""; //ensure values are strings
		end += "";
		if ((hasRandom = ~end.indexOf("random("))) {
			end = _replaceRandom(end);
		}
		if (stringFilter) {
			a = [start, end];
			stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
			start = a[0];
			end = a[1];
		}
		startNums = start.match(_complexStringNumExp) || [];
		while ((result = _complexStringNumExp.exec(end))) {
			endNum = result[0];
			chunk = end.substring(index, result.index);
			if (color) {
				color = (color + 1) % 5;
			} else if (chunk.substr(-5) === "rgba(") {
				color = 1;
			}
			if (endNum !== startNums[matchIndex++]) {
				startNum = parseFloat(startNums[matchIndex-1]) || 0;
				//these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.
				pt._pt = {
					_next:pt._pt,
					p:(chunk || matchIndex === 1) ? chunk : ",", //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
					s:startNum,
					c:endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
					m:(color && color < 4) ? Math.round : 0
				};
				index = _complexStringNumExp.lastIndex;
			}
		}
		pt.c = (index < end.length) ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
		pt.fp = funcParam;
		if (_relExp.test(end) || hasRandom) {
			pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
		}
		this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
		return pt;
	},
	_addPropTween = function(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
		_isFunction(end) && (end = end(index || 0, target, targets));
		let currentValue = target[prop],
			parsedStart = (start !== "get") ? start : !_isFunction(currentValue) ? currentValue : (funcParam ? target[(prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)])) ? prop : "get" + prop.substr(3)](funcParam) : target[prop]()),
			setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
			pt;
		if (_isString(end)) {
			if (~end.indexOf("random(")) {
				end = _replaceRandom(end);
			}
			if (end.charAt(1) === "=") {
				end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0);
			}
		}
		if (parsedStart !== end) {
			if (!isNaN(parsedStart * end)) {
				pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof(currentValue) === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
				funcParam && (pt.fp = funcParam);
				modifier && pt.modifier(modifier, this, target);
				return (this._pt = pt);
			}
			!currentValue && !(prop in target) && _missingPlugin(prop, end);
			return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
		}
	},
	//creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
	_processVars = (vars, index, target, targets, tween) => {
		if (_isFunction(vars)) {
			vars = _parseFuncOrString(vars, tween, index, target, targets);
		}
		if (!_isObject(vars) || (vars.style && vars.nodeType) || _isArray(vars)) {
			return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
		}
		let copy = {},
			p;
		for (p in vars) {
			copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
		}
		return copy;
	},
	_checkPlugin = (property, vars, tween, index, target, targets) => {
		let plugin, pt, ptLookup, i;
		if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
			tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
			if (tween !== _quickTween) {
				ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.
				i = plugin._props.length;
				while (i--) {
					ptLookup[plugin._props[i]] = pt;
				}
			}
		}
		return plugin;
	},
	_overwritingTween, //store a reference temporarily so we can avoid overwriting itself.
	_initTween = (tween, time) => {
		let vars = tween.vars,
			{ ease, startAt, immediateRender, lazy, onUpdate, onUpdateParams, callbackScope, runBackwards, yoyoEase, keyframes, autoRevert } = vars,
			dur = tween._dur,
			prevStartAt = tween._startAt,
			targets = tween._targets,
			parent = tween.parent,
			//when a stagger (or function-based duration/delay) is on a Tween instance, we create a nested timeline which means that the "targets" of that tween don't reflect the parent. This function allows us to discern when it's a nested tween and in that case, return the full targets array so that function-based values get calculated properly.
			fullTargets = (parent && parent.data === "nested") ? parent.parent._targets : targets,
			autoOverwrite = (tween._overwrite === "auto"),
			tl = tween.timeline,
			cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
		tl && (!keyframes || !ease) && (ease = "none");
		tween._ease = _parseEase(ease, _defaults.ease);
		tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
		if (yoyoEase && tween._yoyo && !tween._repeat) { //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
			yoyoEase = tween._yEase;
			tween._yEase = tween._ease;
			tween._ease = yoyoEase;
		}
		if (!tl) { //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
			harness = targets[0] ? _getCache(targets[0]).harness : 0;
			harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.
			cleanVars = _copyExcluding(vars, _reservedProps);
			prevStartAt && prevStartAt.render(-1, true).kill();
			if (startAt) {
				_removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({data: "isStart", overwrite: false, parent: parent, immediateRender: true, lazy: _isNotFalse(lazy), startAt: null, delay: 0, onUpdate: onUpdate, onUpdateParams: onUpdateParams, callbackScope: callbackScope, stagger: 0}, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);
				if (immediateRender) {
					if (time > 0) {
						!autoRevert && (tween._startAt = 0); //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in Timeline instances where immediateRender was false or when autoRevert is explicitly set to true.
					} else if (dur && !(time < 0 && prevStartAt)) {
						tween._zTime = time;
						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
					}
				}
			} else if (runBackwards && dur) {
				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
				if (prevStartAt) {
					!autoRevert && (tween._startAt = 0);
				} else {
					time && (immediateRender = false); //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
					p = _setDefaults({
						overwrite: false,
						data: "isFromStart", //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
						lazy: immediateRender && _isNotFalse(lazy),
						immediateRender: immediateRender, //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
						stagger: 0,
						parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.wrap([-100,100])})
					}, cleanVars);
					harnessVars && (p[harness.prop] = harnessVars); // in case someone does something like .from(..., {css:{}})
					_removeFromParent(tween._startAt = Tween.set(targets, p));
					if (!immediateRender) {
						_initTween(tween._startAt, _tinyNum); //ensures that the initial values are recorded
					} else if (!time) {
						return;
					}
				}
			}
			tween._pt = 0;
			lazy = (dur && _isNotFalse(lazy)) || (lazy && !dur);
			for (i = 0; i < targets.length; i++) {
				target = targets[i];
				gsData = target._gsap || _harness(targets)[i]._gsap;
				tween._ptLookup[i] = ptLookup = {};
				_lazyLookup[gsData.id] && _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
				index = fullTargets === targets ? i : fullTargets.indexOf(target);
				if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
					tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
					plugin._props.forEach(name => {ptLookup[name] = pt;});
					plugin.priority && (hasPriority = 1);
				}
				if (!harness || harnessVars) {
					for (p in cleanVars) {
						if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
							plugin.priority && (hasPriority = 1);
						} else {
							ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
						}
					}
				}
				tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
				if (autoOverwrite && tween._pt) {
					_overwritingTween = tween;
					_globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(0)); //Also make sure the overwriting doesn't overwrite THIS tween!!!
					overwritten = !tween.parent;
					_overwritingTween = 0;
				}
				tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
			}
			hasPriority && _sortPropTweensByPriority(tween);
			tween._onInit && tween._onInit(tween); //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
		}
		tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.
		tween._onUpdate = onUpdate;
		tween._initted = (!tween._op || tween._pt) && !overwritten; // if overwrittenProps resulted in the entire tween being killed, do NOT flag it as initted or else it may render for one tick.
	},
	_addAliasesToVars = (targets, vars) => {
		let harness = targets[0] ? _getCache(targets[0]).harness : 0,
			propertyAliases = (harness && harness.aliases),
			copy, p, i, aliases;
		if (!propertyAliases) {
			return vars;
		}
		copy = _merge({}, vars);
		for (p in propertyAliases) {
			if (p in copy) {
				aliases = propertyAliases[p].split(",");
				i = aliases.length;
				while(i--) {
					copy[aliases[i]] = copy[p];
				}
			}

		}
		return copy;
	},
	_parseFuncOrString = (value, tween, i, target, targets) => (_isFunction(value) ? value.call(tween, i, target, targets) : (_isString(value) && ~value.indexOf("random(")) ? _replaceRandom(value) : value),
	_staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
	_staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger").split(",");























/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */

export class Tween extends Animation {

	constructor(targets, vars, time, skipInherit) {
		if (typeof(vars) === "number") {
			time.duration = vars;
			vars = time;
			time = null;
		}
		super(skipInherit ? vars : _inheritDefaults(vars), time);
		let { duration, delay, immediateRender, stagger, overwrite, keyframes, defaults, scrollTrigger, yoyoEase } = this.vars,
			parent = this.parent,
			parsedTargets = (_isArray(targets) ? _isNumber(targets[0]) : ("length" in vars)) ? [targets] : toArray(targets), // edge case: someone might try animating the "length" of an object with a "length" property that's initially set to 0 so don't interpret that as an empty Array-like object.
			tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
		this._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
		this._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property
		this._overwrite = overwrite;
		if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
			vars = this.vars;
			tl = this.timeline = new Timeline({data:"nested", defaults:defaults || {}});
			tl.kill();
			tl.parent = this;
			if (keyframes) {
				_setDefaults(tl.vars.defaults, {ease:"none"});
				keyframes.forEach(frame => tl.to(parsedTargets, frame, ">"));

			} else {
				l = parsedTargets.length;
				staggerFunc = stagger ? distribute(stagger) : _emptyFunc;
				if (_isObject(stagger)) { //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
					for (p in stagger) {
						if (~_staggerTweenProps.indexOf(p)) {
							staggerVarsToMerge || (staggerVarsToMerge = {});
							staggerVarsToMerge[p] = stagger[p];
						}
					}
				}
				for (i = 0; i < l; i++) {
					copy = {};
					for (p in vars) {
						if (_staggerPropsToSkip.indexOf(p) < 0) {
							copy[p] = vars[p];
						}
					}
					copy.stagger = 0;
					yoyoEase && (copy.yoyoEase = yoyoEase);
					staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
					curTarget = parsedTargets[i];
					//don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.
					copy.duration = +_parseFuncOrString(duration, this, i, curTarget, parsedTargets);
					copy.delay = (+_parseFuncOrString(delay, this, i, curTarget, parsedTargets) || 0) - this._delay;
					if (!stagger && l === 1 && copy.delay) { // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
						this._delay = delay = copy.delay;
						this._start += delay;
						copy.delay = 0;
					}
					tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets));
				}
				tl.duration() ? (duration = delay = 0) : (this.timeline = 0); // if the timeline's duration is 0, we don't need a timeline internally!
			}
			duration || this.duration((duration = tl.duration()));

		} else {
			this.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
		}

		if (overwrite === true) {
			_overwritingTween = this;
			_globalTimeline.killTweensOf(parsedTargets);
			_overwritingTween = 0;
		}
		parent && _postAddChecks(parent, this);
		if (immediateRender || (!duration && !keyframes && this._start === _round(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(this) && parent.data !== "nested")) {
			this._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
			this.render(Math.max(0, -delay)); //in case delay is negative
		}
		scrollTrigger && _scrollTrigger(this, scrollTrigger);
	}

	render(totalTime, suppressEvents, force) {
		let prevTime = this._time,
			tDur = this._tDur,
			dur = this._dur,
			tTime = (totalTime > tDur - _tinyNum && totalTime >= 0) ? tDur : (totalTime < _tinyNum) ? 0 : totalTime,
			time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline, yoyoEase;
		if (!dur) {
			_renderZeroDurationTween(this, totalTime, suppressEvents, force);
		} else if (tTime !== this._tTime || !totalTime || force || (this._startAt && (this._zTime < 0) !== (totalTime < 0))) { //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
			time = tTime;
			timeline = this.timeline;
			if (this._repeat) { //adjust the time for repeats and yoyos
				cycleDuration = dur + this._rDelay;
				time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)
				if (time > dur || tDur === tTime) { // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
					time = dur;
				}
				iteration = ~~(tTime / cycleDuration);
				if (iteration && iteration === tTime / cycleDuration) {
					time = dur;
					iteration--;
				}
				isYoyo = this._yoyo && (iteration & 1);
				if (isYoyo) {
					yoyoEase = this._yEase;
					time = dur - time;
				}
				prevIteration = _animationCycle(this._tTime, cycleDuration);
				if (time === prevTime && !force && this._initted) {
					//could be during the repeatDelay part. No need to render and fire callbacks.
					return this;
				}
				if (iteration !== prevIteration) {
					timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo);
					//repeatRefresh functionality
					if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
						this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.
						this.render(_round(cycleDuration * iteration), true).invalidate()._lock = 0;
					}
				}
			}

			if (!this._initted) {
				if (_attemptInitTween(this, totalTime < 0 ? totalTime : time, force, suppressEvents)) {
					this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.
					return this;
				}
				if (dur !== this._dur) { // while initting, a plugin like InertiaPlugin might alter the duration, so rerun from the start to ensure everything renders as it should.
					return this.render(totalTime, suppressEvents, force);
				}
			}

			this._tTime = tTime;
			this._time = time;

			if (!this._act && this._ts) {
				this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.
				this._lazy = 0;
			}

			this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
			if (this._from) {
				this.ratio = ratio = 1 - ratio;
			}

			time && !prevTime && !suppressEvents && _callback(this, "onStart");

			pt = this._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}

			(timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force)) || (this._startAt && (this._zTime = totalTime));

			if (this._onUpdate && !suppressEvents) {
				if (totalTime < 0 && this._startAt) {
					this._startAt.render(totalTime, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				_callback(this, "onUpdate");
			}

			this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");

			if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
				totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
				(totalTime || !dur) && ((tTime === this._tDur && this._ts > 0) || (!tTime && this._ts < 0)) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.
			    if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) { // if prevTime and tTime are zero, we shouldn't fire the onReverseComplete. This could happen if you gsap.to(... {paused:true}).play();
					_callback(this, (tTime === tDur ? "onComplete" : "onReverseComplete"), true);
					this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
				}
			}

		}
		return this;
	}

	targets() {
		return this._targets;
	}

	invalidate() {
		this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0;
		this._ptLookup = [];
		this.timeline && this.timeline.invalidate();
		return super.invalidate();
	}

	kill(targets, vars = "all") {
		if (!targets && (!vars || vars === "all")) {
			this._lazy = 0;
			if (this.parent) {
				return _interrupt(this);
			}
		}
		if (this.timeline) {
			let tDur = this.timeline.totalDuration();
			this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this); // if nothing is left tweenng, interrupt.
			this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur); // if a nested tween is killed that changes the duration, it should affect this tween's duration. We must use the ratio, though, because sometimes the internal timeline is stretched like for keyframes where they don't all add up to whatever the parent tween's duration was set to.
			return this;
		}
		let parsedTargets = this._targets,
			killingTargets = targets ? toArray(targets) : parsedTargets,
			propTweenLookup = this._ptLookup,
			firstPT = this._pt,
			overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
		if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
			vars === "all" && (this._pt = 0);
			return _interrupt(this);
		}
		overwrittenProps = this._op = this._op || [];
		if (vars !== "all") { //so people can pass in a comma-delimited list of property names
			if (_isString(vars)) {
				p = {};
				_forEachName(vars, name => p[name] = 1);
				vars = p;
			}
			vars = _addAliasesToVars(parsedTargets, vars);
		}
		i = parsedTargets.length;
		while (i--) {
			if (~killingTargets.indexOf(parsedTargets[i])) {
				curLookup = propTweenLookup[i];
				if (vars === "all") {
					overwrittenProps[i] = vars;
					props = curLookup;
					curOverwriteProps = {};
				} else {
					curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
					props = vars;
				}
				for (p in props) {
					pt = curLookup && curLookup[p];
					if (pt) {
						if (!("kill" in pt.d) || pt.d.kill(p) === true) {
							_removeLinkedListItem(this, pt, "_pt");
						}
						delete curLookup[p];
					}
					if (curOverwriteProps !== "all") {
						curOverwriteProps[p] = 1;
					}
				}
			}
		}
		this._initted && !this._pt && firstPT && _interrupt(this); //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
		return this;
	}


	static to(targets, vars) {
		return new Tween(targets, vars, arguments[2]);
	}

	static from(targets, vars) {
		return new Tween(targets, _parseVars(arguments, 1));
	}

	static delayedCall(delay, callback, params, scope) {
		return new Tween(callback, 0, {immediateRender:false, lazy:false, overwrite:false, delay:delay, onComplete:callback, onReverseComplete:callback, onCompleteParams:params, onReverseCompleteParams:params, callbackScope:scope});
	}

	static fromTo(targets, fromVars, toVars) {
		return new Tween(targets, _parseVars(arguments, 2));
	}

	static set(targets, vars) {
		vars.duration = 0;
		vars.repeatDelay || (vars.repeat = 0);
		return new Tween(targets, vars);
	}

	static killTweensOf(targets, props, onlyActive) {
		return _globalTimeline.killTweensOf(targets, props, onlyActive);
	}
}

_setDefaults(Tween.prototype, {_targets:[], _lazy:0, _startAt:0, _op:0, _onInit:0});

//add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
// _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
// 	Tween.prototype[name] = function() {
// 		let tl = new Timeline();
// 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
// 	}
// });

//for backward compatibility. Leverage the timeline calls.
_forEachName("staggerTo,staggerFrom,staggerFromTo", name => {
	Tween[name] = function() {
		let tl = new Timeline(),
			params = _slice.call(arguments, 0);
		params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
		return tl[name].apply(tl, params);
	}
});
















/*
 * --------------------------------------------------------------------------------------
 * PROPTWEEN
 * --------------------------------------------------------------------------------------
 */
let _setterPlain = (target, property, value) => target[property] = value,
	_setterFunc = (target, property, value) => target[property](value),
	_setterFuncWithParam = (target, property, value, data) => target[property](data.fp, value),
	_setterAttribute = (target, property, value) => target.setAttribute(property, value),
	_getSetter = (target, property) => _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain,
	_renderPlain = (ratio, data) => data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data),
	_renderBoolean = (ratio, data) => data.set(data.t, data.p, !!(data.s + data.c * ratio), data),
	_renderComplexString = function(ratio, data) {
		let pt = data._pt,
			s = "";
		if (!ratio && data.b) { //b = beginning string
			s = data.b;
		} else if (ratio === 1 && data.e) { //e = ending string
			s = data.e;
		} else {
			while (pt) {
				s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : (Math.round((pt.s + pt.c * ratio) * 10000) / 10000)) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.
				pt = pt._next;
			}
			s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
		}
		data.set(data.t, data.p, s, data);
	},
	_renderPropTweens = function(ratio, data) {
		let pt = data._pt;
		while (pt) {
			pt.r(ratio, pt.d);
			pt = pt._next;
		}
	},
	_addPluginModifier = function(modifier, tween, target, property) {
		let pt = this._pt,
			next;
		while (pt) {
			next = pt._next;
			if (pt.p === property) {
				pt.modifier(modifier, tween, target);
			}
			pt = next;
		}
	},
	_killPropTweensOf = function(property) {
		let pt = this._pt,
			hasNonDependentRemaining, next;
		while (pt) {
			next = pt._next;
			if ((pt.p === property && !pt.op) || pt.op === property) {
				_removeLinkedListItem(this, pt, "_pt");
			} else if (!pt.dep) {
				hasNonDependentRemaining = 1;
			}
			pt = next;
		}
		return !hasNonDependentRemaining;
	},
	_setterWithModifier = (target, property, value, data) => {
		data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
	},
	_sortPropTweensByPriority = parent => {
		let pt = parent._pt,
			next, pt2, first, last;
		//sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)
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
		parent._pt = first;
	};

//PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)
export class PropTween {

	constructor(next, target, prop, start, change, renderer, data, setter, priority) {
		this.t = target;
		this.s = start;
		this.c = change;
		this.p = prop;
		this.r = renderer || _renderPlain;
		this.d = data || this;
		this.set = setter || _setterPlain;
		this.pr = priority || 0;
		this._next = next;
		if (next) {
			next._prev = this;
		}
	}

	modifier(func, tween, target) {
		this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)
		this.set = _setterWithModifier;
		this.m = func;
		this.mt = target; //modifier target
		this.tween = tween;
	}
}



//Initialization tasks
_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", name => _reservedProps[name] = 1);
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({sortChildren: false, defaults: _defaults, autoRemoveChildren: true, id:"root", smoothChildTiming: true});
_config.stringFilter = _colorStringFilter;

















/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */
const _gsap = {
	registerPlugin(...args) {
		args.forEach(config => _createPlugin(config));
	},
	timeline(vars) {
		return new Timeline(vars);
	},
	getTweensOf(targets, onlyActive) {
		return _globalTimeline.getTweensOf(targets, onlyActive);
	},
	getProperty(target, property, unit, uncache) {
		if (_isString(target)) { //in case selector text or an array is passed in
			target = toArray(target)[0];
		}
		let getter = _getCache(target || {}).get,
			format = unit ? _passThrough : _numericIfPossible;
		if (unit === "native") {
			unit = "";
		}
		return !target ? target : !property ? (property, unit, uncache) => format(((_plugins[property] && _plugins[property].get) || getter)(target, property, unit, uncache)) : format(((_plugins[property] && _plugins[property].get) || getter)(target, property, unit, uncache));
	},
	quickSetter(target, property, unit) {
		target = toArray(target);
		if (target.length > 1) {
			let setters = target.map(t => gsap.quickSetter(t, property, unit)),
				l = setters.length;
			return value => {
				let i = l;
				while(i--) {
					setters[i](value);
				}
			}
		}
		target = target[0] || {};
		let Plugin = _plugins[property],
			cache = _getCache(target),
			p = (cache.harness && (cache.harness.aliases || {})[property]) || property, // in case it's an alias, like "rotate" for "rotation".
			setter = Plugin ? value => {
				let p = new Plugin();
				_quickTween._pt = 0;
				p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
				p.render(1, p);
				_quickTween._pt && _renderPropTweens(1, _quickTween);
			} : cache.set(target, p);
		return Plugin ? setter : value => setter(target, p, unit ? value + unit : value, cache, 1);
	},
	isTweening(targets) {
		return _globalTimeline.getTweensOf(targets, true).length > 0;
	},
	defaults(value) {
		if (value && value.ease) {
			value.ease = _parseEase(value.ease, _defaults.ease);
		}
		return _mergeDeep(_defaults, value || {});
	},
	config(value) {
		return _mergeDeep(_config, value || {});
	},
	registerEffect({name, effect, plugins, defaults, extendTimeline}) {
		(plugins || "").split(",").forEach(pluginName => pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin."));
		_effects[name] = (targets, vars, tl) => effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
		if (extendTimeline) {
			Timeline.prototype[name] = function(targets, vars, position) {
				return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
			};
		}
	},
	registerEase(name, ease) {
		_easeMap[name] = _parseEase(ease);
	},
	parseEase(ease, defaultEase) {
		return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
	},
	getById(id) {
		return _globalTimeline.getById(id);
	},
	exportRoot(vars = {}, includeDelayedCalls) {
		let tl = new Timeline(vars),
			child, next;
		tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
		_globalTimeline.remove(tl);
		tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).
		tl._time = tl._tTime = _globalTimeline._time;
		child = _globalTimeline._first;
		while (child) {
			next = child._next;
			if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
				_addToTimeline(tl, child, child._start - child._delay);
			}
			child = next;
		}
		_addToTimeline(_globalTimeline, tl, 0);
		return tl;
	},
	utils: { wrap, wrapYoyo, distribute, random, snap, normalize, getUnit, clamp, splitColor, toArray, mapRange, pipe, unitize, interpolate, shuffle },
	install: _install,
	effects: _effects,
	ticker: _ticker,
	updateRoot: Timeline.updateRoot,
	plugins: _plugins,
	globalTimeline: _globalTimeline,
	core: {PropTween, globals: _addGlobal, Tween, Timeline, Animation, getCache: _getCache, _removeLinkedListItem}
};

_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", name => _gsap[name] = Tween[name]);
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to({}, {duration:0});




// ---- EXTRA PLUGINS --------------------------------------------------------


let _getPluginPropTween = (plugin, prop) => {
		let pt = plugin._pt;
		while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
			pt = pt._next;
		}
		return pt;
	},
	_addModifiers = (tween, modifiers) => {
			let	targets = tween._targets,
				p, i, pt;
			for (p in modifiers) {
				i = targets.length;
				while (i--) {
					pt = tween._ptLookup[i][p];
					if (pt && (pt = pt.d)) {
						if (pt._pt) { // is a plugin
							pt = _getPluginPropTween(pt, p);
						}
						pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
					}
				}
			}
	},
	_buildModifierPlugin = (name, modifier) => {
		return {
			name: name,
			rawVars: 1, //don't pre-process function-based values or "random()" strings.
			init(target, vars, tween) {
				tween._onInit = tween => {
					let temp, p;
					if (_isString(vars)) {
						temp = {};
						_forEachName(vars, name => temp[name] = 1); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.
						vars = temp;
					}
					if (modifier) {
						temp = {};
						for (p in vars) {
							temp[p] = modifier(vars[p]);
						}
						vars = temp;
					}
					_addModifiers(tween, vars);
				};
			}
		};
	};

//register core plugins
export const gsap = _gsap.registerPlugin({
		name:"attr",
		init(target, vars, tween, index, targets) {
			let p, pt;
			for (p in vars) {
				pt = this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
				pt && (pt.op = p);
				//this.add(target, "setAttribute", (target.getAttribute((p in target.dataset ? (p = "data-" + p) : p)) || 0) + "", vars[p], index, targets, 0, 0, p);
				this._props.push(p);
			}
		}
	}, {
		name:"endArray",
		init(target, value) {
			let i = value.length;
			while (i--) {
				this.add(target, i, target[i] || 0, value[i]);
			}
		}
	},
	_buildModifierPlugin("roundProps", _roundModifier),
	_buildModifierPlugin("modifiers"),
	_buildModifierPlugin("snap", snap)
) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.

Tween.version = Timeline.version = gsap.version = "3.4.2";
_coreReady = 1;
if (_windowExists()) {
	_wake();
}

export const { Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong, Elastic, Back, SteppedEase, Bounce, Sine, Expo, Circ } = _easeMap;
export { Tween as TweenMax, Tween as TweenLite, Timeline as TimelineMax, Timeline as TimelineLite, gsap as default, wrap, wrapYoyo, distribute, random, snap, normalize, getUnit, clamp, splitColor, toArray, mapRange, pipe, unitize, interpolate, shuffle };
//export some internal methods/orojects for use in CSSPlugin so that we can externalize that file and allow custom builds that exclude it.
export { _getProperty, _numExp, _numWithUnitExp, _isString, _isUndefined, _renderComplexString, _relExp, _setDefaults, _removeLinkedListItem, _forEachName, _sortPropTweensByPriority, _colorStringFilter, _replaceRandom, _checkPlugin, _plugins, _ticker, _config, _roundModifier, _round, _missingPlugin, _getSetter, _getCache }