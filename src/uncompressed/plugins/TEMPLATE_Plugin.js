/**
 * VERSION: 1.0
 * DATE: 2012-08-22
 * JavaScript 
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * This file is to be used as a simple template for writing your own plugin. See the 
 * notes at http://api.greensock.com/js/com/greensock/plugins/TweenPlugin.html for more details.
 *
 * You can start by doing a search for "MyCustomProperty" and replace it with whatever the name
 * of your property is. Note that the plugin name itself is typically capitalized by convention 
 * but the name of the property itself isn't. MyCustomPropertyPlugin vs. myCustomProperty.
 *
 * Copyright (c) 2008-2013, GreenSock. All rights reserved. 
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push( function() {
	//ignore the line above this and at the very end - those are for ensuring things load in the proper order
	
	//Replace "MyCustomPropertyPlugin" with whatever your property is, like "ScalePlugin" or "TintPlugin". 
	_gsDefine("plugins.MyCustomPropertyPlugin", ["plugins.TweenPlugin"], function(TweenPlugin) {
		
		var MyCustomPropertyPlugin = function(props, priority) {
				//"myCustomProperty" is the name of the property that will get intercepted and handled by this plugin (obviously change it to whatever you want, typically it is camelCase starting with lowercase). The 0 parameter determines the priority in the rendering pipeline (0 by default). A priority of -1 would mean this plugin will run after all those with 0 or greater. A priority of 1 would get run before 0, etc. This only matters when a plugin relies on other plugins finishing their work before it runs (or visa-versa)
				TweenPlugin.call(this, "myCustomProperty", 0);
			},
			p = MyCustomPropertyPlugin.prototype = new TweenPlugin("myCustomProperty", 0);
		
		p.constructor = MyCustomPropertyPlugin;
		MyCustomPropertyPlugin.API = 2; //the API should stay 2 - it just gives us a way to know the method/property structure so that if in the future we change to a different TweenPlugin architecture, we can identify this plugin's structure.
		
		/*
		 * _onInitTween() is where everything begins - it called when the tween first instantiates (right before its first render) and it receives 3 parameters:
		 *   1) target [object] - the target of the tween. In cases where the tween's original target is an array (or jQuery object), this target will be the individual object inside that array (a new plugin instance is created for each target in the array). For example, TweenLite.to([obj1, obj2, obj3], 1, {x:100}) the target will be obj1 or obj2 or obj3 rather than the array containing them. 
		 *   2) value [*] - whatever value is passed as the special property value. For example, TweenLite.to(element, 1, {myCustomProperty:3}) the value would be 3. Or for TewenLite.to(element, 1, {myCustomProperty:{subProp1:3, subProp2:"whatever"}});, value would be {subProp1:3, subProp2:"whatever"}.
		 *   3) tween [TweenLite] - the TweenLite (or TweenMax) instance that is managing this plugin instance. This can be useful if you need to check certain state-related properties on the tween (maybe in the setRatio() method) like its duration or time. Most of the time, however, you don't need to do anything with the tween. It is provided just in case you want to reference it. 
		 * 
		 * _onInitTween() should return true unless you want to have TweenLite/Max skip the plugin altogether and instead treat the property/value like a normal tween (as if the plugin wasn't activated). This is rarely useful, so you should almost always return true.
		 */
		p._onInitTween = function(target, value, tween) {
			this._target = target; //we record the target so that we can refer to it in the setRatio() method when doing updates.
			
			/* Next, we create a property tween for "scaleX" and "scaleY" properties of our target 
			 * (we're just using them as a examples of how to set up a property tween with a name, start, and end value).
			 * the _addTween() method accepts the following parameters:
			 *   1) target [object] - target object whose property this tween will control.
			 *   2) property [string] - the name of the property, like "scaleX" or "scaleY"
			 *   3) start [number] - The starting value of the property. For example, if you're tweening from 0 to 100, start would be 0. 
			 *   4) end [number] - the ending value of the property. For example, if you're tweening from 0 to 100, end would be 100.
			 *   5) overwriteProperty [string] - the name that gets registered as the overwrite property so that if another concurrent tween of the same target gets created and it is tweening a property with this name, this one will be overwritten. Typically this is the same as "property".
			 *   6) round [boolean] - if true, the updated value on each update will be rounded to the nearest integer. [false by default]
			 * You do NOT need to use _addTween() at all. It is merely a convenience. You can record your own values internally or whatever you want.
			 */  
			this._addTween(target, "scaleX", target.scaleX, value, "scaleX", false); 
			this._addTween(target, "scaleY", target.scaleY, value, "scaleY", false);
			
			//now, just for kicks, we'll record the starting "alpha" value and amount of change so that we can manage this manually rather than _addTween() (again, totally fictitious, just for an example)
			this._alphaStart = target.alpha;
			this._alphaChange = value.alpha - target.alpha;
			
			//always return true unless we want to scrap the plugin and have the value treated as a normal property tween (very uncommon)
			return true;
		}
		
		//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
		p.setRatio = function(ratio) {
			
			//since we used _addTween() inside _onInitTween(), it created some property tweens that we'll update by calling the TweenPlugin prototype's setRatio() (otherwise, the property tweens wouldn't get their values updated).
			TweenPlugin.prototype.setRatio.call(this, ratio);
			
			//now manually set the alpha
			this._target.alpha = this._alphaStart + this._alphaChange * ratio;
		}
		
		TweenPlugin.activate([MyCustomPropertyPlugin]);
		return MyCustomPropertyPlugin;
		
		//no need to change anything after this point...
	}, true);

}); if (window._gsDefine) { _gsQueue.pop()(); }