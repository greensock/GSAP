/*!
 * VERSION: 0.3.0
 * DATE: 2013-07-03
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue || (window._gsQueue = [])).push( function() {

	"use strict";

	window._gsDefine("utils.Draggable", ["events.EventDispatcher","TweenLite"], function(EventDispatcher, TweenLite) {

		var tempVarsXY = {css:{}}, //speed optimization - we reuse the same vars object for x/y TweenLite.set() calls to minimize garbage collection tasks and improve speed.
			tempVarsX = {css:{}},
			tempVarsY = {css:{}},
			tempVarsRotation = {css:{}},
			doc = document,
			emptyArray = [],
			emptyFunc = function() { return false; },
			RAD2DEG = 180 / Math.PI,
			prefix,
			ThrowPropsPlugin,
			checkPrefix = function(e, p) {
				var s = e.style,
					capped, i, a;
				if (s[p] === undefined) {
					a = ["O","Moz","ms","Ms","Webkit"];
					i = 5;
					capped = p.charAt(0).toUpperCase() + p.substr(1);
					while (--i > -1 && s[a[i]+capped] === undefined) { }
					if (i < 0) {
						return "";
					}
					prefix = (i === 3) ? "ms" : a[i];
					p = prefix + capped;
				}
				return p;
			},
			setStyle = function(e, p, value) {
				var s = e.style;
				if (s[p] === undefined) {
					p = checkPrefix(e, p);
				}
				if (value == null) {
					if (s.removeProperty) {
						s.removeProperty(p.replace(/([A-Z])/g, "-$1").toLowerCase());
					} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
						s.removeAttribute(p);
					}
				} else if (s[p] !== undefined) {
					s[p] = value;
				}
			},
			getComputedStyle = doc.defaultView ? doc.defaultView.getComputedStyle : emptyFunc,
			getStyle = function(element, prop) {
				var rv = (element._gsTransform || {})[prop],
					cs;
				if (rv || rv === 0) {
					return rv;
				} else if (element.style[prop]) {
					rv = element.style[prop];
				} else if ((cs = getComputedStyle(element))) {
					element = cs.getPropertyValue(prop);
					rv = (element || cs.length) ? element : cs[prop]; //Opera behaves VERY strangely - length is usually 0 and cs[prop] is the only way to get accurate results EXCEPT when checking for -o-transform which only works with cs.getPropertyValue()!
				} else if (element.currentStyle) {
					rv = element.currentStyle[prop];
				}
				return parseFloat(rv) || 0;
			},
			addListener = function(element, type, func) {
				if (element.addEventListener) {
					element.addEventListener(type, func, false);
				} else if (element.attachEvent) {
					element.attachEvent("on" + type, func);
				}
			},
			removeListener = function(element, type, func) {
				if (element.removeEventListener) {
					element.removeEventListener(type, func);
				} else if (element.detachEvent) {
					element.detachEvent("on" + type, func);
				}
			},
			dispatchEvent = function(instance, type, callbackName) {
				var vars = instance.vars,
					callback = vars[callbackName],
					listeners = instance._listeners[type];
				if (typeof(callback) === "function") {
					callback.apply(vars[callbackName + "Scope"] || instance, vars[callbackName + "Params"] || emptyArray);
				}
				if (listeners) {
					instance.dispatchEvent(type);
				}
			},
			getBounds = function(e) {
				if (e === window) {
					return {
						top:(window.pageYOffset != null) ? window.pageYOffset : (doc.scrollTop != null) ? doc.scrollTop : doc.body.scrollTop,
						left:(window.pageXOffset != null) ? window.pageXOffset : (doc.scrollLeft != null) ? doc.scrollLeft : doc.body.scrollLeft,
						width: (doc.documentElement ? doc.documentElement.clientWidth : window.innerWidth),
						height: (doc.documentElement ? doc.documentElement.clientHeight : window.innerHeight)
					};
				}
				var width = e.offsetWidth,
					height = e.offsetHeight,
					top = e.offsetTop,
					left = e.offsetLeft;
				while ((e = e.offsetParent)) {
					top += e.offsetTop;
					left += e.offsetLeft;
				}
				return {top:top, left:left, width:width, height:height};
			},
			originProp = checkPrefix(doc.body, "transformOrigin").replace(/([A-Z])/g, "-$1").toLowerCase(),
			getTransformOriginOffset = function(e) {
				var bounds = getBounds(e),
					cs = getComputedStyle(e),
					v = (originProp && cs) ? cs.getPropertyValue(originProp) : "50% 50%",
					a = v.split(" "),
					x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
					y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1];
				if (y == null) {
					y = "0";
				} else if (y === "center") {
					y = "50%";
				}
				if (x === "center" || isNaN(parseFloat(x))) { //remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN(). If there's an "=" sign in the value, it's relative.
					x = "50%";
				}
				bounds.left += (x.indexOf("%") !== -1) ? bounds.width * parseFloat(x) / 100 : parseFloat(x);
				bounds.top += (y.indexOf("%") !== -1) ? bounds.height * parseFloat(y) / 100 : parseFloat(y);
				return bounds;
			},
			_isArrayLike = function(e) {
				return (e.length && e[0] && ((e[0].nodeType && e[0].style && !e.nodeType) || (e[0].length && e[0][0]))) ? true : false; //could be an array of jQuery objects too, so accommodate that.
			},
			_flattenArray = function(a) {
				var result = [],
					l = a.length,
					i, e, j;
				for (i = 0; i < l; i++) {
					e = a[i];
					if (_isArrayLike(e)) {
						j = e.length;
						for (j = 0; j < e.length; j++) {
							result.push(e[j]);
						}
					} else {
						result.push(e);
					}
				}
				return result;
			},



			Draggable = function(target, vars) {
				EventDispatcher.call(this, target);
				if (target.length && target[0]) { //in case the target is a selector object.
					target = target[0];
				}
				if (!ThrowPropsPlugin) {
					ThrowPropsPlugin = (window.GreenSockGlobals || window).com.greensock.plugins.ThrowPropsPlugin;
				}
				this.vars = vars = vars || {};
				this.target = target;
				var type = vars.type || "top,left",
					xyMode = (type.indexOf("x") !== -1 || type.indexOf("y") !== -1),
					rotationMode = (type.indexOf("rotation") !== -1),
					xProp = xyMode ? "x" : "left",
					yProp = xyMode ? "y" : "top",
					allowX = (type.indexOf("x") !== -1 || type.indexOf("left") !== -1),
					allowY = (type.indexOf("y") !== -1 || type.indexOf("top") !== -1),
					self = this,
					killProps = {},
					edgeTolerance = parseFloat(vars.edgeTolerance) || 0,
					startMouseX, startMouseY, startElementX, startElementY, hasBounds, hasDragCallback, xMax, xMin, yMax, yMin, tempVars, cssVars, touch, rotationOffset,
					onPress = function(e) {
						e.preventDefault();
						if (e.changedTouches) { //touch events store the data slightly differently
							e = touch = e.changedTouches[0];
						}
						TweenLite.killTweensOf(target, killProps); //in case the user tries to drag it before the last tween is done.
						startMouseY = e.pageY; //record the starting x and y so that we can calculate the movement from the original in _onMouseMove
						startMouseX = e.pageX;
						if (rotationMode) {
							rotationOffset = getTransformOriginOffset(target);
							startElementX = rotationOffset.left;
							startElementY = rotationOffset.top;
							rotationOffset = Math.atan2(startElementY - startMouseY, startMouseX - startElementX);
						} else {
							startElementY = getStyle(target, yProp); //record the starting top and left values so that we can just add the mouse's movement to them later.
							startElementX = getStyle(target, xProp);
						}
						if (!rotationMode && vars.zIndexBoost !== false) {
							target.style.zIndex = Draggable.zIndex++;
						}
						addListener(doc, "mousemove", onMove); //attach these to the document instead of the box itself so that if the user's mouse moves too quickly (and off of the box), things still work.
						addListener(doc, "touchmove", onMove); //don't forget touch events
						addListener(doc, "mouseup", onRelease);
						addListener(doc, "touchend", onRelease);
						self.isDragging = true;
						hasBounds = !!vars.bounds;
						hasDragCallback = !!(vars.onDrag || self._listeners.drag);
						if (hasBounds) {
							var targetBounds = getBounds(target),
								bounds = (vars.bounds.length && vars.bounds !== window && vars.bounds[0] && !vars.bounds.nodeType) ? getBounds(vars.bounds[0]) : (vars.bounds === window || vars.bounds.style) ? getBounds(vars.bounds) : vars.bounds; //could be a selector/jQuery object or a DOM element or a generic object like {top:0, left:100, width:1000, height:800}
							self.xMin = xMin = (xyMode ? 0 : getStyle(target, "left")) + bounds.left - targetBounds.left;
							self.yMin = yMin = (xyMode ? 0 : getStyle(target, "top")) + bounds.top - targetBounds.top;
							self.xMax = xMax = xMin + (bounds.width - target.offsetWidth);
							self.yMax = yMax = yMin + (bounds.height - target.offsetHeight);
							if (xMin > xMax) {
								self.xMin = xMax;
								self.xMax = xMax = xMin;
								xMin = self.xMin;
							}
							if (yMin > yMax) {
								self.yMin = yMax;
								self.yMax = yMax = yMin;
								yMin = self.yMin;
							}
						}
						dispatchEvent(self, "dragstart", "onDragStart");
						return false;
					},
					onMove = function(e) {
						var touches = e.changedTouches,
							xChange, yChange, x, y, i;
						e.preventDefault();
						if (touches) { //touch events store the data slightly differently
							e = touches[0];
							if (e !== touch && e.target !== target) { //Usually changedTouches[0] will be what we're looking for, but in case it's not, look through the rest of the array...(and Android browsers don't reuse the event like iOS)
								i = touches.length;
								while (--i > -1 && (e = touches[i]).target !== target) {}
								if (i < 0) {
									return;
								}
							}
						}
						if (rotationMode) {
							x = Math.atan2(startElementY - e.pageY, e.pageX - startElementX);
							cssVars.rotation = "+=" + ((rotationOffset - x) * RAD2DEG);
							TweenLite.set(target, tempVars);
							rotationOffset = x;
						} else {
							yChange = (e.pageY - startMouseY),
							xChange = (e.pageX - startMouseX),
							x = (xChange > 2 || xChange < -2) ? startElementX + xChange : startElementX,
							y = (yChange > 2 || yChange < -2) ? startElementY + yChange : startElementY;
							if (hasBounds) {
								if (x > xMax) {
									x = xMax + (x - xMax) * edgeTolerance;
								} else if (x < xMin) {
									x = xMin + (x - xMin) * edgeTolerance;
								}
								if (y > yMax) {
									y = yMax + (y - yMax) * edgeTolerance;
								} else if (y < yMin) {
									y = yMin + (y - yMin) * edgeTolerance;
								}
							}
							if (xyMode) {
								if (allowY) {
									cssVars.y = y;
								}
								if (allowX) {
									cssVars.x = x;
								}
								TweenLite.set(target, tempVars);
							} else {
								if (allowY) {
									target.style.top = y + "px";
								}
								if (allowX) {
									target.style.left = x + "px";
								}
							}
						}
						if (hasDragCallback) {
							dispatchEvent(self, "drag", "onDrag");
						}
					},
					onRelease = function(e) {
						var touches = e.changedTouches,
							throwProps = vars.throwProps,
							xChange, yChange, i;
						if (touches) { //touch events store the data slightly differently
							e = touches[0];
							if (e !== touch && e.target !== target) { //Usually changedTouches[0] will be what we're looking for, but in case it's not, look through the rest of the array...(and Android browsers don't reuse the event like iOS)
								i = touches.length;
								while (--i > -1 && (e = touches[i]).target !== target) {}
								if (i < 0) {
									return;
								}
							}
						}
						yChange = (e.pageY - startMouseY);
						xChange = (e.pageX - startMouseX);
						self.isDragging = false;
						removeListener(doc, "mouseup", onRelease);
						removeListener(doc, "touchend", onRelease);
						removeListener(doc, "mousemove", onMove);
						removeListener(doc, "touchmove", onMove);
						if (throwProps && ThrowPropsPlugin) {
							if (throwProps === true) {
								throwProps = {resistance:(vars.resistance || 1000) / (rotationMode ? 100 : 1)};
								if (rotationMode) {
									throwProps.rotation = "auto";
								} else {
									if (allowX) {
										throwProps[xProp] = hasBounds ? {min:xMin, max:xMax} : "auto";
									}
									if (allowY) {
										throwProps[yProp] = hasBounds ? {min:yMin, max:yMax} : "auto";
									}
								}
							}
							ThrowPropsPlugin.to(target, {throwProps:throwProps, ease:(vars.ease || Power3.easeOut), onComplete:vars.onComplete}, vars.maxDuration || 2, vars.minDuration || 0.1, (vars.overshootTolerance === undefined) ? edgeTolerance + 0.2 : vars.overshootTolerance);
						}
						if (xChange < 2 && xChange > -2 && yChange < 2 && yChange > -2) {
							dispatchEvent(self, "click", "onClick");
						}
						dispatchEvent(self, "dragend", "onDragEnd");
					};

				this.enable = function() {
					addListener(target, "mousedown", onPress);
					addListener(target, "touchstart", onPress);
					if (!rotationMode) {
						setStyle(target, "cursor", vars.cursor || "move");
					}
					setStyle(target, "userSelect", "none");
					setStyle(target, "touchCallout", "none");
					if (ThrowPropsPlugin) {
						ThrowPropsPlugin.track(target, (xyMode ? "x,y" : rotationMode ? "rotation" : "top,left"));
					}
				};

				this.disable = function() {
					var dragging = this.isDragging;
					if (!rotationMode) {
						setStyle(target, "cursor", null);
					}
					setStyle(target, "userSelect", "text");
					setStyle(target, "touchCallout", "default");
					removeListener(target, "mousedown", onPress);
					removeListener(target, "touchstart", onPress);
					removeListener(doc, "mouseup", onRelease);
					removeListener(doc, "touchend", onRelease);
					removeListener(doc, "mousemove", onMove);
					removeListener(doc, "touchmove", onMove);
					if (ThrowPropsPlugin) {
						ThrowPropsPlugin.untrack(target, (xyMode ? "x,y" : rotationMode ? "rotation" : "top,left"));
					}
					this.isDragging = false;
					if (dragging) {
						dispatchEvent(this, "dragend", "onDragEnd");
					}
				};

				// prevent IE from trying to drag an image and prevent text selection in IE
				target.ondragstart = doc.onselectstart = emptyFunc;
				TweenLite.set(target, {css:{z:"+=0.01"}}); //improve performance by forcing a GPU layer when possible
				if (rotationMode) {
					killProps.rotation = 1;
				} else {
					if (allowX) {
						killProps.x = killProps.left = 1;
					}
					if (allowY) {
						killProps.y = killProps.top = 1;
					}
				}
				if (rotationMode) {
					tempVars = tempVarsRotation;
					cssVars = tempVars.css;
				} else if (xyMode) {
					tempVars = (allowX && allowY) ? tempVarsXY : allowX ? tempVarsX : tempVarsY;
					cssVars = tempVars.css;
				}
				this.isDragging = false;
				this.enable();
			},
			p = Draggable.prototype = new EventDispatcher();

		p.constructor = Draggable;
		Draggable.version = "0.3.0";
		Draggable.zIndex = 1000;

		Draggable.create = function(targets, vars) {
			if (typeof(targets) === "string") {
				targets = TweenLite.selector(targets);
			}
			var a = _isArrayLike(targets) ? _flattenArray(targets) : [targets],
				i = a.length;
			while (--i > -1) {
				a[i] = new Draggable(a[i], vars);
			}
			return a;
		};

		return Draggable;

	}, true);


}); if (window._gsDefine) { window._gsQueue.pop()(); }