# GSAP (GreenSock Animation Platform)

#### Professional-grade animation for the modern web

GSAP is a robust JavaScript toolset that turns developers into animation superheroes. Build high-performance animations that work in **every** major browser. Animate CSS, SVG, canvas, React, Vue, WebGL, colors, strings, motion paths, generic objects...anything JavaScript can touch! GSAP's <a href="https://greensock.com/scrolltrigger">ScrollTrigger</a> plugin lets you create jaw-dropping scroll-based animations with minimal code. No other library delivers such advanced sequencing, reliability, and tight control while solving real-world problems on over 10 million sites. GSAP works around countless browser inconsistencies; your animations **just work**. At its core, GSAP is a high-speed property manipulator, updating values over time with extreme accuracy. It's up to 20x faster than jQuery! See https://greensock.com/why-gsap/ for what makes GSAP so special.

### What is GSAP? (video)

[![What is GSAP?](http://greensock.com/_img/github/thumb-what-is-gsap-small.jpg)](http://www.youtube.com/watch?v=RYuau0NeR1U)


GSAP is completely flexible; sprinkle it wherever you want. **Zero dependencies.**

There are many optional <a href="https://greensock.com/gsap-plugins/">plugins</a> and <a href="https://greensock.com/ease-visualizer/">easing</a> functions for achieving advanced effects easily like <a href="https://greensock.com/docs/v3/Plugins/ScrollTrigger">scrolling</a>, <a href="https://greensock.com/morphsvg">morphing</a>, or animating along a <a href="https://greensock.com/docs/v3/Plugins/MotionPathPlugin">motion path</a>. 

## Docs &amp; Installation
View the <a href="https://greensock.com/docs">full documentation here</a>, including an <a href="https://greensock.com/install">installation guide</a> with videos.

### CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js"></script>
```
Click the green "Get GSAP Now" button at <a href="https://greensock.com/?download=GSAP-JS">greensock.com</a> for more options and installation instructions, including CDN URLs for various plugins. 

**Every major ad network excludes GSAP from file size calculations** and most have it on their own CDNs, so contact them for the appropriate URL(s). 

### NPM
See the <a href="https://greensock.com/docs/v3/Installation#npm">guide to using GSAP via NPM here</a>.

```javascript
npm install gsap
```
The default (main) file is **gsap.js** which includes most of the eases as well as the core plugins like CSSPlugin, AttrPlugin, SnapPlugin, ModifiersPlugin, and all of the <a href="https://greensock.com/docs/v3/GSAP/UtilityMethods">utility methods</a> like interpolate(), mapRange(), etc. 
```javascript
// typical import
import gsap from "gsap";

// or get other plugins:
import ScrollTrigger from "gsap/ScrollTrigger";
import Draggable from "gsap/Draggable";

// or all tools are exported from the "all" file (excluding bonus plugins):
import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from "gsap/all";

// don't forget to register plugins
gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin); 
```
The NPM files are ES modules, but there's also a /dist/ directory with <a href="https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/">UMD</a> files for extra compatibility.

Download <a href="https://greensock.com/club/">Club GreenSock</a> members-only plugins from your GreenSock.com account and then include them in your own JS payload. There's even a <a href="https://www.youtube.com/watch?v=znVi89_gazE">tarball file you can install with NPM/Yarn</a>. GreenSock has a <a href="https://greensock.com/docs/v3/Installation#private">private NPM registry</a> for members too. Post questions in our <a href="https://greensock.com/forums/">forums</a> and we'd be happy to help.


### Getting Started (includes video)

[![Getting Started with GSAP](http://greensock.com/_img/github/thumb-getting-started-small.gif)](http://greensock.com/get-started)

### ScrollTrigger

If you're looking to do scroll-driven animations, GSAP's <a href="https://greensock.com/scrolltrigger">ScrollTrigger</a> plugin is the new standard. 

[![ScrollTrigger](http://greensock.com/_img/github/thumb-scrolltrigger-small.gif)](http://greensock.com/scrolltrigger)


### Resources

* <a href="https://greensock.com/">GSAP home page</a>
* <a href="https://greensock.com/get-started/">Getting started guide</a>
* <a href="https://greensock.com/docs/">Docs</a>
* <a href="https://greensock.com/cheatsheet">Cheat sheet</a>
* <a href="https://greensock.com/forums/">Forums</a>
* <a href="https://greensock.com/showcase">Showcase</a>
* <a href="https://greensock.com/why-gsap/">Why GSAP?</a> (convince your boss)
* <a href="https://greensock.com/stagger">Staggering animations in GSAP 3</a>
* <a href="https://greensock.com/draggable/">Draggable</a>
* <a href="https://greensock.com/club/">Club GreenSock</a> (get access to bonus plugins not in this repository)

### Get CustomEase for free
Sign up for a free GreenSock account to gain access to <a href="https://greensock.com/customease/">CustomEase</a> which lets you create literally any ease imaginable (unlimited control points). It's in the <a href="https://greensock.com/install">download zip at GreenSock.com</a> (when you're logged in). 

### What is Club GreenSock? (video)

[![What is Club GreenSock?](http://greensock.com/_img/github/thumb-what-is-club-greensock-small.jpg)](http://www.youtube.com/watch?v=Ome_KnloOhs)

<a href="https://greensock.com/club/">Sign up</a> anytime.

### Advanced playback controls &amp; debugging

<a href="https://greensock.com/gsdevtools/">GSDevTools</a> adds a visual UI for controlling your GSAP animations which can significantly boost your workflow and productivity. (<a href="https://greensock.com/club">Club GreenSock</a> membership required, not included in this repository).

### Try all bonus plugins for free on Codepen
<a href="https://codepen.io/GreenSock/full/OPqpRJ">https://codepen.io/GreenSock/full/OPqpRJ</a>

### Need help?
<a href="https://greensock.com/forums/">GreenSock forums</a> are an excellent resource for learning and getting your questions answered. Report any bugs there too please (it's also okay to <a href="https://github.com/greensock/GSAP/issues">file an issue on Github</a> if you prefer).

### License
GreenSock's standard "no charge" license can be viewed at <a href="https://greensock.com/standard-license">http://greensock.com/standard-license</a>. <a href="https://greensock.com/club/">Club GreenSock</a> members are granted additional rights. See <a href="https://greensock.com/licensing/">http://greensock.com/licensing/</a> for details. Why doesn't GreenSock use an MIT (or similar) open source license, and why is that a **good** thing? This article explains it all: <a href="https://greensock.com/why-license/" target="_blank">http://greensock.com/why-license/</a>

Copyright (c) 2008-2021, GreenSock. All rights reserved. 