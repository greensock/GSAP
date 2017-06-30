# GSAP (GreenSock Animation Platform)

#### Ultra high-performance, professional-grade animation for the modern web

GSAP is a JavaScript library for high-performance HTML5 animations that work in **all** major browsers. No other library delivers such advanced sequencing, reliability, API efficiency, and tight control while solving real-world problems for animators on over 3 million sites. GSAP can animate *any* numeric property of *any* JS object, not just CSS properties.

### What is GSAP? (video)

[![What is GSAP?](http://img.youtube.com/vi/-riXBjDfvOw/0.jpg)](http://www.youtube.com/watch?v=-riXBjDfvOw)

### Getting started video

[![Getting started video](http://img.youtube.com/vi/tMP1PCErrmE/0.jpg)](http://www.youtube.com/watch?v=tMP1PCErrmE)

Think of GSAP as the Swiss Army Knife of animation. It animates anything JavaScript can touch (CSS properties, canvas library objects, SVG, generic objects, whatever) and solves countless browser inconsistencies, all with blazing speed (up to 20x faster than jQuery), including automatic GPU-acceleration of transforms. See the <a href="https://greensock.com/why-gsap/">"Why GSAP?"</a> article for details. Most other libraries only animate CSS properties. Plus, their sequencing abilities and runtime controls pale by comparison. Simply put, GSAP is the most robust high-performance animation library on the planet, which is probably why Google recommends it for JS-based animations and every major ad network excludes it from file size calculations. Unlike monolithic frameworks that dictate how you structure your apps, GSAP is completely flexible; sprinkle it wherever you want.

This is the public repository for GreenSock's JavaScript tools like <a href="https://greensock.com/gsap/" target="_blank">GSAP</a> and <a href="https://greensock.com/draggable/" target="_blank">Draggable</a>. "GSAP" describes all of the animation-related tools which include TweenLite, TweenMax, TimelineLite, TimelineMax, various plugins (like CSSPlugin for animating CSS properties of DOM elements), extra easing functions, etc. 

### Resources

* <a href="https://greensock.com/gsap/">GSAP home page</a>
* <a href="https://greensock.com/get-started-js/">Getting started guide</a>
* <a href="https://greensock.com/docs/">Full documentation</a>
* <a href="https://greensock.com/forums/">Community forums</a>
* <a href="https://greensock.com/examples-showcases">Examples &amp; showcases</a>
* <a href="https://codepen.io/GreenSock/full/OPqpRJ/">Codepen with all bonus plugins</a> (try them for free on codepen)
* <a href="https://greensock.com/why-gsap/">Why GSAP?</a> (a practical guide for developers)
* <a href="https://greensock.com/draggable/">Draggable demo</a>
* <a href="https://greensock.com/svg-tips/">Animating SVG with GSAP</a>
* <a href="https://greensock.com/club/">Club GreenSock</a> (get access to bonus plugins and tools not in this repository)
* css-tricks.com article: <a href="https://css-tricks.com/myth-busting-css-animations-vs-javascript/">Myth Busting: CSS Animations vs. JavaScript</a>
* css-tricks.com article about how <a href="https://css-tricks.com/svg-animation-on-css-transforms/">GSAP solves cross-browser SVG animation challenges</a>

### CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.2/TweenMax.min.js"></script>
```
Click the green "Download GSAP" button at <a href="https://greensock.com/?download=GSAP-JS">https://greensock.com</a> for more options. Most ad networks have it on their CDNs as well, so contact them for the appropriate URL(s). 

### NPM
```javascript
npm install gsap
```
The default (main) file is TweenMax which also includes TweenLite, TimelineLite, TimelineMax, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin, and all of the eases like Power1, Power2, Power3, Power4, Back, Bounce, Circ, Cubic, Elastic, Expo, Linear, Sine, RoughEase, SlowMo, and SteppedEase (except the CustomEase, CustomWiggle, and CustomBounce). Please make sure you're using at least version 1.19.1.
```javascript
//typical import
import {TweenMax, Power2, TimelineLite} from "gsap";

//or get to the parts that aren't included inside TweenMax (works as of 1.19.1):
import Draggable from "gsap/Draggable";
import ScrollToPlugin from "gsap/ScrollToPlugin";
```

### Get CustomEase for free
Sign up for a free GreenSock account to gain access to <a href="https://greensock.com/customease/">CustomEase</a>, a tool that lets you create literally any ease imaginable (unlimited control points). It's in the download zip at <a href="https://greensock.com/?download=GSAP-JS">GreenSock.com</a> (when you're logged in). 

### What is Club GreenSock? (video)

[![What is Club GreenSock?](http://img.youtube.com/vi/03yJ6-Aq0gQ/0.jpg)](http://www.youtube.com/watch?v=03yJ6-Aq0gQ)

<a href="https://greensock.com/club/">Sign up</a> anytime.

### Need help?
Head over to the <a href="https://greensock.com/forums/">GreenSock forums</a> which are an excellent resource for learning and getting questions answered. Report any bugs there too please (it's also okay to file an issue on Github if you prefer).

Copyright (c) 2008-2017, GreenSock. All rights reserved. 

License: GreenSock's standard "no charge" license can be viewed at <a href="https://greensock.com/standard-license">http://greensock.com/standard-license</a>. <a href="https://greensock.com/club/">Club GreenSock</a> members are granted additional rights. See <a href="https://greensock.com/licensing/">http://greensock.com/licensing/</a> for details. Why doesn't GreenSock use an MIT (or similar) open source license, and why is that a **good** thing? This article explains it all: <a href="https://greensock.com/why-license/" target="_blank">http://greensock.com/why-license/</a>