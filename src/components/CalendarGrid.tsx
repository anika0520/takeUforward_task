"use client";
import { format, isSameMonth } from "date-fns";
import { useCalendar } from "@/hooks/useCalendar";

const WDAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function CalendarGrid({
  hook, dragging,
}: {
  hook: ReturnType<typeof useCalendar>;
  dragging: boolean;
}) {
  const { days, onDayMouseDown, onDayMouseEnter, onDayMouseUp, getDayInfo } = hook;

  return (
    <>
      <div className="wdays">
        {WDAYS.map((d,i)=>(
          <div key={d} className={`wd ${i>=5?"wk":""}`}>{d}</div>
        ))}
      </div>

      <div className={`dgrid ${dragging?"dragging":""}`}
        onMouseLeave={hook.onMouseLeave}>
        {days.map(date=>{
          const { inMonth, today, holiday, isStart, isEnd, inRange, isWknd, dayNotes } = getDayInfo(date);

          let cls="dc";
          if (!inMonth) cls+=" out";
          if (isStart)  cls+=" ds";
          if (isEnd)    cls+=" de";
          if (inRange)  cls+=" rng";
          if (today)    cls+=" tod";
          if (isWknd&&inMonth) cls+=" wk";

          return (
            <div key={date.toISOString()} className={cls}
              title={holiday||undefined}
              onMouseDown={()=>inMonth&&onDayMouseDown(date)}
              onMouseEnter={()=>inMonth&&onDayMouseEnter(date)}
              onMouseUp={()=>inMonth&&onDayMouseUp(date)}>

              <div className="dn">{format(date,"d")}</div>

              {/* Event category dots */}
              {inMonth && dayNotes.length > 0 && (
                <div className="day-dots">
                  {dayNotes.slice(0,3).map(n=>(
                    <div key={n.id} className="day-dot" style={{background:n.color}} title={n.text}/>
                  ))}
                </div>
              )}

              {/* Holiday pip */}
              {holiday && inMonth && !dayNotes.length && <div className="hpip"/>}
            </div>
          );
        })}
      </div>
    </>
  );
}
