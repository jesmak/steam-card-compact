function t(t,e,s,i){var n,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,s,i);else for(var r=t.length-1;r>=0;r--)(n=t[r])&&(a=(o<3?n(a):o>3?n(e,s,a):n(e,s))||a);return o>3&&a&&Object.defineProperty(e,s,a),a}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new o(s,t,i)},r=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,f=g?g.emptyScript:"",v=m.reactiveElementPolyfillSupport,_=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return i?.call(this)},set(e){const o=i?.call(this);n.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$Eg=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$ES(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$E_??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$E_?.delete(t)}_$ES(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const s of i){const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$E_?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$E_?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EO(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i,this[i]=n.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){if(s??=this.constructor.getPropertyOptions(t),!(s.hasChanged??y)(i?n:this[t],e))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$Eg=this._$EP())}C(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$EP(){this.isUpdatePending=!0;try{await this._$Eg}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t)!0!==s.wrapped||this._$AL.has(e)||void 0===this[e]||this.C(e,this[e],s)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$E_?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$ET()}catch(e){throw t=!1,this._$ET(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$E_?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$ET(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Eg}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EO(t,this[t]))),this._$ET()}updated(t){}firstUpdated(t){}}A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[_("elementProperties")]=new Map,A[_("finalized")]=new Map,v?.({ReactiveElement:A}),(m.reactiveElementVersions??=[]).push("2.0.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=w.trustedTypes,E=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${(Math.random()+"").slice(9)}$`,P="?"+C,k=`<${P}>`,U=document,O=()=>U.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,M="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,z=/>/g,j=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,I=/"/g,D=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,K=U.createTreeWalker(U,129);function Z(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,o=2===e?"<svg>":"",a=H;for(let e=0;e<s;e++){const s=t[e];let r,l,c=-1,h=0;for(;h<s.length&&(a.lastIndex=h,l=a.exec(s),null!==l);)h=a.lastIndex,a===H?"!--"===l[1]?a=N:void 0!==l[1]?a=z:void 0!==l[2]?(D.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=j):void 0!==l[3]&&(a=j):a===j?">"===l[0]?(a=n??H,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?j:'"'===l[3]?I:L):a===I||a===L?a=j:a===N||a===z?a=H:(a=j,n=void 0);const d=a===j&&t[e+1].startsWith("/>")?" ":"";o+=a===H?s+k:c>=0?(i.push(r),s.slice(0,c)+S+s.slice(c)+C+d):s+C+(-2===c?e:d)}return[Z(t,o+(t[s]||"<?>")+(2===e?"</svg>":"")),i]};class F{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const a=t.length-1,r=this.parts,[l,c]=J(t,e);if(this.el=F.createElement(l,s),K.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&r.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[o++],s=i.getAttribute(t).split(C),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:n,name:a[2],strings:s,ctor:"."===a[1]?tt:"?"===a[1]?et:"@"===a[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(C)&&(r.push({type:6,index:n}),i.removeAttribute(t));if(D.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),K.nextNode(),r.push({type:2,index:++n});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===P)r.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)r.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const s=U.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===V)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const o=T(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=G(t,n._$AS(t,e.values),n,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??U).importNode(e,!0);K.currentNode=i;let n=K.nextNode(),o=0,a=0,r=s[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new X(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new it(n,this,t)),this._$AV.push(e),r=s[++a]}o!==r?.index&&(n=K.nextNode(),o++)}return K.currentNode=U,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),T(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==W&&T(this._$AH)?this._$AA.nextSibling.data=t:this.$(U.createTextNode(t)),this._$AH=t}g(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=F.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),s=t.u(this.options);t.p(e),this.$(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new F(t)),e}T(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new X(this.k(O()),this.k(O()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(void 0===n)t=G(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==V,o&&(this._$AH=t);else{const i=t;let a,r;for(t=n[0],a=0;a<n.length-1;a++)r=G(this,i[s+a],e,a),r===V&&(r=this._$AH[a]),o||=!T(r)||r!==this._$AH[a],r===W?t=W:t!==W&&(t+=(r??"")+n[a+1]),this._$AH[a]=r}o&&!i&&this.O(t)}O(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}O(t){this.element[this.name]=t===W?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}O(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends Y{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??W)===V)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(F,X),(w.litHtmlVersions??=[]).push("3.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ot extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new X(e.insertBefore(O(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ot._$litElement$=!0,ot.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:ot});const at=globalThis.litElementPolyfillSupport;at?.({LitElement:ot}),(globalThis.litElementVersions??=[]).push("4.0.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:y},lt=(t=rt,e,s)=>{const{kind:i,metadata:n}=s;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t)},init(e){return void 0!==e&&this.C(i,void 0,t),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ct(t){return(e,s)=>"object"==typeof s?lt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,i?{...t,wrapped:!0}:t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}var ht={version:"Version",invalid_configuration:"Invalid configuration",description:"A compact card to show Steam integrations",name:"Steam card compact",last_seen:"Last seen {amount} {unit} ago",in_state:"{state} for {amount} {unit}",entity_not_found:"Entity not found."},dt={online:"Online",away:"Away",snooze:"Snoozing",offline:"Offline",unavailable:"Unavailable"},pt={minutes:"min",hours:"h",days:"days",weeks:"weeks"},ut={common:ht,statuses:dt,time_units:pt},mt={version:"Versio",invalid_configuration:"Virheellinen konfiguraatio",description:"Kompakti kortti Steam-integraation tietojen näyttämiseksi",name:"Steam card compact",last_seen:"Nähty {amount} {unit} sitten",in_state:"{state} viimeiset {amount} {unit}",entity_not_found:"Entiteettiä {entity} ei löydetty."},gt={online:"Paikalla",away:"Poissa",snooze:"Toimeton",offline:"Offline-tilassa",unavailable:"Ei saatavilla"},ft={minutes:"min",hours:"h",days:"pv",weeks:"vko"},vt={common:mt,statuses:gt,time_units:ft};const _t={en:Object.freeze({__proto__:null,common:ht,default:ut,statuses:dt,time_units:pt}),fi:Object.freeze({__proto__:null,common:mt,default:vt,statuses:gt,time_units:ft})};function $t(t,e="",s=""){var i;let n,o=null===(i=localStorage.getItem("selectedLanguage"))||void 0===i?void 0:i.replace(/['"]+/g,"").replace("-","_");if(!o||"null"===o){const t=document.querySelector("home-assistant").hass;o=t.selectedLanguage||t.language||"en"}try{n=t.split(".").reduce(((t,e)=>t[e]),_t[o])}catch(e){n=t.split(".").reduce(((t,e)=>t[e]),_t.en)}return void 0===n&&(n=t.split(".").reduce(((t,e)=>t[e]),_t.en)),""!==e&&""!==s&&(n=n.replace(e,s)),n}console.info("%c  STEAM-CARD-COMPACT \n%c  1.0.2   ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"steam-card-compact",name:$t("common.name"),description:$t("common.description")});let yt=class extends ot{static getStubConfig(){return{}}static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t||void 0===t.auto_populate&&void 0===t.entity)throw new Error($t("common.invalid_configuration"));this.config=Object.assign({name:$t("common.name")},t)}render(){const t=Object.keys(this.hass.states).filter((t=>t.startsWith("sensor.steam_")));return B`
      <ha-card>
        ${this.config.auto_populate?this.createEntitiesCard(t.map((t=>this.hass.states[t]))):"string"==typeof this.config.entity?this.createEntityCard(this.hass.states[this.config.entity]):this.createEntitiesCard(this.config.entity.map((t=>this.hass.states[t])))}
      </ha-card>
    `}getCardSize(){return this.config.entities?this.config.entities.length+1:2}_toggle(t){this.hass.callService("homeassistant","toggle",{entity_id:t.entity_id})}createEntitiesCard(t){const e=t=>null==t?void 0:t.reduce((function(t,e,s,i){return s%2==0&&t.push(i.slice(s,s+2)),t}),[]);t.sort(((t,e)=>{var s,i;return(this.config.name_overrides&&(null===(s=this.config.name_overrides.find((e=>(null==e?void 0:e.entity)===t.entity_id)))||void 0===s?void 0:s.name)||t.attributes.friendly_name||"").localeCompare(this.config.name_overrides&&(null===(i=this.config.name_overrides.find((t=>(null==t?void 0:t.entity)===e.entity_id)))||void 0===i?void 0:i.name)||e.attributes.friendly_name||"")}));const s=(i="state",t.reduce(((t,e)=>Object.assign(Object.assign({},t),{[e[i]]:(t[e[i]]||[]).concat(e)})),{}));var i;const n=e(s.online),o=e(s.away),a=e(s.snooze),r=e(s.offline),l=e(s.unavailable);return[B`<div class="card-header"><div class="name">${this.config.title||"Steam Friends"}</div></div> `,n&&n.length?B`<div class="status-category">${$t("statuses.online")}</div>`:B``,...(null==n?void 0:n.map((t=>this.createPairRow(t))))||[],o&&o.length?B`<div class="status-category">${$t("statuses.away")}</div>`:B``,...(null==o?void 0:o.map((t=>this.createPairRow(t))))||[],a&&a.length?B`<div class="status-category">${$t("statuses.snooze")}</div>`:B``,...(null==a?void 0:a.map((t=>this.createPairRow(t))))||[],r&&r.length?B`<div class="status-category">${$t("statuses.offline")}</div>`:B``,...(null==r?void 0:r.map((t=>this.createPairRow(t))))||[],l&&l.length?B`<div class="status-category">${$t("statuses.unavailable")}</div>`:B``,...(null==l?void 0:l.map((t=>this.createPairRow(t))))||[]]}createPairRow(t){const e=t[0],s=t.length>1?t[1]:void 0;return B`
      <div class="user-row">
        ${e?this.createPairItem(e):B`<div class="not-found">${$t("common.entity_not_found")}</div>`}
        ${s?this.createPairItem(s):2==t.length?B`<div class="not-found">${$t("common.entity_not_found")}</div>`:""}
      </div>
    `}createPairItem(t){var e;const s=t?this.config.name_overrides&&(null===(e=this.config.name_overrides.find((e=>(null==e?void 0:e.entity)===t.entity_id)))||void 0===e?void 0:e.name)||t.attributes.friendly_name:void 0;return B`
      <div class="steam-multi clickable ${t.state}" @click=${()=>this.handlePopup(t)}>
        <div class="steam-user">
          ${"unavailable"!==t.state?this.renderUserAvatar(t,`steam-avatar ${t.state}`):""}
          <div class="user-container ${t.attributes.game?"":"no-game"}">
            <div class="steam-username ${t.state}">${s}</div>
            ${t.attributes.game?B`<div class="steam-value ${t.state}">${t.attributes.game}</div>`:""}
            ${"offline"==t.state?B`<div class="steam-last-online ${t.state}">
                  <span class="steam-last-online-text ${t.state}"
                    >${this.formatLastSeen(t.attributes.last_online)}</span
                  >
                </div>`:""}
          </div>
        </div>
        ${t.attributes.game&&!1!==this.config.game_background?B`<img src="${t.attributes.game_image_header}" class="steam-game-bg" /> `:""}
      </div>
    `}handlePopup(t){const e=t.entity_id,s=new Event("hass-more-info",{composed:!0});s.detail={entityId:e},this.dispatchEvent(s)}createEntityCard(t){var e;const s=this.config.name_overrides&&(null===(e=this.config.name_overrides.find((e=>(null==e?void 0:e.entity)===t.entity_id)))||void 0===e?void 0:e.name)||t.attributes.friendly_name;return B`
      <div class="single-card-container clickable" @click=${()=>this.handlePopup(t)}>
        <div class="steam-avatar-container ${this.getState(t,"unknown")}">
          ${this.renderUserAvatar(t,`steam-avatar single ${this.getState(t,"unknown")}`)}
          <div class="steam-level single ${this.getState(t,"unknown")}">
            <span class="steam-level-text-container single">
              <span class="steam-level-text single">${this.getAttr(t,"level","?")}</span>
            </span>
            <ha-icon icon="mdi:shield"></ha-icon>
          </div>
        </div>
        <div class="user-data-container single">
          <div class="steam-username ${t.state}">${s}</div>
          <div class="steam-last-online ${t.state}">
            <span class="steam-last-online-text ${t.state}"
              >${this.formatLastOnline(t.attributes.last_online,t.state)}</span
            >
          </div>
        </div>
        ${this.config.game_background?t.attributes.game?B`<img src="${t.attributes.game_image_header}" class="steam-game-bg single" />`:B`<svg class="steam-game-default-bg single" version="1.0" viewBox="0 0 467 143">
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
              </svg>`:""}
        ${t.attributes.game?B`<div class="steam-game">${t.attributes.game}</div>`:""}
      </div>
    `}getState(t,e){return t&&t.state?t.state:e}getAttr(t,e,s){return t&&t.attributes?t.attributes[e]:s}formatLastOnline(t,e){return this.setAmountAndUnit(t,$t("common.in_state")).replace("{state}",$t(`statuses.${e}`))}formatLastSeen(t){return this.setAmountAndUnit(t,$t("common.last_seen"))}setAmountAndUnit(t,e){if(isNaN(parseInt(t)))return"";const s=((new Date).getTime()-new Date(t).getTime())/1e3,i=s<60?s:s<3600?Math.floor(s/60):s<86400?Math.floor(s/60/60):s<604800?Math.floor(s/60/60/24):Math.floor(s/60/60/24/7),n=s<60?"time_units.seconds":s<3600?"time_units.minutes":s<86400?"time_units.hours":s<604800?"time_units.days":"time_units.weeks";return e.replace("{amount}",i.toString()).replace("{unit}",$t(n))}renderUserAvatar(t,e){return t.attributes.entity_picture?B`<img src="${t.attributes.entity_picture.replace("_medium","_full")}" class="${e}" />`:B`<div class="${e}"></div>`}static get styles(){return a`
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
    `}};t([ct()],yt.prototype,"hass",void 0),t([function(t){return ct({...t,state:!0,attribute:!1})}()],yt.prototype,"config",void 0),yt=t([(t=>(e,s)=>{void 0!==s?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)})("steam-card-compact")],yt);export{yt as SteamCardCompact};
