/*! steam-card-compact 2.2.0 | MIT License */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i5 = decorators.length - 1, decorator; i5 >= 0; i5--)
    if (decorator = decorators[i5])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = /* @__PURE__ */ Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t4, e5, o6) {
    if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t4, this.t = e5;
  }
  get styleSheet() {
    let t4 = this.o;
    const s4 = this.t;
    if (e && void 0 === t4) {
      const e5 = void 0 !== s4 && 1 === s4.length;
      e5 && (t4 = o.get(s4)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t4));
    }
    return t4;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
var i = (t4, ...e5) => {
  const o6 = 1 === t4.length ? t4[0] : e5.reduce((e6, s4, o7) => e6 + ((t5) => {
    if (true === t5._$cssResult$) return t5.cssText;
    if ("number" == typeof t5) return t5;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t4[o7 + 1], t4[0]);
  return new n(o6, t4, s);
};
var S = (s4, o6) => {
  if (e) s4.adoptedStyleSheets = o6.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
  else for (const e5 of o6) {
    const o7 = document.createElement("style"), n5 = t.litNonce;
    void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e5.cssText, s4.appendChild(o7);
  }
};
var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
  let e5 = "";
  for (const s4 of t5.cssRules) e5 += s4.cssText;
  return r(e5);
})(t4) : t4;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t4, s4) => t4;
var u = { toAttribute(t4, s4) {
  switch (s4) {
    case Boolean:
      t4 = t4 ? l : null;
      break;
    case Object:
    case Array:
      t4 = null == t4 ? t4 : JSON.stringify(t4);
  }
  return t4;
}, fromAttribute(t4, s4) {
  let i5 = t4;
  switch (s4) {
    case Boolean:
      i5 = null !== t4;
      break;
    case Number:
      i5 = null === t4 ? null : Number(t4);
      break;
    case Object:
    case Array:
      try {
        i5 = JSON.parse(t4);
      } catch (t5) {
        i5 = null;
      }
  }
  return i5;
} };
var f = (t4, s4) => !i2(t4, s4);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
var y = class extends HTMLElement {
  static addInitializer(t4) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t4);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t4, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t4) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t4, s4), !s4.noAccessor) {
      const i5 = /* @__PURE__ */ Symbol(), h3 = this.getPropertyDescriptor(t4, i5, s4);
      void 0 !== h3 && e2(this.prototype, t4, h3);
    }
  }
  static getPropertyDescriptor(t4, s4, i5) {
    const { get: e5, set: r6 } = h(this.prototype, t4) ?? { get() {
      return this[s4];
    }, set(t5) {
      this[s4] = t5;
    } };
    return { get: e5, set(s5) {
      const h3 = e5?.call(this);
      r6?.call(this, s5), this.requestUpdate(t4, h3, i5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t4) {
    return this.elementProperties.get(t4) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t4 = n2(this);
    t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t5 = this.properties, s4 = [...r2(t5), ...o2(t5)];
      for (const i5 of s4) this.createProperty(i5, t5[i5]);
    }
    const t4 = this[Symbol.metadata];
    if (null !== t4) {
      const s4 = litPropertyMetadata.get(t4);
      if (void 0 !== s4) for (const [t5, i5] of s4) this.elementProperties.set(t5, i5);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t5, s4] of this.elementProperties) {
      const i5 = this._$Eu(t5, s4);
      void 0 !== i5 && this._$Eh.set(i5, t5);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i5 = [];
    if (Array.isArray(s4)) {
      const e5 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e5) i5.unshift(c(s5));
    } else void 0 !== s4 && i5.push(c(s4));
    return i5;
  }
  static _$Eu(t4, s4) {
    const i5 = s4.attribute;
    return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
  }
  addController(t4) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
  }
  removeController(t4) {
    this._$EO?.delete(t4);
  }
  _$E_() {
    const t4 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t4.set(i5, this[i5]), delete this[i5]);
    t4.size > 0 && (this._$Ep = t4);
  }
  createRenderRoot() {
    const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t4, this.constructor.elementStyles), t4;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t4) => t4.hostConnected?.());
  }
  enableUpdating(t4) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t4) => t4.hostDisconnected?.());
  }
  attributeChangedCallback(t4, s4, i5) {
    this._$AK(t4, i5);
  }
  _$ET(t4, s4) {
    const i5 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i5);
    if (void 0 !== e5 && true === i5.reflect) {
      const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
      this._$Em = t4, null == h3 ? this.removeAttribute(e5) : this.setAttribute(e5, h3), this._$Em = null;
    }
  }
  _$AK(t4, s4) {
    const i5 = this.constructor, e5 = i5._$Eh.get(t4);
    if (void 0 !== e5 && this._$Em !== e5) {
      const t5 = i5.getPropertyOptions(e5), h3 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
      this._$Em = e5;
      const r6 = h3.fromAttribute(s4, t5.type);
      this[e5] = r6 ?? this._$Ej?.get(e5) ?? r6, this._$Em = null;
    }
  }
  requestUpdate(t4, s4, i5, e5 = false, h3) {
    if (void 0 !== t4) {
      const r6 = this.constructor;
      if (false === e5 && (h3 = this[t4]), i5 ?? (i5 = r6.getPropertyOptions(t4)), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t4) && !this.hasAttribute(r6._$Eu(t4, i5)))) return;
      this.C(t4, s4, i5);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t4, s4, { useDefault: i5, reflect: e5, wrapped: h3 }, r6) {
    i5 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t4) && (this._$Ej.set(t4, r6 ?? s4 ?? this[t4]), true !== h3 || void 0 !== r6) || (this._$AL.has(t4) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t4, s4)), true === e5 && this._$Em !== t4 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t4));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t5) {
      Promise.reject(t5);
    }
    const t4 = this.scheduleUpdate();
    return null != t4 && await t4, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t6, s5] of this._$Ep) this[t6] = s5;
        this._$Ep = void 0;
      }
      const t5 = this.constructor.elementProperties;
      if (t5.size > 0) for (const [s5, i5] of t5) {
        const { wrapped: t6 } = i5, e5 = this[s5];
        true !== t6 || this._$AL.has(s5) || void 0 === e5 || this.C(s5, void 0, i5, e5);
      }
    }
    let t4 = false;
    const s4 = this._$AL;
    try {
      t4 = this.shouldUpdate(s4), t4 ? (this.willUpdate(s4), this._$EO?.forEach((t5) => t5.hostUpdate?.()), this.update(s4)) : this._$EM();
    } catch (s5) {
      throw t4 = false, this._$EM(), s5;
    }
    t4 && this._$AE(s4);
  }
  willUpdate(t4) {
  }
  _$AE(t4) {
    this._$EO?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t4) {
    return true;
  }
  update(t4) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t5) => this._$ET(t5, this[t5]))), this._$EM();
  }
  updated(t4) {
  }
  firstUpdated(t4) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t4) => t4;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
