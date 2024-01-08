"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new n(i,t,s)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:o,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",$=u.reactiveElementPolyfillSupport,f=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;class b extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return i?.call(this)},set(e){const a=i?.call(this);n.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$Eg=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$ES(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$E_??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$E_?.delete(t)}_$ES(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$E_?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$E_?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EO(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:_).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=i,this[i]=n.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){if(s??=this.constructor.getPropertyOptions(t),!(s.hasChanged??v)(i?n:this[t],e))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$Eg=this._$EP())}C(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$EP(){this.isUpdatePending=!0;try{await this._$Eg}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t)!0!==s.wrapped||this._$AL.has(e)||void 0===this[e]||this.C(e,this[e],s)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$E_?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$ET()}catch(e){throw t=!1,this._$ET(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$E_?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$ET(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Eg}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EO(t,this[t]))),this._$ET()}updated(t){}firstUpdated(t){}}b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[f("elementProperties")]=new Map,b[f("finalized")]=new Map,$?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.0.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=A.trustedTypes,x=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${(Math.random()+"").slice(9)}$`,C="?"+S,P=`<${C}>`,k=document,U=()=>k.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,H="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,R=/>/g,z=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,D=/"/g,j=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),V=new WeakMap,q=k.createTreeWalker(k,129);function Z(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,a=2===e?"<svg>":"",r=N;for(let e=0;e<s;e++){const s=t[e];let o,l,h=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===N?"!--"===l[1]?r=M:void 0!==l[1]?r=R:void 0!==l[2]?(j.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=z):void 0!==l[3]&&(r=z):r===z?">"===l[0]?(r=n??N,h=-1):void 0===l[1]?h=-2:(h=r.lastIndex-l[2].length,o=l[1],r=void 0===l[3]?z:'"'===l[3]?D:L):r===D||r===L?r=z:r===M||r===R?r=N:(r=z,n=void 0);const d=r===z&&t[e+1].startsWith("/>")?" ":"";a+=r===N?s+P:h>=0?(i.push(o),s.slice(0,h)+E+s.slice(h)+S+d):s+S+(-2===h?e:d)}return[Z(t,a+(t[s]||"<?>")+(2===e?"</svg>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,a=0;const r=t.length-1,o=this.parts,[l,h]=J(t,e);if(this.el=K.createElement(l,s),q.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=q.nextNode())&&o.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=h[a++],s=i.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);o.push({type:1,index:n,name:r[2],strings:s,ctor:"."===r[1]?X:"?"===r[1]?tt:"@"===r[1]?et:Q}),i.removeAttribute(t)}else t.startsWith(S)&&(o.push({type:6,index:n}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=w?w.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],U()),q.nextNode(),o.push({type:2,index:++n});i.append(t[e],U())}}}else if(8===i.nodeType)if(i.data===C)o.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)o.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const s=k.createElement("template");return s.innerHTML=t,s}}function F(t,e,s=t,i){if(e===B)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const a=T(e)?void 0:e._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),void 0===a?n=void 0:(n=new a(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=F(t,n._$AS(t,e.values),n,i)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);q.currentNode=i;let n=q.nextNode(),a=0,r=0,o=s[0];for(;void 0!==o;){if(a===o.index){let e;2===o.type?e=new G(n,n.nextSibling,this,t):1===o.type?e=new o.ctor(n,o.name,o.strings,this,t):6===o.type&&(e=new st(n,this,t)),this._$AV.push(e),o=s[++r]}a!==o?.index&&(n=q.nextNode(),a++)}return q.currentNode=k,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),T(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==W&&T(this._$AH)?this._$AA.nextSibling.data=t:this.$(k.createTextNode(t)),this._$AH=t}g(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Y(i,this),s=t.u(this.options);t.p(e),this.$(s),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new K(t)),e}T(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new G(this.k(U()),this.k(U()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const n=this.strings;let a=!1;if(void 0===n)t=F(this,t,e,0),a=!T(t)||t!==this._$AH&&t!==B,a&&(this._$AH=t);else{const i=t;let r,o;for(t=n[0],r=0;r<n.length-1;r++)o=F(this,i[s+r],e,r),o===B&&(o=this._$AH[r]),a||=!T(o)||o!==this._$AH[r],o===W?t=W:t!==W&&(t+=(o??"")+n[r+1]),this._$AH[r]=o}a&&!i&&this.O(t)}O(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}O(t){this.element[this.name]=t===W?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}O(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class et extends Q{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=F(this,t,e,0)??W)===B)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}}const it=A.litHtmlPolyfillSupport;it?.(K,G),(A.litHtmlVersions??=[]).push("3.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class nt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new G(e.insertBefore(U(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}nt._$litElement$=!0,nt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:nt});const at=globalThis.litElementPolyfillSupport;at?.({LitElement:nt}),(globalThis.litElementVersions??=[]).push("4.0.2");const rt={offline:4,online:1,away:2,snooze:3};console.info("%c  STEAM-CARD-COMPACT \n%c  1.0.0   ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"steam-card-compact",name:"Steam card compact",description:"A compact card to show Steam integrations"});let ot=class extends nt{static get properties(){return{hass:{},config:{}}}render(){return I`
      <ha-card>
        ${this.config.entity?this.createEntityCard(this.hass.states[this.config.entity]):this.createEntitiesCard(this.config.entities)}
      </ha-card>
    `}setConfig(t){if(!t.entities&&!t.entity)throw new Error("You need to define either a single entity or an entities field");this.config=t}getCardSize(){return this.config.entities?this.config.entities.length+1:2}_toggle(t){this.hass.callService("homeassistant","toggle",{entity_id:t.entity_id})}sortEntities(t,e){const s=rt[t.state]-rt[e.state];return 0===s?t.attributes.friendly_name.localeCompare(e.attributes.friendly_name):s}createEntitiesCard(t){if("string"==typeof t){const e=[];Object.values(this.hass.states).forEach((s=>{s.entity_id.startsWith(t)&&e.push(s)})),e.sort(this.sortEntities),t=e.map((t=>t.entity_id))}if(this.config.online_only){const e=[];t.forEach((t=>{const s=this.hass.states[t];s&&s.state&&"offline"!==s.state&&e.push(t)})),t=e}const e=[].concat(...t.map((function(e,s){return s%2?[]:[t.slice(s,s+2)]})));return[I` <div class="card-header"><div class="name">${this.config.title||"Steam Friends"}</div></div> `,...e.map((t=>{const e=this.hass.states[t[0]],s=t.length>1?this.hass.states[t[1]]:void 0;return I`
          <div class="user-row">
            ${e?I`
              <div
                class="steam-multi clickable ${e.state}"
                @click=${()=>this.handlePopup(e)}
              >
                <div class="steam-user">
                  ${this.renderUserAvatar(e,`steam-avatar ${e.state}`)}
                  <div class="user-container ${e.attributes.game?"":"no-game"}">
                    <div class="steam-username ${e.state}">${e.attributes.friendly_name}</div>
                    ${e.attributes.game?I`<div class="steam-value ${e.state}">${e.attributes.game}</div>`:""}
                  </div>
                </div>
                ${e.attributes.game&&this.config.game_background?I`<img src="${e.attributes.game_image_header}" class="steam-game-bg" /> `:""}
              </div>
            `:I`<div class="not-found">Entity ${t[0]} not found.</div>`}
            ${s?I`
              <div
                class="steam-multi clickable ${s.state}"
                @click=${()=>this.handlePopup(s)}
              >
                <div class="steam-user">
                  ${this.renderUserAvatar(s,`steam-avatar ${s.state}`)}
                  <div class="user-container ${s.attributes.game?"":"no-game"}">
                    <div class="steam-username ${s.state}">${s.attributes.friendly_name}</div>
                    ${s.attributes.game?I`<div class="steam-value ${s.state}">${s.attributes.game}</div>`:""}
                  </div>
                </div>
                ${s.attributes.game&&this.config.game_background?I`<img src="${s.attributes.game_image_header}" class="steam-game-bg" /> `:""}
              </div>
            `:2==t.length?I`<div class="not-found">Entity ${t[1]} not found.</div>`:""}
          </div>
        `}))]}handlePopup(t){const e=t.entity_id,s=new Event("hass-more-info",{composed:!0});s.detail={entityId:e},this.dispatchEvent(s)}createEntityCard(t){return I`
      <div class="single-card-container clickable" @click=${()=>this.handlePopup(t)}>
        <div class="steam-avatar-container">
          ${this.renderUserAvatar(t,`steam-avatar single ${this.getState(t,"unknown")}`)}
          <div class="steam-level single">
            <span class="steam-level-text-container single">
              <span class="steam-level-text single">${this.getAttr(t,"level","?")}</span>
            </span>
            <ha-icon icon="mdi:shield"></ha-icon>
          </div>
        </div>
        <div class="user-data-container single">
          <div class="steam-username ${t.state}">${t.attributes.friendly_name}</div>
          <div class="steam-last-online ${t.state}">
            <span>
              <ha-icon icon="mdi:cloud-${"online"===t.state?"check":isNaN(parseInt(t.state))?"question":"remove"}-outline"></ha-icon>
            </span>
            <span class="steam-last-online-text">${this.formatLastOnline(t.attributes.last_online)}</span>
          </div>
        </div>
        ${this.config.game_background?t.attributes.game?I`<img src="${t.attributes.game_image_header}" class="steam-game-bg single" />`:I`<svg class="steam-game-default-bg single" version="1.0"viewBox="0 0 467 143">
              <g id="g6" transform="translate(-66.97417,-43.726937)">
                <path class="st0" d="m 137.9,45.1 c -36.7,0 -66.8,28.3 -69.7,64.3 l 37.5,15.5 c 3.2,-2.2 7,-3.4 11.1,-3.4 0.4,0 0.7,0 1.1,0 l 16.7,-24.2 c 0,-0.1 0,-0.2 0,-0.3 0,-14.5 11.8,-26.4 26.4,-26.4 14.5,0 26.4,11.8 26.4,26.4 0,14.6 -11.8,26.4 -26.4,26.4 -0.2,0 -0.4,0 -0.6,0 l -23.8,17 c 0,0.3 0,0.6 0,0.9 0,10.9 -8.9,19.8 -19.8,19.8 -9.6,0 -17.6,-6.8 -19.4,-15.9 L 70.6,134.1 c 8.3,29.4 35.3,50.9 67.3,50.9 38.6,0 69.9,-31.3 69.9,-69.9 0,-38.7 -31.3,-70 -69.9,-70" id="path1" />
                <path class="st0" d="m 112,151.2 -8.6,-3.5 c 1.5,3.2 4.2,5.8 7.7,7.3 7.6,3.1 16.3,-0.4 19.4,-8 1.5,-3.7 1.5,-7.7 0,-11.4 -1.5,-3.7 -4.4,-6.5 -8,-8.1 -3.6,-1.5 -7.5,-1.5 -10.9,-0.2 l 8.9,3.7 c 5.6,2.3 8.2,8.7 5.9,14.3 -2.4,5.6 -8.8,8.3 -14.4,5.9" id="path2" />
                <path class="st0" d="m 178.5,97 c 0,-9.7 -7.9,-17.6 -17.6,-17.6 -9.7,0 -17.6,7.9 -17.6,17.6 0,9.7 7.9,17.6 17.6,17.6 9.7,0 17.6,-7.9 17.6,-17.6 m -30.7,0 c 0,-7.3 5.9,-13.2 13.2,-13.2 7.3,0 13.2,5.9 13.2,13.2 0,7.3 -5.9,13.2 -13.2,13.2 -7.3,0 -13.2,-5.9 -13.2,-13.2" id="path3" />
                <path class="st0" d="m 282.5,93 -4.7,8.2 c -3.6,-2.5 -8.5,-4 -12.8,-4 -4.9,0 -7.9,2 -7.9,5.6 0,4.4 5.4,5.4 13.3,8.3 8.6,3 13.5,6.6 13.5,14.4 0,10.7 -8.4,16.8 -20.6,16.8 -5.9,0 -13.1,-1.5 -18.5,-4.9 l 3.4,-9.1 c 4.5,2.4 9.8,3.7 14.5,3.7 6.4,0 9.5,-2.4 9.5,-5.9 0,-4 -4.6,-5.2 -12.1,-7.7 -8.5,-2.9 -14.5,-6.6 -14.5,-15.3 0,-9.8 7.8,-15.4 19.1,-15.4 7.9,0.1 14.3,2.6 17.8,5.3" id="path4" />
                <polygon class="st0" points="335.1,98.2 319.1,98.2 319.1,141.4 308.1,141.4 308.1,98.2 292.1,98.2 292.1,88.7 335.1,88.7 " id="polygon4" />
                <polygon class="st0" points="382.8,141.4 347.3,141.4 347.3,88.7 382.8,88.7 382.8,98.2 358.3,98.2 358.3,110 379.4,110 379.4,119.5 358.3,119.5 358.3,131.9 382.8,131.9 " id="polygon5" />
                <path class="st0" d="m 407.4,131.2 -3.5,10.2 h -11.6 l 19.8,-52.7 h 11.1 l 20.3,52.7 h -12 l -3.6,-10.2 z m 10.2,-29.9 -7.2,21.1 H 425 Z" id="path5" />
                <polygon class="st0" points="485.8,139.9 479.5,139.9 465.4,109.4 465.4,141.4 454.8,141.4 454.8,88.7 465.3,88.7 483,126.8 500.1,88.7 510.8,88.7 510.8,141.4 500.2,141.4 500.2,109.1 " id="polygon6" />
                <path class="st0" d="m 532.1,95.4 c 0,4.5 -3.4,7.3 -7.3,7.3 -3.9,0 -7.3,-2.8 -7.3,-7.3 0,-4.5 3.4,-7.3 7.3,-7.3 3.9,-0.1 7.3,2.7 7.3,7.3 m -13.4,0 c 0,3.8 2.7,6.2 6.1,6.2 3.3,0 6.1,-2.4 6.1,-6.2 0,-3.8 -2.7,-6.1 -6.1,-6.1 -3.3,-0.1 -6.1,2.3 -6.1,6.1 m 6.2,-3.8 c 1.9,0 2.5,1 2.5,2.1 0,1 -0.6,1.7 -1.3,2 l 1.7,3.2 h -1.4 L 525,96.1 h -1.5 v 2.8 h -1.2 v -7.2 h 2.6 z m -1.4,3.4 h 1.3 c 0.8,0 1.3,-0.5 1.3,-1.2 0,-0.7 -0.4,-1.1 -1.3,-1.1 h -1.3 z" id="path6" />
              </g>
            </svg>`:""}
        ${t.attributes.game?I`<div class="steam-game">${t.attributes.game}</div>`:""}
      </div>
    `}getState(t,e){return t&&t.state?t.state:e}getAttr(t,e,s){return t&&t.attributes?t.attributes[e]:s}formatLastOnline(t){if(isNaN(parseInt(t)))return"";const e=((new Date).getTime()-new Date(t).getTime())/1e3;return e<60?`${e} sec`:e<3600?`${Math.floor(e/60)} min`:e<86400?`${Math.floor(e/60/60)} h`:e<86400?`${Math.floor(e/60/60/24)} ${this.translation("ui.components.calendar.event.repeat.interval.daily","days")}`:`${Math.floor(e/60/60/24/7)} ${this.translation("ui.components.calendar.event.repeat.interval.weekly","weeks")}`}translation(t,e){const s=this.hass.selectedLanguage||this.hass.language,i=this.hass.resources[s];return i&&i[t]?i[t]:e}renderUserAvatar(t,e){return t.attributes.entity_picture?I` <img src="${t.attributes.entity_picture.replace("_medium","_full")}" class="${e}" /> `:I` <ha-icon icon="${t.attributes.icon}" class="${e}"></ha-icon> `}static get styles(){return a`
      .card-header {
        width: 100%;
        padding-top: 0;
        padding-bottom: 8px;
      }

      .clickable {
        cursor: pointer;
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
        width: 40px;
        height: 36px;
        border-style: solid;
        border-width: 1px 1px 4px 1px;
        object-fit: cover;
        margin-bottom: 3px;
      }

      .steam-avatar.single {
        width: 50px;
        height: 50px;
        border-width: 1px 1px 5px 1px;
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
        font-weight: 600;
        width: 99%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .steam-username.offline, .steam-value.offline {
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
      }

      .user-data-container.single {
        display: inline-block;
        width: calc(100% - 76px);
        vertical-align: top;
        padding-left: 10px;        
      }

      .no-game {
        display: flex;
        align-items: center;
      }

      .steam-level.single {
        position: absolute;
        top: 56px;
        left: 56px;
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
        margin-top: 5px;
      }

      .steam-last-online-text {
        margin-left: 5px;
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

      .steam-multi:last-child {
        margin-left: 3px;
      }

      .user-row {
        width: 100%;
      }

      .steam-multi .steam-user {
        display: flex;
      }
    `}};ot=function(t,e,s,i){var n,a=arguments.length,r=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(r=(a<3?n(r):a>3?n(e,s,r):n(e,s))||r);return a>3&&r&&Object.defineProperty(e,s,r),r}([(t=>(e,s)=>{void 0!==s?s.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)})("steam-card-compact")],ot);
