import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const getGradientStops = (value: number) => {
  if (value <= 33) {
    return (
      <>
        <stop offset="0%" stopColor="#ff3b3b" />
        <stop offset="100%" stopColor="#ff3b3b" />
      </>
    );
  }

  if (value <= 66) {
    return (
      <>
        <stop offset="0%" stopColor="#facc15" />
        <stop offset="70%" stopColor="#ff3b3b" />
        <stop offset="100%" stopColor="#ff3b3b" />
      </>
    );
  }

  return (
    <>
      <stop offset="0%" stopColor="#22c55e" />
      <stop offset="50%" stopColor="#ff3b3b" />
      <stop offset="100%" stopColor="#facc15" />
    </>
  );
};

export default function MultiColorProgress({ progress }: { progress: { totalLimit: number, usedLimit: number } }) {
  const { totalLimit, usedLimit } = progress;
  const remainingPercent =
    totalLimit > 0
      ? Math.max(0, Math.min(100, ((totalLimit - usedLimit) / totalLimit) * 100))
      : 0;
  const displayPercent = Math.round(remainingPercent);

  return (
    <div style={{ width: 140, height: 140 }}>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="progressGradient">
            {getGradientStops(remainingPercent)}
          </linearGradient>
        </defs>
      </svg>

      <CircularProgressbarWithChildren
        value={remainingPercent}
        text={`${displayPercent}%`}
        strokeWidth={10}
        styles={buildStyles({
          pathColor: "url(#progressGradient)",
          trailColor: "#e5e7eb",
          strokeLinecap: "round",
          textColor: "#fff"
        })}
      />
    </div>
  );
}