var u2 = Array.isArray;
var d2 = (t4) => u2(t4) || "function" == typeof t4?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t4) => (i5, ...s4) => ({ _$litType$: t4, strings: i5, values: s4 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = /* @__PURE__ */ Symbol.for("lit-noChange");
var A = /* @__PURE__ */ Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t4, i5) {
  if (!u2(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i5) : i5;
}
var N = (t4, i5) => {
  const s4 = t4.length - 1, e5 = [];
  let n5, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = v;
  for (let i6 = 0; i6 < s4; i6++) {
    const s5 = t4[i6];
    let a3, u3, d3 = -1, f3 = 0;
    for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n5 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n5 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n5 = void 0);
    const x2 = c4 === p2 && t4[i6 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e5.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i6 : x2);
  }
  return [V(t4, l3 + (t4[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), e5];
};
var S2 = class _S {
  constructor({ strings: t4, _$litType$: i5 }, e5) {
    let r6;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = N(t4, i5);
    if (this.el = _S.createElement(f3, e5), P.currentNode = this.el.content, 2 === i5 || 3 === i5) {
      const t5 = this.el.content.firstChild;
      t5.replaceWith(...t5.childNodes);
    }
    for (; null !== (r6 = P.nextNode()) && d3.length < u3; ) {
      if (1 === r6.nodeType) {
        if (r6.hasAttributes()) for (const t5 of r6.getAttributeNames()) if (t5.endsWith(h2)) {
          const i6 = v2[a3++], s4 = r6.getAttribute(t5).split(o3), e6 = /([.?@])?(.*)/.exec(i6);
          d3.push({ type: 1, index: l3, name: e6[2], strings: s4, ctor: "." === e6[1] ? I : "?" === e6[1] ? L : "@" === e6[1] ? z : H }), r6.removeAttribute(t5);
        } else t5.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t5));
        if (y2.test(r6.tagName)) {
          const t5 = r6.textContent.split(o3), i6 = t5.length - 1;
          if (i6 > 0) {
            r6.textContent = s2 ? s2.emptyScript : "";
            for (let s4 = 0; s4 < i6; s4++) r6.append(t5[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r6.append(t5[i6], c3());
          }
        }
      } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t5 = -1;
        for (; -1 !== (t5 = r6.data.indexOf(o3, t5 + 1)); ) d3.push({ type: 7, index: l3 }), t5 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t4, i5) {
    const s4 = l2.createElement("template");
    return s4.innerHTML = t4, s4;
  }
};
function M(t4, i5, s4 = t4, e5) {
  if (i5 === E) return i5;
  let h3 = void 0 !== e5 ? s4._$Co?.[e5] : s4._$Cl;
  const o6 = a2(i5) ? void 0 : i5._$litDirective$;
  return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t4), h3._$AT(t4, s4, e5)), void 0 !== e5 ? (s4._$Co ?? (s4._$Co = []))[e5] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = M(t4, h3._$AS(t4, i5.values), h3, e5)), i5;
}
var R = class {
  constructor(t4, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t4) {
    const { el: { content: i5 }, parts: s4 } = this._$AD, e5 = (t4?.creationScope ?? l2).importNode(i5, true);
    P.currentNode = e5;
    let h3 = P.nextNode(), o6 = 0, n5 = 0, r6 = s4[0];
    for (; void 0 !== r6; ) {
      if (o6 === r6.index) {
        let i6;
        2 === r6.type ? i6 = new k(h3, h3.nextSibling, this, t4) : 1 === r6.type ? i6 = new r6.ctor(h3, r6.name, r6.strings, this, t4) : 6 === r6.type && (i6 = new Z(h3, this, t4)), this._$AV.push(i6), r6 = s4[++n5];
      }
      o6 !== r6?.index && (h3 = P.nextNode(), o6++);
    }
    return P.currentNode = l2, e5;
  }
  p(t4) {
    let i5 = 0;
    for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t4, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t4[i5])), i5++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t4, i5, s4, e5) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t4, this._$AB = i5, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
  }
  get parentNode() {
    let t4 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === t4?.nodeType && (t4 = i5.parentNode), t4;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t4, i5 = this) {
    t4 = M(this, t4, i5), a2(t4) ? t4 === A || null == t4 || "" === t4 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t4 !== this._$AH && t4 !== E && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : d2(t4) ? this.k(t4) : this._(t4);
  }
  O(t4) {
    return this._$AA.parentNode.insertBefore(t4, this._$AB);
  }
  T(t4) {
    this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
  }
  _(t4) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(l2.createTextNode(t4)), this._$AH = t4;
  }
  $(t4) {
    const { values: i5, _$litType$: s4 } = t4, e5 = "number" == typeof s4 ? this._$AC(t4) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e5) this._$AH.p(i5);
    else {
      const t5 = new R(e5, this), s5 = t5.u(this.options);
      t5.p(i5), this.T(s5), this._$AH = t5;
    }
  }
  _$AC(t4) {
    let i5 = C.get(t4.strings);
    return void 0 === i5 && C.set(t4.strings, i5 = new S2(t4)), i5;
  }
  k(t4) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s4, e5 = 0;
    for (const h3 of t4) e5 === i5.length ? i5.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i5[e5], s4._$AI(h3), e5++;
    e5 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i5.length = e5);
  }
  _$AR(t4 = this._$AA.nextSibling, s4) {
    for (this._$AP?.(false, true, s4); t4 !== this._$AB; ) {
      const s5 = i3(t4).nextSibling;
      i3(t4).remove(), t4 = s5;
    }
  }
  setConnected(t4) {
    void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t4, i5, s4, e5, h3) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t4, this.name = i5, this._$AM = e5, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
  }
  _$AI(t4, i5 = this, s4, e5) {
    const h3 = this.strings;
    let o6 = false;
    if (void 0 === h3) t4 = M(this, t4, i5, 0), o6 = !a2(t4) || t4 !== this._$AH && t4 !== E, o6 && (this._$AH = t4);
    else {
      const e6 = t4;
      let n5, r6;
      for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r6 = M(this, e6[s4 + n5], i5, n5), r6 === E && (r6 = this._$AH[n5]), o6 || (o6 = !a2(r6) || r6 !== this._$AH[n5]), r6 === A ? t4 = A : t4 !== A && (t4 += (r6 ?? "") + h3[n5 + 1]), this._$AH[n5] = r6;
    }
    o6 && !e5 && this.j(t4);
  }
  j(t4) {
    t4 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t4) {
    this.element[this.name] = t4 === A ? void 0 : t4;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t4) {
    this.element.toggleAttribute(this.name, !!t4 && t4 !== A);
  }
};
var z = class extends H {
  constructor(t4, i5, s4, e5, h3) {
    super(t4, i5, s4, e5, h3), this.type = 5;
  }
  _$AI(t4, i5 = this) {
    if ((t4 = M(this, t4, i5, 0) ?? A) === E) return;
    const s4 = this._$AH, e5 = t4 === A && s4 !== A || t4.capture !== s4.capture || t4.once !== s4.once || t4.passive !== s4.passive, h3 = t4 !== A && (s4 === A || e5);
    e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
  }
  handleEvent(t4) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
  }
};
var Z = class {
  constructor(t4, i5, s4) {
    this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t4) {
    M(this, t4);
  }
};
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.3");
var D = (t4, i5, s4) => {
  const e5 = s4?.renderBefore ?? i5;
  let h3 = e5._$litPart$;
  if (void 0 === h3) {
    const t5 = s4?.renderBefore ?? null;
    e5._$litPart$ = h3 = new k(i5.insertBefore(c3(), t5), t5, void 0, s4 ?? {});
  }
  return h3._$AI(t4), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a;
    const t4 = super.createRenderRoot();
    return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t4.firstChild), t4;
  }
  update(t4) {
    const r6 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = D(r6, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ?? (s3.litElementVersions = [])).push("4.2.2");

// node_modules/@lit/reactive-element/decorators/custom-element.js
var t3 = (t4) => (e5, o6) => {
  void 0 !== o6 ? o6.addInitializer(() => {
    customElements.define(t4, e5);
  }) : customElements.define(t4, e5);
};

// node_modules/@lit/reactive-element/decorators/property.js
var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r4 = (t4 = o5, e5, r6) => {
  const { kind: n5, metadata: i5 } = r6;
  let s4 = globalThis.litPropertyMetadata.get(i5);
  if (void 0 === s4 && globalThis.litPropertyMetadata.set(i5, s4 = /* @__PURE__ */ new Map()), "setter" === n5 && ((t4 = Object.create(t4)).wrapped = true), s4.set(r6.name, t4), "accessor" === n5) {
    const { name: o6 } = r6;
    return { set(r7) {
      const n6 = e5.get.call(this);
      e5.set.call(this, r7), this.requestUpdate(o6, n6, t4, true, r7);
    }, init(e6) {
      return void 0 !== e6 && this.C(o6, void 0, t4, e6), e6;
    } };
  }
  if ("setter" === n5) {
    const { name: o6 } = r6;
    return function(r7) {
      const n6 = this[o6];
      e5.call(this, r7), this.requestUpdate(o6, n6, t4, true, r7);
    };
  }
  throw Error("Unsupported decorator location: " + n5);
};
function n4(t4) {
  return (e5, o6) => "object" == typeof o6 ? r4(t4, e5, o6) : ((t5, e6, o7) => {
    const r6 = e6.hasOwnProperty(o7);
    return e6.constructor.createProperty(o7, t5), r6 ? Object.getOwnPropertyDescriptor(e6, o7) : void 0;
  })(t4, e5, o6);
}

// node_modules/@lit/reactive-element/decorators/state.js
function r5(r6) {
  return n4({ ...r6, state: true, attribute: false });
}

// src/actions.ts
var HOLD_MS = 500;
var DOUBLE_TAP_MS = 250;
function hasAction(action) {
  return action !== void 0 && action.action !== "none";
}
function isTappable(config) {
  return config.tap_action === void 0 || hasAction(config.tap_action);
}
var GestureDetector = class {
  constructor(config, fire) {
    this.config = config;
    this.fire = fire;
    this.held = false;
  }
  pointerDown(event) {
    this.held = false;
    clearTimeout(this.holdTimer);
    if (event.button === 0 && hasAction(this.config()?.hold_action)) {
      this.holdTimer = setTimeout(() => {
        this.held = true;
        this.fire("hold");
      }, HOLD_MS);
    }
  }
  pointerUp() {
    clearTimeout(this.holdTimer);
  }
  click() {
    if (this.held) {
      this.held = false;
      return;
    }
    if (!hasAction(this.config()?.double_tap_action)) {
      this.fire("tap");
      return;
    }
    if (this.tapTimer !== void 0) {
      clearTimeout(this.tapTimer);
      this.tapTimer = void 0;
      this.fire("double_tap");
      return;
    }
    this.tapTimer = setTimeout(() => {
      this.tapTimer = void 0;
      this.fire("tap");
    }, DOUBLE_TAP_MS);
  }
  key(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.fire("tap");
    }
  }
  dispose() {
    clearTimeout(this.holdTimer);
    clearTimeout(this.tapTimer);
    this.tapTimer = void 0;
  }
};

