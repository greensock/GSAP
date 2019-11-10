/*!
 * TextPlugin 3.0.0
 * https://greensock.com
 *
 * @license Copyright 2008-2019, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
/* eslint-disable */

import { emojiSafeSplit, getText } from "./utils/strings.js";

let gsap,
	_getGSAP = () => gsap || (typeof(window) !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap);


export const TextPlugin = {
	version:"3.0.0",
	name:"text",
	init(target, value, tween) {
		let i = target.nodeName.toUpperCase(),
			data = this,
			short;
		data.svg = (target.getBBox && (i === "TEXT" || i === "TSPAN"));
		if (!("innerHTML" in target) && !data.svg) {
			return false;
		}
		data.target = target;
		if (typeof(value) !== "object") {
			value = {value:value};
		}
		if (!("value" in value)) {
			data.text = data.original = [""];
			return;
		}
		data.delimiter = value.delimiter || "";
		data.original = emojiSafeSplit(getText(target).replace(/\s+/g, " "), data.delimiter);
		data.text = emojiSafeSplit(value.value.replace(/\s+/g, " "), data.delimiter);
		data.from = tween._from;
		if (data.from) {
			i = data.original;
			data.original = data.text;
			data.text = i;
		}
		data.hasClass = !!(value.newClass || value.oldClass);
		data.newClass = value.newClass;
		data.oldClass = value.oldClass;
		i = data.original.length - data.text.length;
		short = (i < 0) ? data.original : data.text;
		data.fillChar = value.fillChar || (value.padSpace ? "&nbsp;" : "");
		if (i < 0) {
			i = -i;
		}
		while (--i > -1) {
			short.push(data.fillChar);
		}
		this._props.push("text");
	},
	render(ratio, data) {
		if (ratio > 1) {
			ratio = 1;
		} else if (ratio < 0) {
			ratio = 0;
		}
		if (data.from) {
			ratio = 1 - ratio;
		}
		let { text, hasClass, newClass, oldClass, delimiter, target, fillChar, original } = data,
			l = text.length,
			i = (ratio * l + 0.5) | 0,
			applyNew, applyOld, str;
		if (hasClass) {
			applyNew = (newClass && i);
			applyOld = (oldClass && i !== l);
			str = (applyNew ? "<span class='" + newClass + "'>" : "") + text.slice(0, i).join(delimiter) + (applyNew ? "</span>" : "") + (applyOld ? "<span class='" + oldClass + "'>" : "") + delimiter + original.slice(i).join(delimiter) + (applyOld ? "</span>" : "");
		} else {
			str = text.slice(0, i).join(delimiter) + delimiter + original.slice(i).join(delimiter);
		}
		if (data.svg) { //SVG text elements don't have an "innerHTML" in Microsoft browsers.
			target.textContent = str;
		} else {
			target.innerHTML = (fillChar === "&nbsp;" && ~str.indexOf("  ")) ? str.split("  ").join("&nbsp;&nbsp;") : str;
		}
	}
};

TextPlugin.emojiSafeSplit = emojiSafeSplit;
TextPlugin.getText = getText;

_getGSAP() && gsap.registerPlugin(TextPlugin);

export { TextPlugin as default };