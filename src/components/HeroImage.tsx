"use client";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

const SCENES: Record<number, {
  bg: string; season: string; weather: string; label: string;
  svg: string; particleColor: string; particleType: "snow"|"rain"|"stars"|"fireflies"|"petals"|"dust"|"none";
}> = {
  0: {
    bg: "linear-gradient(160deg,#071828 0%,#0e2a42 40%,#163355 100%)",
    season: "Winter", weather: "❄ Frost", label: "Frozen Peaks",
    particleColor: "rgba(220,235,255,",
    particleType: "snow",
    svg: `
      <circle cx="720" cy="65" r="50" fill="rgba(255,248,200,.88)"/>
      <circle cx="720" cy="65" r="68" fill="rgba(255,248,200,.14)"/>
      <circle cx="720" cy="65" r="88" fill="rgba(255,248,200,.07)"/>
      ${[60,170,280,400,530,650,780,870].map((x,i)=>`<circle cx="${x}" cy="${25+i*8}" r="1.5" fill="white" opacity="${.5+i*.06}"/>`).join('')}
      ${[120,220,350,480,600,740].map((x,i)=>`<circle cx="${x}" cy="${45+i*5}" r="1" fill="white" opacity=".6"/>`).join('')}
      <polygon points="0,290 90,110 200,270 310,90 440,210 550,65 680,195 800,55 900,180 900,360 0,360" fill="rgba(20,45,85,.68)"/>
      <polygon points="0,360 100,170 215,310 340,110 470,240 580,80 700,220 840,70 900,195 900,360" fill="rgba(10,28,65,.82)"/>
      <polygon points="340,110 375,175 305,175" fill="rgba(220,235,255,.78)"/>
      <polygon points="580,80 614,140 546,140" fill="rgba(215,232,255,.72)"/>
      <polygon points="840,70 868,125 812,125" fill="rgba(218,234,255,.68)"/>
      <rect x="0" y="332" width="900" height="28" fill="rgba(200,220,255,.16)"/>
    `
  },
  1: {
    bg: "linear-gradient(175deg,#060a18 0%,#0c1030 50%,#050c1e 100%)",
    season: "Winter", weather: "✦ Aurora", label: "Aurora Night",
    particleColor: "rgba(200,240,210,",
    particleType: "stars",
    svg: `
      ${[55,145,230,360,480,590,710,820,890,100,270,420,650,780].map((x,i)=>`<circle cx="${x}" cy="${18+i*12}" r="${i%2===0?1.8:1.1}" fill="white" opacity="${(.55+i%4*.1).toFixed(2)}"/>`).join('')}
      <path d="M-20,125 Q160,80 340,118 Q510,155 680,100 Q800,63 920,118 L920,185 Q800,118 680,155 Q510,200 340,165 Q160,130 -20,175Z" fill="rgba(60,200,150,.2)"/>
      <path d="M-20,162 Q190,120 390,158 Q560,190 740,140 Q840,116 920,155 L920,218 Q840,168 740,195 Q560,240 390,205 Q190,168 -20,210Z" fill="rgba(100,80,220,.16)"/>
      <path d="M-20,200 Q200,163 420,198 Q620,230 820,180 Q875,163 920,192 L920,252 Q875,215 820,232 Q620,278 420,248 Q200,215 -20,252Z" fill="rgba(50,160,210,.13)"/>
      <path d="M0,305 Q450,285 900,305 L900,360 L0,360Z" fill="rgba(40,80,160,.28)"/>
      <path d="M0,318 Q450,300 900,318" stroke="rgba(80,160,255,.28)" stroke-width="1.5" fill="none"/>
    `
  },
  2: {
    bg: "linear-gradient(150deg,#ead8f0 0%,#d8c4ec 40%,#c8b4e8 100%)",
    season: "Spring", weather: "🌸 Bloom", label: "Cherry Blossom",
    particleColor: "rgba(255,160,185,",
    particleType: "petals",
    svg: `
      <ellipse cx="200" cy="72" rx="95" ry="38" fill="rgba(255,255,255,.42)"/>
      <ellipse cx="680" cy="55" rx="110" ry="40" fill="rgba(255,255,255,.35)"/>
      <line x1="150" y1="360" x2="162" y2="125" stroke="rgba(80,40,22,.44)" stroke-width="11" stroke-linecap="round"/>
      <line x1="162" y1="198" x2="98"  y2="122" stroke="rgba(80,40,22,.36)" stroke-width="7"  stroke-linecap="round"/>
      <line x1="162" y1="165" x2="228" y2="92"  stroke="rgba(80,40,22,.34)" stroke-width="6"  stroke-linecap="round"/>
      <line x1="162" y1="148" x2="138" y2="80"  stroke="rgba(80,40,22,.28)" stroke-width="5"  stroke-linecap="round"/>
      ${[[88,105,32],[138,80,26],[195,74,30],[238,88,24],[120,98,20],[172,115,22]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,148,175,.74)"/><circle cx="${x}" cy="${y}" r="${(r as number)*.4}" fill="rgba(255,205,215,.9)"/>`).join('')}
      <line x1="710" y1="360" x2="720" y2="138" stroke="rgba(80,40,22,.40)" stroke-width="10" stroke-linecap="round"/>
      <line x1="720" y1="205" x2="790" y2="132" stroke="rgba(80,40,22,.34)" stroke-width="6" stroke-linecap="round"/>
      <line x1="720" y1="172" x2="655" y2="100" stroke="rgba(80,40,22,.30)" stroke-width="5" stroke-linecap="round"/>
      ${[[656,92,26],[705,70,30],[762,84,26],[798,102,22],[680,110,18]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,152,178,.72)"/><circle cx="${x}" cy="${y}" r="${(r as number)*.38}" fill="rgba(255,200,212,.88)"/>`).join('')}
      <line x1="450" y1="360" x2="450" y2="172" stroke="rgba(80,40,22,.32)" stroke-width="8" stroke-linecap="round"/>
      ${[[418,155,26],[450,135,32],[482,155,26]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,155,180,.55)"/>`).join('')}
      <path d="M0,315 Q450,295 900,315 L900,360 L0,360Z" fill="rgba(185,108,148,.2)"/>
    `
  },
  3: {
    bg: "linear-gradient(168deg,#50a8e0 0%,#72c2f0 38%,#95d8ff 100%)",
    season: "Spring", weather: "☀ Sunny", label: "Golden Fields",
    particleColor: "rgba(255,255,200,",
    particleType: "dust",
    svg: `
      <circle cx="740" cy="88" r="65" fill="rgba(255,228,80,.9)"/>
      <circle cx="740" cy="88" r="82" fill="rgba(255,228,80,.2)"/>
      <circle cx="740" cy="88" r="102" fill="rgba(255,228,80,.09)"/>
      <ellipse cx="195" cy="80" rx="100" ry="36" fill="rgba(255,255,255,.78)"/>
      <ellipse cx="148" cy="88" rx="68"  ry="28" fill="rgba(255,255,255,.72)"/>
      <ellipse cx="450" cy="62" rx="82"  ry="30" fill="rgba(255,255,255,.62)"/>
      <ellipse cx="412" cy="70" rx="56"  ry="24" fill="rgba(255,255,255,.58)"/>
      <path d="M-20,238 Q115,188 288,218 Q462,248 640,202 Q760,170 920,215 L920,360 L-20,360Z" fill="rgba(72,162,72,.58)"/>
      <path d="M-20,272 Q108,232 268,255 Q428,278 600,244 Q720,220 920,265 L920,360 L-20,360Z" fill="rgba(50,138,50,.68)"/>
      <path d="M-20,300 Q160,278 345,295 Q528,312 700,280 Q800,264 920,295 L920,360 L-20,360Z" fill="rgba(38,118,42,.74)"/>
      <rect x="0" y="330" width="900" height="30" fill="rgba(32,105,38,.78)"/>
      ${[65,180,295,415,540,660,780].map((x,i)=>`<circle cx="${x}" cy="300" r="5" fill="${['rgba(255,220,50,.8)','rgba(255,80,100,.7)','rgba(255,255,255,.85)'][i%3]}"/>`).join('')}
    `
  },
  4: {
    bg: "linear-gradient(168deg,#0a4878 0%,#0e6098 35%,#1278b5 65%,#18a0d0 100%)",
    season: "Summer", weather: "🌊 Coastal", label: "Ocean Horizon",
    particleColor: "rgba(180,230,255,",
    particleType: "none",
    svg: `
      <circle cx="128" cy="90" r="62" fill="rgba(255,200,80,.6)"/>
      <circle cx="128" cy="90" r="80" fill="rgba(255,195,70,.18)"/>
      <rect x="0" y="185" width="900" height="18" fill="rgba(255,205,95,.1)"/>
      <path d="M-20,196 Q98,178 205,196 Q325,214 452,190 Q572,168 695,188 Q795,202 920,186 L920,228 Q795,242 695,226 Q572,208 452,232 Q325,252 205,234 Q98,218 -20,232Z" fill="rgba(8,48,118,.5)"/>
      <path d="M-20,228 Q130,210 268,228 Q412,246 562,222 Q685,202 920,228 L920,272 Q685,248 562,270 Q412,290 268,272 Q130,254 -20,272Z" fill="rgba(6,38,100,.56)"/>
      <path d="M-20,262 Q162,245 332,262 Q502,278 665,252 Q778,234 920,258 L920,310 Q778,286 665,305 Q502,325 332,308 Q162,292 -20,308Z" fill="rgba(4,28,88,.62)"/>
      <rect x="0" y="298" width="900" height="62" fill="rgba(3,20,65,.72)"/>
      ${[[60,235],[290,224],[520,240],[730,226]].map(([x,y])=>`<path d="M${x},${y} Q${(x as number)+16},${(y as number)-9} ${(x as number)+33},${y}" stroke="rgba(255,255,255,.4)" stroke-width="1.8" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M88,228 L175,360" stroke="rgba(255,210,80,.24)" stroke-width="22" stroke-linecap="round"/>
    `
  },
  5: {
    bg: "linear-gradient(158deg,#c02858 0%,#e05520 28%,#f08e18 54%,#f8be38 80%,#e89525 100%)",
    season: "Summer", weather: "🌴 Tropical", label: "Monsoon Sunset",
    particleColor: "rgba(255,200,80,",
    particleType: "dust",
    svg: `
      <circle cx="450" cy="145" r="72" fill="rgba(255,255,200,.8)"/>
      <circle cx="450" cy="145" r="90" fill="rgba(255,255,200,.2)"/>
      <circle cx="450" cy="145" r="112" fill="rgba(255,255,200,.08)"/>
      <rect x="0" y="232" width="900" height="12" fill="rgba(255,200,80,.18)"/>
      <rect x="0" y="278" width="900" height="82" fill="rgba(95,25,8,.52)"/>
      <path d="M200,295 L650,360" stroke="rgba(255,200,80,.3)" stroke-width="32" stroke-linecap="round"/>
      <path d="M-20,270 Q205,235 420,265 Q628,290 920,255 L920,360 L-20,360Z" fill="#180a02"/>
      <line x1="88"  y1="360" x2="105" y2="148" stroke="#180a02" stroke-width="11" stroke-linecap="round"/>
      <path d="M105,152 Q68,96 30,80"   stroke="#180a02" stroke-width="6.5" fill="none" stroke-linecap="round"/>
      <path d="M105,152 Q122,94 162,78"  stroke="#180a02" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <path d="M105,152 Q82,105 55,118"  stroke="#180a02" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <line x1="808" y1="360" x2="795" y2="152" stroke="#180a02" stroke-width="10" stroke-linecap="round"/>
      <path d="M795,156 Q838,102 878,90"  stroke="#180a02" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M795,156 Q760,100 738,85"  stroke="#180a02" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M795,156 Q820,108 848,122" stroke="#180a02" stroke-width="4" fill="none" stroke-linecap="round"/>
    `
  },
  6: {
    bg: "linear-gradient(168deg,#040e06 0%,#081c0e 50%,#051408 100%)",
    season: "Monsoon", weather: "✦ Firefly", label: "Firefly Hollow",
    particleColor: "rgba(200,255,100,",
    particleType: "fireflies",
    svg: `
      ${[72,192,368,548,715,818].map((x,i)=>`
        <line x1="${x}" y1="360" x2="${x+5}" y2="${72+i*12}" stroke="rgba(18,48,18,.82)" stroke-width="${11-i}" stroke-linecap="round"/>
        <ellipse cx="${x+5}" cy="${75+i*12}" rx="${65+i*5}" ry="${52+i*5}" fill="rgba(12,48,16,.78)"/>
      `).join('')}
      ${Array.from({length:20},(_,i)=>{
        const x=(i*167+55)%840+30; const y=(i*91+50)%260+30;
        return `<circle cx="${x}" cy="${y}" r="4.5" fill="rgba(210,255,100,.96)"/><circle cx="${x}" cy="${y}" r="12" fill="rgba(180,255,80,.22)"/>`;
      }).join('')}
      <path d="M0,320 Q450,305 900,320 L900,360 L0,360Z" fill="rgba(6,26,8,.92)"/>
    `
  },
  7: {
    bg: "linear-gradient(162deg,#130a02 0%,#221408 40%,#321e10 100%)",
    season: "Monsoon", weather: "🌕 Harvest", label: "Harvest Moon",
    particleColor: "rgba(255,220,100,",
    particleType: "dust",
    svg: `
      <circle cx="668" cy="105" r="78" fill="rgba(255,210,95,.9)"/>
      <circle cx="668" cy="105" r="96" fill="rgba(255,195,75,.18)"/>
      <circle cx="668" cy="105" r="116" fill="rgba(255,185,60,.07)"/>
      <ellipse cx="645" cy="88"  rx="20" ry="15" fill="rgba(200,145,35,.4)"/>
      <ellipse cx="698" cy="115" rx="15" ry="11" fill="rgba(200,145,35,.32)"/>
      <path d="M-20,245 Q148,205 328,232 Q508,260 690,215 Q795,190 920,232 L920,360 L-20,360Z" fill="rgba(36,20,5,.82)"/>
      ${Array.from({length:30},(_,i)=>{
        const x=i*31+8; const h=72+Math.sin(i*.9)*18;
        return `<line x1="${x}" y1="360" x2="${x+4}" y2="${360-h}" stroke="rgba(200,148,45,.65)" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="${x+5}" cy="${360-h-10}" rx="4" ry="14" fill="rgba(185,135,38,.7)" transform="rotate(-8,${x+5},${360-h-10})"/>`;
      }).join('')}
    `
  },
  8: {
    bg: "linear-gradient(158deg,#1a2c1a 0%,#263625 45%,#1a2c28 100%)",
    season: "Autumn", weather: "🌫 Misty", label: "Misty Pines",
    particleColor: "rgba(200,220,195,",
    particleType: "rain",
    svg: `
      <circle cx="450" cy="90" r="52"  fill="rgba(255,218,158,.44)"/>
      <circle cx="450" cy="90" r="76"  fill="rgba(255,208,138,.18)"/>
      <path d="M-20,208 Q228,182 450,205 Q668,228 920,202 L920,255 Q668,275 450,255 Q228,232 -20,258Z" fill="rgba(198,218,194,.10)"/>
      <path d="M-20,238 Q218,215 450,238 Q682,260 920,232 L920,282 Q682,305 450,282 Q218,260 -20,285Z" fill="rgba(192,215,188,.08)"/>
      ${[22,95,178,262,355,458,562,660,752,838].map((x,i)=>{
        const h=162+i%3*28; const w=52+i%2*16;
        return `<polygon points="${x},290 ${x+w/2},${290-h} ${x+w},290" fill="rgba(18,50,22,.62)"/><polygon points="${x-8},290 ${x+w/2},${290-h+36} ${x+w+8},290" fill="rgba(14,42,18,.72)"/>`;
      }).join('')}
      ${[15,122,258,398,532,665,790].map((x,i)=>{
        const h=212+i%2*32; const w=72+i%3*14;
        return `<polygon points="${x},360 ${x+w/2},${360-h} ${x+w},360" fill="rgba(10,38,14,.88)"/>`;
      }).join('')}
    `
  },
  9: {
    bg: "linear-gradient(152deg,#180800 0%,#320e00 40%,#4e1600 80%,#3a0e00 100%)",
    season: "Autumn", weather: "🍂 Blaze", label: "Autumn Blaze",
    particleColor: "rgba(255,120,40,",
    particleType: "petals",
    svg: `
      <circle cx="450" cy="112" r="62" fill="rgba(255,185,55,.75)"/>
      <circle cx="450" cy="112" r="80" fill="rgba(255,175,45,.18)"/>
      <line x1="125" y1="360" x2="133" y2="115" stroke="rgba(58,26,8,.86)" stroke-width="14" stroke-linecap="round"/>
      <line x1="133" y1="178" x2="68"  y2="108" stroke="rgba(58,26,8,.78)" stroke-width="9"  stroke-linecap="round"/>
      <line x1="133" y1="150" x2="198" y2="82"  stroke="rgba(58,26,8,.76)" stroke-width="8"  stroke-linecap="round"/>
      ${[[58,94,44],[108,68,52],[178,78,46],[208,104,36],[80,122,32]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(222,70,25,.72)"/>`).join('')}
      <line x1="728" y1="360" x2="718" y2="120" stroke="rgba(58,26,8,.83)" stroke-width="13" stroke-linecap="round"/>
      <line x1="718" y1="182" x2="788" y2="112" stroke="rgba(58,26,8,.76)" stroke-width="8"  stroke-linecap="round"/>
      <line x1="718" y1="154" x2="652" y2="90"  stroke="rgba(58,26,8,.73)" stroke-width="7"  stroke-linecap="round"/>
      ${[[798,98,42],[748,72,50],[678,82,44],[648,108,34]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(218,62,22,.7)"/>`).join('')}
      <line x1="450" y1="360" x2="450" y2="170" stroke="rgba(55,25,6,.8)" stroke-width="11" stroke-linecap="round"/>
      ${[[418,152,34],[450,134,42],[482,154,34]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(232,82,22,.66)"/>`).join('')}
      <path d="M0,322 Q450,308 900,322 L900,360 L0,360Z" fill="rgba(32,10,2,.88)"/>
    `
  },
  10: {
    bg: "linear-gradient(168deg,#0c1420 0%,#162032 50%,#101828 100%)",
    season: "Winter", weather: "⛈ Storm", label: "November Dusk",
    particleColor: "rgba(150,175,210,",
    particleType: "rain",
    svg: `
      <ellipse cx="200" cy="88"  rx="148" ry="56" fill="rgba(78,88,108,.56)"/>
      <ellipse cx="148" cy="98"  rx="105" ry="44" fill="rgba(68,78,100,.52)"/>
      <ellipse cx="378" cy="72"  rx="155" ry="58" fill="rgba(82,92,114,.54)"/>
      <ellipse cx="658" cy="76"  rx="148" ry="56" fill="rgba(80,90,112,.52)"/>
      <ellipse cx="812" cy="90"  rx="115" ry="46" fill="rgba(68,78,102,.48)"/>
      <polyline points="555,78 540,142 560,142 534,214" stroke="rgba(220,232,255,.78)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${Array.from({length:8},(_,i)=>`<rect x="${58+i*112}" y="${225+i%3*8}" width="${40+i*12}" height="${100+i%2*15}" fill="rgba(8,14,28,.93)"/>`).join('')}
      ${Array.from({length:8},(_,i)=>`<polygon points="${46+i*112},${230+i%3*8} ${78+i*112+40/2},${230+i%3*8-45+i*3} ${118+i*112},${230+i%3*8}" fill="rgba(6,12,26,.95)"/>`).join('')}
      <rect x="0" y="325" width="900" height="35" fill="rgba(5,10,22,.9)"/>
    `
  },
  11: {
    bg: "linear-gradient(162deg,#060b18 0%,#0c1828 50%,#081224 100%)",
    season: "Winter", weather: "❄ Snow", label: "Winter Solstice",
    particleColor: "rgba(210,230,255,",
    particleType: "snow",
    svg: `
      ${Array.from({length:38},(_,i)=>{
        const x=(i*162+35)%840+28; const y=(i*95+12)%170+8; const r=i%3===0?1.9:1.1;
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${(.42+i%4*.14).toFixed(2)}"/>`;
      }).join('')}
      <path d="M-20,95 Q225,68 450,90 Q672,112 920,80 L920,135 Q672,158 450,135 Q225,112 -20,140Z" fill="rgba(58,175,138,.11)"/>
      <path d="M0,262 Q450,245 900,262 L900,360 L0,360Z" fill="rgba(178,198,228,.42)"/>
      <rect x="0" y="330" width="900" height="30" fill="rgba(205,222,248,.65)"/>
      <line x1="68" y1="360" x2="75" y2="225" stroke="rgba(58,33,10,.86)" stroke-width="9"  stroke-linecap="round"/>
      <rect x="22" y="225" width="110" height="92" fill="rgba(75,48,28,.90)"/>
      <polygon points="10,230 142,230 76,162" fill="rgba(52,32,14,.94)"/>
      <rect x="88" y="268" width="28" height="49" fill="rgba(48,28,12,.76)"/>
      <rect x="132" y="248" width="26" height="22" rx="2" fill="rgba(255,200,88,.55)"/>
      <line x1="724" y1="360" x2="732" y2="228" stroke="rgba(58,33,10,.84)" stroke-width="9"  stroke-linecap="round"/>
      <rect x="678" y="228" width="116" height="90" fill="rgba(72,45,26,.90)"/>
      <polygon points="666,233 808,233 737,164" fill="rgba(50,30,13,.94)"/>
      <rect x="702" y="272" width="30" height="46" fill="rgba(48,28,12,.74)"/>
      <rect x="748" y="250" width="26" height="20" rx="2" fill="rgba(255,200,88,.52)"/>
      <line x1="450" y1="360" x2="450" y2="248" stroke="rgba(55,32,10,.88)" stroke-width="10" stroke-linecap="round"/>
      <polygon points="450,250 390,322 510,322" fill="rgba(22,95,35,.90)"/>
      <polygon points="450,222 384,294 516,294" fill="rgba(26,108,40,.90)"/>
      <polygon points="450,196 390,268 510,268" fill="rgba(30,118,45,.92)"/>
      <polygon points="450,172 392,242 508,242" fill="rgba(33,126,48,.92)"/>
      <polygon points="450,150 394,218 506,218" fill="rgba(36,132,50,.94)"/>
      <circle cx="450" cy="150" r="7"  fill="rgba(255,222,80,.96)"/>
      ${[[398,202,4,'rgba(255,80,80,.9)'],[460,218,4,'rgba(80,180,255,.9)'],[380,255,4,'rgba(255,200,60,.9)'],[476,270,4,'rgba(100,255,120,.9)'],[404,282,4,'rgba(255,80,80,.88)']].map(([x,y,r,c])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')}
      <path d="M142,200 Q295,218 450,205" stroke="rgba(255,200,80,.42)" stroke-width="1.3" fill="none"/>
      <path d="M758,202 Q604,220 450,205" stroke="rgba(255,200,80,.40)" stroke-width="1.3" fill="none"/>
      ${[[238,214,'rgba(255,210,70,.88)'],[308,220,'rgba(255,100,80,.84)'],[374,210,'rgba(100,200,255,.84)'],[526,212,'rgba(255,210,70,.84)'],[594,218,'rgba(255,100,80,.82)'],[658,208,'rgba(100,200,255,.80)']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="3.5" fill="${c}"/>`).join('')}
    `
  },
};

// Canvas-based particle animation
function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  type: string,
  color: string,
  active: boolean
) {
  useEffect(() => {
    if (!active || type === "none") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width, H = canvas.height;

    const COUNT = type === "fireflies" ? 18 : type === "petals" ? 22 : type === "stars" ? 40 : 55;

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: type === "fireflies" ? 3 + Math.random() * 2 : type === "petals" ? 3 + Math.random() * 3 : 1.5 + Math.random() * 2,
      vx: type === "rain" ? -1.5 + Math.random() * -.5 : (Math.random() - .5) * .8,
      vy: type === "rain" ? 4 + Math.random() * 3 : type === "snow" ? .8 + Math.random() * 1.2 : type === "petals" ? .6 + Math.random() : .3 + Math.random() * .5,
      alpha: Math.random(),
      alphaDir: Math.random() > .5 ? 1 : -1,
      wobble: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.wobble += .03;
        p.x += p.vx + (type === "snow" || type === "petals" ? Math.sin(p.wobble) * .4 : 0);
        p.y += p.vy;
        p.alpha += p.alphaDir * .008;
        if (p.alpha > 1)  { p.alpha = 1;  p.alphaDir = -1; }
        if (p.alpha < .1) { p.alpha = .1; p.alphaDir =  1; }
        if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
        if (p.x > W + 10) { p.x = -10; }
        if (p.x < -10)    { p.x = W + 10; }

        if (type === "fireflies") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = color + (p.alpha * .2) + ")";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * .7, 0, Math.PI * 2);
          ctx.fillStyle = color + (p.alpha) + ")";
          ctx.fill();
        } else if (type === "rain") {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 3, p.y - 10);
          ctx.strokeStyle = color + (p.alpha * .55) + ")";
          ctx.lineWidth = .9;
          ctx.stroke();
        } else if (type === "petals") {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 1.8, p.wobble, 0, Math.PI * 2);
          ctx.fillStyle = color + (p.alpha * .72) + ")";
          ctx.fill();
        } else if (type === "stars") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * .6, 0, Math.PI * 2);
          ctx.fillStyle = color + (p.alpha * .7) + ")";
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * .8, 0, Math.PI * 2);
          ctx.fillStyle = color + (p.alpha * .55) + ")";
          ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [type, color, active]);
}

export default function HeroImage({ month }: { month: Date }) {
  const idx = month.getMonth();
  const sc  = SCENES[idx];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef, sc.particleType, sc.particleColor, true);

  return (
    <div className="hero" style={{ background: sc.bg }}>
      {/* Static SVG scene */}
      <svg className="hero-svg" viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: sc.svg }}/>

      {/* Animated particle canvas */}
      <canvas ref={canvasRef} className="hero-particles"
        style={{ position:"absolute",inset:0,width:"100%",height:"100%" }}/>

      {/* Overlays */}
      <div className="hero-vignette"/>
      <div className="hero-fade"/>

      {/* Season + weather chips */}
      <div className="hero-season">
        <div className="hero-season-chip">{sc.season}</div>
        <div className="hero-season-chip">{sc.weather}</div>
      </div>

      {/* Month number badge */}
      <div className="hero-badge">
        <div className="hero-badge-num">{String(idx+1).padStart(2,"0")}</div>
        <div className="hero-badge-sub">month</div>
      </div>

      {/* Bottom left text */}
      <div className="hero-text">
        <div className="hero-tag">{sc.label}</div>
        <div className="hero-month">{format(month,"MMMM")}</div>
        <div className="hero-year">{format(month,"yyyy")}</div>
      </div>
    </div>
  );
}
