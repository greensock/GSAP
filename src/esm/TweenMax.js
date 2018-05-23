/*!
 * VERSION: 1.20.5
 * DATE: 2018-05-21
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2018, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/

import TweenLite, { TweenPlugin, Ease, Power0, Power1, Power2, Power3, Power4, Linear } from "./TweenLite";
import TweenMaxBase from "./TweenMaxBase";
import CSSPlugin from "./CSSPlugin";
import AttrPlugin from "./AttrPlugin";
import RoundPropsPlugin from "./RoundPropsPlugin";
import DirectionalRotationPlugin from "./DirectionalRotationPlugin";
import TimelineLite from "./TimelineLite";
import TimelineMax from "./TimelineMax";
import BezierPlugin from "./BezierPlugin";
import { Back, Elastic, Bounce, RoughEase, SlowMo, SteppedEase, Circ, Expo, Sine, ExpoScaleEase } from "./EasePack";

//the following two lines are designed to prevent tree shaking of the classes that were historically included with TweenMax (otherwise, folks would have to reference CSSPlugin, for example, to ensure their CSS-related animations worked)
export const TweenMax = TweenMaxBase;
TweenMax._autoActivated = [TimelineLite, TimelineMax, CSSPlugin, AttrPlugin, BezierPlugin, RoundPropsPlugin, DirectionalRotationPlugin, Back, Elastic, Bounce, RoughEase, SlowMo, SteppedEase, Circ, Expo, Sine, ExpoScaleEase];

export { TweenMax as default };
export { TweenLite, TimelineLite, TimelineMax, CSSPlugin, AttrPlugin, BezierPlugin, DirectionalRotationPlugin, RoundPropsPlugin, TweenPlugin, Ease, Power0, Power1, Power2, Power3, Power4, Linear, Back, Elastic, Bounce, RoughEase, SlowMo, SteppedEase, Circ, Expo, Sine, ExpoScaleEase };
