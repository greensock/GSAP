/*!
 * GSAP 3.0.1
 * https://greensock.com
 *
 * @license Copyright 2008-2019, GreenSock. All rights reserved.
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
	_numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi, //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
	_complexStringNumExp = /[-+=\.]*\d+(?:\.|e-|e)*\d*/gi, //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
	_parenthesesExp = /\(([^()]+)\)/i, //finds the string between parentheses.
	_relExp = /[\+-]=-?[\.\d]+/,
	_delimitedValueExp = /[#\-+\.]*\b[a-z\d-=+%.]+/gi,
	_globalTimeline, _win, _coreInitted, _doc,
	_globals = {},
	_installScope = {},
	_coreReady,
	_install = scope => (_installScope = _merge(scope, _globals)) && gsap,
	_missingPlugin = (property, value) => console.warn("Invalid", property, "tween of", value, "Missing plugin? gsap.registerPlugin()"),
	_warn = (message, suppress) => !suppress && console.warn(message),
	_addGlobal = (name, obj) => (name && (_globals[name] = obj) && (_installScope && (_installScope[name] = obj))) || _globals,
	_emptyFunc = () => 0,
	_reservedProps = {},
	_lazyTweens = [],
	_lazyLookup = {},
	_plugins = {},
	_effects = {},
	_nextGCFrame = 30,
	_harnessPlugins = [],
	_callbackNames = "onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
	_harness = targets => {
		let target = targets[0],
			harnessPlugin, i;
		if (!_isObject(target) && !_isFunction(target)) {
			return _isArray(targets) ? targets : [targets];
		}
		if (!(harnessPlugin = (target._gsap || {}).harness)) {
			i = _harnessPlugins.length;
			while (i-- && !_harnessPlugins[i].targetTest(target)) {	}
			harnessPlugin = _harnessPlugins[i];
		}
		i = targets.length;
		while (i--) {
			targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin));
		}
		return targets;
	},
	_getCache = target => target._gsap || _harness(toArray(target))[0]._gsap,
	_getProperty = (target, property) => {
		let currentValue = target[property];
		return _isFunction(currentValue) ? target[property]() : (_isUndefined(currentValue) && target.getAttribute(property)) || currentValue;
	},
	_forEachName = (names, func) => ((names = names.split(",")).forEach(func)) || names, //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
	_round = value => Math.round(value * 10000) / 10000,
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
			i;
		if (isLegacy) {
			vars.duration = params[1];
		}
		if (type === 1) {
			vars.runBackwards = 1;
			vars.immediateRender = _isNotFalse(vars.immediateRender);
		} else if (type === 2) {
			i = params[varsIndex - 1]; //"from" vars
			vars.startAt = i;
			vars.immediateRender = _isNotFalse(vars.immediateRender);
		}
		vars.parent = parent;
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
			if (tween && tween._lazy) {
				tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0;
			}
		}
	},
	_lazySafeRender = (animation, time, suppressEvents, force) => {
		if (_lazyTweens.length) {
			_lazyRender();
		}
		animation.render(time, suppressEvents, force);
		if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
			_lazyRender();
		}
	},
	_numericIfPossible = value => {
		let n = parseFloat(value);
		return n || n === 0 ? n : value;
	},
	_passThrough = p => p,
	_setDefaults = (obj, defaults) => {
		for (let p in defaults) {
			if (!(p in obj)) {
				obj[p] = defaults[p];
			}
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
			if (!(p in excluding)) {
				copy[p] = obj[p];
			}
		}
		return copy;
	},
	_inheritDefaults = vars => {
		let parent = vars.parent || _globalTimeline,
			func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;
		if (_isNotFalse(vars.inherit)) {
			while (parent) {
				func(vars, parent.vars.defaults);
				parent = parent.parent;
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
		child.parent = parent;
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
		child._dp = parent; //record the parent as _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
		child._next = child._prev = child.parent = null;
	},
	_removeFromParent = (child, onlyIfParentHasAutoRemove) => {
		if (child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren)) {
			child.parent.remove(child);
		}
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
	_elapsedCycleDuration = animation => {
		let cycleDuration;
		return animation._repeat ? (cycleDuration = animation.duration() + animation._rDelay) * ~~(animation._tTime / cycleDuration) : 0;
	},
	_parentToChildTotalTime = (parentTime, child) => child._ts > 0 ? (parentTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (parentTime - child._start) * child._ts,
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
	_addToTimeline = (timeline, child, position) => {
		child.parent && _removeFromParent(child);
		child._start = position + child._delay;
		child._end = child._start + ((child.totalDuration() / child._ts) || 0);
		_addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
		timeline._recent = child;

		if (child._time || (!child._dur && child._initted)) { //in case, for example, the _start is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
			let curTime = (timeline.rawTime() - child._start) * child._ts;
			if (!child._dur || _clamp(0, child.totalDuration(), curTime) - child._tTime > _tinyNum) {
				child.render(curTime, true);
			}
		}
		_uncache(timeline);
		//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
		if (timeline._dp && timeline._time >= timeline._dur && timeline._ts && timeline._dur < timeline.duration()) {
			//in case any of the ancestors had completed but should now be enabled...
			let tl = timeline;
			while (tl._dp) {
				tl.totalTime(tl._tTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
				tl = tl._dp;
			}
		}
		return timeline;
	},
	_attemptInitTween = (tween, totalTime, force, suppressEvents) => {
		_initTween(tween, totalTime);
		if (!tween._initted) {
			return 1;
		}
		if (!force && tween._pt && tween.vars.lazy) {
			_lazyTweens.push(tween);
			tween._lazy = [totalTime, suppressEvents];
			return 1;
		}
	},
	_renderZeroDurationTween = (tween, totalTime, suppressEvents, force) => {
		let prevRatio = tween._zTime < 0 ? 0 : 1,
			ratio = totalTime < 0 ? 0 : 1,
			repeatDelay = tween._rDelay,
			tTime = 0,
			pt, iteration, prevIteration;
		if (repeatDelay && tween._repeat) { //in case there's a zero-duration tween that has a repeat with a repeatDelay
			tTime = _clamp(0, tween._tDur, totalTime);
			iteration = ~~(tTime / repeatDelay);
			if (iteration && iteration === tTime / repeatDelay) {
				iteration--;
			}
			prevIteration = ~~(tween._tTime / repeatDelay);
			if (prevIteration && prevIteration === tween._tTime / repeatDelay) {
				prevIteration--;
			}
			if (iteration !== prevIteration) {
				prevRatio = 1 - ratio;
				if (tween.vars.repeatRefresh) {
					tween.invalidate();
				}
			}
		}
		if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
			return;
		}
		if (ratio !== prevRatio || force) {
			if (!suppressEvents || totalTime) { //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.
				tween._zTime = totalTime;
			}
			tween.ratio = ratio;
			if (tween._from) {
				ratio = 1 - ratio;
			}
			tween._time = 0;
			tween._tTime = tTime;
			if (!suppressEvents) {
				_callback(tween, "onStart");
			}
			pt = tween._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}
			if (!ratio && tween._startAt && !tween._onUpdate && tween._start) { //if the tween is positioned at the VERY beginning (_start 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
				tween._startAt.render(totalTime, true, force);
			}
			if (tween._onUpdate && !suppressEvents) {
				_callback(tween, "onUpdate");
			}
			if (tTime && tween._repeat && !suppressEvents && tween.parent) {
				_callback(tween, "onRepeat");
			}
			if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
				tween.ratio && _removeFromParent(tween, 1);
				if (!suppressEvents) {
					_callback(tween, (tween.ratio ? "onComplete" : "onReverseComplete"), true);
					tween._prom && tween.ratio && tween._prom();
				}
			}
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
	_onUpdateTotalDuration = animation => {
		if (animation instanceof Timeline) {
			return _uncache(animation);
		}
		let repeat = animation._repeat;
		animation._tDur = !repeat ? animation._dur : repeat < 0 ? 1e20 : _round(animation._dur * (repeat + 1) + (animation._rDelay * repeat));
		_uncache(animation.parent); //if the tween's duration changed, the parent timeline's duration may have changed, so flag it as "dirty"
		return animation;
	},
	_zeroPosition = {_start:0, endTime:_emptyFunc},
	_parsePosition = (animation, position, useBuildFrom) => {
		let labels = animation.labels,
			recent = animation._recent || _zeroPosition,
			clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur, //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
			//buildFrom = useBuildFrom ? animation._build : "auto",
			i, offset;
		if (_isString(position) && (isNaN(position) || (position in labels))) { //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
			i = position.charAt(0);
			if (i === "<" || i === ">") {
				return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
			}
			i = position.indexOf("=");
			if (i < 0) {
				if (!(position in labels)) {
					labels[position] = clippedDuration;
				}
				return labels[position];
			}
			offset = +(position.charAt(i-1) + position.substr(i+1));
			return (i > 1) ? _parsePosition(animation, position.substr(0, i-1)) + offset : clippedDuration + offset;
		}
		return (position == null) ? clippedDuration : +position;
		//return (position == null) ? (isNaN(buildFrom) ? clippedDuration : buildFrom) : (buildFrom === ">>" ? clippedDuration : +buildFrom || 0) + (+position);
	},
	_conditionalReturn = (value, func) => value || value === 0 ? func(value) : func,
	_clamp = (min, max, value) => value < min ? min : value > max ? max : value,
	getUnit = value => (value + "").substr((parseFloat(value) + "").length),
	clamp = (min, max, value) => _conditionalReturn(value, v => _clamp(min, max, v)),
	_slice = [].slice,
	_isArrayLike = value => (_isObject(value) && "length" in value && (value.length - 1) in value && _isObject(value[0]) && value !== _win),
	_flatten = (ar, leaveStrings, accumulator = []) => ar.forEach(value => (_isString(value) && !leaveStrings) || _isArrayLike(value) ? accumulator.push(...toArray(value)) : accumulator.push(value)) || accumulator,
	toArray = (value, leaveStrings) => { //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
		return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
	},
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
					if (d > max) {
						max = d;
					}
					if (d < min) {
						min = d;
					}
				}
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
		return raw => ~~(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw));
	},
	snap = (snapTo, value) => {
		let isArray = _isArray(snapTo),
			radius, is2D;
		if (!isArray && _isObject(snapTo)) {
			radius = isArray = snapTo.radius || _bigNum;
			snapTo = toArray(snapTo.values);
			if ((is2D = !_isNumber(snapTo[0]))) {
				radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
			}
		}
		return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : raw => {
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
	random = (min, max, roundingIncrement, returnFunction) => _conditionalReturn(_isArray(min) ? !max : !returnFunction, () => _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? 10 ** ((roundingIncrement + "").length - 2) : 1) && (~~(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction)),
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
			value = (total + (value - min) % total) % total;
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
		return _conditionalReturn(value, value => outMin + ((value - inMin) / inRange) * outRange);
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
		if (executeLazyFirst && _lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
			_lazyRender();
		}
		return params ? callback.apply(scope, params) : callback.call(scope, animation);
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
	splitColor = (v, toHSL) => {
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
					return v.match(_numExp);
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
			a[0] = (h + .5) | 0;
			a[1] = (s * 100 + .5) | 0;
			a[2] = (l * 100 + .5) | 0;
		}
		return a;
	},
	_formatColors = (s, toHSL) => {
		let colors = (s + "").match(_colorExp),
			charIndex = 0,
			parsed = "",
			i, color, temp;
		if (!colors) {
			return s;
		}
		for (i = 0; i < colors.length; i++) {
			color = colors[i];
			temp = s.substr(charIndex, s.indexOf(color, charIndex)-charIndex);
			charIndex += temp.length + color.length;
			color = splitColor(color, toHSL);
			if (color.length === 3) {
				color.push(1);
			}
			parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")";
		}
		return parsed + s.substr(charIndex);
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
			a[0] = _formatColors(a[0], toHSL);
			a[1] = _formatColors(a[1], toHSL);
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
			_gap = 1 / 60,
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
				if (!manual) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
					_id = _req(_tick);
				}
				if (dispatch) {
					_listeners.forEach(l => l(_self.time, elapsed, _self.frame, v));
				}
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
				_gap = 1 / (fps || 60);
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
	// potential future feature - allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos. Not sure it's worth the kb.
	// _propagateYoyoEase = (timeline, isYoyo) => {
	// 	let child = timeline._first, ease;
	// 	while (child) {
	// 		if (child instanceof Timeline) {
	// 			_propagateYoyoEase(child, isYoyo);
	// 		} else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
	// 			if (child.timeline) {
	// 				_propagateYoyoEase(child.timeline, isYoyo);
	// 			} else {
	// 				ease = child._ease;
	// 				child._ease = child._yEase;
	// 				child._yEase = ease;
	// 				child._yoyo = isYoyo;
	// 			}
	// 		}
	// 		child = child._next;
	// 	}
	// },
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
		let easeOut = p => ((--p) * p * ((overshoot + 1) * p + overshoot) + 1),
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
_insertEase("Sine", p => -_cos(p * _HALF_PI) + 1);
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
		this._dur = this._tDur = +vars.duration || 0;
		this._delay = +vars.delay || 0;
		if ((this._repeat = vars.repeat || 0)) {
			this._rDelay = vars.repeatDelay || 0;
			this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
			_onUpdateTotalDuration(this);
		}
		this._ts = 1;
		this.data = vars.data;

		if (!_tickerActive) {
			_ticker.wake();
		}
		if (parent) {
			_addToTimeline(parent, this, (time || time === 0) ? time : parent._time);
		}
		if (vars.reversed) {
			this.reversed(true);
		}
		if (vars.paused) {
			this.paused(true);
		}
	}

	delay(value) {
		if (value || value === 0) {
			this._delay = value;
			return this;
		}
		return this._delay;
	}

	duration(value) {
		let isSetter = arguments.length,
			repeat = this._repeat,
			repeatCycles = repeat > 0 ? repeat * ((isSetter ? value : this._dur) + this._rDelay) : 0;
		return isSetter ? this.totalDuration( (repeat < 0) ? value : value + repeatCycles ) : this.totalDuration() && this._dur;
	}

	totalDuration(value) {
		if (!arguments.length) {
			return this._tDur;
		}
		let repeat = this._repeat,
			isInfinite = (value || this._rDelay) && repeat < 0;
		this._tDur = isInfinite ? 1e20 : value;
		this._dur = isInfinite ? value : (value - (repeat * this._rDelay)) / (repeat + 1);
		this._dirty = 0;
		_uncache(this.parent);
		return this;
	}

	totalTime(totalTime, suppressEvents) {
		_wake();
		if (!arguments.length) {
			return this._tTime;
		}
		let parent = this.parent || this._dp,
			start;
		if (parent && parent.smoothChildTiming && this._ts) {
			start = this._start;
			// if (!parent._dp && parent._time === parent._dur) { // if a root timeline completes...and then a while later one of its children resumes, we must shoot the playhead forward to where it should be raw-wise, otherwise the child will jump to the end. Down side: this assumes it's using the _ticker.time as a reference.
			// 	parent._time = _ticker.time - parent._start;
			// }
			this._start = parent._time - (this._ts > 0 ? totalTime / this._ts : ((this._dirty ? this.totalDuration() : this._tDur) - totalTime) / -this._ts);
			this._end += this._start - start;
			if (!parent._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
				_uncache(parent);
			}
			//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.
			while (parent.parent) {
				if (parent.parent._time !== parent._start + (parent._ts > 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
					parent.totalTime(parent._tTime, true);
				}
				parent = parent.parent;
			}
			if (!this.parent) { //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this).
				_addToTimeline(this._dp, this, this._start - this._delay);
			}
		}
		if (this._tTime !== totalTime || !this._dur) {
			_lazySafeRender(this, totalTime, suppressEvents);
		}
		return this;
	}

	time(value, suppressEvents) {
		return arguments.length ? this.totalTime(value + _elapsedCycleDuration(this), suppressEvents) : this._time;
	}

	totalProgress(value, suppressEvents) {
		return arguments.length ? this.totalTime( this.totalDuration() * value, suppressEvents) : this._tTime / this.totalDuration();
	}

	progress(value, suppressEvents) {
		return arguments.length ? this.totalTime( this.duration() * value + _elapsedCycleDuration(this), suppressEvents) : (this.duration() ? this._time / this._dur : this.ratio);
	}

	iteration(value, suppressEvents) {
		let cycleDuration = this.duration() + this._rDelay;
		return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? ~~(this._tTime / cycleDuration) + 1 : 1;
	}

	timeScale(value) {
		let prevTS = this._ts;
		if (!arguments.length) {
			return prevTS || this._pauseTS;
		}
		if (!prevTS) {
			this._pauseTS = value;
			return this;
		}
		//don't allow a zero _ts, otherwise we can't resume() properly. For example, gsap.fromTo(tween, {timeScale:0}, {timeScale:1}) wouldn't work because the timeScale:0 would of course pause, and we'd record _pauseTS as 0...and then when resuming we'd copy that back to _ts...which would still keep it paused.
		this._end = this._start + this._tDur / (this._ts = value || _tinyNum);
		return _recacheAncestors(this).totalTime(this._tTime, true);
	}

	paused(value) {
		let isPaused = !this._ts;
		if (!arguments.length) {
			return isPaused;
		}
		if (isPaused !== value) {
			if (value) {
				this._pauseTS = this._ts;
				this._pTime = this._tTime ||  Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.
				this._ts = this._act = 0; //we use a timeScale of 0 to indicate a paused state, but we record the old "real" timeScale as _pauseTS so we can revert when unpaused.
			} else {
				this._ts = this._pauseTS;
				value = this._tTime || this._pTime; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume().
				if (this.progress() === 1) { // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course).
					this._tTime -= _tinyNum;
				}
				this.totalTime(value, true);
			}
		}
		return this;
	}

	startTime(value) {
		if (arguments.length) {
			if (this.parent && this.parent._sort) {
				_addToTimeline(this.parent, this, value - this._delay);
			}
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

	// globalTime(rawTime) {
	// 	let animation = this,
	// 		time = arguments.length ? rawTime : animation.rawTime();
	// 	while (animation) {
	// 		time = animation._start + time / (animation._ts || 1);
	// 		animation = animation.parent;
	// 	}
	// 	return time;
	// }

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
		let ts = this._ts || this._pauseTS;
		if (arguments.length) {
			if (value !== this.reversed()) {
				this[this._ts ? "_ts" : "_pauseTS"] = Math.abs(ts) * (value ? -1 : 1);
				this.totalTime(this._tTime, true);
			}
			return this;
		}
		return ts < 0;
	}

	invalidate() {
		this._initted = 0;
		return this;
	}

	isActive() {
		let parent = this.parent || this._dp,
			start = this._start,
			rawTime;
		return !parent || (this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
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

	then(onFulfilled = _emptyFunc) {
		return new Promise(resolve => {
			this._prom = () => {
				onFulfilled(this);
				resolve();
			}
		});
	}

	kill() {
		_interrupt(this);
	}

}

_setDefaults(Animation.prototype, {_time:0, _start:0, _end:0, _tTime:0, _tDur:0, _dirty:0, _repeat:0, _yoyo:false, parent:0, _rDelay:0, _ts:1, _dp:0, ratio:0, _zTime:-_tinyNum, _prom:0});


















/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */

export class Timeline extends Animation {

	constructor(vars = {}, time) {
		super(vars, time);
		this.labels = {};
		this.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
		this.autoRemoveChildren = !!vars.autoRemoveChildren;
		this._sort = _isNotFalse(vars.sortChildren);
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
		if (!vars.repeatDelay) {
			vars.repeat = 0;
		}
		vars.immediateRender = !!vars.immediateRender;
		new Tween(targets, vars, _parsePosition(this, position));
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
		vars.immediateRender = _isNotFalse(vars.immediateRender);
		return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
	}

	staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
		toVars.startAt = fromVars;
		toVars.immediateRender = _isNotFalse(toVars.immediateRender);
		return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
	}

	render(totalTime, suppressEvents, force) {
		let prevTime = this._time,
			tDur = this._dirty ? this.totalDuration() : this._tDur,
			dur = this._dur,
			tTime = (totalTime > tDur - _tinyNum && totalTime >= 0 && this !== _globalTimeline) ? tDur : (totalTime < _tinyNum) ? 0 : totalTime,
			crossingStart = (this._zTime < 0) !== (totalTime < 0) && this._initted,
			time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
		if (tTime !== this._tTime || force || crossingStart) {
			if (crossingStart) {
				if (!dur) {
					prevTime = this._zTime;
				}
				if (totalTime || !suppressEvents) { //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.
					this._zTime = totalTime;
				}
			}
			time = tTime;
			prevStart = this._start;
			timeScale = this._ts;
			prevPaused = (timeScale === 0);
			if (prevTime !== this._time && dur) { //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
				time += this._time - prevTime;
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
				prevIteration = ~~(this._tTime / cycleDuration);
				if (prevIteration && prevIteration === this._tTime / cycleDuration) {
					prevIteration--;
				}
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
					this.render(prevTime, suppressEvents, !dur)._lock = 0;
					if (!suppressEvents && this.parent) {
						_callback(this, "onRepeat");
					}
					if (prevTime !== this._time || prevPaused !== !this._ts) {
						return this;
					}
					if (doesWrap) {
						this._lock = 2;
						prevTime = rewinding ? dur + 0.0001 : -0.0001;
						this.render(prevTime, true);
					}
					this._lock = 0;
					if (!this._ts && !prevPaused) {
						return this;
					}
					//in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.
					//_propagateYoyoEase(this, isYoyo);
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
					return this.render(totalTime, suppressEvents, force);
				}
			}
			if (this._onUpdate && !suppressEvents) {
				_callback(this, "onUpdate", true);
			}
			if (tTime === tDur || (!tTime && this._ts < 0)) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!time || tDur >= this.totalDuration()) {
				(totalTime || !dur) && _removeFromParent(this, 1);
				if (!suppressEvents && !(totalTime < 0 && !prevTime)) {
					_callback(this, (tTime === tDur ? "onComplete" : "onReverseComplete"), true);
					this._prom && (tTime === tDur) && this._prom();
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

	// buildFrom(position, absolute) {
	// 	this._build = (position === ">>" || position === "auto") ? position : (position === "<<") ? 0 : _parsePosition(this, position, !absolute);
	// 	return this;
	// }

	getChildren(nested = true, tweens = true, timelines = true, ignoreBeforeTime = -_bigNum) {
		let a = [],
			child = this._first;
		while (child) {
			if (child._start >= ignoreBeforeTime) {
				if (child instanceof Tween) {
					if (tweens) {
						a.push(child);
					}
				} else {
					if (timelines) {
						a.push(child);
					}
					if (nested) {
						a.push(...child.getChildren(true, tweens, timelines));
					}
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
		if (!this.parent && !this._dp && this._ts) { //special case for the global timeline (or any other that has no parent or detached parent).
			this._start = _ticker.time - (this._ts > 0 ? totalTime / this._ts : (this.totalDuration() - totalTime) / -this._ts);
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
			tweens[i].kill(targets, props);
		}
		return this;
	}

	getTweensOf(targets, onlyActive) {
		let a = [],
			parsedTargets = toArray(targets),
			child = this._first,
			children;
		while (child) {
			if (child instanceof Tween) {
				if (_arrayContainsAny(child._targets, parsedTargets) && (!onlyActive || child.isActive())) {
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
		let tl = this,
			endTime = _parsePosition(tl, position),
			startAt = (vars && vars.startAt),
			tween = Tween.to(tl, _setDefaults({
				ease:"none",
				lazy:false,
				time:endTime,
				duration: (Math.abs(endTime - ((startAt && "time" in startAt) ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
				onStart: () => {
					tl.pause();
					let duration = Math.abs(endTime - tl._time) / tl.timeScale();
					if (tween._dur !== duration) {
						tween._dur = duration;
						tween.render(tween._time, true, true);
					}
					if (vars && vars.onStart) { //in case the user had an onStart in the vars - we don't want to overwrite it.
						vars.onStart.apply(tween, vars.onStartParams || []);
					}
				}
			}, vars));
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
		this._time = this._tTime = 0;
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
			repeat = self._repeat,
			repeatCycles = repeat * self._rDelay || 0,
			isInfinite = (repeat < 0),
			prev, end;
		if (!arguments.length) {
			if (self._dirty) {
				while (child) {
					prev = child._prev; //record it here in case the tween changes position in the sequence...
					if (child._dirty) {
						child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.
					}
					if (child._start > prevStart && self._sort && child._ts && !self._lock) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
						self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().
						_addToTimeline(self, child, child._start - child._delay);
						self._lock = 0;
					} else {
						prevStart = child._start;
					}
					if (child._start < 0 && child._ts) { //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
						max -= child._start;
						if ((!self.parent && !self._dp) || (self.parent && self.parent.smoothChildTiming)) {
							self._start += child._start / self._ts;
							self._time -= child._start;
							self._tTime -= child._start;
						}
						self.shiftChildren(-child._start, false, -_bigNum);
						prevStart = 0;
					}
					end = child._end = child._start + child._tDur / Math.abs(child._ts || child._pauseTS);
					if (end > max && child._ts) {
						max = _round(end);
					}
					child = prev;
				}
				self._dur = (self === _globalTimeline && self._time > max) ? self._time : Math.min(_bigNum, max);
				self._tDur = isInfinite && (self._dur || repeatCycles) ? 1e20 : Math.min(_bigNum, max * (repeat + 1) + repeatCycles);
				self._end = self._start + ((self._tDur / Math.abs(self._ts || self._pauseTS)) || 0);
				self._dirty = 0;
			}
			return self._tDur;
		}
		return isInfinite ? self : self.timeScale(self.totalDuration() / value);
	}

	static updateRoot(time) {
		if (_globalTimeline._ts) {
			_lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
		}
		if (_ticker.frame >= _nextGCFrame) {
			_nextGCFrame += _config.autoSleep || 120;
			let child = _globalTimeline._first;
			if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
				while (child && !child._ts) {
					child = child._next;
				}
				if (!child) {
					_ticker.sleep();
				}
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
				startNum = parseFloat(startNums[matchIndex-1]);
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
		if (_isFunction(end)) {
			end = end(index || 0, target, targets);
		}
		let currentValue = target[prop],
			parsedStart = (start !== "get") ? start : !_isFunction(currentValue) ? currentValue : (funcParam ? target[(prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)])) ? prop : "get" + prop.substr(3)](funcParam) : target[prop]()),
			setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
			pt;
		if (_isString(end)) {
			if (~end.indexOf("random(")) {
				end = _replaceRandom(end);
			}
			if (end.charAt(1) === "=") {
				end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + getUnit(parsedStart);
			}
		}
		if (parsedStart !== end) {
			if (!isNaN(parsedStart + end)) {
				pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof(currentValue) === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
				if (funcParam) {
					pt.fp = funcParam;
				}
				if (modifier) {
					pt.modifier(modifier, this, target);
				}
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
			cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars;
		if (tl && (!keyframes || !ease)) {
			ease = "none";
		}
		tween._ease = _parseEase(ease, _defaults.ease);
		tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
		if (yoyoEase && tween._yoyo && !tween._repeat) { //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
			yoyoEase = tween._yEase;
			tween._yEase = tween._ease;
			tween._ease = yoyoEase;
		}
		if (!tl) { //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
			if (prevStartAt) {
				prevStartAt.render(-1, true).kill();
			}
			if (startAt) {
				_removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({data: "isStart", overwrite: false, parent: parent, immediateRender: true, lazy: _isNotFalse(lazy), startAt: null, delay: 0, onUpdate: onUpdate, onUpdateParams: onUpdateParams, callbackScope: callbackScope, stagger: 0}, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);
				if (immediateRender) {
					if (time > 0) {
						!autoRevert && (tween._startAt = 0); //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in Timeline instances where immediateRender was false or when autoRevert is explicitly set to true.
					} else if (dur) {
						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
					}
				}
			} else if (runBackwards && dur) {
				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
				if (prevStartAt) {
					!autoRevert && (tween._startAt = 0);
				} else {
					if (time) { //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
						immediateRender = false;
					}
					_removeFromParent(tween._startAt = Tween.set(targets, _merge(_copyExcluding(vars, _reservedProps), {
						overwrite: false,
						data: "isFromStart", //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
						lazy: (immediateRender && _isNotFalse(lazy)),
						immediateRender: immediateRender, //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
						stagger: 0,
						parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.cycle([-100,100])})
					})));
					if (!immediateRender) {
						_initTween(tween._startAt, time); //ensures that the initial values are recorded
						if (immediateRender) {
							!autoRevert && (tween._startAt = 0);
						}
					} else if (!time) {
						return;
					}
				}
			}
			cleanVars = _copyExcluding(vars, _reservedProps);
			tween._pt = 0;
			harness = targets[0] ? _getCache(targets[0]).harness : 0;
			harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.
			for (i = 0; i < targets.length; i++) {
				target = targets[i];
				gsData = target._gsap || _harness(targets)[i]._gsap;
				tween._ptLookup[i] = ptLookup = {};
				if (_lazyLookup[gsData.id]) {
					_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
				}
				index = fullTargets === targets ? i : fullTargets.indexOf(target);
				if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
					tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
					plugin._props.forEach(name => {ptLookup[name] = pt;});
					if (plugin.priority) {
						hasPriority = 1;
					}
				}
				if (!harness || harnessVars) {
					for (p in cleanVars) {
						if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
							if (plugin.priority) {
								hasPriority = 1;
							}
						} else {
							ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
						}
					}
				}
				if (tween._op && tween._op[i]) {
					tween.kill(target, tween._op[i]);
				}
				if (autoOverwrite) {
					_overwritingTween = tween;
					_globalTimeline.killTweensOf(target, ptLookup, true); //Also make sure the overwriting doesn't overwrite THIS tween!!!
					_overwritingTween = 0;
				}
				if (tween._pt && ((_isNotFalse(lazy) && dur) || (lazy && !dur))) {
					_lazyLookup[gsData.id] = 1;
				}
			}
			if (hasPriority) {
				_sortPropTweensByPriority(tween);
			}
			if (tween._onInit) { //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
				tween._onInit(tween);
			}
		}
		tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.
		tween._onUpdate = onUpdate;
		tween._initted = 1;
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
	_staggerTweenProps = _callbackNames + ",repeat,repeatDelay,yoyo,yoyoEase",
	_staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration").split(",");























/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */

export class Tween extends Animation {

	constructor(targets, vars, time) {
		if (typeof(vars) === "number") {
			time.duration = vars;
			vars = time;
			time = null;
		}
		super(_inheritDefaults(vars), time);
		let { duration, delay, immediateRender, stagger, overwrite, keyframes, defaults } = this.vars,
			parsedTargets = toArray(targets),
			tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
		this._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [{}];
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
							if (!staggerVarsToMerge) {
								staggerVarsToMerge = {};
							}
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
					if (staggerVarsToMerge) {
						_merge(copy, staggerVarsToMerge);
					}
					if (vars.yoyoEase && !vars.repeat) { //so that propagation works properly when a ancestor timeline yoyos
						copy.yoyoEase = vars.yoyoEase;
					}
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
				duration = delay = 0;
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

		if (immediateRender || (!duration && !keyframes && this._start === this.parent._time  && _isNotFalse(immediateRender) && _hasNoPausedAncestors(this) && this.parent.data !== "nested")) {
			this._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
			this.render(Math.max(0, -delay)); //in case delay is negative
		}
	}

	render(totalTime, suppressEvents, force) {
		let prevTime = this._time,
			tDur = this._tDur,
			dur = this._dur,
			tTime = (totalTime > tDur - _tinyNum && totalTime >= 0) ? tDur : (totalTime < _tinyNum) ? 0 : totalTime,
			time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline, yoyoEase;
		if (!dur) {
			_renderZeroDurationTween(this, totalTime, suppressEvents, force);
		} else if (tTime !== this._tTime || force || (this._startAt && (this._zTime < 0) !== (totalTime < 0))) { //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
			time = tTime;
			timeline = this.timeline;
			if (this._repeat) { //adjust the time for repeats and yoyos
				cycleDuration = dur + this._rDelay;
				time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)
				if (time > dur) {
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
				prevIteration = ~~(this._tTime / cycleDuration);
				if (prevIteration && prevIteration === this._tTime / cycleDuration) {
					prevIteration--;
				}
				if (time === prevTime && !force) {
					//could be during the repeatDelay part. No need to render and fire callbacks.
					return this;
				}
				if (iteration !== prevIteration) {
					//timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo);
					//repeatRefresh functionality
					if (this.vars.repeatRefresh && !this._lock) {
						this._lock = 1;
						this.render(cycleDuration * iteration, true).invalidate()._lock = 0;
					}
				}
			}

			if (!this._initted && _attemptInitTween(this, time, force, suppressEvents)) {
				return this;
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

			if (!prevTime && time && !suppressEvents) {
				_callback(this, "onStart");
			}

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

			if (this._repeat) if (iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent) {
				_callback(this, "onRepeat");
			}
			if ((tTime === tDur || !tTime) && this._tTime === tTime) {
				if (totalTime < 0 && this._startAt && !this._onUpdate) {
					this._startAt.render(totalTime, true, force);
				}
				(totalTime || !dur) && (tTime || this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime).
				if (!suppressEvents && !(totalTime < 0 && !prevTime)) {
					_callback(this, (tTime === tDur ? "onComplete" : "onReverseComplete"), true);
					this._prom && (tTime === tDur) && this._prom();
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
		if (this.timeline) {
			this.timeline.invalidate();
		}
		return super.invalidate();
	}

	kill(targets, vars = "all") {
		if (_overwritingTween === this) {
			return _overwritingTween;
		}
		if (!targets && (!vars || vars === "all")) {
			if (this.parent) {
				this._lazy = 0;
				return _interrupt(this);
			}
		}
		if (this.timeline) {
			this.timeline.killTweensOf(targets, vars);
			return this;
		}
		let parsedTargets = this._targets,
			killingTargets = targets ? toArray(targets) : parsedTargets,
			propTweenLookup = this._ptLookup,
			firstPT = this._pt,
			overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
		if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
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
							delete curLookup[p];
						}
					}
					if (curOverwriteProps !== "all") {
						curOverwriteProps[p] = 1;
					}
				}
			}
		}
		if (this._initted && !this._pt && firstPT) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
			_interrupt(this);
		}
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
		if (!vars.repeatDelay) {
			vars.repeat = 0;
		}
		return new Tween(targets, vars);
	}

	static killTweensOf(targets, props, onlyActive) {
		return _globalTimeline.killTweensOf(targets, props, onlyActive);
	}
}

_setDefaults(Tween.prototype, {_targets:[], _initted:0, _lazy:0, _startAt:0, _op:0, _onInit:0});

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
			params = toArray(arguments);
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
	_renderPlain = (ratio, data) => data.set(data.t, data.p, ~~((data.s + data.c * ratio) * 10000) / 10000, data),
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
				s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : (~~((pt.s + pt.c * ratio) * 10000) / 10000)) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.
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
	_setterWithModifier = function(target, property, value, data) {
		data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
	},
	_sortPropTweensByPriority = (parent) => {
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
_forEachName(_callbackNames + ",parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert", name => {_reservedProps[name] = 1; if (name.substr(0,2) === "on") _reservedProps[name + "Params"] = 1});
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({sortChildren: false, defaults: _defaults, autoRemoveChildren: true, id:"root"});
_config.stringFilter = _colorStringFilter;

















/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */
export const gsap = {
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
			setter = Plugin ? value => {
				let p = new Plugin();
				_quickTween._pt = 0;
				p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
				p.render(1, p);
				_quickTween._pt && _renderPropTweens(1, _quickTween);
			} : cache.set(target, property);
		return Plugin ? setter : value => setter(target, property, unit ? value + unit : value, cache, 1);
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
		_effects[name] = (targets, vars) => effect(toArray(targets), _setDefaults(vars || {}, defaults));
		if (extendTimeline) {
			Timeline.prototype[name] = function(targets, vars, position) {
				return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}), position);
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
	utils: { wrap, wrapYoyo, distribute, random, snap, normalize, getUnit, clamp, splitColor, toArray, mapRange, pipe, unitize, interpolate },
	install: _install,
	effects: _effects,
	ticker: _ticker,
	updateRoot: Timeline.updateRoot,
	plugins: _plugins,
	globalTimeline: _globalTimeline,
	core: {PropTween: PropTween, globals: _addGlobal, Tween: Tween, Timeline: Timeline, Animation: Animation, getCache: _getCache}
};

_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", name => gsap[name] = Tween[name]);
_ticker.add(Timeline.updateRoot);
_quickTween = gsap.to({}, {duration:0});




// ---- EXTRA PLUGINS --------------------------------------------------------


let _addModifiers = (tween, modifiers) => {
		let	targets = tween._targets,
			p, i, pt;
		for (p in modifiers) {
			i = targets.length;
			while (i--) {
				pt = tween._ptLookup[i][p];
				if (pt) {
					if (pt.d.modifier) {
						pt.d.modifier(modifiers[p], tween, targets[i], p);
					}
				}
			}
		}
	},
	_buildModifierPlugin = (name, modifier) => {
		return {
			name:name,
			rawVars:1, //don't pre-process function-based values or "random()" strings.
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
gsap.registerPlugin({
		name:"attr",
		init(target, vars, tween, index, targets) {
			for (let p in vars) {
				this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
				//this.add(target, "setAttribute", (target.getAttribute((p in target.dataset ? (p = "data-" + p) : p)) || 0) + "", vars[p], index, targets, 0, 0, p);
				this._props.push(p);
			}
		}
	}, {
		name:"endArray",
		init(target, value) {
			let i = value.length;
			while (i--) {
				this.add(target, i, target[i], value[i]);
			}
		}
	},
	_buildModifierPlugin("roundProps", _roundModifier),
	_buildModifierPlugin("modifiers"),
	_buildModifierPlugin("snap", snap)
);

Tween.version = Timeline.version = gsap.version = "3.0.1";
_coreReady = 1;
if (_windowExists()) {
	_wake();
}

export const { Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong, Elastic, Back, SteppedEase, Bounce, Sine, Expo, Circ } = _easeMap;
export { Tween as TweenMax, Tween as TweenLite, Timeline as TimelineMax, Timeline as TimelineLite, gsap as default, wrap, wrapYoyo, distribute, random, snap, normalize, getUnit, clamp, splitColor, toArray, mapRange, pipe, unitize, interpolate };
//export some internal methods/orojects for use in CSSPlugin so that we can externalize that file and allow custom builds that exclude it.
export { _getProperty, _numExp, _isString, _isUndefined, _renderComplexString, _relExp, _setDefaults, _removeLinkedListItem, _forEachName, _sortPropTweensByPriority, _colorStringFilter, _replaceRandom, _checkPlugin, _plugins, _ticker, _config, _roundModifier, _round, _missingPlugin, _getSetter, _getCache }