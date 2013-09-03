/*!
 * VERSION: 0.8.1
 * DATE: 2013-09-02
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
			_docElement = _doc.documentElement || {},
			_emptyArray = [],
			_emptyFunc = function() { return false; },
			_RAD2DEG = 180 / Math.PI,
			_DEG2RAD = Math.PI / 180,
			_isOldIE = (_doc.all && !_doc.addEventListener),
			_renderQueue = [],
			_lookup = {}, //when a Draggable is created, the target gets a unique _gsDragID property that allows gets associated with the Draggable instance for quick lookups in Draggable.get(). This avoids circular references that could cause gc problems.
			_lookupCount = 0,
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
			_defaultTransform = {x:0, y:0},
			_getBounds = function(e, unrotated) {
				var scrollTop = (e.pageYOffset != null) ? e.pageYOffset : (_doc.scrollTop != null) ? _doc.scrollTop : _doc.body.scrollTop || _docElement.scrollTop || 0,
					scrollLeft = (e.pageXOffset != null) ? e.pageXOffset : (_doc.scrollLeft != null) ? _doc.scrollLeft : _doc.body.scrollLeft || _docElement.scrollLeft || 0,
					rect, transform, width, height, top, left;
				if (e === window) {
					return {
						top:scrollTop,
						left:scrollLeft,
						width:_docElement.clientWidth || e.innerWidth || _doc.body.clientWidth || 0,
						height:(e.innerHeight - 20 < _docElement.clientHeight) ? _docElement.clientHeight : e.innerHeight || _doc.body.clientHeight || 0 //some browsers (like Firefox) ignore absolutely positioned elements, and collapse the height of the documentElement, so it could be 8px, for example, if you have just an absolutely positioned div. In that case, we use the innerHeight to resolve this.
					};
				}
				if (unrotated) {
					width = e.offsetWidth;
					height = e.offsetHeight;
					top = e.offsetTop;
					left = e.offsetLeft;
					while ((e = e.offsetParent)) {
						top += e.offsetTop;
						left += e.offsetLeft;
					}
					return {top:top, left:left, width:width, height:height};
				} else {
					rect = e.getBoundingClientRect();
					transform = e._gsTransform || _defaultTransform;
					return {top:rect.top - transform.y + scrollTop, left:rect.left - transform.x + scrollLeft, width:rect.right - rect.left, height:rect.bottom - rect.top};
				}
			},

			_tempDiv = _doc.createElement("div"),
			_originProp = _checkPrefix(_tempDiv, "transformOrigin").replace(/([A-Z])/g, "-$1").toLowerCase(),
			_transformProp = _checkPrefix(_tempDiv, "transform"),
			_supports3D = (_checkPrefix(_tempDiv, "perspective") !== ""),
			_use3DTransform = (_transformProp && _supports3D),
			_getTransformOriginOffset = function(e) {
				var bounds = _getBounds(e, true),
					cs = _getComputedStyle(e),
					v = (_originProp && cs) ? cs.getPropertyValue(_originProp) : "50% 50%",
					a = v.split(" "),
					x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
					y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1];
				if (y === "center" || y == null) {
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
			_parseThrowProps = function(draggable, snap, max, min, factor, forceZeroVelocity) {
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
							return snap.call(draggable, value); //we need to ensure that we can scope the function call to the Draggable instance itself so that users can access important values like maxX, minX, maxY, minY, x, and y from within that function.
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
				if (forceZeroVelocity) {
					vars.velocity = 0;
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
					scrollProxy, startMouseX, startMouseY, startElementX, startElementY, hasBounds, hasDragCallback, maxX, minX, maxY, minY, tempVars, cssVars, touch, touchID, rotationOffset, dirty, old,

					//this method gets called on every tick of TweenLite.ticker which allows us to synchronize the renders to the core engine (which is typically synchronized with the display refresh via requestAnimationFrame). This is an optimization - it's better than applying the values inside the "mousemove" or "touchmove" event handler which may get called many times inbetween refreshes.
					render = function() {
						if (dirty) {
							var x = self.x,
								y = self.y,
								min = 0.000001;
							if (x < min && x > -min) { //browsers don't handle super small decimals well.
								x = 0;
							}
							if (y < min && y > -min) {
								y = 0;
							}
							self.endX = x;
							self.endY = y;
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

					//just copies the x/y from the element (whether that be transforms, top/left, or ScrollProxy's top/left) to the Draggable's x and y properties so that they reflect reality. This is used by the ThrowPropsPlugin tween in an onUpdate to ensure things are synced
					syncXY = function(skipOnUpdate) {
						if (xyMode) {
							self.y = target._gsTransform.y;
							self.x = target._gsTransform.x;
						} else if (rotationMode) {
							self.x = target._gsTransform.rotation;
						} else if (scrollProxy) {
							self.y = scrollProxy.top();
							self.x = scrollProxy.left();
						} else {
							self.y = parseInt(target.style.top, 10) || 0;
							self.x = parseInt(target.style.left, 10) || 0;
						}
						if (vars.onThrowUpdate && !skipOnUpdate) {
							vars.onThrowUpdate.apply(vars.onThrowUpdateScope || self, vars.onThrowUpdateParams || _emptyArray);
						}
					},

					calculateBounds = function() {
						hasBounds = false;
						if (scrollProxy) {
							scrollProxy.calibrate();
							self.minX = minX = -scrollProxy.maxScrollLeft();
							self.minY = minY = -scrollProxy.maxScrollTop();
							self.maxX = maxX = self.maxY = maxY = 0;
							hasBounds = true;
						} else if (!!vars.bounds && !rotationMode) {
							var targetBounds = _getBounds(target),
								boundsElement = _unwrapElement(vars.bounds),
								bounds = boundsElement ? _getBounds(boundsElement) : vars.bounds; //could be a selector/jQuery object or a DOM element or a generic object like {top:0, left:100, width:1000, height:800}
							self.minX = minX = (xyMode ? 0 : _getStyle(target, "left")) + bounds.left - targetBounds.left;
							self.minY = minY = (xyMode ? 0 : _getStyle(target, "top")) + bounds.top - targetBounds.top;
							self.maxX = maxX = minX + (bounds.width - targetBounds.width);
							self.maxY = maxY = minY + (bounds.height - targetBounds.height);
							if (minX > maxX) {
								self.minX = maxX;
								self.maxX = maxX = minX;
								minX = self.minX;
							}
							if (minY > maxY) {
								self.minY = maxY;
								self.maxY = maxY = minY;
								minY = self.minY;
							}
							hasBounds = true;
						}
					},

					animate = function(throwProps, forceZeroVelocity) {
						var snap, snapIsRaw, tween;
						if (throwProps && ThrowPropsPlugin) {
							if (throwProps === true) {
								snap = vars.snap || {};
								snapIsRaw = (snap instanceof Array || typeof(snap) === "function");
								throwProps = {resistance:(vars.resistance || 1000) / (rotationMode ? 100 : 1)};
								if (rotationMode) {
									throwProps.rotation = _parseThrowProps(self, snapIsRaw ? snap : snap.rotation, maxX, minX, vars.useRadians ? null : _DEG2RAD, forceZeroVelocity);
								} else {
									if (allowX) {
										throwProps[xProp] = _parseThrowProps(self, snapIsRaw ? snap : snap.x || snap.left || snap.scrollLeft, maxX, minX, scrollProxy ? -1 : null, forceZeroVelocity);
									}
									if (allowY) {
										throwProps[yProp] = _parseThrowProps(self, snapIsRaw ? snap : snap.y || snap.top || snap.scrollTop, maxY, minY, scrollProxy ? -1 : null, forceZeroVelocity);
									}
								}
							}
							self.tween = tween = ThrowPropsPlugin.to(scrollProxy || target, {throwProps:throwProps, ease:(vars.ease || Power3.easeOut), onComplete:vars.onThrowComplete, onCompleteScope:(vars.onThrowCompleteScope || self), onUpdate:(vars.fastMode ? vars.onThrowUpdate : syncXY), onUpdateScope:(vars.onThrowUpdateScope || self)}, vars.maxDuration || 2, vars.minDuration || 0.5, (vars.overshootTolerance === undefined) ? edgeTolerance + 0.2 : vars.overshootTolerance);
							if (!vars.fastMode) {
								//to populate the end values, we just scrub the tween to the end, record the values, and then jump back to the beginning.
								tween.seek(tween.duration());
								syncXY(true);
								self.endX = self.x;
								self.endY = self.y;
								tween.play(0);
							}
						} else if (hasBounds) {
							self.applyBounds();
						}
					},

					//called when the mouse is pressed (or touch starts)
					onPress = function(e) {
						if (_isOldIE) {
							e = _populateIEEvent(e, true);
						} else if ((e.target.nodeName + "").toUpperCase() !== "A" && !e.target.onclick) { //in some mobile browsers, e.preventDefault() when pressing on a link (or element with an onclick) will cause the link not to work.
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
						_renderQueue.push(render); //causes the Draggable to render on each "tick" of TweenLite.ticker (performance optimization - updating values in a mousemove can cause them to happen too frequently, like multiple times between frame redraws which is wasteful, and it also prevents values from updating properly in IE8)
						if (self.tween) {
							self.tween.kill();
						}
						self.tween = null;
						TweenLite.killTweensOf(scrollProxy || target, killProps); //in case the user tries to drag it before the last tween is done.
						startMouseY = self.pointerY = e.pageY; //record the starting x and y so that we can calculate the movement from the original in _onMouseMove
						startMouseX = self.pointerX = e.pageX;
						if (rotationMode) {
							rotationOffset = _getTransformOriginOffset(target)
							startElementX = rotationOffset.left;
							startElementY = rotationOffset.top;
							rotationOffset = Math.atan2(startElementY - startMouseY, startMouseX - startElementX);
						} else {
							self.applyBounds();
							if (scrollProxy) {
								startElementY = scrollProxy.top();
								startElementX = scrollProxy.left();
							} else {
								startElementY = _getStyle(target, yProp); //record the starting top and left values so that we can just add the mouse's movement to them later.
								startElementX = _getStyle(target, xProp);
							}
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
						dirty = false;
						if (hasBounds && edgeTolerance) {
							if (startElementX > maxX) {
								startElementX = maxX + (startElementX - maxX) / edgeTolerance;
							} else if (startElementX < minX) {
								startElementX = minX - (minX - startElementX) / edgeTolerance;
							}
							if (startElementY > maxY) {
								startElementY = maxY + (startElementY - maxY) / edgeTolerance;
							} else if (startElementY < minY) {
								startElementY = minY - (minY - startElementY) / edgeTolerance;
							}
						}

						if (!rotationMode) {
							_setStyle(trigger, "cursor", vars.cursor || "move");
						}
						_dispatchEvent(self, "dragstart", "onDragStart");
					},

					//called every time the mouse/touch moves
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
						self.pointerX = e.pageX;
						self.pointerY = e.pageY;
						dirty = true; //a flag that indicates we need to render the target next time the TweenLite.ticker dispatches a "tick" event (typically on a requestAnimationFrame) - this is a performance optimization (we shouldn't render on every move because sometimes many move events can get dispatched between screen refreshes, and that'd be wasteful to render every time)
						if (rotationMode) {
							self.x = Math.atan2(startElementY - e.pageY, e.pageX - startElementX);
						} else {
							yChange = (e.pageY - startMouseY);
							xChange = (e.pageX - startMouseX);
							x = (xChange > 2 || xChange < -2) ? startElementX + xChange : startElementX;
							y = (yChange > 2 || yChange < -2) ? startElementY + yChange : startElementY;
							if (hasBounds) {
								if (x > maxX) {
									x = maxX + (x - maxX) * edgeTolerance;
								} else if (x < minX) {
									x = minX + (x - minX) * edgeTolerance;
								}
								if (y > maxY) {
									y = maxY + (y - maxY) * edgeTolerance;
								} else if (y < minY) {
									y = minY + (y - minY) * edgeTolerance;
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

					//called when the mouse/touch is released
					onRelease = function(e) {
						if (_isOldIE) {
							e = _populateIEEvent(e, false);
						}
						var touches = e.changedTouches,
							originalEvent = e,
							xChange, yChange, i;
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
						self.pointerX = e.pageX;
						self.pointerY = e.pageY;
						dirty = false;
						i = _renderQueue.length;
						while (--i > -1) {
							if (_renderQueue[i] === render) {
								_renderQueue.splice(i, 1);
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
						animate(vars.throwProps); //will skip if throwProps isn't defined or ThrowPropsPlugin isn't loaded.
						if (!rotationMode) {
							_setStyle(trigger, "cursor", vars.cursor || "move");
						}
						if (xChange < 2 && xChange > -2 && yChange < 2 && yChange > -2) {
							_dispatchEvent(self, "click", "onClick");
						} else if (!_isOldIE) {
							originalEvent.preventDefault();
						}
						_dispatchEvent(self, "dragend", "onDragEnd");
						return true;
					};

				this.applyBounds = function() {
					var x, y;
					syncXY(true);
					calculateBounds();
					if (vars.snap && vars.throwProps && ThrowPropsPlugin) { //sometimes users apply some fancy throwProps snapping that could affect how the bounds act, so if we sense throwProps and snap, feed it through the throwProps so the logic runs and then jump to the end of that tween so that the bounds are imposed immediately. We're letting ThrowPropsPlugin do its magic in terms of parsing all the snapping logic.
						animate(vars.throwProps, true);
						this.tween.seek(this.tween.duration());
						this.tween = null;
					} else if (hasBounds) {
						x = self.x;
						y = self.y;
						if (hasBounds) {
							if (x > maxX) {
								x = maxX;
							} else if (x < minX) {
								x = minX;
							}
							if (y > maxY) {
								y = maxY;
							} else if (y < minY) {
								y = minY;
							}
						}
						if (self.x !== x || self.y !== y) {
							self.x = self.endX = x;
							self.y = self.endY = y;
							dirty = true;
							render();
						}
					}
					return self;
				};
				
				this.update = function(applyBounds) {
					if (applyBounds) {
						self.applyBounds();
					} else {
						syncXY(true);
					}
					return self;
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
					target._gsDragID = "d" + (_lookupCount++);
					_lookup[target._gsDragID] = this;
					return self;
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
					i = _renderQueue.length;
					while (--i > -1) {
						if (_renderQueue[i] === render) {
							_renderQueue.splice(i, 1);
						}
					}
					delete _lookup[target._gsDragID];
					this.isDragging = false;
					if (dragging) {
						_dispatchEvent(this, "dragend", "onDragEnd");
					}
					return self;
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
				old = Draggable.get(this.target);
				if (old) {
					old.disable(); // avoids duplicates (an element can only be controlled by one Draggable)
				}

				this.isDragging = false;
				this.enable();
			},
			p = Draggable.prototype = new EventDispatcher();

		p.constructor = Draggable;
		p.pointerX = p.pointerY = 0;
		Draggable.version = "0.8.1";
		Draggable.zIndex = 1000;

		TweenLite.ticker.addEventListener("tick", function() {
			var i = _renderQueue.length;
			while (--i > -1) {
				_renderQueue[i]();
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

		Draggable.get = function(target) {
			return _lookup[(_unwrapElement(target) || {})._gsDragID];
		};

		return Draggable;

	}, true);


}); if (window._gsDefine) { window._gsQueue.pop()(); }