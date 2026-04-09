"use client";
import { useState, useEffect } from "react";
import { format, isSameMonth, isToday } from "date-fns";
import { useCalendar } from "@/hooks/useCalendar";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";

type Theme = "warm"|"cool"|"dark";

const THEMES: {id:Theme; color:string; label:string}[] = [
  { id:"warm", color:"#c0502c", label:"Warm Parchment" },
  { id:"cool", color:"#1a5cc8", label:"Cool Slate" },
  { id:"dark", color:"#404055", label:"Midnight" },
];

const WDAYS_PRINT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const HOLIDAYS: Record<string,string> = {
  "01-01":"New Year","01-14":"Sankranti","01-26":"Republic Day",
  "03-14":"Holi","04-14":"Ambedkar Jayanti","05-12":"Buddha Purnima",
  "08-15":"Independence","08-16":"Janmashtami","10-02":"Gandhi Jayanti",
  "10-20":"Diwali","11-15":"Guru Nanak Jayanti","12-25":"Christmas",
};

export default function WallCalendar() {
  const hook = useCalendar();
  const { s, goMonth, goToday, setTheme, setView, clearSel, monthStats } = hook;
  const [mounted, setMounted] = useState(false);
  const [flipping, setFlip]   = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleNav = (dir: 1|-1) => {
    if (flipping) return;
    setFlip(true);
    goMonth(dir);
    setTimeout(()=>setFlip(false), 560);
  };

  const selLabel = () => {
    if (s.selStart && s.selEnd) {
      const diff = Math.round((s.selEnd.getTime()-s.selStart.getTime())/86400000)+1;
      return `${format(s.selStart,"MMM d")} – ${format(s.selEnd,"MMM d")}  ·  ${diff} day${diff!==1?"s":""} selected`;
    }
    if (s.selStart) return `${format(s.selStart,"EEEE, MMMM d")}  ·  drag or click another day`;
    return null;
  };

  // ── Print view ─────────────────────────────────
  if (s.view === "print") {
    return (
      <div data-theme={s.theme}>
        <div className="page">
          <div className="cal-wrap">
            <div className="cal-lift">
              <div className="binding">
                <div className="binding-track">
                  {Array.from({length:20}).map((_,i)=><div key={i} className="coil"/>)}
                </div>
              </div>
              <div className="cal-card">
                <div className="print-view">
                  <div className="print-header">
                    <div>
                      <div className="print-month-name">{format(s.month,"MMMM")}</div>
                      <div className="print-year">{format(s.month,"yyyy")}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--ink-soft)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>
                        {monthStats.days} days · {monthStats.weekends} weekends · {monthStats.holidays} holidays
                      </div>
                      <button className="print-back" onClick={()=>setView("calendar")}>
                        ← Back to Calendar
                      </button>
                    </div>
                  </div>

                  <div className="print-grid">
                    {WDAYS_PRINT.map((d,i)=>(
                      <div key={d} className="print-wday" style={i>=5?{color:"var(--accent)"}:{}}>{d}</div>
                    ))}
                    {hook.days.map(date=>{
                      const inMon = isSameMonth(date, s.month);
                      const tod   = isToday(date);
                      const dow   = (date.getDay()+6)%7;
                      const wk    = dow>=5;
                      const hol   = HOLIDAYS[format(date,"MM-dd")];
                      const dateKey = format(date,"yyyy-MM-dd");
                      const dn = s.notes.filter(n=>n.rangeStart&&dateKey>=n.rangeStart&&(!n.rangeEnd||dateKey<=n.rangeEnd));
                      let cls="print-day";
                      if (!inMon) cls+=" out";
                      if (wk&&inMon) cls+=" wk";
                      if (tod) cls+=" tod";
                      return (
                        <div key={date.toISOString()} className={cls}>
                          <div className="print-day-num">{format(date,"d")}</div>
                          {hol&&inMon&&<div className="print-holiday">{hol}</div>}
                          {dn.length>0&&<div className="print-note-dot" style={{background:dn[0].color}}/>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Notes summary for print */}
                  {s.notes.length > 0 && (
                    <div style={{marginTop:20}}>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"var(--ink-soft)",marginBottom:10}}>
                        Notes this month
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
                        {s.notes.filter(n=>{
                          if (!n.rangeStart) return false;
                          return n.rangeStart.startsWith(format(s.month,"yyyy-MM"));
                        }).map(n=>(
                          <div key={n.id} style={{
                            padding:"8px 10px",borderRadius:6,borderLeft:`3px solid ${n.color}`,
                            background:"var(--bg-sub)",fontSize:11.5,color:"var(--ink)",
                          }}>
                            <div style={{fontFamily:"var(--font-mono)",fontSize:8,color:n.color,marginBottom:3,letterSpacing:".08em",textTransform:"uppercase"}}>
                              {n.rangeStart}{n.rangeEnd&&n.rangeEnd!==n.rangeStart?` – ${n.rangeEnd}`:""}
                            </div>
                            {n.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="cal-footer">
              <span>Print View</span>
              <div className="footer-sep"/>
              <span>Interactive Wall Calendar</span>
              <div className="footer-sep"/>
              <span>{format(new Date(),"yyyy")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Calendar view ───────────────────────────────
  return (
    <div data-theme={s.theme}
      onMouseUp={()=>setDragging(false)}>
      <div className="page-glow"/>
      <div className="page">
        <div className="cal-wrap">
          <div className="cal-lift">

            {/* Binding */}
            <div className="binding">
              <div className="binding-track">
                {Array.from({length:20}).map((_,i)=><div key={i} className="coil"/>)}
              </div>
            </div>

            {/* Card */}
            <div className="cal-card"
              onMouseDown={()=>setDragging(true)}
              onMouseUp={()=>setDragging(false)}>

              {/* Hero — flip on nav */}
              <div key={`hero-${s.month.toISOString()}`} className={flipping?"flip":""}>
                <HeroImage month={s.month}/>
              </div>

              {/* Stats bar */}
              <div className="stats-bar">
                {[
                  { num: monthStats.days,     label:"Days",     cls:"" },
                  { num: monthStats.weekends, label:"Weekends", cls:"accent" },
                  { num: monthStats.holidays, label:"Holidays", cls:"gold" },
                  { num: monthStats.notes,    label:"Notes",    cls:"accent" },
                ].map(({num,label,cls})=>(
                  <div key={label} className="stat-item">
                    <div className={`stat-num ${cls}`}>{num}</div>
                    <div className="stat-lbl">{label}</div>
                  </div>
                ))}
              </div>

              {/* Keyboard shortcut hints */}
              <div className="kb-hint">
                {[
                  {keys:["←","→"], desc:"Navigate months"},
                  {keys:["T"],     desc:"Jump to today"},
                  {keys:["P"],     desc:"Print view"},
                  {keys:["Esc"],   desc:"Clear selection"},
                  {keys:["Drag"],  desc:"Select range"},
                ].map(({keys,desc},i)=>(
                  <span key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                    {i>0&&<span className="kb-sep"/>}
                    <span className="kb-item">
                      {keys.map(k=><span key={k} className="kb-key">{k}</span>)}
                      <span className="kb-desc">{desc}</span>
                    </span>
                  </span>
                ))}
              </div>

              {/* Bottom: calendar + notes */}
              <div className="bottom">

                <div className="cal-col">
                  {/* Nav */}
                  <div className="nav-row">
                    <div className="nav-left">
                      <div className="nav-month">{format(s.month,"MMMM")}</div>
                      <div className="nav-year-lbl">{format(s.month,"yyyy")}</div>
                    </div>
                    <div className="nav-right">
                      <div className="theme-row">
                        {THEMES.map(t=>(
                          <div key={t.id} className={`tdot ${s.theme===t.id?"on":""}`}
                            style={{background:t.color}} title={t.label}
                            onClick={()=>setTheme(t.id)}/>
                        ))}
                      </div>

                      {/* View toggle */}
                      <div className="view-toggle">
                        <button className="vbtn on"
                          onClick={()=>setView("calendar")}>Cal</button>
                        <button className="vbtn"
                          onClick={()=>setView("print")}>Print</button>
                      </div>

                      <button className="today-pill" onClick={goToday}>Today</button>
                      <button className="nav-btn" onClick={()=>handleNav(-1)}>‹</button>
                      <button className="nav-btn" onClick={()=>handleNav(1)}>›</button>
                    </div>
                  </div>

                  {/* Grid — flip on nav */}
                  <div key={`grid-${s.month.toISOString()}`} className={flipping?"flip":""}>
                    <CalendarGrid hook={hook} dragging={dragging}/>
                  </div>

                  {/* Sel bar or hint */}
                  {selLabel() ? (
                    <div className="sel-bar">
                      <div className="sel-pulse"/>
                      <span className="sel-txt">{selLabel()}</span>
                      <button className="sel-x" onClick={clearSel}>×</button>
                    </div>
                  ) : (
                    <div className="sel-hint">
                      Click or drag to select a date range
                    </div>
                  )}

                  {/* Legend */}
                  <div className="legend">
                    {[
                      { icon:<div style={{width:13,height:13,borderRadius:"50%",outline:"2.5px solid var(--gold)",outlineOffset:2}}/>, label:"Today" },
                      { icon:<div style={{width:13,height:13,borderRadius:"50%",background:"var(--accent)"}}/>, label:"Selected" },
                      { icon:<div style={{width:26,height:11,borderRadius:3,background:"var(--range)",border:"1px solid var(--accent-b)"}}/>, label:"Range" },
                      { icon:<div style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)"}}/>, label:"Holiday" },
                      { icon:<div style={{width:5,height:5,borderRadius:"50%",background:"var(--accent)"}}/>, label:"Event" },
                    ].map(({icon,label})=>(
                      <div key={label} className="lg">{icon}<span>{label}</span></div>
                    ))}
                  </div>
                </div>

                {/* Notes panel */}
                <NotesPanel hook={hook}/>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="cal-footer">
            <span>Interactive Wall Calendar</span>
            <div className="footer-sep"/>
            <span>{format(new Date(),"yyyy")}</span>
            <div className="footer-sep"/>
            <span>All data saved locally</span>
          </div>
        </div>
      </div>
    </div>
  );
}
