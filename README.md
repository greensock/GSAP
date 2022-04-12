# GSAP (GreenSock Animation Platform)

#### Professional-grade animation for the modern web

GSAP is a robust JavaScript toolset that turns developers into animation superheroes. Build high-performance animations that work in **every** major browser. Animate CSS, SVG, canvas, React, Vue, WebGL, colors, strings, motion paths, generic objects...anything JavaScript can touch! GSAP's <a href="https://greensock.com/scrolltrigger">ScrollTrigger</a> plugin lets you create jaw-dropping scroll-based animations with minimal code. No other library delivers such advanced sequencing, reliability, and tight control while solving real-world problems on over 11 million sites. GSAP works around countless browser inconsistencies; your animations **just work**. At its core, GSAP is a high-speed property manipulator, updating values over time with extreme accuracy. It's up to 20x faster than jQuery! See https://greensock.com/why-gsap/ for what makes GSAP so special.

### What is GSAP? (video)

[![What is GSAP?](http://greensock.com/_img/github/thumb-what-is-gsap-small.jpg)](http://www.youtube.com/watch?v=RYuau0NeR1U)


GSAP is completely flexible; sprinkle it wherever you want. **Zero dependencies.**

There are many optional <a href="https://greensock.com/gsap-plugins/">plugins</a> and <a href="https://greensock.com/ease-visualizer/">easing</a> functions for achieving advanced effects easily like <a href="https://greensock.com/docs/v3/Plugins/ScrollTrigger">scrolling</a>, <a href="https://greensock.com/morphsvg">morphing</a>, animating along a <a href="https://greensock.com/docs/v3/Plugins/MotionPathPlugin">motion path</a> or <a href="https://greensock.com/docs/v3/Plugins/Flip">FLIP</a> animations. There's even a handy <a href="https://greensock.com/docs/v3/Plugins/Observer">Observer</a> for normalizing event detection across browsers/devices. 

## Docs &amp; Installation
View the <a href="https://greensock.com/docs">full documentation here</a>, including an <a href="https://greensock.com/install">installation guide</a> with videos.

### CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.3/gsap.min.js"></script>
```
Click the green "Get GSAP Now" button at <a href="https://greensock.com/?download=GSAP-JS">greensock.com</a> for more options and installation instructions, including CDN URLs for various plugins. 

**Every major ad network excludes GSAP from file size calculations** and most have it on their own CDNs, so contact them for the appropriate URL(s). 

### NPM
See the <a href="https://greensock.com/docs/v3/Installation#npm">guide to using GSAP via NPM here</a>.

```javascript
npm install gsap
```
The default (main) file is **gsap.js** which includes most of the eases as well as the core plugins like CSSPlugin, AttrPlugin, SnapPlugin, ModifiersPlugin, and all of the <a href="https://greensock.com/docs/v3/GSAP/UtilityMethods">utility methods</a> like <a href="https://greensock.com/docs/v3/GSAP/UtilityMethods/interpolate()">interpolate()</a>, <a href="https://greensock.com/docs/v3/GSAP/UtilityMethods/mapRange()">mapRange()</a>, etc. 
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

Download <a href="https://greensock.com/club/">Club GreenSock</a> members-only plugins from your GreenSock.com account and then include them in your own JS payload. There's even a <a href="https://www.youtube.com/watch?v=znVi89_gazE">tarball file you can install with NPM/Yarn</a>. GreenSock has a <a href="https://greensock.com/docs/v3/Installation#private">private NPM registry</a> for members too. Post questions in our <a href="https://greensock.com/forums/">forums</a> and we'd be happy to help.


### Getting Started (includes video)

[![Getting Started with GSAP](http://greensock.com/_img/github/thumb-getting-started-small.gif)](http://greensock.com/get-started)

### ScrollTrigger &amp; ScrollSmoother

If you're looking to do scroll-driven animations, GSAP's <a href="https://greensock.com/scrolltrigger">ScrollTrigger</a> plugin is the new standard. There's a companion <a href="https://greensock.com/scrollsmoother">ScrollSmoother</a> as well.

[![ScrollTrigger](http://greensock.com/_img/github/thumb-scrolltrigger-small.gif)](http://greensock.com/scrolltrigger)


### Resources

* <a href="https://greensock.com/">GSAP home page</a>
* <a href="https://greensock.com/get-started/">Getting started guide</a>
* <a href="https://greensock.com/docs/">Docs</a>
* <a href="https://greensock.com/cheatsheet">Cheat sheet</a>
* <a href="https://greensock.com/forums/">Forums</a>
* <a href="https://greensock.com/ease-visualizer/">Ease Visualizer</a>
* <a href="https://greensock.com/showcase">Showcase</a>
* <a href="https://greensock.com/why-gsap/">Why GSAP?</a> (convince your boss)
* <a href="https://greensock.com/stagger">Staggering animations in GSAP 3</a>
* <a href="https://greensock.com/draggable/">Draggable</a>
* <a href="https://greensock.com/club/">Club GreenSock</a> (get access to bonus plugins not in this repository)

### What is Club GreenSock? (video)

[![What is Club GreenSock?](http://greensock.com/_img/github/thumb-what-is-club-greensock-small.jpg)](http://www.youtube.com/watch?v=Ome_KnloOhs)

There are 3 main reasons anyone signs up for <a href="https://greensock.com/club">Club GreenSock</a>: 
* To get access to the incredibly helpful <a href="https://greensock.com/club">members-only plugins</a> like MorphSVGPlugin, SplitText, ScrollSmoother, etc.
* To get the special <a href="https://greensock.com/licensing/">commercial license</a> ("Business Green" - only necessary if multiple customers are being charged for something that uses GreenSock technology).
* To support ongoing development efforts and **cheer us on**.

<a href="https://greensock.com/club/">Sign up</a> anytime.

### Advanced playback controls &amp; debugging

<a href="https://greensock.com/gsdevtools/">GSDevTools</a> adds a visual UI for controlling your GSAP animations which can significantly boost your workflow and productivity. (<a href="https://greensock.com/club">Club GreenSock</a> membership required, not included in this repository).

### Try all bonus plugins for free!
<a href="https://greensock.com/try-plugins">https://greensock.com/try-plugins</a>

### Need help?
<a href="https://greensock.com/forums/">GreenSock forums</a> are an excellent resource for learning and getting your questions answered. Report any bugs there too please (it's also okay to <a href="https://github.com/greensock/GSAP/issues">file an issue on Github</a> if you prefer).

### License
GreenSock's standard "no charge" license can be viewed at <a href="https://greensock.com/standard-license">http://greensock.com/standard-license</a>. <a href="https://greensock.com/club/">Club GreenSock</a> members are granted additional rights. See <a href="https://greensock.com/licensing/">http://greensock.com/licensing/</a> for details. Why doesn't GreenSock use an MIT (or similar) open source license, and why is that a **good** thing? This article explains it all: <a href="https://greensock.com/why-license/" target="_blank">http://greensock.com/why-license/</a>

Copyright (c) 2008-2022, GreenSock. All rights reserved. 