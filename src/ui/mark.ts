// The app mark — one SVG for the welcome screen and (via scripts/icon.ts) src/icon.png.
export const MARK =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34467a"/><stop offset="1" stop-color="#101731"/></linearGradient>
<radialGradient id="glow" cx="0.5" cy="0.44" r="0.5"><stop offset="0" stop-color="#ffcf70" stop-opacity="0.42"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
<linearGradient id="page" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8e6"/><stop offset="1" stop-color="#ecd9ad"/></linearGradient>
</defs>
<rect width="512" height="512" rx="112" fill="url(#bg)"/>
<circle cx="256" cy="226" r="220" fill="url(#glow)"/>
<path d="M256 178C206 146 146 140 94 156V368C146 352 206 356 256 388Z" fill="url(#page)" stroke="#c99a45" stroke-width="7" stroke-linejoin="round"/>
<path d="M256 178C306 146 366 140 418 156V368C366 352 306 356 256 388Z" fill="url(#page)" stroke="#c99a45" stroke-width="7" stroke-linejoin="round"/>
<g stroke="#caa865" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.8">
<path d="M126 198C160 190 196 194 226 210"/><path d="M126 236C160 228 196 232 226 248"/><path d="M126 274C160 266 196 270 226 286"/><path d="M126 312C160 304 196 308 226 324"/>
<path d="M386 198C352 190 316 194 286 210"/><path d="M386 236C352 228 316 232 286 248"/><path d="M386 274C352 266 316 270 286 286"/><path d="M386 312C352 304 316 308 286 324"/>
</g>
<path d="M256 178V388" stroke="#b8852f" stroke-width="7" stroke-linecap="round"/>
<path d="M256 52C261 86 270 95 302 100C270 105 261 114 256 148C251 114 242 105 210 100C242 95 251 86 256 52Z" fill="#ffe3a3"/>
</svg>`;
