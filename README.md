# GSAP (GreenSock Animation Platform)

[![GSAP - Animate anything](https://gsap.com/GSAP-share-image.png)](http://gsap.com)

GSAP is a **framework-agnostic** JavaScript animation library that turns developers into animation superheroes. Build high-performance animations that work in **every** major browser. Animate CSS, SVG, canvas, React, Vue, WebGL, colors, strings, motion paths, generic objects...anything JavaScript can touch! GSAP's <a href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/">ScrollTrigger</a> plugin delivers jaw-dropping scroll-based animations with minimal code. <a href="https://gsap.com/docs/v3/GSAP/gsap.matchMedia()">gsap.matchMedia()</a> makes building responsive, accessibility-friendly animations a breeze.

No other library delivers such advanced sequencing, reliability, and tight control while solving real-world problems on over 12 million sites. GSAP works around countless browser inconsistencies; your animations ***just work***. At its core, GSAP is a high-speed property manipulator, updating values over time with extreme accuracy. It's up to 20x faster than jQuery!

GSAP is completely flexible; sprinkle it wherever you want. **Zero dependencies.**

There are many optional <a href="https://gsap.com/docs/v3/Plugins">plugins</a> and <a href="https://gsap.com/docs/v3/Eases">easing</a> functions for achieving advanced effects easily like <a href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/">scrolling</a>, <a href="https://gsap.com/docs/v3/Plugins/MorphSVGPlugin">morphing</a>, animating along a <a href="https://gsap.com/docs/v3/Plugins/MotionPathPlugin">motion path</a> or <a href="https://gsap.com/docs/v3/Plugins/Flip/">FLIP</a> animations. There's even a handy <a href="https://gsap.com/docs/v3/Plugins/Observer/">Observer</a> for normalizing event detection across browsers/devices. 


### Get Started

[![Get Started with GSAP](http://gsap.com/_img/github/get-started.jpg)](http://gsap.com/get-started)


## Docs &amp; Installation

View the <a href="https://gsap.com/docs">full documentation here</a>, including an <a href="https://gsap.com/install">installation guide</a>.

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
```

See <a href="https://www.jsdelivr.com/gsap">JSDelivr's dedicated GSAP page</a> for quick CDN links to the core files/plugins. There are more <a href="https://gsap.com/install">installation instructions</a> at gsap.com.

**Every major ad network excludes GSAP from file size calculations** and most have it on their own CDNs, so contact them for the appropriate URL(s). 

### NPM
See the <a href="https://gsap.com/install">guide to using GSAP via NPM here</a>.

```javascript
npm install gsap
```

GSAP's core can animate almost anything including CSS and attributes, plus it includes all of the <a href="https://gsap.com/docs/v3/GSAP/UtilityMethods">utility methods</a> like <a href="https://gsap.com/docs/v3/GSAP/UtilityMethods/interpolate()">interpolate()</a>, <a href="https://gsap.com/docs/v3/GSAP/UtilityMethods/mapRange()">mapRange()</a>, most of the <a href="https://gsap.com/docs/v3/Eases">eases</a>, and it can do snapping and modifiers. 

```javascript
// typical import
import gsap from "gsap";

// get other plugins:
import ScrollTrigger from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";
import Draggable from "gsap/Draggable";

// or all tools are exported from the "all" file (excluding members-only plugins):
import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from "gsap/all";

// don't forget to register plugins
gsap.registerPlugin(ScrollTrigger, Draggable, Flip, MotionPathPlugin); 
```

The NPM files are ES modules, but there's also a /dist/ directory with <a href="https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/">UMD</a> files for extra compatibility.

Download <a href="https://gsap.com/pricing/">Club GSAP</a> members-only plugins from your gsap.com account and then include them in your own JS payload. There's even a <a href="https://www.youtube.com/watch?v=znVi89_gazE">tarball file you can install with NPM/Yarn</a>. GSAP has a <a href="https://gsap.com/docs/v3/Installation#private">private NPM registry</a> for members too. Post questions in our <a href="https://gsap.com/community/">forums</a> and we'd be happy to help.

### ScrollTrigger &amp; ScrollSmoother

If you're looking for scroll-driven animations, GSAP's <a href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/">ScrollTrigger</a> plugin is the new standard. There's a companion <a href="https://gsap.com/docs/v3/Plugins/ScrollSmoother/">ScrollSmoother</a> as well.

[![ScrollTrigger](http://gsap.com/_img/github/scrolltrigger.jpg)](https://gsap.com/docs/v3/Plugins/ScrollTrigger)

### Using React? 

There's a <a href="https://www.npmjs.com/package/@gsap/react">@gsap/react</a> package that exposes a `useGSAP()` hook which is a drop-in replacement for `useEffect()`/`useLayoutEffect()`, automating cleanup tasks. Please read the <a href="https://gsap.com/react">React guide</a> for details.

### Resources

* <a href="https://gsap.com/">gsap.com</a>
* <a href="https://gsap.com/get-started/">Getting started guide</a>
* <a href="https://gsap.com/docs/">Docs</a>
* <a href="https://gsap.com/demos">Demos &amp; starter templates</a>
* <a href="https://gsap.com/community/">Community forums</a>
* <a href="https://gsap.com/docs/v3/Eases">Ease Visualizer</a>
* <a href="https://gsap.com/showcase">Showcase</a>
* <a href="https://www.youtube.com/@GreenSockLearning">YouTube Channel</a>
* <a href="https://gsap.com/cheatsheet">Cheat sheet</a>
* <a href="https://gsap.com/trial">Try bonus plugins for free</a>
* <a href="https://gsap.com/pricing/">Club GSAP</a> (get access to unrestricted bonus plugins that are not in this repository)

### What is Club GSAP?

There are 3 main reasons anyone signs up for <a href="https://gsap.com/pricing">Club GSAP</a>: 
* To get access to snazzy <a href="https://gsap.com/pricing">members-only plugins</a> like MorphSVG, SplitText, ScrollSmoother, etc.
* To get the special <a href="https://gsap.com/licensing/">commercial license</a>.
* To support ongoing development efforts and **cheer us on**.

<a href="https://gsap.com/pricing/">Learn more</a>.

### Try all bonus plugins for free!
<a href="https://gsap.com/trial">https://gsap.com/trial</a>

### Need help?
Ask in the friendly <a href="https://gsap.com/community/">GSAP forums</a>. Or share your knowledge and help someone else - it's a great way to sharpen your skills! Report any bugs there too (or <a href="https://github.com/greensock/GSAP/issues">file an issue here</a> if you prefer).

### License
GreenSock's standard "no charge" license can be viewed at <a href="https://gsap.com/standard-license">https://gsap.com/standard-license</a>. <a href="https://gsap.com/pricing/">Club GSAP</a> members are granted additional rights. See <a href="https://gsap.com/licensing/">https://gsap.com/licensing/</a> for details. Why doesn't GSAP use an MIT (or similar) open source license, and why is that a **good** thing? This article explains it all: <a href="https://gsap.com/why-license/" target="_blank">https://gsap.com/why-license/</a>

Copyright (c) 2008-2025, GreenSock Inc. All rights reserved.