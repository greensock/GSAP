/*!
 * matrix 3.1.1
 * https://greensock.com
 *
 * Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
/* eslint-disable */

let _doc, _win, _docElement, _body,	_divContainer, _svgContainer, _identityMatrix,
	_transformProp = "transform",
	_transformOriginProp = _transformProp + "Origin",
	_setDoc = element => {
		let doc = element.ownerDocument || element;
		if (!(_transformProp in element.style) && "msTransform" in element.style) { //to improve compatibility with old Microsoft browsers
			_transformProp = "msTransform";
			_transformOriginProp = _transformProp + "Origin";
		}
		while (doc.parentNode && (doc = doc.parentNode)) {	}
		_win = window;
		_identityMatrix = new Matrix2D();
		if (doc) {
			_doc = doc;
			_docElement = doc.documentElement;
			_body = doc.body;
		}
		return doc;
	},
	_svgTemps = [], //we create 3 elements for SVG, and 3 for other DOM elements and cache them for performance reasons. They get nested in _divContainer and _svgContainer so that just one element is added to the DOM on each successive attempt. Again, performance is key.
	_divTemps = [],
	_getDocScrollTop = () => _win.pageYOffset  || _doc.scrollTop || _docElement.scrollTop || _body.scrollTop || 0,
	_getDocScrollLeft = () => _win.pageXOffset || _doc.scrollLeft || _docElement.scrollLeft || _body.scrollLeft || 0,
	_svgOwner = element => element.ownerSVGElement || ((element.tagName + "").toLowerCase() === "svg" ? element : null),
	_isFixed = element => {
		if (_win.getComputedStyle(element).position === "fixed") {
			return true;
		}
		element = element.parentNode;
		if (element && element.nodeType === 1) { // avoid document fragments which will throw an error.
			return _isFixed(element);
		}
	},
	_createSibling = (element, i) => {
		if (element.parentNode && (_doc || _setDoc(element))) {
			let svg = _svgOwner(element),
				ns = svg ? (svg.getAttribute("xmlns") || "http://www.w3.org/2000/svg") : "http://www.w3.org/1999/xhtml",
				type = svg ? (i ? "rect" : "g") : "div",
				x = i !== 2 ? 0 : 100,
				y = i === 3 ? 100 : 0,
				css = "position:absolute;display:block;pointer-events:none;",
				e = _doc.createElementNS ? _doc.createElementNS(ns.replace(/^https/, "http"), type) : _doc.createElement(type);
			if (i) {
				if (!svg) {
					if (!_divContainer) {
						_divContainer = _createSibling(element);
						_divContainer.style.cssText = css;
					}
					e.style.cssText = css + "width:1px;height:1px;top:" + y + "px;left:" + x + "px";
					_divContainer.appendChild(e);

				} else {
					if (!_svgContainer) {
						_svgContainer = _createSibling(element);
					}
					e.setAttribute("width", 1);
					e.setAttribute("height", 1);
					e.setAttribute("transform", "translate(" + x + "," + y + ")");
					_svgContainer.appendChild(e);
				}
			}
			return e;
		}
		throw "Need document and parent.";
	},
	_placeSiblings = element => {
		let svg = _svgOwner(element),
			isRootSVG = element === svg,
			siblings = svg ? _svgTemps : _divTemps,
			container, m, b, x, y;
		if (element === _win) {
			return element;
		}
		if (!siblings.length) {
			siblings.push(_createSibling(element, 1), _createSibling(element, 2), _createSibling(element, 3));
		}
		container = svg ? _svgContainer : _divContainer;
		if (svg) {
			b = isRootSVG ? {x:0, y:0} : element.getBBox();
			m = element.transform ? element.transform.baseVal : []; // IE11 doesn't follow the spec.
			if (m.length) {
				m = m.consolidate().matrix;
				x = m.a * b.x + m.c * b.y;
				y = m.b * b.x + m.d * b.y;
			} else {
				m = _identityMatrix;
				x = b.x;
				y = b.y;
			}
			if (element.tagName.toLowerCase() === "g") {
				x = y = 0;
			}
			container.setAttribute("transform", "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + (m.e + x) + "," + (m.f + y) + ")");
			(isRootSVG ? svg : element.parentNode).appendChild(container);
		} else {
			container.style.top = element.offsetTop + "px";
			container.style.left = element.offsetLeft + "px";
			m = _win.getComputedStyle(element);
			container.style[_transformProp] = m[_transformProp];
			container.style[_transformOriginProp] = m[_transformOriginProp];
			container.style.position = m.position === "fixed" ? "fixed" : "absolute";
			element.parentNode.appendChild(container);
		}
		return container;
	},
	_setMatrix = (m, a, b, c, d, e, f) => {
		m.a = a;
		m.b = b;
		m.c = c;
		m.d = d;
		m.e = e;
		m.f = f;
		return m;
	};

