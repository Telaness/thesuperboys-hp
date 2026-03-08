"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import { supabase } from "../../lib/supabase";

interface EventItem {
  id: string;
  title: string;
  date: string;
  detail?: string;
}

const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];
const dayLabelsEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const rows: (number | null)[][] = [];
  let current = 1 - firstDay;

  while (current <= daysInMonth) {
    const week: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (current >= 1 && current <= daysInMonth) {
        week.push(current);
      } else {
        week.push(null);
      }
      current++;
    }
    rows.push(week);
  }
  return rows;
}

export default function LiveEventPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [monthEvents, setMonthEvents] = useState<EventItem[]>([]);

  const [listPage, setListPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    async function fetchEvents() {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = month === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(month + 1).padStart(2, "0")}-01`;

      const { data } = await supabase
        .from("live_events")
        .select("id, title, date, detail")
        .gte("date", startDate)
        .lt("date", endDate)
        .order("date", { ascending: true });

      setMonthEvents(data || []);
    }
    fetchEvents();
  }, [year, month]);

  const calendarRows = getCalendarDays(year, month);

  const today = new Date().toISOString().split("T")[0];
  const futureEvents = monthEvents.filter((e) => e.date >= today);

  const totalPages = Math.max(1, Math.ceil(futureEvents.length / PER_PAGE));
  const listStart = (listPage - 1) * PER_PAGE;
  const pageEvents = futureEvents.slice(listStart, listStart + PER_PAGE);

  const prevMonth = () => {
    setListPage(1);
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    setListPage(1);
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const getDay = (dateStr: string) => new Date(dateStr).getDate();

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Header currentPath="/live-event" />

      <main className="max-w-[1200px] mx-auto px-3 sm:px-6 py-10 sm:py-16">
        {/* Heading */}
        <SectionHeading color="#e60012">LIVE / EVENT</SectionHeading>
        <p className="section-subtitle mb-16">ライブ出演情報・イベント情報</p>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-8 mb-10">
          <button
            onClick={prevMonth}
            className="text-2xl hover:opacity-60 transition-opacity px-2"
            aria-label="前月"
          >
            &lsaquo;
          </button>
          <h3 className="text-xl font-bold tracking-wide">
            {year}年{month}月
          </h3>
          <button
            onClick={nextMonth}
            className="text-2xl hover:opacity-60 transition-opacity px-2"
            aria-label="翌月"
          >
            &rsaquo;
          </button>
        </div>

        {/* Calendar */}
        <div className="w-full">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                {dayLabels.map((label, i) => (
                  <th
                    key={label}
                    className={`text-center text-xs sm:text-sm font-bold py-2 sm:py-3 w-[14.28%] ${
                      i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-700"
                    }`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendarRows.map((week, wi) => (
                <tr key={wi}>
                  {week.map((day, di) => {
                    const dayEvents = day
                      ? monthEvents.filter((e) => getDay(e.date) === day)
                      : [];
                    return (
                      <td
                        key={di}
                        className={`border border-gray-200 align-top p-0.5 sm:p-2 h-[56px] sm:h-[90px] md:h-[120px] w-[14.28%] overflow-hidden ${
                          day === null ? "bg-gray-50" : ""
                        } ${di === 0 ? "text-red-500" : di === 6 ? "text-blue-500" : ""}`}
                      >
                        {day !== null && (
                          <>
                            <div className="text-right text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">
                              {day}
                            </div>
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className="text-[9px] sm:text-[11px] leading-tight text-gray-800 mb-0.5 sm:mb-1 truncate"
                              >
                                {event.title}
                              </div>
                            ))}
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Event List */}
        {futureEvents.length > 0 && (
          <div className="mt-20">
            <h3 className="font-impact text-2xl tracking-wider uppercase mb-8">
              SCHEDULE
            </h3>
            <div className="space-y-0">
              {pageEvents.map((event) => {
                const date = new Date(event.date);
                const dow = date.getDay();
                const dowEn = dayLabelsEn[dow];
                const isSun = dow === 0;
                const isSat = dow === 6;
                const dowColor = isSun
                  ? "text-red-500"
                  : isSat
                  ? "text-blue-500"
                  : "text-gray-400";

                return (
                  <Link
                    href={`/live-event/${event.id}`}
                    key={event.id}
                    className="flex items-center gap-3 sm:gap-6 py-4 sm:py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    {/* Date block */}
                    <div className="flex items-baseline gap-1.5 sm:gap-3 shrink-0 w-[90px] sm:w-[160px]">
                      <span className="font-impact text-xl sm:text-3xl tracking-wide">
                        {month}/{getDay(event.date)}
                      </span>
                      <span className={`font-impact text-sm sm:text-lg tracking-wide ${dowColor}`}>
                        {dowEn}
                      </span>
                    </div>
                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate group-hover:text-red-600 transition-colors">
                        {event.title}
                      </p>
                    </div>
                    {/* Arrow */}
                    <span className="text-gray-300 group-hover:text-red-500 transition-colors shrink-0">
                      &rsaquo;
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 flex-wrap">
                <button
                  onClick={() => setListPage(listPage - 1)}
                  disabled={listPage === 1}
                  className="font-impact text-base sm:text-lg px-2 sm:px-3 py-1 hover:opacity-60 transition-opacity disabled:opacity-20"
                >
                  &lsaquo;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setListPage(p)}
                    className={`font-impact text-base sm:text-lg w-8 h-8 sm:w-10 sm:h-10 rounded transition-colors ${
                      p === listPage
                        ? "bg-black text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setListPage(listPage + 1)}
                  disabled={listPage === totalPages}
                  className="font-impact text-base sm:text-lg px-2 sm:px-3 py-1 hover:opacity-60 transition-opacity disabled:opacity-20"
                >
                  &rsaquo;
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
