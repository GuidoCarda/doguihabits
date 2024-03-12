import { useState } from "react";
import useUpdateHabitEntry from "../../hooks/api/useUpdateHabitEntry";
import {
  MONTHS,
  WEEK_DAYS,
  cn,
  getDatesInRange,
  getDayMonthYear,
  getMonthDatesInRange,
  getMonthString,
  isPast,
  isSameDay,
  isToday,
} from "../../utils";
import { ENTRY_STATE } from "../../constants";
import { Tooltip } from "../Habits";

const colors = [
  "fill-red-600",
  "fill-green-500",
  "fill-blue-500",
  "fill-yellow-500",
  "fill-pink-500",
  "fill-indigo-500",
  "fill-purple-500",
  "fill-cyan-500",
  "fill-rose-500",
  "fill-emerald-500",
  "fill-fuchsia-500",
  "fill-lime-500",
];

const HabitEntriesHeatmap = ({ year, id, entries }) => {
  const dates = getDatesInRange(`${year}-01-02`, `${year + 1}-1-1`).map(
    (date) => {
      const entry = entries?.find((entry) => isSameDay(entry.date, date));
      // console.log(entry);
      return entry || { date, state: ENTRY_STATE.pending };
    }
  );

  const updateEntryMutation = useUpdateHabitEntry();

  const toggleEntryState = (entryDate) => {
    updateEntryMutation.mutate({
      habitId: id,
      entryDate,
      entries,
    });
  };

  // console.log(dates);
  return (
    <div className="mt-10 w-full  ">
      <h2 className="h-10 px-10 rounded-md border border-white/10 border-emerald-600 w-max flex items-center mb-4">
        {year}
      </h2>
      <div className="grid grid-cols-12 gap-1 text-zinc-400  ml-10">
        {getMonthDatesInRange("2023-01-02", "2023-12-31").map((monthDate) => (
          <span key={monthDate.toString()} className="block">
            {getMonthString(monthDate.getMonth()).slice(0, 3)}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="grid grid-rows-7 w-max text-zinc-400">
          <span className="row-start-2 row-span-1 block">mon</span>
          <span className="row-start-4 row-span-1 block">tue</span>
          <span className="row-start-6 row-span-1 block">fri</span>
        </div>
        <div className="flex-1  min-w-full overflow-hidden grid grid-rows-7 grid-flow-col-dense gap-1 cursor-pointer">
          {dates.map(({ date, state }, idx) => (
            <Tooltip label={getDayMonthYear(date).join("/")} key={idx}>
              <button
                disabled={!isPast(date)}
                onClick={() => toggleEntryState(date)}
                className={cn(
                  "block h-5 w-5 aspect-square rounded-sm bg-zinc-800",
                  "disabled:bg-zinc-800/30 disabled:cursor-not-allowed",
                  state === ENTRY_STATE.completed && "bg-emerald-500",
                  state === ENTRY_STATE.failed && "bg-red-500",
                  isToday(date) && "ring-1 ring-zinc-600 hover:ring-emerald-500"
                )}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitEntriesHeatmap;

export const HeatMapWithSVG = ({ year, id, entries }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const cellSize = 18;
  const numRows = 7;
  const numCols = Math.ceil(366 / numRows);
  const gapSize = 5;
  const leftLabelWidht = 32;
  const topLabelHeight = 32;

  const updateHabitEntryMutation = useUpdateHabitEntry(id);

  const toggleHabitDay = (entryDate) => {
    updateHabitEntryMutation.mutate({
      habitId: id,
      entryDate,
      entries,
    });
  };

  const dates = getDatesInRange(`${year}-01-02`, `${year + 1}-1-1`).map(
    (date) => {
      const entry = entries?.find((entry) => isSameDay(entry.date, date));
      return entry || { date, state: ENTRY_STATE.pending };
    }
  );

  const allRects = dates.map((date, idx) => {
    const rowIndex = idx % numRows;
    const colIndex = Math.floor(idx / numRows);

    const cell = [];

    if (date.date.getDate() === 1) {
      cell.push(
        <text
          key={`month-${colIndex}-label`}
          x={colIndex * (cellSize + gapSize) + leftLabelWidht + 10}
          y={35}
          className="fill-zinc-500 select-none"
        >
          {MONTHS[date.date.getMonth()].slice(0, 3)}
        </text>
      );
    }

    if (rowIndex % 2 !== 0) {
      cell.push(
        <text
          key={`week-day-${rowIndex}-label`}
          x={0}
          y={rowIndex * (cellSize + gapSize) + 25 + topLabelHeight}
          className="fill-zinc-500 select-none"
        >
          {WEEK_DAYS[rowIndex].slice(0, 3)}
        </text>
      );
    }

    cell.push(
      <rect
        key={idx}
        x={colIndex * (cellSize + gapSize) + 10 + leftLabelWidht}
        y={rowIndex * (cellSize + gapSize) + 10 + 32}
        width={cellSize}
        height={cellSize}
        opacity={1}
        onClick={
          !isPast(date.date) ? () => {} : () => toggleHabitDay(date.date)
        }
        rx={4}
        onMouseEnter={(e) => {
          setHoveredCell({
            date: getDayMonthYear(date.date).join("/"),
            state: date.state,
            xPos: colIndex * (cellSize + gapSize) + 10 + leftLabelWidht + 25,
            yPos: rowIndex * (cellSize + gapSize) + 10 + 32,
          });
        }}
        onMouseLeave={() => setHoveredCell(null)}
        className={cn(
          "stroke-white/5 cursor-pointer ",
          date.state === ENTRY_STATE.completed && "fill-emerald-500",
          date.state === ENTRY_STATE.failed && "fill-red-500",
          date.state === ENTRY_STATE.pending && "fill-zinc-800",
          isToday(date.date) && "stroke-zinc-600",
          !isPast(date.date)
            ? "cursor-not-allowed fill-zinc-800/30 stroke-zinc-800/30"
            : "hover:stroke-zinc-700"
        )}
      />
    );

    return cell;
  });

  return (
    <div className="relative overflow-hidden">
      <svg
        width={numCols * (cellSize + gapSize) + 20 - gapSize + leftLabelWidht}
        height={numRows * (cellSize + gapSize) + 20 - gapSize + topLabelHeight}
      >
        {allRects}
      </svg>
      <HeatmapTooltip
        interactionData={hoveredCell}
        width={numCols * (cellSize + gapSize) + 20 - gapSize + leftLabelWidht}
        height={numRows * (cellSize + gapSize) + 20 - gapSize + topLabelHeight}
      />
    </div>
  );
};

const HeatmapTooltip = ({ interactionData, width, height }) => {
  if (!interactionData) {
    return null;
  }

  return (
    // The container area for the tooltip
    <div
      className={`bg-white top-0 left-0 absolute h-[${height}] w-[${width}] pointer-events-none`}
    >
      {/* The actual tooltip rendered */}
      <div
        className="bg-zinc-800/90 w-max border border-white/5 rounded-md p-2 absolute z-20"
        style={{
          left: interactionData.xPos,
          top: interactionData.yPos,
        }}
      >
        <TooltipRow label={"date"} value={interactionData.date} />
        <TooltipRow label={"state"} value={interactionData.state} />
      </div>
    </div>
  );
};

const TooltipRow = ({ label, value }) => (
  <div>
    <span className="text-zinc-400 mr-2">{label}:</span>
    <span>{value}</span>
  </div>
);