// src/const.ts
var CARD_VERSION = "2.2.0";
var STATUSES = [
  "ingame",
  "online",
  "busy",
  "looking_to_play",
  "looking_to_trade",
  "away",
  "snooze",
  "offline",
  "unavailable"
];
var STEAM_PREFIX = "sensor.steam_";
var STORE_URL = "https://store.steampowered.com/app/";

// src/height.ts
var HEIGHT_MODES = ["auto", "fixed", "max"];
var pixels = (value) => value == null || typeof value === "number" && Number.isFinite(value) && value > 0;
function validHeight(config) {
  return (config.height_mode == null || HEIGHT_MODES.includes(config.height_mode)) && pixels(config.height) && pixels(config.max_height);
}
function heightMode(config) {
  return config.height_mode ?? (config.height ? "fixed" : config.max_height ? "max" : "auto");
}
var ROW_HEIGHT = 56;
var ROW_GAP = 8;
function heightStyle(config, layout, minimum = 0) {
  const rows = config.grid_options ? config.grid_options.rows : config.layout_options?.grid_rows;
  if (layout === "grid" && typeof rows === "number") {
    return "height: 100%";
  }
  const mode = heightMode(config);
  if (mode === "fixed" && config.height) {
    return `height: ${Math.max(config.height, minimum)}px`;
  }
  return mode === "max" && config.max_height ? `max-height: ${Math.max(config.max_height, minimum)}px` : "";
}
function gridMinRows(minimum) {
  return Math.max(1, Math.ceil((minimum + ROW_GAP) / (ROW_HEIGHT + ROW_GAP)));
}
function heightCardSize(config, content, minimum = 0) {
  const mode = heightMode(config);
  if (mode === "fixed" && config.height) {
    return Math.max(1, Math.round(Math.max(config.height, minimum) / 50));
  }
  return mode === "max" && config.max_height ? Math.max(1, Math.min(content, Math.round(Math.max(config.max_height, minimum) / 50))) : content;
}
function heightSchema(config, text) {
  const mode = heightMode(config);
  const field = (name) => ({
    name,
    selector: { number: { min: 100, max: 2e3, step: 10, unit_of_measurement: "px", mode: "box" } }
  });
  return [
    {
      name: "height_mode",
      selector: {
        select: { mode: "dropdown", options: HEIGHT_MODES.map((value) => ({ value, label: text(`editor.height_mode_${value}`) })) }
      }
    },
    ...mode === "fixed" ? [field("height")] : mode === "max" ? [field("max_height")] : []
  ];
}
function heightData(config) {
  return { ...config, height_mode: heightMode(config) };
}
function tidyHeight(config) {
  const mode = heightMode(config);
  const tidied = { ...config };
  if (mode !== "fixed" || !tidied.height) {
    delete tidied.height;
  }
  if (mode !== "max" || !tidied.max_height) {
    delete tidied.max_height;
  }
  if (!tidied.height_mode || heightMode({ ...tidied, height_mode: void 0 }) === mode) {
    delete tidied.height_mode;
  }
  return tidied;
}

// src/friends.ts
var PLATFORM = "steam_online";
function isSteamPlayer(entity, entities) {
  if (entity === void 0 || !entity.entity_id.startsWith("sensor.")) {
    return false;
  }
  if (entities !== void 0) {
    const entry = entities[entity.entity_id];
    return entry?.platform === PLATFORM && entry.translation_key === "account";
  }
  if (entity.entity_id.startsWith(STEAM_PREFIX)) {
    return true;
  }
  const options = entity.attributes.options;
  return Array.isArray(options) && options.includes("looking_to_trade");
}
function steamPlayers(hass) {
  return Object.keys(hass.states).filter((id) => isSteamPlayer(hass.states[id], hass.entities)).sort();
}
var byDevice = /* @__PURE__ */ new WeakMap();
function deviceEntries(entities, device) {
  let index = byDevice.get(entities);
  if (index === void 0) {
    index = /* @__PURE__ */ new Map();
    for (const entry of Object.values(entities)) {
      if (entry?.device_id && entry.platform === PLATFORM) {
        const entries = index.get(entry.device_id) ?? [];
        entries.push(entry);
        index.set(entry.device_id, entries);
      }
    }
    byDevice.set(entities, index);
  }
  return index.get(device) ?? [];
}
function deviceEntityIds(hass, entityId) {
  const device = hass.entities?.[entityId]?.device_id;
  return hass.entities && device ? deviceEntries(hass.entities, device).map((entry) => entry.entity_id) : [entityId];
}
function siblings(hass, entityId) {
  const found = /* @__PURE__ */ new Map();
  const device = hass.entities?.[entityId]?.device_id;
  if (!hass.entities || !device) {
    return found;
  }
  for (const entry of deviceEntries(hass.entities, device)) {
    const state = hass.states[entry.entity_id];
    if (entry.translation_key && entry.entity_id !== entityId && state) {
      found.set(entry.translation_key, state);
    }
  }
  return found;
}
function known(value) {
  if (value === void 0 || value === null || value === "" || value === "unknown" || value === "unavailable") {
    return void 0;
  }
  return String(value);
}
function pictureOf(entity) {
  return entity.state !== "unavailable" ? known(entity.attributes.entity_picture) : void 0;
}
function readPlayer(hass, entity) {
  const own = siblings(hass, entity.entity_id);
  const attributes = entity.attributes;
  const playing = own.get("now_playing");
  const levelSensor = own.get("level");
  const lastOnlineSensor = own.get("last_online");
  const game = playing ? known(playing.state) : known(attributes.game);
  const image = (key, attribute) => {
    const entity2 = own.get(key);
    return entity2 ? pictureOf(entity2) : attribute ? known(attributes[attribute]) : void 0;
  };
  const player = {
    entity,
    level: levelSensor ? known(levelSensor.state) : known(attributes.level),
    lastOnline: lastOnlineSensor ? known(lastOnlineSensor.state) : known(attributes.last_online)
  };
  if (game === void 0) {
    return player;
  }
  return {
    ...player,
    game,
    gameId: playing ? known(playing.attributes.app_id) : known(attributes.game_id),
    gameIcon: playing ? known(playing.attributes.entity_picture) : known(attributes.game_icon),
    gameSince: playing ? known(playing.last_changed) : void 0,
    header: image("header_capsule", "game_image_header"),
    main: image("main_capsule", "game_image_main"),
    hero: image("library_hero"),
    logo: image("library_logo")
  };
}
function displayName(entity, overrides) {
  const override = overrides?.find((item) => item?.entity === entity.entity_id)?.name;
  return override || String(entity.attributes.friendly_name ?? entity.entity_id);
}
function sortByName(players, overrides) {
  return [...players].sort((one, other) => displayName(one.entity, overrides).localeCompare(displayName(other.entity, overrides)));
}
function inGame(player) {
  return player.game !== void 0 && player.entity.state !== "offline" && player.entity.state !== "unavailable";
}
function statusOf(player) {
  const state = player.entity.state;
  return STATUSES.includes(state) && state !== "ingame" ? state : "unavailable";
}
function groupByStatus(players) {
  var _a;
  const groups = {};
  for (const player of players) {
    (groups[_a = inGame(player) ? "ingame" : statusOf(player)] ?? (groups[_a] = [])).push(player);
  }
  return groups;
}
function pairs(items) {
  const rows = [];
  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }
  return rows;
}
function moment(time) {
  const value = time ? Date.parse(time) : NaN;
  return Number.isNaN(value) ? void 0 : value;
}
function elapsed(time, now = Date.now()) {
  const since = moment(time);
  if (since === void 0) {
    return void 0;
  }
  const seconds = Math.max(0, Math.floor((now - since) / 1e3));
  if (seconds < 60) {
    return { amount: seconds, unit: "seconds" };
  }
  if (seconds < 3600) {
    return { amount: Math.floor(seconds / 60), unit: "minutes" };
  }
  if (seconds < 86400) {
    return { amount: Math.floor(seconds / 3600), unit: "hours" };
  }
  if (seconds < 604800) {
    return { amount: Math.floor(seconds / 86400), unit: "days" };
  }
  return { amount: Math.floor(seconds / 604800), unit: "weeks" };
}
function playTime(since, now = Date.now()) {
  const start = moment(since);
  if (start === void 0) {
    return void 0;
  }
  const minutes = Math.max(0, Math.floor((now - start) / 6e4));
  return { hours: Math.floor(minutes / 60), minutes: minutes % 60 };
}
function avatarUrl(entity) {
  const picture = entity.attributes.entity_picture;
  return typeof picture === "string" ? picture.replace("_medium", "_full") : void 0;
}

