"use client";
import { useState, useCallback, useEffect } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay,
  isWithinInterval, addMonths, subMonths, format,
  isToday, isBefore, getDaysInMonth,
} from "date-fns";

export type NoteCategory = "personal" | "work" | "travel" | "health" | "reminder";

export interface CalNote {
  id: string;
  text: string;
  category: NoteCategory;
  color: string;
  createdAt: string;
  rangeStart?: string;
  rangeEnd?: string;
}

export interface CalState {
  month: Date;
  selStart: Date | null;
  selEnd:   Date | null;
  dragging: boolean;
  dragAnchor: Date | null;
  hover: Date | null;
  notes: CalNote[];
  theme: "warm" | "cool" | "dark";
  view: "calendar" | "print";
}

const INDIAN_HOLIDAYS: Record<string, string> = {
  "01-01":"New Year","01-14":"Makar Sankranti","01-26":"Republic Day",
  "03-14":"Holi","04-14":"Dr. Ambedkar Jayanti","05-12":"Buddha Purnima",
  "08-15":"Independence Day","08-16":"Janmashtami","08-27":"Onam",
  "10-02":"Gandhi Jayanti","10-12":"Dussehra","10-20":"Diwali",
  "11-01":"Diwali (alt)","11-05":"Bhai Dooj","11-15":"Guru Nanak Jayanti",
  "12-25":"Christmas",
};

export const CAT_META: Record<NoteCategory, { label: string; icon: string; color: string }> = {
  personal:  { label: "Personal",  icon: "👤", color: "#c0502c" },
  work:      { label: "Work",      icon: "💼", color: "#1a5cc8" },
  travel:    { label: "Travel",    icon: "✈️", color: "#2a8a5a" },
  health:    { label: "Health",    icon: "🌿", color: "#8a4aba" },
  reminder:  { label: "Reminder",  icon: "🔔", color: "#c89a3a" },
};

function calDays(month: Date) {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end:   endOfWeek(endOfMonth(month),     { weekStartsOn: 1 }),
  });
}

