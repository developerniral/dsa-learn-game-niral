import React, { useState } from 'react';
import { COMPLEXITY_CLASSES, ComplexityClass } from '../../data/bigOData';

interface BigOChartProps {
  n: number;
  selectedClasses: string[];
}

export const BigOChart: React.FC<BigOChartProps> = ({ n, selectedClasses }) => {
  // SVG coordinates: 600 width, 320 height
  const width = 600;
  const height = 300;
  const padding = 45;

  const maxN = Math.max(10, n);
  // Cap max operations plotted so O(n²) doesn't completely squash O(n)
  const maxOps = Math.min(2500, Math.max(50, Math.pow(Math.min(maxN, 50), 2)));

  // Generate SVG path for a given complexity class
  const getPath = (cls: ComplexityClass) => {
    const points: string[] = [];
    const samplePoints = 40;

    for (let i = 0; i <= samplePoints; i++) {
      const currentN = 1 + (i / samplePoints) * (maxN - 1);
      const ops = cls.calculateOps(currentN);
      
      const x = padding + ((currentN - 1) / (maxN - 1)) * (width - padding * 2);
      const normalizedOps = Math.min(maxOps, ops);
      const y = height - padding - (normalizedOps / maxOps) * (height - padding * 2);

      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    return points.join(' ');
  };

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[600px] h-[300px]">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - padding - pct * (height - padding * 2);
          const opsVal = Math.round(pct * maxOps);
          return (
            <React.Fragment key={`grid-${idx}`}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-500 select-none"
              >
                {opsVal >= 1000 ? `${(opsVal / 1000).toFixed(1)}k` : opsVal}
              </text>
            </React.Fragment>
          );
        })}

        {/* X Axis labels */}
        {[1, Math.round(maxN / 2), maxN].map((val, idx) => {
          const x = padding + ((val - 1) / (maxN - 1)) * (width - padding * 2);
          return (
            <text
              key={`x-label-${idx}`}
              x={x}
              y={height - padding + 18}
              textAnchor="middle"
              className="text-[10px] font-mono fill-slate-500 select-none"
            >
              N={val}
            </text>
          );
        })}

        {/* X and Y Axes */}
        <line
          x1={padding}
          y1={padding / 2}
          x2={padding}
          y2={height - padding}
          stroke="#475569"
          strokeWidth="1.5"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding / 2}
          y2={height - padding}
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Axis titles */}
        <text
          x={width / 2}
          y={height - 8}
          textAnchor="middle"
          className="text-[11px] font-mono fill-slate-400 select-none"
        >
          Input Size (N) →
        </text>
        <text
          x={padding}
          y={18}
          textAnchor="start"
          className="text-[11px] font-mono fill-slate-400 select-none"
        >
          ↑ Operations Count
        </text>

        {/* Complexity Curves */}
        {COMPLEXITY_CLASSES.map(cls => {
          const isSelected = selectedClasses.includes(cls.id);
          if (!isSelected) return null;

          return (
            <g key={cls.id}>
              <path
                d={getPath(cls)}
                fill="none"
                stroke={cls.color}
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
