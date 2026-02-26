import React from "react";

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angle = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export default function PieChart({ data = [], size = 200, innerRadius = 60 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = Math.min(cx, cy) - 4;

  const total = data.reduce((s, d) => s + (d.value || 0), 0);

  let currentAngle = -90;

  return (
    <div className="pie-chart-wrapper">
      <svg className="pie-chart-svg" viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {data.map((slice) => {
          const value = slice.value || 0;
          const angle = total > 0 ? (value / total) * 360 : 0;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          // If angle is 0, render nothing
          if (angle === 0) return null;

          const path = describeArc(cx, cy, radius, startAngle, endAngle);
          return <path key={slice.name} d={path} fill={slice.color} />;
        })}

        {/* center circle to create donut */}
        <circle className="pie-center" cx={cx} cy={cy} r={innerRadius} />

        {/* center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" className="pie-center-title">
          {total > 0 ? total : "No data"}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="pie-center-sub">
          Transactions
        </text>
      </svg>

      <div className="pie-chart-legend">
        {data.map((d) => (
          <div key={d.name} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: d.color }} />
            <span className="legend-label">{d.name} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
