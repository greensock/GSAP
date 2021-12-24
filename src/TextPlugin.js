/*!
 * TextPlugin 3.9.1
 * https://greensock.com
 *
 * @license Copyright 2008-2021, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
/* eslint-disable */

import { emojiSafeSplit, getText, splitInnerHTML } from "./utils/strings.js";

let gsap, _tempDiv,
	_getGSAP = () => gsap || (typeof(window) !== "undefined" && (gsap = window.gsap) && gsap.registerPlugin && gsap);


export const TextPlugin = {
	version:"3.9.1",
	name:"text",
	init(target, value, tween) {
		let i = target.nodeName.toUpperCase(),
			data = this,
			short, text, original, j, condensedText, condensedOriginal, aggregate, s;
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
		original = splitInnerHTML(target, data.delimiter, false, value.preserveSpaces);
		if (!_tempDiv) {
			_tempDiv = document.createElement("div");
		}
		_tempDiv.innerHTML = value.value;
		text = splitInnerHTML(_tempDiv, data.delimiter);
		data.from = tween._from;
		if (data.from) {
			i = original;
			original = text;
			text = i;
		}
		data.hasClass = !!(value.newClass || value.oldClass);
		data.newClass = value.newClass;
		data.oldClass = value.oldClass;
		i = original.length - text.length;
		short = (i < 0) ? original : text;
		data.fillChar = value.fillChar || (value.padSpace ? "&nbsp;" : "");
		if (i < 0) {
			i = -i;
		}
		while (--i > -1) {
			short.push(data.fillChar);
		}
		if (value.type === "diff") {
			j = 0;
			condensedText = [];
			condensedOriginal = [];
			aggregate = "";
			for (i = 0; i < text.length; i++) {
				s = text[i];
				if (s === original[i]) {
					aggregate += s;
				} else {
					condensedText[j] = aggregate + s;
					condensedOriginal[j++] = aggregate + original[i];
					aggregate = "";
				}
			}
			text = condensedText;
			original = condensedOriginal;
			if (aggregate) {
				text.push(aggregate);
				original.push(aggregate);
			}
		}
		if (value.speed) {
			tween.duration(Math.min(0.05 / value.speed * short.length, value.maxDuration || 9999));
		}
		this.original = original;
		this.text = text;
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
		if (hasClass && ratio) {
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

TextPlugin.splitInnerHTML = splitInnerHTML;
TextPlugin.emojiSafeSplit = emojiSafeSplit;
TextPlugin.getText = getText;

_getGSAP() && gsap.registerPlugin(TextPlugin);

export { TextPlugin as default };