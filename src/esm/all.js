import TweenLite, {Ease, Power0, Power1, Power2, Power3, Power4, Linear, _gsScope} from "./TweenLite";

import TweenMax from "./TweenMaxBase";
import TimelineLite from "./TimelineLite";
import TimelineMax from "./TimelineMax";

// plugins
import AttrPlugin from "./AttrPlugin";
import BezierPlugin from "./BezierPlugin";
import ColorPropsPlugin from "./ColorPropsPlugin";
import CSSPlugin from "./CSSPlugin";
import CSSRulePlugin from "./CSSRulePlugin";
import DirectionalRotationPlugin from "./DirectionalRotationPlugin";
import EaselPlugin from "./EaselPlugin";
import EndArrayPlugin from "./EndArrayPlugin";
import ModifiersPlugin from "./ModifiersPlugin";
import PixiPlugin from "./PixiPlugin";
import RoundPropsPlugin from "./RoundPropsPlugin";
import ScrollToPlugin from "./ScrollToPlugin";
import TextPlugin from "./TextPlugin";


// utils
import Draggable from "./Draggable";

// easing
import {
	Back,
	Elastic,
	Bounce,
	RoughEase,
	SlowMo,
	SteppedEase,
	Circ,
	Expo,
	Sine,
	ExpoScaleEase
} from "./EasePack";

// bonus tools
/*
import DrawSVGPlugin from "./DrawSVGPlugin";
import MorphSVGPlugin from "./MorphSVGPlugin";
import Physics2DPlugin from "./Physics2DPlugin";
import PhysicsPropsPlugin from "./PhysicsPropsPlugin";
import ScrambleTextPlugin from "./ScrambleTextPlugin";
import ThrowPropsPlugin from "./ThrowPropsPlugin";
import GSDevTools from "./GSDevTools";
import SplitText from "./SplitText";
import CustomBounce from "./CustomBounce";
import CustomEase from "./CustomEase";
import CustomWiggle from "./CustomWiggle";

export {
	DrawSVGPlugin,
	MorphSVGPlugin,
	Physics2DPlugin,
	PhysicsPropsPlugin,
	ScrambleTextPlugin,
	ThrowPropsPlugin,
	GSDevTools,
	SplitText,
	CustomBounce,
	CustomEase,
	CustomWiggle
}
*/



export {
	TweenLite,
	TweenMax,
	TimelineLite,
	TimelineMax,
	_gsScope,

	// plugins
	AttrPlugin,
	BezierPlugin,
	ColorPropsPlugin,
	CSSPlugin,
	CSSRulePlugin,
	DirectionalRotationPlugin,
	EaselPlugin,
	EndArrayPlugin,
	ModifiersPlugin,
	PixiPlugin,
	RoundPropsPlugin,
	ScrollToPlugin,
	TextPlugin,

	// utils
	Draggable,

	// easing
	Ease,
	Power0,
	Power1,
	Power2,
	Power3,
	Power4,
	Linear,
	Back,
	Elastic,
	Bounce,
	RoughEase,
	SlowMo,
	SteppedEase,
	Circ,
	Expo,
	Sine,
	ExpoScaleEase

};