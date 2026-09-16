/*! steam-card-compact 2.0.0 | MIT License */
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

// src/const.ts
var CARD_VERSION = "2.0.0";
var STATUSES = ["online", "away", "snooze", "offline", "unavailable"];
var STEAM_PREFIX = "sensor.steam_";

// src/friends.ts
function displayName(entity, overrides) {
  const override = overrides?.find((item) => item?.entity === entity.entity_id)?.name;
  return override || String(entity.attributes.friendly_name ?? entity.entity_id);
}
function sortByName(entities, overrides) {
  return [...entities].sort(
    (one, other) => displayName(one, overrides).localeCompare(displayName(other, overrides))
  );
}
function groupByStatus(entities) {
  const groups = {};
  for (const entity of entities) {
    const status = STATUSES.includes(entity.state) ? entity.state : "unavailable";
    (groups[status] ?? (groups[status] = [])).push(entity);
  }
  return groups;
}
function pairs(entities) {
  const rows = [];
  for (let index = 0; index < (entities?.length ?? 0); index += 2) {
    rows.push(entities.slice(index, index + 2));
  }
  return rows;
}
function elapsed(time, now = Date.now()) {
  if (time === void 0 || time === null || time === "") {
    return void 0;
  }
  const moment = typeof time === "number" ? time * 1e3 : Date.parse(String(time));
  if (Number.isNaN(moment)) {
    return void 0;
  }
  const seconds = Math.max(0, Math.floor((now - moment) / 1e3));
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
function avatarUrl(entity) {
  const picture = entity.attributes.entity_picture;
  return typeof picture === "string" ? picture.replace("_medium", "_full") : void 0;
}

// src/languages/en.json
var en_default = {
  common: {
    version: "Version",
    invalid_configuration: "Invalid configuration",
    description: "A compact card to show Steam integrations",
    name: "Steam card compact",
    last_seen: "Last seen {amount} {unit} ago",
    in_state: "{state} for {amount} {unit}",
    entity_not_found: "Entity {entity} was not found."
  },
  statuses: {
    online: "Online",
    away: "Away",
    snooze: "Snoozing",
    offline: "Offline",
    unavailable: "Unavailable"
  },
  time_units: {
    minutes: "min",
    hours: "h",
    days: "days",
    weeks: "weeks",
    seconds: "s"
  }
};

// src/languages/fi.json
var fi_default = {
  common: {
    version: "Versio",
    invalid_configuration: "Virheellinen konfiguraatio",
    description: "Kompakti kortti Steam-integraation tietojen n\xE4ytt\xE4miseksi",
    name: "Steam card compact",
    last_seen: "N\xE4hty {amount} {unit} sitten",
    in_state: "{state} viimeiset {amount} {unit}",
    entity_not_found: "Entiteetti\xE4 {entity} ei l\xF6ydetty."
  },
  statuses: {
    online: "Paikalla",
    away: "Poissa",
    snooze: "Toimeton",
    offline: "Offline-tilassa",
    unavailable: "Ei saatavilla"
  },
  time_units: {
    minutes: "min",
    hours: "h",
    days: "pv",
    weeks: "vko",
    seconds: "s"
  }
};

// src/localize.ts
var LANGUAGES = { en: en_default, fi: fi_default };
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

// src/logo.ts
var STEAM_LOGO = b2`
  <svg class="steam-game-default-bg single" version="1.0" viewBox="0 0 467 143">
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
  /** Offers every Steam player there is when the card is added from the picker. */
  static getStubConfig(hass) {
    const players = Object.keys(hass?.states ?? {}).filter((id) => id.startsWith(STEAM_PREFIX));
    return players.length > 0 ? { entity: players } : { auto_populate: true };
  }
  setConfig(config) {
    if (!config || config.auto_populate === void 0 && config.entity === void 0) {
      throw new Error(translate(browserLanguage(), "common.invalid_configuration"));
    }
    this.config = { ...config };
  }
  getCardSize() {
    const shown = this.wanted().length;
    return this.single() ? 2 : 1 + Math.ceil(shown / 2);
  }
  shouldUpdate(changed) {
    if (changed.has("config") || !this.config) {
      return true;
    }
    const previous = changed.get("hass");
    if (!previous || this.config.auto_populate) {
      return true;
    }
    return this.wanted().some((id) => previous.states[id] !== this.hass?.states[id]);
  }
  /** The entity ids the card is meant to show. */
  wanted() {
    if (!this.hass || !this.config) {
      return [];
    }
    if (this.config.auto_populate) {
      return Object.keys(this.hass.states).filter((id) => id.startsWith(STEAM_PREFIX));
    }
    const { entity } = this.config;
    return entity === void 0 ? [] : typeof entity === "string" ? [entity] : entity;
  }
  /** One named player, and not the automatic list, means the big card. */
  single() {
    return !this.config?.auto_populate && typeof this.config?.entity === "string";
  }
  render() {
    if (!this.hass || !this.config) {
      return A;
    }
    const wanted = this.wanted();
    const players = wanted.map((id) => this.hass?.states[id]).filter((entity) => entity !== void 0);
    const missing = wanted.filter((id) => this.hass?.states[id] === void 0);
    if (this.single()) {
      return b2`<ha-card>
        ${players.length > 0 ? this.bigCard(players[0]) : this.notFound(missing[0])}
      </ha-card>`;
    }
    return b2`<ha-card>${this.listCard(players, missing)}</ha-card>`;
  }
  listCard(players, missing) {
    const groups = groupByStatus(sortByName(players, this.config?.name_overrides));
    const rows = [
      b2`<div class="card-header"><div class="name">${this.config?.title || "Steam Friends"}</div></div>`
    ];
    for (const status of STATUSES) {
      const group = groups[status];
      if (!group || group.length === 0) {
        continue;
      }
      rows.push(b2`<div class="status-category">${this.text(`statuses.${status}`)}</div>`);
      rows.push(...pairs(group).map((pair) => this.pairRow(pair)));
    }
    rows.push(...missing.map((id) => this.notFound(id)));
    return rows;
  }
  pairRow(pair) {
    return b2`<div class="user-row">${pair.map((entity) => this.listPlayer(entity))}</div>`;
  }
  listPlayer(entity) {
    const game = entity.attributes.game;
    return b2`
      <div class="steam-multi clickable ${entity.state}" @click=${() => this.openMoreInfo(entity)}>
        <div class="steam-user">
          ${entity.state !== "unavailable" ? this.avatar(entity, `steam-avatar ${entity.state}`) : A}
          <div class="user-container ${game ? "" : "no-game"}">
            <div class="steam-username ${entity.state}">
              ${displayName(entity, this.config?.name_overrides)}
            </div>
            ${game ? b2`<div class="steam-value ${entity.state}">${game}</div>` : A}
            ${entity.state === "offline" ? b2`<div class="steam-last-online ${entity.state}">
                    <span class="steam-last-online-text ${entity.state}">${this.lastSeen(entity)}</span>
                  </div>` : A}
          </div>
        </div>
        ${game && this.config?.game_background !== false ? b2`<img src="${String(entity.attributes.game_image_header ?? "")}" class="steam-game-bg" />` : A}
      </div>
    `;
  }
  bigCard(entity) {
    const game = entity.attributes.game;
    return b2`
      <div class="single-card-container clickable" @click=${() => this.openMoreInfo(entity)}>
        <div class="steam-avatar-container ${entity.state}">
          ${this.avatar(entity, `steam-avatar single ${entity.state}`)}
          <div class="steam-level single ${entity.state}">
            <span class="steam-level-text-container single">
              <span class="steam-level-text single">${entity.attributes.level ?? "?"}</span>
            </span>
            <ha-icon icon="mdi:shield"></ha-icon>
          </div>
        </div>
        <div class="user-data-container single">
          <div class="steam-username ${entity.state}">
            ${displayName(entity, this.config?.name_overrides)}
          </div>
          <div class="steam-last-online ${entity.state}">
            <span class="steam-last-online-text ${entity.state}">${this.inState(entity)}</span>
          </div>
        </div>
        ${this.config?.game_background ? game ? b2`<img
                  src="${String(entity.attributes.game_image_header ?? "")}"
                  class="steam-game-bg single"
                />` : STEAM_LOGO : A}
        ${game ? b2`<div class="steam-game">${game}</div>` : A}
      </div>
    `;
  }
  avatar(entity, className) {
    const picture = avatarUrl(entity);
    return picture ? b2`<img src="${picture}" class="${className}" />` : b2`<div class="${className}"></div>`;
  }
  notFound(entityId) {
    return b2`<div class="not-found">
      ${this.text("common.entity_not_found").replace("{entity}", entityId ?? "")}
    </div>`;
  }
  openMoreInfo(entity) {
    const event = new Event("hass-more-info", { bubbles: true, composed: true });
    event.detail = { entityId: entity.entity_id };
    this.dispatchEvent(event);
  }
  /** "Last seen 5 min ago", or nothing when the player has no such time. */
  lastSeen(entity) {
    const since = elapsed(entity.attributes.last_online);
    if (!since) {
      return "";
    }
    return this.text("common.last_seen").replace("{amount}", String(since.amount)).replace("{unit}", this.text(`time_units.${since.unit}`));
  }
  /** "Offline for 3 days", or nothing when the player has no such time. */
  inState(entity) {
    const since = elapsed(entity.attributes.last_online);
    if (!since) {
      return "";
    }
    return this.text("common.in_state").replace("{state}", this.text(`statuses.${entity.state}`)).replace("{amount}", String(since.amount)).replace("{unit}", this.text(`time_units.${since.unit}`));
  }
  text(key) {
    const language = this.hass?.locale?.language ?? this.hass?.language ?? browserLanguage();
    return translate(language, key);
  }
  static get styles() {
    return i`
      .card-header {
        width: 100%;
        padding-top: 0;
        padding-bottom: 8px;
      }

      .clickable {
        cursor: pointer;
      }

      .status-category {
        text-align: left;
        width: 100%;
        margin: 10px 0 5px 0;
      }

      .steam-game-bg {
        z-index: 0;
        position: absolute;
        top: 0;
        right: 0;
        height: 41px;
        width: auto;
        opacity: 0.5;
        mask-image: linear-gradient(to right, transparent 1%, black 90%);
      }

      .steam-game-default-bg.single {
        position: absolute;
        top: 5px;
        left: 135px;
        height: 90%;
        opacity: 0.3;
        mask-image: linear-gradient(to right, transparent 1%, black 90%);
      }

      .steam-game-bg.single {
        height: 100%;
        width: 130%;
        opacity: 0.3;
        object-fit: cover;
        border-radius: var(--ha-card-border-radius);
      }

      .steam-game {
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .not-found {
        background-color: yellow;
        font-family: sans-serif;
        font-size: 14px;
        padding: 8px;
      }

      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
      }

      .single-card-container {
        width: 100%;
        height: 80px;
      }

      .steam-avatar-container {
        display: inline-block;
      }

      .steam-avatar {
        min-width: 36px;
        min-height: 36px;
        max-width: 36px;
        max-height: 36px;
        border-style: solid;
        border-width: 1px 1px 4px 1px;
        object-fit: cover;
        margin-bottom: 3px;
        display: block;
      }

      .steam-avatar.single {
        min-width: 50px;
        min-height: 50px;
        max-width: 50px;
        max-height: 50px;
        border-width: 1px 1px 5px 1px;
        display: block;
      }

      .steam-avatar.online {
        border-color: #6cff4f9d;
        box-shadow: 1px 0.5px 3px #6cff4f88;
      }

      .steam-avatar.away {
        border-color: #d6ca1c9d;
        box-shadow: 1px 0.5px 3px #d6ca1c88;
      }

      .steam-avatar.snooze {
        border-color: #4081e49d;
        box-shadow: 1px 0.5px 3px #4081e488;
      }

      .steam-avatar.offline {
        border-color: #aaaaaa9d;
        opacity: 0.2;
        box-shadow: 1px 0.5px 3px #aaaaaa88;
      }

      .steam-username {
        width: 99%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-weight: 600;
      }

      .steam-username.offline,
      .steam-value.offline,
      .steam-level.single.offline,
      .steam-last-online-text.offline,
      .online-status-icon.offline {
        opacity: 0.5;
      }

      .steam-value {
        font-size: 10px;
        width: 99%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .user-container {
        margin-left: 0.5em;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        align-content: center;
      }

      .user-data-container.single {
        display: inline-block;
        width: calc(100% - 76px);
        vertical-align: top;
        padding-left: 10px;
      }

      .no-game {
        align-items: center;
      }

      .steam-level.single {
        position: absolute;
        top: 56px;
        left: 56px;
      }

      .steam-avatar-container.unavailable {
        display: none;
      }

      .steam-level > .steam-level-text-container {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        color: var(--card-background-color);
        z-index: 2;
      }

      .steam-last-online {
        width: 100%;
        display: flex;
        font-size: smaller;
      }

      .steam-last-online-text {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .steam-multi {
        width: calc(50% - 5px);
        display: inline-block;
        align-items: center;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }

      .steam-multi:first-child {
        margin-right: 3px;
      }

      .steam-multi:nth-child(2) {
        margin-left: 3px;
      }

      .user-row {
        width: 100%;
      }

      .steam-multi .steam-user {
        display: flex;
      }
    `;
  }
};
__decorateClass([
  n4({ attribute: false })
], SteamCardCompact.prototype, "hass", 2);
__decorateClass([
  r5()
], SteamCardCompact.prototype, "config", 2);
SteamCardCompact = __decorateClass([
  t3("steam-card-compact")
], SteamCardCompact);
export {
  SteamCardCompact
};