// src/localize/languages/en.json
var en_default = {
  common: {
    invalid_configuration: "Invalid configuration",
    invalid_height: "Invalid height. height and max_height must be positive numbers of pixels, and height_mode auto, fixed or max.",
    description: "A compact card to show Steam integrations",
    name: "Steam card compact",
    last_seen: "Last seen {amount} {unit} ago",
    entity_not_found: "Entity {entity} was not found.",
    level: "Steam level {level}",
    title: "Steam friends",
    minutes: "{minutes} min",
    hours: "{hours} h",
    hours_minutes: "{hours} h {minutes} min"
  },
  statuses: {
    ingame: "In game",
    online: "Online",
    busy: "Busy",
    away: "Away",
    snooze: "Snoozing",
    looking_to_play: "Looking to play",
    looking_to_trade: "Looking to trade",
    offline: "Offline",
    unavailable: "Unavailable"
  },
  time_units: {
    minutes: "min",
    hours: "h",
    days: "days",
    weeks: "weeks",
    seconds: "s",
    one_seconds: "s",
    one_minutes: "min",
    one_hours: "h",
    one_days: "day",
    one_weeks: "week"
  },
  editor: {
    entity: "Players",
    entity_helper: "The players to show. One player with the player layout shows the big card.",
    auto_populate: "Every player",
    auto_populate_helper: "Lists every Steam player there is without picking them one by one.",
    title: "Title",
    layout: "Layout",
    layout_helper: "Automatic draws the big card when only one player is chosen.",
    layout_auto: "Automatic",
    layout_list: "List",
    layout_player: "One player",
    game_background: "Game picture",
    game_background_helper: "Draws the game's picture behind the player.",
    name_overrides: "Names",
    name_overrides_helper: "Names to show instead of the players' own.",
    override_entity: "Player",
    override_name: "Name",
    interactions: "Interactions",
    tap_action: "Tap",
    hold_action: "Hold",
    double_tap_action: "Double tap",
    height_mode: "Height",
    height_mode_helper: "A height set in the layout tab of a sections view is used instead.",
    height_mode_auto: "Fits the content",
    height_mode_fixed: "Fixed",
    height_mode_max: "Grows up to a limit",
    height: "Fixed height",
    height_helper: "The card is always this tall.",
    max_height: "Maximum height",
    max_height_helper: "The card grows with its content up to this height."
  }
};

// src/localize/languages/fi.json
var fi_default = {
  common: {
    invalid_configuration: "Virheellinen konfiguraatio",
    invalid_height: "Virheellinen korkeus. Korkeuksien (height ja max_height) on oltava positiivisia lukuja pikselein\xE4, ja korkeustilan (height_mode) auto, fixed tai max.",
    description: "Kompakti kortti Steam-integraation tietojen n\xE4ytt\xE4miseksi",
    name: "Steam card compact",
    last_seen: "N\xE4hty {amount} {unit} sitten",
    entity_not_found: "Entiteetti\xE4 {entity} ei l\xF6ydetty.",
    level: "Steam-taso {level}",
    title: "Steam-kaverit",
    minutes: "{minutes} min",
    hours: "{hours} h",
    hours_minutes: "{hours} h {minutes} min"
  },
  statuses: {
    ingame: "Pelaamassa",
    online: "Paikalla",
    busy: "Varattu",
    away: "Poissa",
    snooze: "Toimeton",
    looking_to_play: "Etsii peliseuraa",
    looking_to_trade: "Haluaa vaihtaa",
    offline: "Offline-tilassa",
    unavailable: "Ei saatavilla"
  },
  time_units: {
    minutes: "min",
    hours: "h",
    days: "pv",
    weeks: "vko",
    seconds: "s",
    one_seconds: "s",
    one_minutes: "min",
    one_hours: "h",
    one_days: "pv",
    one_weeks: "vko"
  },
  editor: {
    entity: "Pelaajat",
    entity_helper: "N\xE4ytett\xE4v\xE4t pelaajat. Yksi pelaaja yhden pelaajan asettelulla n\xE4ytt\xE4\xE4 ison kortin.",
    auto_populate: "Kaikki pelaajat",
    auto_populate_helper: "Listaa kaikki Steam-pelaajat ilman ett\xE4 ne erikseen valitaan.",
    title: "Otsikko",
    layout: "Asettelu",
    layout_helper: "Automaattinen piirt\xE4\xE4 ison kortin, kun vain yksi pelaaja on valittu.",
    layout_auto: "Automaattinen",
    layout_list: "Lista",
    layout_player: "Yksi pelaaja",
    game_background: "Pelin kuva",
    game_background_helper: "Piirt\xE4\xE4 pelin kuvan pelaajan taakse.",
    name_overrides: "Nimet",
    name_overrides_helper: "Nimet, jotka n\xE4ytet\xE4\xE4n pelaajien omien nimien sijaan.",
    override_entity: "Pelaaja",
    override_name: "Nimi",
    interactions: "Toiminnot",
    tap_action: "Napautus",
    hold_action: "Pitk\xE4 painallus",
    double_tap_action: "Kaksoisnapautus",
    height_mode: "Korkeus",
    height_mode_helper: "Osioihin jaetun n\xE4kym\xE4n asettelu-v\xE4lilehdell\xE4 asetettu korkeus ohittaa t\xE4m\xE4n.",
    height_mode_auto: "Sis\xE4ll\xF6n mukaan",
    height_mode_fixed: "Kiinte\xE4",
    height_mode_max: "Kasvaa rajaan asti",
    height: "Kiinte\xE4 korkeus",
    height_helper: "Kortti on aina n\xE4in korkea.",
    max_height: "Enimm\xE4iskorkeus",
    max_height_helper: "Kortti kasvaa sis\xE4lt\xF6ns\xE4 mukana t\xE4h\xE4n korkeuteen asti."
  }
};

// src/localize/localize.ts
var FILES = { "./languages/en.json": en_default, "./languages/fi.json": fi_default };
var LANGUAGES = Object.fromEntries(
  Object.entries(FILES).map(([path, table]) => [path.replace(/^.*\/|\.json$/g, "").toLowerCase(), table])
);
var LANGUAGE_CODES = Object.keys(LANGUAGES).sort();
function translate(language, key) {
  const code = (language ?? "en").split(/[-_]/)[0].toLowerCase();
  return read(LANGUAGES[code], key) ?? read(LANGUAGES.en, key) ?? key;
}
function read(table, key) {
  let value = table;
  for (const part of key.split(".")) {
    if (value === null || typeof value !== "object") {
      return void 0;
    }
    value = value[part];
  }
  return typeof value === "string" ? value : void 0;
}
function browserLanguage() {
  return document.documentElement.lang || navigator.language || "en";
}
function languageOf(hass) {
  return hass?.locale?.language ?? hass?.language ?? browserLanguage();
}

