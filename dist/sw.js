if(!self.define){let e,i={};const r=(r,n)=>(r=new URL(r+".js",n).href,i[r]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=i,document.head.appendChild(e)}else e=r,importScripts(r),i()})).then((()=>{let e=i[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(n,o)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let c={};const d=e=>r(e,s),f={module:{uri:s},exports:c,require:d};i[s]=Promise.all(n.map((e=>f[e]||d(e)))).then((e=>(o(...e),c)))}}define(["./workbox-b8ba324e"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"android-chrome-192x192.png",revision:"7b008758f976036f31bb9f60607ee7b2"},{url:"android-chrome-512x512.png",revision:"fc4972937d8cfd5543821394b47fe0e0"},{url:"apple-touch-icon.png",revision:"7c7a179a93fc849e2da4619fafbe9d01"},{url:"browserconfig.xml",revision:"974ad5d8ffd6a63817dfeb40bbad2653"},{url:"favicon-16x16.png",revision:"f2ff399165f0def3674cfadade63a45c"},{url:"favicon-32x32.png",revision:"c40b0c05562dc43a1eda584b02464e6f"},{url:"favicon.ico",revision:"78e77098cac3918a146d561237c6da3d"},{url:"index.html",revision:"900b2e929a13b81e7b82fb6d2fd30456"},{url:"js/app.bundle.js",revision:"70e4d2daef8460e799b9e2f50444f75a"},{url:"logoCircle.png",revision:"7b008758f976036f31bb9f60607ee7b2"},{url:"manifest.webmanifest",revision:"3cd6a1661de93e58fb0c7966c851b729"},{url:"mstile-150x150.png",revision:"9f520ca5bb8d47088203b1a109fe7728"},{url:"safari-pinned-tab.svg",revision:"6c3a35ca64614bbb89ec8795668c3998"},{url:"sounds/buttonClick.mp3",revision:"7987616a293bf3de04cd673d08a497c3"},{url:"sounds/secondTick.mp3",revision:"54ee0a6e3542916a687b35e268ad3807"},{url:"sounds/timerCancelled.mp3",revision:"f64411169b5eb80062ea78b82cd146b1"},{url:"sounds/timerCompleted.mp3",revision:"219395c80b42b3af6165e1172033c51d"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/,/^source/]})}));
//# sourceMappingURL=sw.js.map