export function useCalendar() {
  const [s, setS] = useState<CalState>({
    month: new Date(),
    selStart: null, selEnd: null,
    dragging: false, dragAnchor: null, hover: null,
    notes: [],
    theme: "warm",
    view: "calendar",
  });

  // Persist notes + theme
  useEffect(() => {
    try {
      const n = localStorage.getItem("wc-notes-v2");
      const t = localStorage.getItem("wc-theme") as CalState["theme"] | null;
      setS(p => ({
        ...p,
        notes: n ? JSON.parse(n) : [],
        theme: t || "warm",
      }));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("wc-notes-v2", JSON.stringify(s.notes)); } catch {}
  }, [s.notes]);

  useEffect(() => {
    try { localStorage.setItem("wc-theme", s.theme); } catch {}
  }, [s.theme]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft")  setS(p => ({ ...p, month: subMonths(p.month, 1), selStart: null, selEnd: null }));
      if (e.key === "ArrowRight") setS(p => ({ ...p, month: addMonths(p.month, 1), selStart: null, selEnd: null }));
      if (e.key === "Escape")     setS(p => ({ ...p, selStart: null, selEnd: null, dragging: false }));
      if (e.key === "t" || e.key === "T") setS(p => ({ ...p, month: new Date() }));
      if (e.key === "p" || e.key === "P") setS(p => ({ ...p, view: p.view === "print" ? "calendar" : "print" }));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const goMonth = useCallback((dir: 1 | -1) =>
    setS(p => ({ ...p, month: dir===1 ? addMonths(p.month,1) : subMonths(p.month,1), selStart:null, selEnd:null, dragging:false }))
  , []);

  const goToday = useCallback(() =>
    setS(p => ({ ...p, month: new Date(), selStart:null, selEnd:null }))
  , []);

  const setTheme = useCallback((theme: CalState["theme"]) =>
    setS(p => ({ ...p, theme }))
  , []);

  const setView = useCallback((view: CalState["view"]) =>
    setS(p => ({ ...p, view }))
  , []);

  // Drag-to-select handlers
  const onDayMouseDown = useCallback((date: Date) => {
    setS(p => ({
      ...p,
      dragging: true,
      dragAnchor: date,
      selStart: date,
      selEnd: null,
    }));
  }, []);

  const onDayMouseEnter = useCallback((date: Date) => {
    setS(p => {
      if (p.dragging && p.dragAnchor) {
        const [a, b] = isBefore(date, p.dragAnchor) ? [date, p.dragAnchor] : [p.dragAnchor, date];
        return { ...p, selStart: a, selEnd: b, hover: date };
      }
      return { ...p, hover: date };
    });
  }, []);

  const onDayMouseUp = useCallback((date: Date) => {
    setS(p => {
      if (!p.dragging || !p.dragAnchor) return { ...p, dragging: false };
      const [a, b] = isBefore(date, p.dragAnchor) ? [date, p.dragAnchor] : [p.dragAnchor, date];
      return { ...p, dragging: false, dragAnchor: null, selStart: a, selEnd: b };
    });
  }, []);

  const onMouseLeave = useCallback(() =>
    setS(p => ({ ...p, hover: null }))
  , []);

  const clearSel = useCallback(() =>
    setS(p => ({ ...p, selStart: null, selEnd: null }))
  , []);

  const addNote = useCallback((text: string, category: NoteCategory, start?: Date, end?: Date) => {
    if (!text.trim()) return;
    const note: CalNote = {
      id: Date.now().toString(),
      text: text.trim(),
      category,
      color: CAT_META[category].color,
      createdAt: new Date().toISOString(),
      rangeStart: start ? format(start, "yyyy-MM-dd") : undefined,
      rangeEnd:   end   ? format(end,   "yyyy-MM-dd") : undefined,
    };
    setS(p => ({ ...p, notes: [note, ...p.notes] }));
  }, []);

  const deleteNote = useCallback((id: string) =>
    setS(p => ({ ...p, notes: p.notes.filter(n => n.id !== id) }))
  , []);

  const getDayInfo = useCallback((date: Date) => {
    const inMonth = isSameMonth(date, s.month);
    const today   = isToday(date);
    const holiday = INDIAN_HOLIDAYS[format(date, "MM-dd")] || null;
    const isStart = !!s.selStart && isSameDay(date, s.selStart);
    const isEnd   = !!s.selEnd   && isSameDay(date, s.selEnd);
    const dow = (date.getDay() + 6) % 7; // 0=Mon
    const isWknd = dow >= 5;

    let inRange = false;
    if (s.selStart && s.selEnd) {
      inRange = isWithinInterval(date, { start: s.selStart, end: s.selEnd })
        && !isSameDay(date, s.selStart) && !isSameDay(date, s.selEnd);
    }

    // Notes on this date
    const dateKey = format(date, "yyyy-MM-dd");
    const dayNotes = s.notes.filter(n => {
      if (!n.rangeStart) return false;
      if (!n.rangeEnd) return n.rangeStart === dateKey;
      return dateKey >= n.rangeStart && dateKey <= n.rangeEnd;
    });

    return { inMonth, today, holiday, isStart, isEnd, inRange, isWknd, dayNotes };
  }, [s]);

  // Monthly stats
  const monthStats = (() => {
    const days = getDaysInMonth(s.month);
    const notesThisMonth = s.notes.filter(n => {
      if (!n.rangeStart) return false;
      const m = format(s.month, "yyyy-MM");
      return n.rangeStart.startsWith(m);
    }).length;
    const holidays = Object.entries(INDIAN_HOLIDAYS)
      .filter(([k]) => k.startsWith(format(s.month, "MM"))).length;
    const weekends = calDays(s.month).filter(d => {
      const dow = (d.getDay() + 6) % 7;
      return isSameMonth(d, s.month) && dow >= 5;
    }).length;
    return { days, notes: notesThisMonth, holidays, weekends };
  })();

  return {
    s, goMonth, goToday, setTheme, setView,
    days: calDays(s.month),
    onDayMouseDown, onDayMouseEnter, onDayMouseUp, onMouseLeave,
    clearSel, addNote, deleteNote, getDayInfo,
    monthStats,
    HOLIDAYS: INDIAN_HOLIDAYS,
  };
}
