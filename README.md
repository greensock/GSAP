# GSAP (GreenSock Animation Platform)

#### Professional-grade animation for the modern web

GSAP is a JavaScript library for building high-performance animations that work in **every** major browser. Animate CSS, SVG, canvas, React, Vue, WebGL, colors, strings, motion paths, generic objects...anything JavaScript can touch! No other library delivers such advanced sequencing, reliability, and tight control while solving real-world problems on millions of sites. GSAP works around countless browser inconsistencies; your animations **just work**.  At its core, GSAP is a high-speed property manipulator, updating values over time with extreme accuracy. It's up to 20x faster than jQuery! See the <a href="https://greensock.com/why-gsap/">"Why GSAP?" article</a> for what makes GSAP so special.

### What is GSAP? (video)

[![What is GSAP?](http://img.youtube.com/vi/RYuau0NeR1U/0.jpg)](http://www.youtube.com/watch?v=RYuau0NeR1U)


GSAP is completely flexible; sprinkle it wherever you want. **Zero dependencies.**

There are many optional <a href="https://greensock.com/gsap-plugins/">plugins</a> and <a href="https://greensock.com/ease-visualizer/">easing</a> functions for achieving advanced effects easily like morphing, scrolling, or animating along a motion path. 

## Docs
View the <a href="https://greensock.com/docs">full documentation here</a>, including an <a href="https://greensock.com/docs/v3/Installation">installation guide</a>.

### CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.0.1/gsap.min.js"></script>
```
Click the green "Get GSAP Now" button at <a href="https://greensock.com/?download=GSAP-JS">greensock.com</a> for more options and installation instructions, including CDN URLs for various plugins. 

**Every major ad network excludes GSAP from file size calculations** and most have it on their own CDNs as well, so contact them for the appropriate URL(s). 

### NPM
See the <a href="https://greensock.com/docs/v3/Installation#npm">guide to using GSAP via NPM here</a>.

```javascript
npm install gsap
```
The default (main) file is gsap.js which includes most of the eases as well as the core plugins like CSSPlugin, AttrPlugin, SnapPlugin, ModifiersPlugin, and all of the utility methods like interpolate(), mapRange(), etc. 
```javascript
// typical import
import gsap from "gsap";

// or get other plugins:
import Draggable from "gsap/Draggable";
import ScrollToPlugin from "gsap/ScrollToPlugin";

// or all tools are exported from the "all" file (excluding bonus plugins):
import { gsap, ScrollToPlugin, Draggable, MotionPathPlugin } from "gsap/all";

// don't forget to register plugins
gsap.registerPlugin(ScrollToPlugin, Draggable, MotionPathPlugin); 
```
The NPM files are ES modules, but there's also a /dist/ directory with UMD files for extra compatibility.

Download <a href="https://greensock.com/club/">Club GreenSock</a>-only plugins from your GreenSock.com account and then treat them as part of your own JS payload. Post other questions in our <a href="https://greensock.com/forums/">forums</a> and we'd be happy to help.

### Resources

* <a href="https://greensock.com/">GSAP home page</a>
* <a href="https://greensock.com/get-started/">Getting started guide</a>
* <a href="https://greensock.com/docs/">Full documentation</a>
* <a href="https://greensock.com/forums/">Forums</a>
* <a href="https://greensock.com/showcase">Showcase</a>
* <a href="https://greensock.com/why-gsap/">Why GSAP?</a> (a practical guide for developers)
* <a href="https://codepen.io/GreenSock/full/vYBRPbO">Advanced staggers</a>
* <a href="https://greensock.com/draggable/">Draggable</a>
* <a href="https://greensock.com/svg-tips/">Animating SVG with GSAP</a>
* <a href="https://greensock.com/club/">Club GreenSock</a> (get access to bonus plugins not in this repository)

### Get CustomEase for free
Sign up for a free GreenSock account to gain access to <a href="https://greensock.com/customease/">CustomEase</a> which lets you create literally any ease imaginable (unlimited control points). It's in the download zip at <a href="https://greensock.com/?download=GSAP-JS">GreenSock.com</a> (when you're logged in). 

### What is Club GreenSock? (video)

[![What is Club GreenSock?](http://img.youtube.com/vi/Ome_KnloOhs/0.jpg)](http://www.youtube.com/watch?v=Ome_KnloOhs)

<a href="https://greensock.com/club/">Sign up</a> anytime.

### Advanced playback controls &amp; debugging

<a href="https://greensock.com/gsdevtools/">![GSDevTools](https://greensock.com/_img/github/GSDevTools-github-thumb.gif)</a>

<a href="https://greensock.com/gsdevtools/">GSDevTools</a> adds a visual UI for controlling your GSAP animations which can significantly boost your workflow and productivity. (<a href="https://greensock.com/club">Club GreenSock</a> membership required, not included in this repository).

### Try all bonus plugins for free on Codepen
<a href="https://codepen.io/GreenSock/full/OPqpRJ">https://codepen.io/GreenSock/full/OPqpRJ</a>

### Need help?
<a href="https://greensock.com/forums/">GreenSock forums</a> are an excellent resource for learning and getting your questions answered. Report any bugs there too please (it's also okay to file an issue on Github if you prefer).

### License
GreenSock's standard "no charge" license can be viewed at <a href="https://greensock.com/standard-license">http://greensock.com/standard-license</a>. <a href="https://greensock.com/club/">Club GreenSock</a> members are granted additional rights. See <a href="https://greensock.com/licensing/">http://greensock.com/licensing/</a> for details. Why doesn't GreenSock use an MIT (or similar) open source license, and why is that a **good** thing? This article explains it all: <a href="https://greensock.com/why-license/" target="_blank">http://greensock.com/why-license/</a>

Copyright (c) 2008-2019, GreenSock. All rights reserved. 