// src/editor.ts
var DEFAULTS = { layout: "auto", game_background: true, auto_populate: false };
function schema(hass, config, text) {
  const players = steamPlayers(hass);
  return [
    ...config.auto_populate === true ? [] : [
      {
        name: "entity",
        required: true,
        selector: {
          entity: { multiple: true, domain: "sensor", include_entities: players }
        }
      }
    ],
    { name: "auto_populate", selector: { boolean: {} } },
    {
      name: "layout",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "auto", label: text("editor.layout_auto") },
            { value: "list", label: text("editor.layout_list") },
            { value: "player", label: text("editor.layout_player") }
          ]
        }
      }
    },
    { name: "title", selector: { text: {} } },
    { name: "game_background", selector: { boolean: {} } },
    ...heightSchema(config, text),
    {
      name: "name_overrides",
      selector: {
        object: {
          multiple: true,
          label_field: "name",
          description_field: "entity",
          fields: {
            entity: {
              label: text("editor.override_entity"),
              required: true,
              selector: { entity: { domain: "sensor", include_entities: players } }
            },
            name: { label: text("editor.override_name"), required: true, selector: { text: {} } }
          }
        }
      }
    },
    {
      type: "expandable",
      name: "interactions",
      flatten: true,
      schema: [
        { name: "tap_action", selector: { ui_action: { default_action: "more-info" } } },
        { name: "hold_action", selector: { ui_action: { default_action: "none" } } },
        { name: "double_tap_action", selector: { ui_action: { default_action: "none" } } }
      ]
    }
  ];
}
var SteamCardCompactEditor = class extends i4 {
  constructor() {
    super(...arguments);
    this.config = { type: "custom:steam-card-compact" };
  }
  setConfig(config) {
    this.config = { ...config };
  }
  render() {
    if (!this.hass) {
      return A;
    }
    const entity = typeof this.config.entity === "string" ? [this.config.entity] : this.config.entity;
    return b2`
            <ha-form
                .hass=${this.hass}
                .data=${heightData({ ...DEFAULTS, ...this.config, entity })}
                .schema=${schema(this.hass, this.config, (key) => this.text(key))}
                .computeLabel=${(entry) => this.text(`editor.${entry.name}`)}
                .computeHelper=${(entry) => this.helper(entry.name)}
                @value-changed=${this.valueChanged}
            ></ha-form>
        `;
  }
  valueChanged(event) {
    const config = tidyHeight(event.detail.value);
    if (Array.isArray(config.entity)) {
      if (config.entity.length === 0) {
        delete config.entity;
      } else if (config.entity.length === 1 && !Array.isArray(this.config.entity) && (config.layout ?? "auto") !== "list") {
        config.entity = config.entity[0];
      }
    }
    if (config.auto_populate) {
      delete config.entity;
    }
    if (!config.title) {
      delete config.title;
    }
    if (Array.isArray(config.name_overrides) && config.name_overrides.length === 0) {
      delete config.name_overrides;
    }
    for (const [key, value] of Object.entries(DEFAULTS)) {
      if (config[key] === value) {
        delete config[key];
      }
    }
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }
  text(key) {
    return translate(this.language(), key);
  }
  helper(name) {
    const key = `editor.${name}_helper`;
    const helper = translate(this.language(), key);
    return helper === key ? void 0 : helper;
  }
  language() {
    return languageOf(this.hass);
  }
};
__decorateClass([
  n4({ attribute: false })
], SteamCardCompactEditor.prototype, "hass", 2);
__decorateClass([
  r5()
], SteamCardCompactEditor.prototype, "config", 2);
SteamCardCompactEditor = __decorateClass([
  t3("steam-card-compact-editor")
], SteamCardCompactEditor);

// src/fade.ts
var fadeStyles = i`
    .fades {
        --fade-length: min(24px, 25%);
        scroll-padding-block: calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px)) var(--fade-length, 24px);
    }

    .fade-top {
        mask-image: linear-gradient(
            to bottom,
            #000 var(--fade-top-offset, 0px),
            transparent var(--fade-top-offset, 0px),
            #000 calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px))
        );
    }

    .fade-bottom {
        mask-image: linear-gradient(to top, transparent, #000 var(--fade-length, 24px));
    }

    .fade-top.fade-bottom {
        mask-image: linear-gradient(
            to bottom,
            #000 var(--fade-top-offset, 0px),
            transparent var(--fade-top-offset, 0px),
            #000 calc(var(--fade-top-offset, 0px) + var(--fade-length, 24px)),
            #000 calc(100% - var(--fade-length, 24px)),
            transparent
        );
    }
`;
function markFade(part) {
  const hidden = part.scrollHeight - part.clientHeight;
  part.classList.toggle("fade-top", hidden > 1 && part.scrollTop > 1);
  part.classList.toggle("fade-bottom", hidden > 1 && hidden - part.scrollTop > 1);
}
var onScroll = (event) => markFade(event.currentTarget);
var ScrollFade = class {
  constructor(host, parts) {
    this.host = host;
    this.parts = parts;
    /** Each followed part with the children whose size it watches. */
    this.followed = /* @__PURE__ */ new Map();
    this.resized = typeof ResizeObserver === "undefined" ? void 0 : new ResizeObserver((entries) => {
      for (const { target } of entries) {
        const part = this.followed.has(target) ? target : target.parentElement;
        if (part && this.followed.has(part)) {
          markFade(part);
        }
      }
    });
    host.addController(this);
  }
  hostConnected() {
    if (this.host.hasUpdated) {
      this.follow();
    }
  }
  hostUpdated() {
    if (this.host.isConnected) {
      this.follow();
    }
  }
  hostDisconnected() {
    for (const part of [...this.followed.keys()]) {
      this.forget(part);
    }
  }
  follow() {
    const now = new Set(this.parts());
    for (const part of [...this.followed.keys()]) {
      if (!now.has(part)) {
        this.forget(part);
      }
    }
    for (const part of now) {
      if (!this.followed.has(part)) {
        part.addEventListener("scroll", onScroll, { passive: true });
        this.resized?.observe(part);
      }
      part.classList.add("fades");
      const before = this.followed.get(part) ?? [];
      const children = [...part.children];
      before.filter((child) => !children.includes(child)).forEach((child) => this.resized?.unobserve(child));
      children.filter((child) => !before.includes(child)).forEach((child) => this.resized?.observe(child));
      this.followed.set(part, children);
      markFade(part);
    }
  }
  forget(part) {
    this.followed.get(part)?.forEach((child) => this.resized?.unobserve(child));
    this.followed.delete(part);
    part.removeEventListener("scroll", onScroll);
    this.resized?.unobserve(part);
    part.classList.remove("fades", "fade-top", "fade-bottom");
  }
};

