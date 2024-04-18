import { useState } from "react";
import useUpdateHabitEntry from "../../hooks/api/useUpdateHabitEntry";
import {
  MONTHS,
  WEEK_DAYS,
  cn,
  getDatesInRange,
  getDayMonthYear,
  isPast,
  isSameDay,
  isToday,
  nextState,
} from "../../utils";
import { ENTRY_STATE } from "../../constants";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "../../components/Buttons";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useHabit } from "../../hooks/api/useHabits";

const HabitEntriesHeatmap = ({ id }) => {
  const [year, setYear] = useState(new Date().getFullYear());

  const onNextClick = () => {
    setYear(year + 1);
  };

  const onPrevClick = () => {
    setYear(year - 1);
  };

  const habitQuery = useHabit(id);

  return (
    <>
      <div className="flex justify-between items-center ">
        <IconButton
          onClick={onPrevClick}
          className={
            "text-zinc-400 hover:text-white transition-colors duration-150 "
          }
        >
          <ArrowLeftIcon className="h-5 w-5" strokeWidth={2} />
        </IconButton>
        <span className="block text-sm py-1 px-2 rounded-md text-zinc-500">
          {year}
        </span>
        <IconButton
          onClick={onNextClick}
          disabled={year === new Date().getFullYear()}
          className={cn(
            "text-zinc-400 hover:text-white transition-colors duration-150",
            "disabled:text-zinc-600 disabled:cursor-not-allowed disabled:hover:text-zinc-600 "
          )}
        >
          <ArrowRightIcon className="h-5 w-5" strokeWidth={2} />
        </IconButton>
      </div>
      <SVGHeatmap year={year} id={id} entries={habitQuery?.data?.entries} />
    </>
  );
};

export default HabitEntriesHeatmap;

export const SVGHeatmap = ({ year, id, entries }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!entries || !id) {
    return null;
  }

  const updateHabitEntryMutation = useUpdateHabitEntry(id);

  // Heatmap config
  const cellSize = 18;
  const numRows = 7;
  const numCols = Math.ceil(366 / numRows);
  const gapSize = 5;
  const leftLabelWidth = 32;
  const topLabelHeight = 32;

  const dates = getDatesInRange(`01-01-${year}`, `12-31-${year}`).map(
    (date) => {
      const entry = entries?.find((entry) => isSameDay(entry.date, date));
      return entry || { date, state: ENTRY_STATE.pending };
    }
  );

  const toggleHabitDay = (entryDate) => {
    updateHabitEntryMutation.mutate({
      habitId: id,
      entryDate,
      entries,
    });
  };

  const handleSetHoveredCell = (event, cellData) => {
    const cellBCR = event.target.getBoundingClientRect();
    const tooltipWidth = 160;
    const padding = 20;

    let adjustedX = cellData.xPos;

    if (cellBCR.right + tooltipWidth + 10 >= window.innerWidth) {
      adjustedX = cellBCR.left - tooltipWidth - padding;
    }

    setHoveredCell({ ...cellData, xPos: adjustedX });
  };

  const allRects = dates.map((entry, idx) => {
    const rowIndex = idx % numRows;
    const colIndex = Math.floor(idx / numRows);

    const cell = [];

    if (entry.date.getDate() === 1) {
      const month = MONTHS[entry.date.getMonth()].slice(0, 3);

      cell.push(
        <text
          key={`month-${colIndex}-label`}
          x={colIndex * (cellSize + gapSize) + leftLabelWidth + 10}
          y={35}
          className="fill-zinc-500 select-none"
        >
          {month}
        </text>
      );
    }

    if (rowIndex % 2 !== 0) {
      const day = WEEK_DAYS[rowIndex].slice(0, 3);
      cell.push(
        <text
          key={`week-day-${rowIndex}-label`}
          x={0}
          y={rowIndex * (cellSize + gapSize) + 25 + topLabelHeight}
          className="fill-zinc-500 select-none"
        >
          {day}
        </text>
      );
    }

    cell.push(
      <rect
        key={idx}
        x={colIndex * (cellSize + gapSize) + 10 + leftLabelWidth}
        y={rowIndex * (cellSize + gapSize) + 10 + 32}
        width={cellSize}
        height={cellSize}
        opacity={1}
        onClick={
          isPast(entry.date)
            ? (e) => {
                toggleHabitDay(entry.date);
                handleSetHoveredCell(e, {
                  date: getDayMonthYear(entry.date).join("/"),
                  state: nextState(entry.state),
                  xPos:
                    colIndex * (cellSize + gapSize) + 10 + leftLabelWidth + 25,
                  yPos: rowIndex * (cellSize + gapSize) + 10 + 32,
                });
              }
            : null
        }
        rx={4}
        onMouseEnter={(e) => {
          handleSetHoveredCell(e, {
            date: getDayMonthYear(entry.date).join("/"),
            state: entry.state,
            xPos: colIndex * (cellSize + gapSize) + 10 + leftLabelWidth + 25,
            yPos: rowIndex * (cellSize + gapSize) + 10 + 32,
          });
        }}
        onMouseLeave={() => setHoveredCell(null)}
        className={cn(
          "stroke-white/5 cursor-pointer ",
          entry.state === ENTRY_STATE.completed && "fill-emerald-500",
          entry.state === ENTRY_STATE.failed && "fill-red-500",
          entry.state === ENTRY_STATE.pending && "fill-zinc-800",
          isToday(entry.date) && "stroke-zinc-600",
          !isPast(entry.date)
            ? "cursor-not-allowed fill-zinc-800/30 stroke-zinc-800/30"
            : "hover:stroke-zinc-700"
        )}
      />
    );

    return cell;
  });

  const heatmapWidth =
    numCols * (cellSize + gapSize) + 20 - gapSize + leftLabelWidth;
  const heatmapHeight =
    numRows * (cellSize + gapSize) + 20 - gapSize + topLabelHeight;

  return (
    <div className="relative ">
      <div className="overflow-x-scroll 2xl:overflow-visible scrollbar-thin ">
        <svg width={heatmapWidth} height={heatmapHeight}>
          {allRects}
        </svg>
      </div>
      <AnimatePresence>
        <HeatmapTooltip
          interactionData={hoveredCell}
          width={heatmapWidth}
          height={heatmapHeight}
        />
      </AnimatePresence>
    </div>
  );
};

const HeatmapTooltip = ({ interactionData, width, height }) => {
  if (!interactionData) {
    return null;
  }

  return (
    // The container area for the tooltip
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`top-0 left-0 absolute pointer-events-none`}
      style={{ height, width }}
    >
      {/* The actual tooltip rendered */}
      <div
        className="bg-zinc-800/90 w-40 border border-white/5 rounded-md p-2 absolute z-20"
        style={{
          left: interactionData.xPos,
          top: interactionData.yPos,
        }}
      >
        <TooltipRow label={"date"} value={interactionData.date} />
        <TooltipRow label={"state"} value={interactionData.state} />
      </div>
    </motion.div>
  );
};

const TooltipRow = ({ label, value }) => (
  <div>
    <span className="text-zinc-400 mr-2">{label}:</span>
    <span>{value}</span>
  </div>
);
