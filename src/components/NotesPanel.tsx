"use client";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useCalendar, CalNote, NoteCategory, CAT_META } from "@/hooks/useCalendar";

export default function NotesPanel({ hook }: { hook: ReturnType<typeof useCalendar> }) {
  const { s, addNote, deleteNote } = hook;
  const [text, setText]       = useState("");
  const [cat, setCat]         = useState<NoteCategory>("personal");
  const [attach, setAttach]   = useState(false);
  const [filterCat, setFilter]= useState<NoteCategory|"all">("all");

  const hasStart = !!s.selStart;

  const handleAdd = () => {
    if (!text.trim()) return;
    addNote(
      text,
      cat,
      attach && hasStart && s.selStart ? s.selStart : undefined,
      attach && hasStart && s.selEnd   ? s.selEnd   : undefined,
    );
    setText("");
  };

  const fmtNote = (n: CalNote) => {
    if (n.rangeStart) {
      const st = format(parseISO(n.rangeStart), "MMM d");
      const en = n.rangeEnd ? format(parseISO(n.rangeEnd), "MMM d") : null;
      return en && en !== st ? `${st} – ${en}` : st;
    }
    return format(parseISO(n.createdAt), "MMM d");
  };

  const rangeSub = () => {
    if (!s.selStart) return null;
    if (s.selEnd) {
      const diff = Math.round((s.selEnd.getTime()-s.selStart.getTime())/86400000)+1;
      return `${format(s.selStart,"MMM d")} – ${format(s.selEnd,"MMM d")} · ${diff}d`;
    }
    return format(s.selStart,"MMM d, yyyy");
  };

  const filtered = filterCat==="all"
    ? s.notes
    : s.notes.filter(n=>n.category===filterCat);

  return (
    <div className="notes-col">
      {/* Header */}
      <div className="notes-hdr">
        <div className="notes-hdr-row">
          <div className="notes-title">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="4" y1="5"   x2="10" y2="5"   stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="4" y1="7.5" x2="10" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="4" y1="10"  x2="7.5" y2="10"  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Notes
          </div>
          {s.notes.length > 0 && (
            <div className="notes-count">{s.notes.length}</div>
          )}
        </div>
        {rangeSub() && <div className="notes-sub">{rangeSub()}</div>}
      </div>

      {/* Category filter tabs */}
      <div className="cat-tabs">
        <button className={`cat-tab ${filterCat==="all"?"on":""}`} onClick={()=>setFilter("all")}>
          All
        </button>
        {(Object.entries(CAT_META) as [NoteCategory, typeof CAT_META[NoteCategory]][]).map(([id,m])=>(
          <button key={id} className={`cat-tab ${filterCat===id?"on":""}`}
            style={filterCat===id ? {background:m.color,borderColor:m.color} : {}}
            onClick={()=>setFilter(id)}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="notes-inp">
        <textarea className="notes-ta" rows={3} value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))handleAdd();}}
          placeholder={hasStart?"Note for this range…":"Jot something down…"}
        />

        {/* Category selector row */}
        <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
          {(Object.entries(CAT_META) as [NoteCategory, typeof CAT_META[NoteCategory]][]).map(([id,m])=>(
            <button key={id}
              style={{
                fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:".08em",
                padding:"3px 7px",borderRadius:10,cursor:"pointer",
                border:`1px solid ${cat===id?m.color:"var(--line)"}`,
                background: cat===id ? m.color : "var(--bg-card)",
                color: cat===id ? "#fff" : "var(--ink-soft)",
                transition:"all .14s",
              }}
              onClick={()=>setCat(id)}>
              {m.icon}
            </button>
          ))}
        </div>

        {hasStart && (
          <label className="attach-row" style={{cursor:"pointer"}}>
            <input type="checkbox" checked={attach} onChange={e=>setAttach(e.target.checked)}
              style={{width:11,height:11,accentColor:"var(--accent)"}}/>
            <span className="attach-lbl">Attach to selection</span>
          </label>
        )}

        <button className="add-btn" onClick={handleAdd} disabled={!text.trim()}>
          + Add Note
          <span style={{opacity:.65,fontSize:9,fontFamily:"var(--font-mono)"}}>⌘↵</span>
        </button>
      </div>

      {/* Notes list */}
      <div className="notes-list">
        {filtered.length===0 ? (
          <div className="notes-empty">
            <div className="empty-icon">
              {filterCat==="all" ? "📝" : CAT_META[filterCat as NoteCategory].icon}
            </div>
            <p className="empty-txt">
              {filterCat==="all"
                ? "No notes yet.\nSelect dates and start writing."
                : `No ${CAT_META[filterCat as NoteCategory].label.toLowerCase()} notes yet.`}
            </p>
          </div>
        ) : filtered.map(note=>(
          <div key={note.id} className="note-card"
            style={{borderLeftColor:note.color}}>
            <div className="note-cat-badge" style={{color:note.color}}>
              {CAT_META[note.category].icon} {CAT_META[note.category].label}
            </div>
            <p className="note-body">{note.text}</p>
            <p className="note-foot">{fmtNote(note)}</p>
            <button className="note-del" onClick={()=>deleteNote(note.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