// src/logo.ts
var STEAM_LOGO = b2`
    <div class="steam-game-default-bg">
        <svg class="steam-logo" version="1.0" viewBox="0 0 467 143" preserveAspectRatio="xMidYMid meet">
            <g id="g6" transform="translate(-66.97417,-43.726937)">
                <path
                    class="st0"
                    d="m 137.9,45.1 c -36.7,0 -66.8,28.3 -69.7,64.3 l 37.5,15.5 c 3.2,-2.2 7,-3.4 11.1,-3.4 0.4,0 0.7,0 1.1,0 l 16.7,-24.2 c 0,-0.1 0,-0.2 0,-0.3 0,-14.5 11.8,-26.4 26.4,-26.4 14.5,0 26.4,11.8 26.4,26.4 0,14.6 -11.8,26.4 -26.4,26.4 -0.2,0 -0.4,0 -0.6,0 l -23.8,17 c 0,0.3 0,0.6 0,0.9 0,10.9 -8.9,19.8 -19.8,19.8 -9.6,0 -17.6,-6.8 -19.4,-15.9 L 70.6,134.1 c 8.3,29.4 35.3,50.9 67.3,50.9 38.6,0 69.9,-31.3 69.9,-69.9 0,-38.7 -31.3,-70 -69.9,-70"
                    id="path1"
                />
                <path
                    class="st0"
                    d="m 112,151.2 -8.6,-3.5 c 1.5,3.2 4.2,5.8 7.7,7.3 7.6,3.1 16.3,-0.4 19.4,-8 1.5,-3.7 1.5,-7.7 0,-11.4 -1.5,-3.7 -4.4,-6.5 -8,-8.1 -3.6,-1.5 -7.5,-1.5 -10.9,-0.2 l 8.9,3.7 c 5.6,2.3 8.2,8.7 5.9,14.3 -2.4,5.6 -8.8,8.3 -14.4,5.9"
                    id="path2"
                />
                <path
                    class="st0"
                    d="m 178.5,97 c 0,-9.7 -7.9,-17.6 -17.6,-17.6 -9.7,0 -17.6,7.9 -17.6,17.6 0,9.7 7.9,17.6 17.6,17.6 9.7,0 17.6,-7.9 17.6,-17.6 m -30.7,0 c 0,-7.3 5.9,-13.2 13.2,-13.2 7.3,0 13.2,5.9 13.2,13.2 0,7.3 -5.9,13.2 -13.2,13.2 -7.3,0 -13.2,-5.9 -13.2,-13.2"
                    id="path3"
                />
                <path
                    class="st0"
                    d="m 282.5,93 -4.7,8.2 c -3.6,-2.5 -8.5,-4 -12.8,-4 -4.9,0 -7.9,2 -7.9,5.6 0,4.4 5.4,5.4 13.3,8.3 8.6,3 13.5,6.6 13.5,14.4 0,10.7 -8.4,16.8 -20.6,16.8 -5.9,0 -13.1,-1.5 -18.5,-4.9 l 3.4,-9.1 c 4.5,2.4 9.8,3.7 14.5,3.7 6.4,0 9.5,-2.4 9.5,-5.9 0,-4 -4.6,-5.2 -12.1,-7.7 -8.5,-2.9 -14.5,-6.6 -14.5,-15.3 0,-9.8 7.8,-15.4 19.1,-15.4 7.9,0.1 14.3,2.6 17.8,5.3"
                    id="path4"
                />
                <polygon
                    class="st0"
                    points="335.1,98.2 319.1,98.2 319.1,141.4 308.1,141.4 308.1,98.2 292.1,98.2 292.1,88.7 335.1,88.7 "
                    id="polygon4"
                />
                <polygon
                    class="st0"
                    points="382.8,141.4 347.3,141.4 347.3,88.7 382.8,88.7 382.8,98.2 358.3,98.2 358.3,110 379.4,110 379.4,119.5 358.3,119.5 358.3,131.9 382.8,131.9 "
                    id="polygon5"
                />
                <path
                    class="st0"
                    d="m 407.4,131.2 -3.5,10.2 h -11.6 l 19.8,-52.7 h 11.1 l 20.3,52.7 h -12 l -3.6,-10.2 z m 10.2,-29.9 -7.2,21.1 H 425 Z"
                    id="path5"
                />
                <polygon
                    class="st0"
                    points="485.8,139.9 479.5,139.9 465.4,109.4 465.4,141.4 454.8,141.4 454.8,88.7 465.3,88.7 483,126.8 500.1,88.7 510.8,88.7 510.8,141.4 500.2,141.4 500.2,109.1 "
                    id="polygon6"
                />
                <path
                    class="st0"
                    d="m 532.1,95.4 c 0,4.5 -3.4,7.3 -7.3,7.3 -3.9,0 -7.3,-2.8 -7.3,-7.3 0,-4.5 3.4,-7.3 7.3,-7.3 3.9,-0.1 7.3,2.7 7.3,7.3 m -13.4,0 c 0,3.8 2.7,6.2 6.1,6.2 3.3,0 6.1,-2.4 6.1,-6.2 0,-3.8 -2.7,-6.1 -6.1,-6.1 -3.3,-0.1 -6.1,2.3 -6.1,6.1 m 6.2,-3.8 c 1.9,0 2.5,1 2.5,2.1 0,1 -0.6,1.7 -1.3,2 l 1.7,3.2 h -1.4 L 525,96.1 h -1.5 v 2.8 h -1.2 v -7.2 h 2.6 z m -1.4,3.4 h 1.3 c 0.8,0 1.3,-0.5 1.3,-1.2 0,-0.7 -0.4,-1.1 -1.3,-1.1 h -1.3 z"
                    id="path6"
                />
            </g>
        </svg>
    </div>
`;