export class Matrix2D {
	constructor(a=1, b=0, c=0, d=1, e=0, f=0) {
		_setMatrix(this, a, b, c, d, e, f);
	}

	inverse() {
		let {a, b, c, d, e, f} = this,
			determinant = (a * d - b * c);
		return _setMatrix(
			this,
			d / determinant,
			-b / determinant,
			-c / determinant,
			a / determinant,
			(c * f - d * e) / determinant,
			-(a * f - b * e) / determinant
		);
	}

	multiply(matrix) {
		let {a, b, c, d, e, f} = this,
			a2 = matrix.a,
			b2 = matrix.c,
			c2 = matrix.b,
			d2 = matrix.d,
			e2 = matrix.e,
			f2 = matrix.f;
		return _setMatrix(this,
			a2 * a + c2 * c,
			a2 * b + c2 * d,
			b2 * a + d2 * c,
			b2 * b + d2 * d,
			e + e2 * a + f2 * c,
			f + e2 * b + f2 * d);
	}

	equals(matrix) {
		let {a, b, c, d, e, f} = this;
		return (a === matrix.a && b === matrix.b && c === matrix.c && d === matrix.d && e === matrix.e && f === matrix.f);
	}

	apply(point, decoratee={}) {
		let {x, y} = point,
			{a, b, c, d, e, f} = this;
		decoratee.x = x * a + y * c + e;
		decoratee.y = x * b + y * d + f;
		return decoratee;
	}

}

//feed in an element and it'll return a 2D matrix (optionally inverted) so that you can translate between coordinate spaces.
// Inverting lets you translate a global point into a local coordinate space. No inverting lets you go the other way.
// We needed this to work around various browser bugs, like Firefox doesn't accurately report getScreenCTM() when there
// are transforms applied to ancestor elements.
// The matrix math to convert any x/y coordinate is:
//     tx = m.a * x + m.c * y + m.e
//     ty = m.b * x + m.d * y + m.f
export function getGlobalMatrix(element, inverse) {
	if (!element || !element.parentNode) {
		return new Matrix2D();
	}
	let svg = _svgOwner(element),
		temps = svg ? _svgTemps : _divTemps,
		container = _placeSiblings(element),
		b1 = temps[0].getBoundingClientRect(),
		b2 = temps[1].getBoundingClientRect(),
		b3 = temps[2].getBoundingClientRect(),
		parent = container.parentNode,
		isFixed = _isFixed(element),
		m = new Matrix2D(
			(b2.left - b1.left) / 100,
			(b2.top - b1.top) / 100,
			(b3.left - b1.left) / 100,
			(b3.top - b1.top) / 100,
			b1.left + (isFixed ? 0 : _getDocScrollLeft()),
			b1.top + (isFixed ? 0 : _getDocScrollTop())
		);
	parent.removeChild(container);
	return inverse ? m.inverse() : m;
}
