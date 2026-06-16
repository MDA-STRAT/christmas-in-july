/* ============================================================
   Lancewood Circuit Reserve — hand-styled vector map
   Engraving aesthetic: cream linework on deep forest green,
   parkland in lighter greens, antique-gold marker.
   Traced (stylised) from the supplied area screenshot.
   ============================================================ */
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  const svg = `
  <svg viewBox="0 0 1000 660" role="img" aria-label="Map of Lancewood Circuit Reserve, Robina">
    <defs>
      <radialGradient id="mapVign" cx="42%" cy="46%" r="75%">
        <stop offset="0%" stop-color="#0d3325"/>
        <stop offset="62%" stop-color="#0a2419"/>
        <stop offset="100%" stop-color="#061812"/>
      </radialGradient>
      <linearGradient id="parkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1b5038"/>
        <stop offset="100%" stop-color="#123c2a"/>
      </linearGradient>
      <linearGradient id="reserveGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#246244"/>
        <stop offset="100%" stop-color="#184d34"/>
      </linearGradient>
      <filter id="pinGlow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="7" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <pattern id="hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="7" stroke="#c2a877" stroke-width="0.5" opacity="0.18"/>
      </pattern>
    </defs>

    <!-- ground -->
    <rect x="0" y="0" width="1000" height="660" fill="url(#mapVign)"/>

    <!-- ================= PARKLAND ================= -->
    <g class="park">
      <!-- big eastern park -->
      <path d="M812,288 C880,278 950,300 972,360 C988,420 968,500 905,524 C842,548 800,512 792,452 C786,400 770,300 812,288 Z" fill="url(#parkGrad)"/>
      <!-- mountain ash reserve (upper left) -->
      <path d="M150,206 C198,196 236,214 232,250 C228,286 196,300 166,288 C132,274 116,214 150,206 Z" fill="url(#parkGrad)"/>
      <!-- robina court reserve -->
      <path d="M276,264 C320,258 352,280 344,312 C336,344 300,352 274,338 C246,322 244,270 276,264 Z" fill="url(#parkGrad)"/>
      <!-- lower-left strip -->
      <path d="M140,600 C200,588 268,600 286,632 C300,658 268,680 214,672 C160,664 112,612 140,600 Z" fill="url(#parkGrad)"/>

      <!-- central reserve corridor (the place) -->
      <path d="M236,300
        C300,292 344,326 392,358
        C432,384 470,392 520,396
        C588,402 642,408 696,442
        C732,464 752,498 766,532
        C744,540 720,544 700,520
        C672,488 640,470 596,458
        C536,442 478,442 416,430
        C372,421 338,400 304,372
        C272,346 252,322 224,322
        C212,322 214,302 236,300 Z" fill="url(#reserveGrad)"/>
      <path d="M236,300
        C300,292 344,326 392,358
        C432,384 470,392 520,396
        C588,402 642,408 696,442
        C732,464 752,498 766,532
        C744,540 720,544 700,520
        C672,488 640,470 596,458
        C536,442 478,442 416,430
        C372,421 338,400 304,372
        C272,346 252,322 224,322
        C212,322 214,302 236,300 Z" fill="url(#hatch)"/>
      <path d="M236,300
        C300,292 344,326 392,358
        C432,384 470,392 520,396
        C588,402 642,408 696,442
        C732,464 752,498 766,532" fill="none" stroke="#3a805a" stroke-width="1.2" opacity="0.7"/>
    </g>

    <!-- watercourse through the reserve -->
    <path d="M250,312 C320,330 360,372 430,398 C500,424 560,430 640,460 C690,478 720,506 742,532"
      fill="none" stroke="#3f7d8c" stroke-width="1.6" opacity="0.45" stroke-linecap="round"/>

    <!-- ================= ROADS ================= -->
    <g class="roads" fill="none" stroke="#f3ecdb" stroke-linecap="round" stroke-linejoin="round">
      <g stroke-width="3.2" opacity="0.30">
        <!-- Goldwater Dr (spine) -->
        <path d="M540,120 C500,250 440,356 380,442 C352,482 322,512 300,548"/>
        <!-- Lancewood Cct sweep -->
        <path d="M470,408 C582,402 672,420 732,492 C778,544 796,592 800,648"/>
        <!-- Mountain Ash Circuit -->
        <path d="M138,158 C258,122 386,120 486,156"/>
        <!-- Christine Ave -->
        <path d="M724,150 C824,120 912,130 992,150"/>
      </g>
      <g stroke-width="2.1" opacity="0.24">
        <path d="M600,108 C594,182 606,252 622,302"/>
        <path d="M86,360 C172,344 254,348 326,372"/>
        <path d="M244,392 C238,440 266,474 312,482"/>
        <path d="M120,540 C208,534 282,540 344,550"/>
        <path d="M52,602 C108,588 150,584 192,584"/>
        <path d="M430,556 C433,598 438,624 442,652"/>
        <path d="M618,556 C690,554 752,558 806,566"/>
        <path d="M642,300 C700,300 760,300 812,308"/>
        <path d="M150,250 C150,300 160,340 196,360"/>
        <path d="M700,210 C760,196 820,200 880,214"/>
      </g>
      <!-- roundabouts -->
      <g stroke-width="2.1" opacity="0.30">
        <circle cx="298" cy="552" r="13"/>
        <circle cx="762" cy="150" r="14"/>
        <circle cx="806" cy="566" r="12"/>
      </g>
    </g>

    <!-- ================= LABELS ================= -->
    <g class="labels" fill="#cabf9f" font-family="'Arsenal SC', serif" letter-spacing="2.4">
      <text x="250" y="138" font-size="13" opacity="0.8" transform="rotate(-9 250 138)">MOUNTAIN ASH CIRCUIT</text>
      <text x="455" y="300" font-size="13" opacity="0.8" transform="rotate(58 455 300)">GOLDWATER DR</text>
      <text x="600" y="430" font-size="13" opacity="0.8" transform="rotate(20 600 430)">LANCEWOOD CCT</text>
      <text x="120" y="356" font-size="12" opacity="0.7">LAUREL OAK DR</text>
      <text x="828" y="142" font-size="12" opacity="0.7">CHRISTINE AVE</text>
      <text x="612" y="150" font-size="11" opacity="0.6" transform="rotate(80 612 150)">PEPPERTREE CCT</text>
      <text x="150" y="560" font-size="11" opacity="0.6">CAMPHOR WOOD CT</text>
      <text x="455" y="640" font-size="11" opacity="0.6" transform="rotate(82 455 640)">CORDATA CT</text>
      <text x="690" y="588" font-size="11" opacity="0.6">APPLEGUM CT</text>
    </g>
    <g class="park-labels" fill="#5f9a7a" font-family="'Arsenal SC', serif" letter-spacing="1.6" font-style="italic">
      <text x="138" y="252" font-size="11.5">Mountain Ash Reserve</text>
      <text x="262" y="312" font-size="11.5">Robina Court Reserve</text>
      <text x="858" y="412" font-size="11.5" text-anchor="middle">Robina parkland</text>
    </g>

    <!-- ================= MARKER ================= -->
    <g class="marker" filter="url(#pinGlow)">
      <ellipse cx="432" cy="438" rx="20" ry="6" fill="#000" opacity="0.28"/>
      <path d="M432,386 C415,386 402,399 402,416 C402,438 432,470 432,470 C432,470 462,438 462,416 C462,399 449,386 432,386 Z" fill="#c2a877"/>
      <path d="M432,386 C415,386 402,399 402,416 C402,438 432,470 432,470 C432,470 462,438 462,416 C462,399 449,386 432,386 Z" fill="none" stroke="#e9d8af" stroke-width="1"/>
      <circle cx="432" cy="415" r="8.5" fill="#0a2419"/>
      <circle cx="432" cy="415" r="3" fill="#e9d8af"/>
    </g>
    <g class="marker-label" font-family="'Arsenal SC', serif">
      <text x="432" y="498" text-anchor="middle" fill="#f3ecdb" font-size="16" letter-spacing="3">LANCEWOOD CIRCUIT</text>
      <text x="432" y="518" text-anchor="middle" fill="#c2a877" font-size="16" letter-spacing="3">RESERVE</text>
    </g>

    <!-- ================= COMPASS ================= -->
    <g class="compass" transform="translate(926,586)" opacity="0.85">
      <circle r="26" fill="none" stroke="#c2a877" stroke-width="1" opacity="0.6"/>
      <path d="M0,-22 L5,0 L0,8 L-5,0 Z" fill="#c2a877"/>
      <path d="M0,22 L5,0 L0,-8 L-5,0 Z" fill="#cabf9f" opacity="0.45"/>
      <text x="0" y="-30" text-anchor="middle" fill="#c2a877" font-family="'Arsenal SC', serif" font-size="11" letter-spacing="1">N</text>
    </g>
  </svg>`;

  function mount() {
    const el = document.getElementById('mapStage');
    if (el) el.innerHTML = svg;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