// src/steam-card-compact.ts
console.info(
  `%c  STEAM-CARD-COMPACT 
%c  ${CARD_VERSION}   `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray"
);
var registry = window;
registry.customCards = registry.customCards ?? [];
registry.customCards.push({
  type: "steam-card-compact",
  name: translate(browserLanguage(), "common.name"),
  description: translate(browserLanguage(), "common.description"),
  documentationURL: "https://github.com/jesmak/steam-card-compact",
  preview: true
});
var SteamCardCompact = class extends i4 {
  constructor() {
    super();
    this.failed = /* @__PURE__ */ new Set();
    this.gestures = /* @__PURE__ */ new Map();
    new ScrollFade(this, () => this.heightStyle() ? this.renderRoot.querySelectorAll(".list") : []);
  }
  static getConfigElement() {
    return document.createElement("steam-card-compact-editor");
  }
  /** Offers every Steam player there is when the card is added from the picker. */
  static getStubConfig(hass) {
    const players = steamPlayers({ states: hass?.states ?? {}, entities: hass?.entities });
    return players.length > 0 ? { entity: players } : { auto_populate: true };
  }
  setConfig(config) {
    if (!config || config.auto_populate === void 0 && config.entity === void 0) {
      throw new Error(translate(browserLanguage(), "common.invalid_configuration"));
    }
    if (!validHeight(config)) {
      throw new Error(translate(browserLanguage(), "common.invalid_height"));
    }
    this.config = { ...config };
  }
  getCardSize() {
    const shown = this.wanted().length;
    return heightCardSize(this.config ?? {}, this.single() ? 2 : 1 + Math.ceil(shown / 2), this.minimumHeight());
  }
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6, min_rows: gridMinRows(this.minimumHeight()) };
  }
  // The lowest the card goes when held to a height. The big card: its border and its player at their natural height,
  // the 64 px avatar with its padding, as nothing in it scrolls. The list: its border and padding, the title, and the
  // first status heading with one row of players under it.
  minimumHeight() {
    return this.single() ? 2 + 26 + 64 : 2 + 32 + 37 + 31 + 54;
  }
  // The times ("1 h 20 min", "seen 5 min ago") age while the sensors stay the same, so the card is drawn
  // again every minute
  connectedCallback() {
    super.connectedCallback();
    this.timer = setInterval(() => this.requestUpdate(), 6e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timer);
    this.gestures.forEach((detector) => detector.dispose());
    this.gestures.clear();
  }
  heightStyle() {
    return heightStyle(this.config ?? {}, this.layout, this.minimumHeight());
  }
  shouldUpdate(changed) {
    if (!changed.has("hass") || changed.size > 1 || !this.config) {
      return true;
    }
    const previous = changed.get("hass");
    if (!previous || !this.hass || previous.entities !== this.hass.entities || languageOf(previous) !== languageOf(this.hass)) {
      return true;
    }
    if (this.config.auto_populate && steamPlayers(previous).join() !== steamPlayers(this.hass).join()) {
      return true;
    }
    return this.watched().some((id) => previous.states[id] !== this.hass?.states[id]);
  }
  /** The entity ids the card is meant to show. */
  wanted() {
    if (!this.hass || !this.config) {
      return [];
    }
    if (this.config.auto_populate) {
      return steamPlayers(this.hass);
    }
    const { entity } = this.config;
    return entity === void 0 ? [] : typeof entity === "string" ? [entity] : entity;
  }
  /** The players and the entities of their devices that the card reads: now playing, level and the pictures. */
  watched() {
    const hass = this.hass;
    return hass ? this.wanted().flatMap((id) => deviceEntityIds(hass, id)) : [];
  }
  /** Whether one player gets the big card: asked for, or one named player with the automatic layout. */
  single() {
    const layout = this.config?.layout ?? "auto";
    if (layout !== "auto") {
      return layout === "player";
    }
    return !this.config?.auto_populate && typeof this.config?.entity === "string";
  }
  get gameBackground() {
    return this.config?.game_background !== false;
  }
  render() {
    if (!this.hass || !this.config) {
      return A;
    }
    const hass = this.hass;
    const wanted = this.wanted();
    const players = wanted.map((id) => hass.states[id]).filter((entity) => entity !== void 0).map((entity) => readPlayer(hass, entity));
    const missing = wanted.filter((id) => hass.states[id] === void 0);
    const style = this.heightStyle();
    if (this.single()) {
      return b2`<ha-card class="big-card" style=${style}>
                ${players.length > 0 ? this.bigCard(players[0]) : this.notFound(missing[0])}
            </ha-card>`;
    }
    return b2`<ha-card style=${style}>
            <div class="card-header">${this.config?.title || this.text("common.title")}</div>
            <div class="list">${this.listRows(players, missing)}</div>
        </ha-card>`;
  }
  listRows(players, missing) {
    const groups = groupByStatus(sortByName(players, this.config?.name_overrides));
    const rows = [];
    for (const status of STATUSES) {
      const group = groups[status];
      if (!group || group.length === 0) {
        continue;
      }
      rows.push(b2`<div class="status-category">${this.text(`statuses.${status}`)}</div>`);
      rows.push(...pairs(group).map((pair) => b2`<div class="user-row">${pair.map((player) => this.listPlayer(player))}</div>`));
    }
    rows.push(...missing.map((id) => this.notFound(id)));
    return rows;
  }
  listPlayer(player) {
    const playing = inGame(player);
    const header = player.header;
    return this.target(
      player,
      "",
      b2`
                ${playing && this.gameBackground && header && !this.failed.has(header) ? b2`<img src=${header} class="row-picture" alt="" @error=${() => this.fail(header)} />` : A}
                ${this.avatar(player)}
                <div class="details">
                    <div class="name">${displayName(player.entity, this.config?.name_overrides)}</div>
                    ${playing ? this.gameLine(player) : A}
                    ${player.entity.state === "offline" ? b2`<div class="seen">${this.lastSeen(player)}</div>` : A}
                </div>
            `
    );
  }
  bigCard(player) {
    const playing = inGame(player);
    const state = player.entity.state === "offline" ? this.lastSeen(player) : this.text(`statuses.${statusOf(player)}`);
    const logo = playing && this.gameBackground && player.hero && player.logo && !this.failed.has(player.hero) && !this.failed.has(player.logo);
    return this.target(
      player,
      logo ? "big with-logo" : "big",
      b2`
                ${this.gameBackground ? playing ? this.gameArt(player) : STEAM_LOGO : A} ${this.avatar(player)}
                <div class="details">
                    <div class="name">${displayName(player.entity, this.config?.name_overrides)}</div>
                    <div class="seen">${state}</div>
                    ${playing ? this.gameLine(player) : A}
                </div>
            `
    );
  }
  /**
   * A player's box, answering a tap, a hold and a double tap through Home Assistant's own action handler with
   * the player as the entity. A player that does nothing on a tap isn't offered as a button.
   */
  target(player, kind, body) {
    const tappable = this.config !== void 0 && isTappable(this.config);
    const gestures = this.gesturesFor(player.entity.entity_id);
    return b2`<div
            class="player ${kind} ${this.mood(player)}"
            role=${tappable ? "button" : A}
            tabindex=${tappable ? "0" : A}
            @pointerdown=${(event) => gestures.pointerDown(event)}
            @pointerup=${() => gestures.pointerUp()}
            @pointercancel=${() => gestures.pointerUp()}
            @pointerleave=${() => gestures.pointerUp()}
            @click=${() => gestures.click()}
            @keydown=${(event) => gestures.key(event)}
        >
            ${body}
        </div>`;
  }
  gesturesFor(entity) {
    let detector = this.gestures.get(entity);
    if (!detector) {
      detector = new GestureDetector(
        () => this.config,
        (gesture) => this.act(entity, gesture)
      );
      this.gestures.set(entity, detector);
    }
    return detector;
  }
  /**
   * The game behind the big card: its wide hero picture, shaded under the text, with its logo at the right.
   * A game without a hero picture gets its own picture dimmed, as before there were any.
   */
  gameArt(player) {
    const { hero, logo } = player;
    if (hero && !this.failed.has(hero)) {
      return b2`
                <img src=${hero} class="hero" alt="" @error=${() => this.fail(hero)} />
                <div class="shade"></div>
                ${logo && !this.failed.has(logo) ? b2`<img src=${logo} class="logo" alt="" @error=${() => this.fail(logo)} />` : A}
            `;
    }
    const picture = player.main ?? player.header;
    return picture && !this.failed.has(picture) ? b2`<img src=${picture} class="big-picture" alt="" @error=${() => this.fail(picture)} />` : A;
  }
  /** The game with its icon and how long it has been played. Its name opens the game in the Steam store. */
  gameLine(player) {
    const time = playTime(player.gameSince);
    const name = player.gameId ? b2`<a
                  class="game-name"
                  href="${STORE_URL}${player.gameId}"
                  target="_blank"
                  rel="noreferrer"
                  @click=${(event) => event.stopPropagation()}
                  @pointerdown=${(event) => event.stopPropagation()}
                  @keydown=${(event) => event.stopPropagation()}
                  >${player.game}</a
              >` : b2`<span class="game-name">${player.game}</span>`;
    return b2`<div class="game">
            ${player.gameIcon ? b2`<img src=${player.gameIcon} class="game-icon" alt="" />` : A}${name}
            ${time ? b2`<span class="play-time">· ${this.duration(time)}</span>` : A}
        </div>`;
  }
  /** The avatar, ringed in the colour of the player's state, with their Steam level in the corner. */
  avatar(player) {
    const picture = avatarUrl(player.entity);
    return b2`
            <div class="avatar-wrap">
                ${picture ? b2`<img src=${picture} class="avatar" alt="" />` : b2`<div class="avatar avatar-blank"></div>`}
                ${player.level === void 0 ? A : b2`<span class="level" title=${this.text("common.level", { level: player.level })}>${player.level}</span>`}
            </div>
        `;
  }
  /** The state the card draws a player in: in a game, or whatever Steam says. */
  mood(player) {
    return inGame(player) ? `${player.entity.state} ingame` : player.entity.state;
  }
  notFound(entityId) {
    return b2`<div class="not-found">${this.text("common.entity_not_found", { entity: entityId ?? "" })}</div>`;
  }
  fail(url) {
    this.failed = new Set(this.failed).add(url);
  }
  act(entity, gesture) {
    const { tap_action, hold_action, double_tap_action } = this.config ?? {};
    this.dispatchEvent(
      new CustomEvent("hass-action", {
        detail: { config: { entity, tap_action, hold_action, double_tap_action }, action: gesture },
        bubbles: true,
        composed: true
      })
    );
  }
  /** "Seen 5 min ago", or nothing when the player has no such time. */
  lastSeen(player) {
    const since = elapsed(player.lastOnline);
    if (!since) {
      return "";
    }
    const unit = since.amount === 1 ? `time_units.one_${since.unit}` : `time_units.${since.unit}`;
    return this.text("common.last_seen", { amount: String(since.amount), unit: this.text(unit) });
  }
  duration(time) {
    if (time.hours === 0) {
      return this.text("common.minutes", { minutes: String(time.minutes) });
    }
    return time.minutes === 0 ? this.text("common.hours", { hours: String(time.hours) }) : this.text("common.hours_minutes", { hours: String(time.hours), minutes: String(time.minutes) });
  }
  text(key, values = {}) {
    return Object.entries(values).reduce(
      (text, [name, value]) => text.replace(`{${name}}`, value),
      translate(languageOf(this.hass), key)
    );
  }
  static get styles() {
    return [
      i`
                /* The colour of each state, used for the ring around an avatar and its level. */
                :host {
                    --steam-online: #57cbde;
                    --steam-ingame: #90ba3c;
                    --steam-busy: #d9544e;
                    --steam-away: #d6ca1c;
                    --steam-snooze: #4081e4;
                    --steam-looking: #c58ade;
                    --steam-offline: #8f98a0;
                }

                /* A column, so that with a height of its own the header stays put and the list scrolls. */
                ha-card {
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    padding: 16px;
                    overflow: hidden;
                    container-type: inline-size;
                }

                /* The big card is all one player, so its picture reaches the edges. */
                ha-card.big-card {
                    padding: 0;
                }

                .card-header {
                    flex: none;
                    padding: 0 0 8px 0;
                    font-size: var(--ha-card-header-font-size, 24px);
                    line-height: 1.2;
                    overflow-wrap: anywhere;
                }

                .list {
                    flex: 1 1 auto;
                    min-height: 0;
                    overflow-y: auto;
                    overscroll-behavior: contain;
                    scrollbar-width: thin;
                }

                .status-category {
                    margin: 10px 0 5px 0;
                    font-size: 13px;
                    color: var(--secondary-text-color);
                }

                .user-row {
                    display: flex;
                    gap: 8px;
                }

                /* A row of the list holds half of it; the big card fills its own. */
                .player {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    width: calc(50% - 4px);
                    min-width: 0;
                    box-sizing: border-box;
                    /* Room below for the level, which hangs off the corner of the avatar. */
                    padding: 6px 4px 8px 4px;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .player[role="button"] {
                    cursor: pointer;
                }

                .player:focus-visible {
                    outline: 2px solid var(--primary-color);
                    outline-offset: -2px;
                }

                /* Narrow: one player a row, so a name and a game get the card's width instead of half of it */
                @container (max-width: 400px) {
                    .user-row {
                        flex-direction: column;
                        gap: 0;
                    }
                    .user-row .player {
                        width: 100%;
                    }
                }

                /* With a height of its own, the big card's player and picture fill all of it. */
                .player.big {
                    flex: 1 1 auto;
                    width: 100%;
                    min-height: 88px;
                    gap: 12px;
                    padding: 12px 16px 14px 16px;
                    border-radius: var(--ha-card-border-radius, 12px);
                }

                /* Everything but the pictures sits above them. */
                .avatar-wrap,
                .details {
                    position: relative;
                    z-index: 2;
                }

                .avatar-wrap {
                    flex: 0 0 auto;
                    line-height: 0;
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    object-fit: cover;
                    display: block;
                    box-shadow: 0 0 0 2px var(--ring, var(--steam-offline));
                }

                .avatar-blank {
                    background: var(--secondary-background-color);
                }

                .big .avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 10px;
                }

                /* The level sits in the corner of the avatar and grows with the number. */
                .level {
                    position: absolute;
                    right: -4px;
                    bottom: -6px;
                    min-width: 14px;
                    height: 16px;
                    padding: 0 4px;
                    box-sizing: border-box;
                    border-radius: 8px;
                    border: 1px solid var(--ring, var(--steam-offline));
                    background: var(--card-background-color, var(--ha-card-background, #fff));
                    color: var(--primary-text-color);
                    font-size: 10px;
                    text-align: center;
                    font-variant-numeric: tabular-nums;
                    /* The digits are centred by their own height, not the line's, with the baseline on a whole pixel */
                    text-box: trim-both cap alphabetic;
                    padding-top: calc(11px - 1cap);
                }

                .big .level {
                    height: 18px;
                    min-width: 18px;
                    border-radius: 9px;
                    font-size: 11px;
                    padding-top: calc(12px - 1cap);
                }

                .details {
                    min-width: 0;
                    flex: 1 1 auto;
                }

                /* Names and games wrap rather than end in an ellipsis */
                .name {
                    font-weight: 600;
                    overflow-wrap: anywhere;
                }

                .big .name {
                    font-size: 18px;
                }

                .seen {
                    font-size: 12px;
                    color: var(--secondary-text-color);
                }

                /* Inline, so the icon stays with the game's name and only the time wraps to a line of its own */
                .game {
                    font-size: 12px;
                    overflow-wrap: anywhere;
                }

                .big .game {
                    font-size: 14px;
                    margin-top: 2px;
                }

                .game-icon {
                    width: 16px;
                    height: 16px;
                    border-radius: 3px;
                    margin-right: 4px;
                    vertical-align: -3px;
                }

                .big .game-icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                    vertical-align: -5px;
                }

                a.game-name {
                    color: inherit;
                    text-decoration: none;
                }

                a.game-name:hover,
                a.game-name:focus-visible {
                    text-decoration: underline;
                }

                .play-time {
                    white-space: nowrap;
                }

                /* The game's picture lies behind the row, fading out towards the names. */
                .row-picture {
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 100%;
                    width: 60%;
                    object-fit: cover;
                    opacity: 0.35;
                    z-index: 0;
                    mask-image: linear-gradient(to right, transparent, black 85%);
                }

                /* A glow in the card's colour keeps the text readable over the picture's own lettering */
                .row-picture ~ .details {
                    --halo: var(--card-background-color, var(--ha-card-background, #fff));
                    text-shadow:
                        0 0 2px var(--halo),
                        0 0 4px var(--halo),
                        0 0 8px var(--halo);
                }

                /* A game without a hero picture: its own picture, dimmed and faded from the right */
                .big-picture {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.28;
                    z-index: 0;
                    mask-image: linear-gradient(to right, transparent, black 60%);
                }

                /* The hero picture across the card. The shade goes by pixels, not percent, so the text is always on
               the card's own colour and the picture shows where the text ends */
                .hero {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: 70% 40%;
                    z-index: 0;
                }

                .shade {
                    --shade-colour: var(--card-background-color, var(--ha-card-background, #fff));
                    position: absolute;
                    inset: 0;
                    z-index: 1;
                    background: linear-gradient(
                        to right,
                        var(--shade-colour) 0,
                        var(--shade-colour) 200px,
                        color-mix(in srgb, var(--shade-colour) 70%, transparent) 290px,
                        transparent 400px
                    );
                }

                .logo {
                    position: absolute;
                    z-index: 1;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 72%;
                    max-width: 38%;
                    object-fit: contain;
                    filter: drop-shadow(0 2px 6px rgb(0 0 0 / 0.6));
                    pointer-events: none;
                }

                /* The text keeps clear of the logo, which may take up to 38% of the card */
                .big.with-logo .details {
                    padding-right: calc(38cqw + 8px);
                }

                /* Narrow: the logo would sit on the name, which says the same */
                @container (max-width: 360px) {
                    .logo {
                        display: none;
                    }
                    .big.with-logo .details {
                        padding-right: 0;
                    }
                }

                /* The Steam logo stands in for the picture when a player is in no game. */
                /* The box is a div, because an inline svg has no size of its own to position by. */
                .steam-game-default-bg {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    /* Wider and taller than the drawing needs, with room at the right, so it never touches the edges. */
                    height: 50%;
                    width: min(50%, 190px);
                    padding-right: 25px;
                    box-sizing: border-box;
                    opacity: 0.15;
                    z-index: 0;
                    pointer-events: none;
                }

                .steam-logo {
                    display: block;
                    width: 100%;
                    height: 100%;
                    fill: var(--primary-text-color);
                }

                /* Each state colours the ring, and the offline players are greyed out. */
                .online {
                    --ring: var(--steam-online);
                }

                .busy {
                    --ring: var(--steam-busy);
                }

                .away {
                    --ring: var(--steam-away);
                }

                .snooze {
                    --ring: var(--steam-snooze);
                }

                .looking_to_play,
                .looking_to_trade {
                    --ring: var(--steam-looking);
                }

                .offline,
                .unavailable {
                    --ring: var(--steam-offline);
                }

                /* Last, so a player in a game is green whatever else Steam says they are, as in their group */
                .ingame {
                    --ring: var(--steam-ingame);
                }

                .offline .avatar,
                .unavailable .avatar {
                    filter: grayscale(1);
                    opacity: 0.65;
                }

                .offline .name,
                .unavailable .name {
                    font-weight: 500;
                    color: var(--secondary-text-color);
                }

                .not-found {
                    background-color: var(--warning-color, #ffa726);
                    color: var(--text-primary-color, #fff);
                    border-radius: 8px;
                    font-size: 14px;
                    padding: 8px;
                    overflow-wrap: anywhere;
                }
            `,
      fadeStyles
    ];
  }
};
__decorateClass([
  n4({ attribute: false })
], SteamCardCompact.prototype, "hass", 2);
__decorateClass([
  n4({ attribute: false })
], SteamCardCompact.prototype, "layout", 2);
__decorateClass([
  r5()
], SteamCardCompact.prototype, "config", 2);
__decorateClass([
  r5()
], SteamCardCompact.prototype, "failed", 2);
SteamCardCompact = __decorateClass([
  t3("steam-card-compact")
], SteamCardCompact);
export {
  SteamCardCompact
};
