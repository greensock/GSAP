/*!
 * VERSION: 0.7.0
 * DATE: 2013-08-18
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Requires TweenLite and CSSPlugin (or TweenMax which contains both of those). ThrowPropsPlugin is required for momentum-based continuation of movement after the mouse/touch is released (ThrowPropsPlugin is a membership benefit of Club GreenSock - http://www.greensock.com/club/).
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

		var _tempVarsXY = {css:{}}, //speed optimization - we reuse the same vars object for x/y TweenLite.set() calls to minimize garbage collection tasks and improve performance.
			_tempVarsX = {css:{}},
			_tempVarsY = {css:{}},
			_tempVarsRotation = {css:{}},
			_tempEvent = {}, //for populating with pageX/pageY in old versions of IE
			_doc = document,
			_docElement = _doc.documentElement,
			_emptyArray = [],
			_emptyFunc = function() { return false; },
			_RAD2DEG = 180 / Math.PI,
			_DEG2RAD = Math.PI / 180,
			_isOldIE = (_doc.all && !_doc.addEventListener),
			_updateQueue = [],
			_isTouchDevice = (("ontouchstart" in _docElement) && ("orientation" in window)),
			_prefix,
			ThrowPropsPlugin,

			//just used for IE8 and earlier to normalize events and populate pageX/pageY
			_populateIEEvent = function(e, preventDefault) {
				e = e || window.event;
				_tempEvent.pageX = e.clientX + _doc.body.scrollLeft + _docElement.scrollLeft;
				_tempEvent.pageY = e.clientY + _doc.body.scrollTop + _docElement.scrollTop;
				if (preventDefault) {
					e.returnValue = false;
				}
				return _tempEvent;
			},

			_unwrapElement = function(value) { //grabs the first element it finds (and we include the window as an element), so if it's selector text, it'll feed that value to TweenLite.selector, if it's a jQuery object or some other selector engine's result, it'll grab the first one, and same for an array. If the value doesn't contain a DOM element, it'll just return null.
				if (!value) {
					return value;
				}
				if (typeof(value) === "string") {
					value = TweenLite.selector(value);
				}
				if (value.length && value !== window && value[0] && value[0].style && !value.nodeType) {
					value = value[0];
				}
				return (value === window || (value.nodeType && value.style)) ? value : null;
			},

			_checkPrefix = function(e, p) {
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
					_prefix = (i === 3) ? "ms" : a[i];
					p = _prefix + capped;
				}
				return p;
			},
			_setStyle = function(e, p, value) {
				var s = e.style;
				if (s[p] === undefined) {
					p = _checkPrefix(e, p);
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
			_getComputedStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle : _emptyFunc,
			_getStyle = function(element, prop, keepUnits) {
				var rv = (element._gsTransform || {})[prop],
					cs;
				if (rv || rv === 0) {
					return rv;
				} else if (element.style[prop]) {
					rv = element.style[prop];
				} else if ((cs = _getComputedStyle(element))) {
					element = cs.getPropertyValue(prop.replace(/([A-Z])/g, "-$1").toLowerCase());
					rv = (element || cs.length) ? element : cs[prop]; //Opera behaves VERY strangely - length is usually 0 and cs[prop] is the only way to get accurate results EXCEPT when checking for -o-transform which only works with cs.getPropertyValue()!
				} else if (element.currentStyle) {
					rv = element.currentStyle[prop];
				}
				return keepUnits ? rv : parseFloat(rv) || 0;
			},
			_addListener = function(element, type, func) {
				if (element.addEventListener) {
					element.addEventListener(type, func, false);
				} else if (element.attachEvent) {
					element.attachEvent("on" + type, func);
				}
			},
			_removeListener = function(element, type, func) {
				if (element.removeEventListener) {
					element.removeEventListener(type, func);
				} else if (element.detachEvent) {
					element.detachEvent("on" + type, func);
				}
			},
			_dispatchEvent = function(instance, type, callbackName) {
				var vars = instance.vars,
					callback = vars[callbackName],
					listeners = instance._listeners[type];
				if (typeof(callback) === "function") {
					callback.apply(vars[callbackName + "Scope"] || instance, vars[callbackName + "Params"] || _emptyArray);
				}
				if (listeners) {
					instance.dispatchEvent(type);
				}
			},
			_getBounds = function(e) {
				if (e === window) {
					return {
						top:(e.pageYOffset != null) ? e.pageYOffset : (_doc.scrollTop != null) ? _doc.scrollTop : _doc.body.scrollTop || _docElement.scrollTop || 0,
						left:(e.pageXOffset != null) ? e.pageXOffset : (_doc.scrollLeft != null) ? _doc.scrollLeft : _doc.body.scrollLeft || _docElement.scrollLeft || 0,
						width:(_docElement ? _docElement.clientWidth : e.innerWidth),
						height:(_docElement ? _docElement.clientHeight : e.innerHeight)
					};
				}
				var width = e.offsetWidth,
					height = e.offsetHeight,
					top = e.offsetTop,
					left = e.offsetLeft;
				if (_isOldIE && e._gsTransform) {
					top -= e._gsTransform.y;
					left -= e._gsTransform.x;
				}
				while ((e = e.offsetParent)) {
					top += e.offsetTop;
					left += e.offsetLeft;
				}
				return {top:top, left:left, width:width, height:height};
			},

			_tempDiv = _doc.createElement("div"),
			_originProp = _checkPrefix(_tempDiv, "transformOrigin").replace(/([A-Z])/g, "-$1").toLowerCase(),
			_transformProp = _checkPrefix(_tempDiv, "transform"),
			_supports3D = (_checkPrefix(_tempDiv, "perspective") !== ""),
			_use3DTransform = (_transformProp && _supports3D),
			_getTransformOriginOffset = function(e) {
				var bounds = _getBounds(e),
					cs = _getComputedStyle(e),
					v = (_originProp && cs) ? cs.getPropertyValue(_originProp) : "50% 50%",
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
			_parseThrowProps = function(draggable, snap, max, min, factor) {
				var vars = {},
					a, i, l;
				if (snap) {
					if (factor && snap instanceof Array) { //some data must be altered to make sense, like if the user passes in an array of rotational values in degrees, we must convert it to radians. Or for scrollLeft and scrollTop, we invert the values.
						vars.end = a = [];
						l = snap.length;
						for (i = 0; i < l; i++) {
							a[i] = snap[i] * factor;
						}
					} else if (typeof(snap) === "function") {
						vars.end = function(value) {
							return snap.call(draggable, value); //we need to ensure that we can scope the function call to the Draggable instance itself so that users can access important values like xMax, xMin, yMax, yMin, x, and y from within that function.
						};
					} else {
						vars.end = snap;
					}
				}
				if (max || max === 0) {
					vars.max = max;
				}
				if (min || min === 0) {
					vars.min = min;
				}
				return vars;
			},

			_addPaddingBR,
			_addPaddingLeft = (function() { //this function is in charge of analyzing browser behavior related to padding. It sets the _addPaddingBR to true if the browser doesn't normally factor in the bottom or right padding on the element inside the scrolling area, and it sets _addPaddingLeft to true if it's a browser that requires the extra offset (offsetLeft) to be added to the paddingRight (like Opera).
				var div = _doc.createElement("div"),
					child = _doc.createElement("div"),
					childStyle = child.style,
					parent = _doc.body || _tempDiv,
					val;
				childStyle.display = "inline-block";
				childStyle.position = "relative";
				div.style.cssText = child.innerHTML = "width:90px; height:40px; padding:10px; overflow:auto; visibility: hidden";
				div.appendChild(child);
				parent.appendChild(div);
				_addPaddingBR = (child.offsetHeight + 18 > div.scrollHeight); //div.scrollHeight should be child.offsetHeight + 20 because of the 10px of padding on each side, but some browsers ignore one side. We allow a 2px margin of error.
				childStyle.width = "100%";
				if (!_use3DTransform) {
					childStyle.paddingRight = "500px";
					val = div.scrollLeft = div.scrollWidth - div.clientWidth;
					childStyle.left = "-90px";
					val = (val !== div.scrollLeft);
				}
				parent.removeChild(div);
				return val;
			}()),



			//The ScrollProxy class wraps an element's contents into another div (we call it "content") that we either add padding when necessary or apply a translate3d() transform in order to overscroll (scroll past the boundaries). This allows us to simply set the scrollTop/scrollLeft (or top/left for easier reverse-axis orientation, which is what we do in Draggable) and it'll do all the work for us. For example, if we tried setting scrollTop to -100 on a normal DOM element, it wouldn't work - it'd look the same as setting it to 0, but if we set scrollTop of a ScrollProxy to -100, it'll give the correct appearance by either setting paddingTop of the wrapper to 100 or applying a 100-pixel translateY.
			ScrollProxy = function(element) {
				element = _unwrapElement(element);
				var content = _doc.createElement("div"),
					style = content.style,
					node = element.firstChild,
					offsetTop = 0,
					offsetLeft = 0,
					prevTop = element.scrollTop,
					prevLeft = element.scrollLeft,
					extraPadRight = 0,
					maxLeft = 0,
					maxTop = 0,
					elementWidth, elementHeight, contentHeight, nextNode;

				this.scrollTop = function(value, force) {
					if (!arguments.length) {
						return -this.top();
					}
					this.top(-value, force);
				};

				this.scrollLeft = function(value, force) {
					if (!arguments.length) {
						return -this.left();
					}
					this.left(-value, force);
				};

				this.left = function(value, force) {
					if (!arguments.length) {
						return -(element.scrollLeft + offsetLeft);
					}
					var dif = element.scrollLeft - prevLeft,
						oldOffset = offsetLeft;
					if ((dif > 2 || dif < -2) && !force) { //if the user interacts with the scrollbar (or something else scrolls it, like the mouse wheel), we should kill any tweens of the ScrollProxy.
						prevLeft = element.scrollLeft;
						TweenLite.killTweensOf(this, {left:1, scrollLeft:1});
						this.left(-prevLeft);
						return;
					}
					value = -value; //invert because scrolling works in the opposite direction
					if (value < 0) {
						offsetLeft = (value - 0.5) | 0;
						value = 0;
					} else if (value > maxLeft) {
						offsetLeft = (value - maxLeft) | 0;
						value = maxLeft;
					} else {
						offsetLeft = 0;
					}
					if (offsetLeft || oldOffset) {
						if (_use3DTransform) {
							style[_transformProp] = "translate3d(" + -offsetLeft + "px," + -offsetTop + "px,0px)";
						} else {
							style.left = -offsetLeft + "px";
						}
						if (_addPaddingLeft && offsetLeft + extraPadRight >= 0) {
							style.paddingRight = offsetLeft + extraPadRight + "px";
						}
					}
					element.scrollLeft = value | 0;
					prevLeft = element.scrollLeft; //don't merge this with the line above because some browsers adjsut the scrollLeft after it's set, so in order to be 100% accurate in tracking it, we need to ask the browser to report it.
				};

				this.top = function(value, force) {
					if (!arguments.length) {
						return -(element.scrollTop + offsetTop);
					}
					var dif = element.scrollTop - prevTop,
						oldOffset = offsetTop;
					if ((dif > 2 || dif < -2) && !force) { //if the user interacts with the scrollbar (or something else scrolls it, like the mouse wheel), we should kill any tweens of the ScrollProxy.
						prevTop = element.scrollTop;
						TweenLite.killTweensOf(this, {top:1, scrollTop:1});
						this.top(-prevTop);
						return;
					}
					value = -value; //invert because scrolling works in the opposite direction
					if (value < 0) {
						offsetTop = (value - 0.5) | 0;
						value = 0;
					} else if (value > maxTop) {
						offsetTop = (value - maxTop) | 0;
						value = maxTop;
					} else {
						offsetTop = 0;
					}
					if (offsetTop || oldOffset) {
						if (_use3DTransform) {
							style[_transformProp] = "translate3d(" + -offsetLeft + "px," + -offsetTop + "px,0px)";
						} else {
							style.top = -offsetTop + "px";
						}
					}
					element.scrollTop = value | 0;
					prevTop = element.scrollTop;
				};

				this.maxScrollTop = function() {
					return maxTop;
				};

				this.maxScrollLeft = function() {
					return maxLeft;
				};

				this.disable = function() {
					node = content.firstChild;
					while (node) {
						nextNode = node.nextSibling;
						element.appendChild(node);
						node = nextNode;
					}
					element.removeChild(content);
				};

				this.enable = function() {
					node = element.firstChild;
					if (node === content) {
						return;
					}
					while (node) {
						nextNode = node.nextSibling;
						content.appendChild(node);
						node = nextNode;
					}
					element.appendChild(content);
					this.calibrate();
				};

				this.calibrate = function(force) {
					var widthMatches = (element.clientWidth === elementWidth),
						x, y;
					if (widthMatches && element.clientHeight === elementHeight && content.offsetHeight === contentHeight && !force) {
						return; //no need to recalculate things if the width and height haven't changed.
					}
					if (offsetTop || offsetLeft) {
						x = this.left();
						y = this.top();
						this.left(-element.scrollLeft);
						this.top(-element.scrollTop);
					}
					//first, we need to remove any width constraints to see how the content naturally flows so that we can see if it's wider than the containing element. If so, we've got to record the amount of overage so that we can apply that as padding in order for browsers to correctly handle things. Then we switch back to a width of 100% (without that, some browsers don't flow the content correctly)
					if (!widthMatches || force) {
						style.display = "block";
						style.width = "auto";
						style.paddingRight = "0px";
						extraPadRight = Math.max(0, element.scrollWidth - element.clientWidth);
						//if the content is wider than the container, we need to add the paddingLeft and paddingRight in order for things to behave correctly.
						if (extraPadRight) {
							extraPadRight += _getStyle(element, "paddingLeft") + (_addPaddingBR ? _getStyle(element, "paddingRight") : 0);
						}
					}
					style.display = "inline-block";
					style.position = "relative";
					style.overflow = "visible";
					style.width = "100%";
					style.paddingRight = extraPadRight + "px";
					//some browsers neglect to factor in the bottom padding when calculating the scrollHeight, so we need to add that padding to the content when that happens. Allow a 2px margin for error
					if (_addPaddingBR) {
						style.paddingBottom = _getStyle(element, "paddingBottom", true);
					}
					if (_isOldIE) {
						style.zoom = "1";
					}
					elementWidth = element.clientWidth;
					elementHeight = element.clientHeight;
					maxLeft = element.scrollWidth - elementWidth;
					maxTop = element.scrollHeight - elementHeight;
					contentHeight = content.offsetHeight;
					if (x || y) {
						this.left(x);
						this.top(y);
					}
				};

				this.content = content;
				this.element = element;
				this.enable();
			},



			Draggable = function(target, vars) {
				EventDispatcher.call(this, target);
				target = _unwrapElement(target); //in case the target is a selector object or selector text
				if (!ThrowPropsPlugin) {
					ThrowPropsPlugin = (window.GreenSockGlobals || window).com.greensock.plugins.ThrowPropsPlugin;
				}
				this.vars = vars = vars || {};
				this.target = target;
				this.x = this.y = 0;
				var type = (vars.type || (_isOldIE ? "top,left" : "x,y")).toLowerCase(),
					xyMode = (type.indexOf("x") !== -1 || type.indexOf("y") !== -1),
					rotationMode = (type.indexOf("rotation") !== -1),
					xProp = xyMode ? "x" : "left",
					yProp = xyMode ? "y" : "top",
					allowX = (type.indexOf("x") !== -1 || type.indexOf("left") !== -1 || type === "scroll"),
					allowY = (type.indexOf("y") !== -1 || type.indexOf("top") !== -1 || type === "scroll"),
					self = this,
					trigger = _unwrapElement(vars.trigger || target),
					killProps = {},
					edgeTolerance = parseFloat(vars.edgeTolerance) || (1 - ((vars.edgeResistance === undefined) ? 1 : parseFloat(vars.edgeResistance))), //legacy support for edgeTolerance (new, more intuitive name is edgeResistance which works the opposite)
					scrollProxy, startMouseX, startMouseY, startElementX, startElementY, hasBounds, hasDragCallback, xMax, xMin, yMax, yMin, tempVars, cssVars, touch, touchID, rotationOffset, dirty,

					//this method gets called on every tick of TweenLite.ticker which allows us to synchronize the updates to the core engine (which is typically synchronized with the display refresh via requestAnimationFrame). This is an optimization - it's better than applying the values inside the "mousemove" or "touchmove" event handler which may get called many times inbetween refreshes.
					update = function() {
						if (dirty) {
							var x = self.x,
								y = self.y;
							if (rotationMode) {
								cssVars.rotation = "+=" + ((rotationOffset - x) * _RAD2DEG);
								TweenLite.set(target, tempVars);
								rotationOffset = x;
							} else {
								if (scrollProxy) {
									if (allowY) {
										scrollProxy.top(y);
									}
									if (allowX) {
										scrollProxy.left(x);
									}
								} else if (xyMode) {
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
								_dispatchEvent(self, "drag", "onDrag");
							}
						}
						dirty = false;
					},
					onPress = function(e) {
						if (_isOldIE) {
							e = _populateIEEvent(e, true);
						} else {
							e.preventDefault();
						}
						if (self.isDragging) { //just in case the browser dispatches a "touchstart" and "mousedown" (some browsers emulate mouse events when using touches)
							return;
						}
						if (e.changedTouches) { //touch events store the data slightly differently
							e = touch = e.changedTouches[0];
							touchID = e.identifier;
						} else {
							touch = null;
						}
						_updateQueue.push(update); //causes the Draggable to update on each "tick" of TweenLite.ticker (performance optimization - updating values in a mousemove can cause them to happen too frequently, like multiple times between frame redraws which is wasteful, and it also prevents values from updating properly in IE8)
						TweenLite.killTweensOf(scrollProxy || target, killProps); //in case the user tries to drag it before the last tween is done.
						startMouseY = e.pageY; //record the starting x and y so that we can calculate the movement from the original in _onMouseMove
						startMouseX = e.pageX;
						if (rotationMode) {
							rotationOffset = _getTransformOriginOffset(target);
							startElementX = rotationOffset.left;
							startElementY = rotationOffset.top;
							rotationOffset = Math.atan2(startElementY - startMouseY, startMouseX - startElementX);
						} else if (scrollProxy) {
							startElementY = scrollProxy.top();
							startElementX = scrollProxy.left();
						} else {
							startElementY = _getStyle(target, yProp); //record the starting top and left values so that we can just add the mouse's movement to them later.
							startElementX = _getStyle(target, xProp);
						}
						if (!rotationMode && !scrollProxy && vars.zIndexBoost !== false) {
							target.style.zIndex = Draggable.zIndex++;
						}
						if (touch) { //note: on iOS, BOTH touchmove and mousemove are dispatched, but the mousemove has pageY and pageX of 0 which would mess up the calculations and needlessly hurt performance.
							_addListener(trigger, "touchend", onRelease);
							_addListener(trigger, "touchmove", onMove); //don't forget touch events
						} else {
							_addListener(_doc, "mousemove", onMove); //attach these to the document instead of the box itself so that if the user's mouse moves too quickly (and off of the box), things still work.
							_addListener(_doc, "mouseup", onRelease);
						}
						self.isDragging = true;
						hasDragCallback = !!(vars.onDrag || self._listeners.drag);
						hasBounds = dirty = false;
						if (scrollProxy) {
							scrollProxy.calibrate();
							self.xMin = xMin = -scrollProxy.maxScrollLeft();
							self.yMin = yMin = -scrollProxy.maxScrollTop();
							self.xMax = xMax = self.yMax = yMax = 0;
							hasBounds = true;

						} else if (!!vars.bounds && !rotationMode) {
							var targetBounds = _getBounds(target),
								boundsElement = _unwrapElement(vars.bounds),
								bounds = boundsElement ? _getBounds(boundsElement) : vars.bounds; //could be a selector/jQuery object or a DOM element or a generic object like {top:0, left:100, width:1000, height:800}
							self.xMin = xMin = (xyMode ? 0 : _getStyle(target, "left")) + bounds.left - targetBounds.left;
							self.yMin = yMin = (xyMode ? 0 : _getStyle(target, "top")) + bounds.top - targetBounds.top;
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
							hasBounds = true;
						}
						if (hasBounds) {
							if (startElementX > xMax) {
								startElementX = xMax + (startElementX - xMax) / edgeTolerance;
							} else if (startElementX < xMin) {
								startElementX = xMin - (xMin - startElementX) / edgeTolerance;
							}
							if (startElementY > yMax) {
								startElementY = yMax + (startElementY - yMax) / edgeTolerance;
							} else if (startElementY < yMin) {
								startElementY = yMin - (yMin - startElementY) / edgeTolerance;
							}
						}

						if (!rotationMode) {
							_setStyle(trigger, "cursor", vars.cursor || "move");
						}
						_dispatchEvent(self, "dragstart", "onDragStart");
					},
					onMove = function(e) {
						if (_isOldIE) {
							e = _populateIEEvent(e, true);
						} else {
							e.preventDefault();
						}
						var touches = e.changedTouches,
							xChange, yChange, x, y, i;
						if (touches) { //touch events store the data slightly differently
							e = touches[0];
							if (e !== touch && e.identifier !== touchID) { //Usually changedTouches[0] will be what we're looking for, but in case it's not, look through the rest of the array...(and Android browsers don't reuse the event like iOS)
								i = touches.length;
								while (--i > -1 && (e = touches[i]).identifier !== touchID) {}
								if (i < 0) {
									return;
								}
							}
						}
						dirty = true; //a flag that indicates we need to update the target next time the TweenLite.ticker dispatches a "tick" event (typically on a requestAnimationFrame) - this is a performance optimization (we shouldn't update on every move because sometimes many move events can get dispatched between screen refreshes, and that'd be wasteful to update every time)
						if (rotationMode) {
							self.x = Math.atan2(startElementY - e.pageY, e.pageX - startElementX);
						} else {
							yChange = (e.pageY - startMouseY);
							xChange = (e.pageX - startMouseX);
							x = (xChange > 2 || xChange < -2) ? startElementX + xChange : startElementX;
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
							if (self.x !== x || self.y !== y) {
								self.x = x;
								self.y = y;
							} else {
								dirty = false;
							}
						}
					},
					onRelease = function(e) {
						if (_isOldIE) {
							e = _populateIEEvent(e, true);
						} else {
							e.preventDefault();
						}
						var touches = e.changedTouches,
							throwProps = vars.throwProps,
							xChange, yChange, i, snap, snapIsRaw;
						if (touches) { //touch events store the data slightly differently
							e = touches[0];
							if (e !== touch && e.identifier !== touchID) { //Usually changedTouches[0] will be what we're looking for, but in case it's not, look through the rest of the array...(and Android browsers don't reuse the event like iOS)
								i = touches.length;
								while (--i > -1 && (e = touches[i]).identifier !== touchID) {}
								if (i < 0) {
									return;
								}
							}
						}
						dirty = false;
						i = _updateQueue.length;
						while (--i > -1) {
							if (_updateQueue[i] === update) {
								_updateQueue.splice(i, 1);
							}
						}
						yChange = (e.pageY - startMouseY);
						xChange = (e.pageX - startMouseX);
						self.isDragging = false;
						if (touch) {
							_removeListener(trigger, "touchend", onRelease);
							_removeListener(trigger, "touchmove", onMove);
						} else {
							_removeListener(_doc, "mouseup", onRelease);
							_removeListener(_doc, "mousemove", onMove);
						}
						if (throwProps && ThrowPropsPlugin) {
							if (throwProps === true) {
								snap = vars.snap || {};
								snapIsRaw = (snap instanceof Array || typeof(snap) === "function");
								throwProps = {resistance:(vars.resistance || 1000) / (rotationMode ? 100 : 1)};
								if (rotationMode) {
									throwProps.rotation = _parseThrowProps(self, snapIsRaw ? snap : snap.rotation, xMax, xMin, vars.useRadians ? null : _DEG2RAD);
								} else {
									if (allowX) {
										throwProps[xProp] = _parseThrowProps(self, snapIsRaw ? snap : snap.x || snap.left || snap.scrollLeft, xMax, xMin, scrollProxy ? -1 : null);
									}
									if (allowY) {
										throwProps[yProp] = _parseThrowProps(self, snapIsRaw ? snap : snap.y || snap.top || snap.scrollTop, yMax, yMin, scrollProxy ? -1 : null);
									}
								}
							}
							ThrowPropsPlugin.to(scrollProxy || target, {throwProps:throwProps, ease:(vars.ease || Power3.easeOut), onComplete:vars.onComplete, onUpdate:vars.onUpdate}, vars.maxDuration || 2, vars.minDuration || 0.5, (vars.overshootTolerance === undefined) ? edgeTolerance + 0.2 : vars.overshootTolerance);
						}
						if (!rotationMode) {
							_setStyle(trigger, "cursor", vars.cursor || "move");
						}
						if (xChange < 2 && xChange > -2 && yChange < 2 && yChange > -2) {
							_dispatchEvent(self, "click", "onClick");
						}
						_dispatchEvent(self, "dragend", "onDragEnd");
						return true;
					};

				this.enable = function() {
					_addListener(trigger, "mousedown", onPress);
					_addListener(trigger, "touchstart", onPress);
					if (!rotationMode) {
						_setStyle(trigger, "cursor", vars.cursor || "move");
					}
					_setStyle(trigger, "userSelect", "none");
					_setStyle(trigger, "touchCallout", "none");
					if (ThrowPropsPlugin) {
						ThrowPropsPlugin.track(scrollProxy || target, (xyMode ? "x,y" : rotationMode ? "rotation" : "top,left"));
					}
					if (scrollProxy) {
						scrollProxy.enable();
					}
				};

				this.disable = function() {
					var dragging = this.isDragging,
						i;
					if (!rotationMode) {
						_setStyle(trigger, "cursor", null);
					}
					TweenLite.killTweensOf(scrollProxy || target, killProps); //in case the user tries to drag it before the last tween is done.
					_setStyle(trigger, "userSelect", "text");
					_setStyle(trigger, "touchCallout", "default");
					_removeListener(trigger, "mousedown", onPress);
					_removeListener(trigger, "touchstart", onPress);
					_removeListener(_doc, "mouseup", onRelease);
					_removeListener(trigger, "touchend", onRelease);
					_removeListener(_doc, "mousemove", onMove);
					_removeListener(trigger, "touchmove", onMove);
					if (ThrowPropsPlugin) {
						ThrowPropsPlugin.untrack(scrollProxy || target, (xyMode ? "x,y" : rotationMode ? "rotation" : "top,left"));
					}
					if (scrollProxy) {
						scrollProxy.disable();
					}
					i = _updateQueue.length;
					while (--i > -1) {
						if (_updateQueue[i] === update) {
							_updateQueue.splice(i, 1);
						}
					}
					this.isDragging = false;
					if (dragging) {
						_dispatchEvent(this, "dragend", "onDragEnd");
					}
				};

				if (type.indexOf("scroll") !== -1) {
					scrollProxy = this.scrollProxy = new ScrollProxy(target);
					//a bug in many Android devices' stock browser causes scrollTop to get forced back to 0 after it is altered via JS, so we set overflow to "hidden" on mobile/touch devices (they hide the scroll bar anyway). That works around the bug. (This bug is discussed at https://code.google.com/p/android/issues/detail?id=19625)
					target.style.overflowY = (allowY && !_isTouchDevice) ? "auto" : "hidden";
					target.style.overflowX = (allowX && !_isTouchDevice) ? "auto" : "hidden";
					target = scrollProxy.content;
				}

				// prevent IE from trying to drag an image and prevent text selection in IE
				trigger.ondragstart = trigger.onselectstart = _emptyFunc;
				if (vars.force3D !== false) {
					TweenLite.set(target, {force3D:true}); //improve performance by forcing a GPU layer when possible
				}
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
					tempVars = _tempVarsRotation;
					cssVars = tempVars.css;
				} else if (xyMode) {
					tempVars = (allowX && allowY) ? _tempVarsXY : allowX ? _tempVarsX : _tempVarsY;
					cssVars = tempVars.css;
				}
				this.isDragging = false;
				this.enable();
			},
			p = Draggable.prototype = new EventDispatcher();

		p.constructor = Draggable;
		Draggable.version = "0.7.0";
		Draggable.zIndex = 1000;

		TweenLite.ticker.addEventListener("tick", function() {
			var i = _updateQueue.length;
			while (--i > -1) {
				_updateQueue[i]();
			}
		});

		_addListener(_doc, "touchcancel", function() {
			//some older Android devices intermittently stop dispatching "touchmove" events if we don't listen for "touchcancel" on the document. Very strange indeed.
		});

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