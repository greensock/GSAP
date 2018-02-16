# GSAP (GreenSock Animation Platform)

#### Ultra high-performance, professional-grade animation for the modern web

GSAP is a JavaScript library for creating high-performance animations that work in **every** major browser (or beyond the browser). No other library delivers such advanced sequencing, reliability, API efficiency, and tight control while solving real-world problems on over 4 million sites. GSAP works around countless browser inconsistencies; your animations 'just work'. Animate CSS properties, SVG, canvas libraries, custom properties of generic objects, colors, strings...pretty much anything! At its core, GSAP is a property manipulator, updating values over time very quickly with extreme accuracy. And it's up to 20x faster than jQuery! See the <a href="https://greensock.com/why-gsap/">"Why GSAP?"</a> article for what makes GSAP so special.

### What is GSAP? (video)

[![What is GSAP?](http://img.youtube.com/vi/-riXBjDfvOw/0.jpg)](http://www.youtube.com/watch?v=-riXBjDfvOw)

### Getting started video

[![Getting started video](http://img.youtube.com/vi/tMP1PCErrmE/0.jpg)](http://www.youtube.com/watch?v=tMP1PCErrmE)

Simply put, GSAP is the most robust high-performance animation library on the planet, which is probably why **every major ad network excludes it from file size calculations**. Unlike monolithic frameworks that dictate how you structure your apps, GSAP is completely flexible; sprinkle it wherever you want. React, Vue, Angular or vanilla JS - doesn't matter. Zero dependencies.

This is the public repository for GreenSock's JavaScript tools like <a href="https://greensock.com/gsap/" target="_blank">GSAP</a> and <a href="https://greensock.com/draggable/" target="_blank">Draggable</a>. "GSAP" describes all of the animation-related tools which include TweenLite, TweenMax, TimelineLite, TimelineMax, various <a href="https://greensock.com/plugins/?product_id=4921">plugins</a>, extra <a href="https://greensock.com/ease-visualizer/">easing</a> functions, etc. 

### CDN
The TweenMax file is most popular because it has all the essential tools plus several common plugins, all in one file:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.4/TweenMax.min.js"></script>
```
Click the green "Download GSAP" button at <a href="https://greensock.com/?download=GSAP-JS">greensock.com</a> for more options. Click "customize" at the bottom of the resulting window to see all the extra plugins and tool URLs. 

Draggable, for example, is at:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.4/utils/Draggable.min.js"></script>
```

Most ad networks have it on their CDNs as well, so contact them for the appropriate URL(s). 

### NPM
```javascript
npm install gsap
```
The default (main) file is TweenMax which includes TweenLite, TimelineLite, TimelineMax, all of the eases (except CustomEase/CustomWiggle/CustomBounce) and the following plugins: css, roundProps, bezier, attr, and directionalRotation. 
```javascript
//typical import
import {TweenMax, Power2, TimelineLite} from "gsap";

//or get to the parts that aren't included inside TweenMax:
import Draggable from "gsap/Draggable";
import ScrollToPlugin from "gsap/ScrollToPlugin";
```
If you're having trouble getting a plugin to work, it may be that your build tool's tree shaking feature is dumping it, so try referencing it directly somewhere in your code. For import problems, try the npm path like "gsap/ModifiersPlugin". For Club GreenSock-only plugins, download them from your GreenSock.com account and then drop them into your node_modules/gsap folder or treat them as part of your own JS payload. Post other questions in our <a href="https://greensock.com/forums/">forums</a> and we'd be happy to help.

### Resources

* <a href="https://greensock.com/gsap/">GSAP home page</a>
* <a href="https://greensock.com/get-started-js/">Getting started guide</a>
* <a href="https://greensock.com/docs/">Full documentation</a>
* <a href="https://greensock.com/forums/">Community forums</a>
* <a href="https://greensock.com/examples-showcases">Examples &amp; showcases</a>
* <a href="https://greensock.com/why-gsap/">Why GSAP?</a> (a practical guide for developers)
* <a href="https://greensock.com/draggable/">Draggable demo</a>
* <a href="https://greensock.com/svg-tips/">Animating SVG with GSAP</a>
* <a href="https://greensock.com/club/">Club GreenSock</a> (get access to bonus plugins and tools not in this repository)
* css-tricks.com article: <a href="https://css-tricks.com/myth-busting-css-animations-vs-javascript/">Myth Busting: CSS Animations vs. JavaScript</a>
* css-tricks.com article about <a href="https://css-tricks.com/writing-smarter-animation-code/">writing smarter animation code</a>

### Get CustomEase for free
Sign up for a free GreenSock account to gain access to <a href="https://greensock.com/customease/">CustomEase</a> which lets you create literally any ease imaginable (unlimited control points). It's in the download zip at <a href="https://greensock.com/?download=GSAP-JS">GreenSock.com</a> (when you're logged in). 

### What is Club GreenSock? (video)

[![What is Club GreenSock?](http://img.youtube.com/vi/03yJ6-Aq0gQ/0.jpg)](http://www.youtube.com/watch?v=03yJ6-Aq0gQ)

<a href="https://greensock.com/club/">Sign up</a> anytime.

### Advanced playback controls &amp; debugging

<a href="https://greensock.com/gsdevtools/">![GSDevTools](https://greensock.com/_img/github/GSDevTools-github-thumb.gif)</a>

<a href="https://greensock.com/gsdevtools/">GSDevTools</a> adds a visual UI for controlling your GSAP animations which can significantly boost your workflow and productivity. (<a href="https://greensock.com/club">Club GreenSock</a> membership required, not included in this repository).

### Try all bonus plugins for free on Codepen
<a href="https://codepen.io/GreenSock/full/OPqpRJ/">https://codepen.io/GreenSock/full/OPqpRJ/</a>

### Need help?
<a href="https://greensock.com/forums/">GreenSock forums</a> are an excellent resource for learning and getting your questions answered. Report any bugs there too please (it's also okay to file an issue on Github if you prefer).

### License
GreenSock's standard "no charge" license can be viewed at <a href="https://greensock.com/standard-license">http://greensock.com/standard-license</a>. <a href="https://greensock.com/club/">Club GreenSock</a> members are granted additional rights. See <a href="https://greensock.com/licensing/">http://greensock.com/licensing/</a> for details. Why doesn't GreenSock use an MIT (or similar) open source license, and why is that a **good** thing? This article explains it all: <a href="https://greensock.com/why-license/" target="_blank">http://greensock.com/why-license/</a>

Copyright (c) 2008-2018, GreenSock. All rights reserved. 