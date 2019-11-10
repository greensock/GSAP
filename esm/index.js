import { gsap, Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong, Elastic, Back, SteppedEase, Bounce, Sine, Expo, Circ, TweenMax, TweenLite, TimelineLite, TimelineMax } from "./gsap-core.js";
import { CSSPlugin } from "./CSSPlugin.js";
var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap; // to protect from tree shaking

export { gsapWithCSS as gsap, gsapWithCSS as default, CSSPlugin, TweenMax, TweenLite, TimelineMax, TimelineLite, Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong, Elastic, Back, SteppedEase, Bounce, Sine, Expo, Circ };