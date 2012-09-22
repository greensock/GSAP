/*!
 * VERSION: beta 1.26
 * DATE: 2012-05-24
 * JavaScript (ActionScript 3 and 2 also available)
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * Copyright (c) 2008-2012, GreenSock. All rights reserved. 
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push( function() {

	_gsDefine("easing.Back", ["easing.Ease"], function(Ease) {
		
		var gs = window.com.greensock, 
			_class = gs._class, 
			_create = function(n, f) {
				var c = _class("easing." + n, function(){}, true), 
					p = c.prototype = new Ease();
				p.constructor = c;
				p.getRatio = f;
				return c;
			},
			
			//BACK
			_createBack = function(n, f) {
				var c = _class("easing." + n, function(overshoot) {
						this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
						this._p2 = this._p1 * 1.525;
					}, true), 
					p = c.prototype = new Ease();
				p.constructor = c;
				p.getRatio = f;
				p.config = function(overshoot) {
					return new c(overshoot);
				};
				return c;
			}, 
			BackOut = _createBack("BackOut", function(p) {
				return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
			}), 
			BackIn = _createBack("BackIn", function(p) {
				return p * p * ((this._p1 + 1) * p - this._p1);
			}), 
			BackInOut = _createBack("BackInOut", function(p) {
				return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
			}),  
			
			//BOUNCE
			BounceOut = _create("BounceOut", function(p) {
				if (p < 1 / 2.75) {
					return 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					return 7.5625 * (p -= 1.5 / 2.75) * p + .75;
				} else if (p < 2.5 / 2.75) {
					return 7.5625 * (p -= 2.25 / 2.75) * p + .9375;
				} else {
					return 7.5625 * (p -= 2.625 / 2.75) * p + .984375;
				}
			}), 
			BounceIn = _create("BounceIn", function(p) {
				if ((p = 1 - p) < 1 / 2.75) {
					return 1 - (7.5625 * p * p);
				} else if (p < 2 / 2.75) {
					return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + .75);
				} else if (p < 2.5 / 2.75) {
					return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + .9375);
				} else {
					return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + .984375);
				}
			}), 
			BounceInOut = _create("BounceInOut", function(p) {
				var invert = (p < 0.5);
				if (invert) {
					p = 1 - (p * 2);
				} else {
					p = (p * 2) - 1;
				}
				if (p < 1 / 2.75) {
					p = 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					p = 7.5625 * (p -= 1.5 / 2.75) * p + .75;
				} else if (p < 2.5 / 2.75) {
					p = 7.5625 * (p -= 2.25 / 2.75) * p + .9375;
				} else {
					p = 7.5625 * (p -= 2.625 / 2.75) * p + .984375;
				}
				return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
			}),
			
			//CIRC
			CircOut = _create("CircOut", function(p) {
				return Math.sqrt(1 - (p = p - 1) * p);
			}),
			CircIn = _create("CircIn", function(p) {
				return -(Math.sqrt(1 - (p * p)) - 1);
			}),
			CircInOut = _create("CircInOut", function(p) {
				return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
			}),
			
			//ELASTIC
			_2PI = Math.PI * 2,
			_createElastic = function(n, f, def) {
				var c = _class("easing." + n, function(amplitude, period) {
						this._p1 = amplitude || 1;
						this._p2 = period || def;
						this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
					}, true), 
					p = c.prototype = new Ease();
				p.constructor = c;
				p.getRatio = f;
				p.config = function(amplitude, period) {
					return new c(amplitude, period);
				};
				return c;
			}, 
			ElasticOut = _createElastic("ElasticOut", function(p) {
				return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._p3) * _2PI / this._p2 ) + 1;
			}, 0.3), 
			ElasticIn = _createElastic("ElasticIn", function(p) {
				return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * _2PI / this._p2 ));
			}, 0.3), 
			ElasticInOut = _createElastic("ElasticInOut", function(p) {
				return ((p *= 2) < 1) ? -.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * _2PI / this._p2)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._p3) * _2PI / this._p2 ) *.5 + 1;
			}, 0.45),
			
			//Expo
			ExpoOut = _create("ExpoOut", function(p) {
				return 1 - Math.pow(2, -10 * p);
			}),
			ExpoIn = _create("ExpoIn", function(p) {
				return Math.pow(2, 10 * (p - 1)) - 0.001;
			}),
			ExpoInOut = _create("ExpoInOut", function(p) {
				return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
			}), 
			
			//Sine
			_HALF_PI = Math.PI / 2,
			SineOut = _create("SineOut", function(p) {
				return Math.sin(p * _HALF_PI);
			}),
			SineIn = _create("SineIn", function(p) {
				return -Math.cos(p * _HALF_PI) + 1;
			}),
			SineInOut = _create("SineInOut", function(p) {
				return -0.5 * (Math.cos(Math.PI * p) - 1);
			}),
			
			//SlowMo
			SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
				power = (power || power === 0) ? power : 0.7;
				if (linearRatio == null) {
					linearRatio = 0.7;
				} else if (linearRatio > 1) {
					linearRatio = 1;
				}
				this._p = (linearRatio != 1) ? power : 0;
				this._p1 = (1 - linearRatio) / 2;
				this._p2 = linearRatio;
				this._p3 = this._p1 + this._p2;
				this._calcEnd = (yoyoMode === true);
			}, true),
			p = SlowMo.prototype = new Ease();
			
		p.constructor = SlowMo;
		p.getRatio = function(p) {
			var r = p + (0.5 - p) * this._p;
			if (p < this._p1) {
				return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
			} else if (p > this._p3) {
				return this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p);
			}
			return this._calcEnd ? 1 : r;
		};
		SlowMo.ease = new SlowMo(0.7, 0.7);
		
		p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
			return new SlowMo(linearRatio, power, yoyoMode);
		};
		
		
		//SteppedEase
		var SteppedEase = _class("easing.SteppedEase", function(steps) {
				steps = steps || 1;
				this._p1 = 1 / steps;
				this._p2 = steps + 1;
			}, true);
		p = SteppedEase.prototype = new Ease();	
		p.constructor = SteppedEase;
		p.getRatio = function(p) {
			if (p < 0) {
				p = 0;
			} else if (p >= 1) {
				p = 0.999999999;
			}
			return ((this._p2 * p) >> 0) * this._p1;
		};
		p.config = SteppedEase.config = function(steps) {
			return new SteppedEase(steps);
		};
		
		
		_class("easing.Bounce", {
				easeOut:new BounceOut(),
				easeIn:new BounceIn(),
				easeInOut:new BounceInOut()
			}, true);
		
		_class("easing.Circ", {
				easeOut:new CircOut(),
				easeIn:new CircIn(),
				easeInOut:new CircInOut()
			}, true);
		
		_class("easing.Elastic", {
				easeOut:new ElasticOut(),
				easeIn:new ElasticIn(),
				easeInOut:new ElasticInOut()
			}, true);
			
		_class("easing.Expo", {
				easeOut:new ExpoOut(),
				easeIn:new ExpoIn(),
				easeInOut:new ExpoInOut()
			}, true);
			
		_class("easing.Sine", {
				easeOut:new SineOut(),
				easeIn:new SineIn(),
				easeInOut:new SineInOut()
			}, true);
		
		
		return {
			easeOut:new BackOut(),
			easeIn:new BackIn(),
			easeInOut:new BackInOut()
		};
		
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }