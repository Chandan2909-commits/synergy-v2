'use client';

import React from 'react';
import { Activity } from 'lucide-react';

// ==============================================================================
// 14.1 DUAL CUBIC BÉZIER MULTI-CURVE TREND CHART
// Pure SVG Spline Curve (Dispatched/Impressions vs Engagement)
// ==============================================================================
interface Point {
  x: number;
  y: number;
}

function getBezierPath(points: Point[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export function DualBezierTrendChart({
  series1 = [0, 0, 0, 0, 0, 0, 0], // Impressions
  series2 = [0, 0, 0, 0, 0, 0, 0], // Engagements
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  height = 220,
}: {
  series1?: number[];
  series2?: number[];
  labels?: string[];
  height?: number;
}) {
  const width = 640;
  const paddingX = 40;
  const paddingY = 24;
  const hasData = series1.some((v) => v > 0) || series2.some((v) => v > 0);
  const maxVal = Math.max(...series1, ...series2, 100);

  const stepX = (width - paddingX * 2) / (series1.length - 1);
  const scaleY = (height - paddingY * 2) / maxVal;

  const points1: Point[] = series1.map((val, idx) => ({
    x: paddingX + idx * stepX,
    y: height - paddingY - val * scaleY,
  }));

  const points2: Point[] = series2.map((val, idx) => ({
    x: paddingX + idx * stepX,
    y: height - paddingY - val * scaleY,
  }));

  const linePath1 = getBezierPath(points1);
  const linePath2 = getBezierPath(points2);

  const areaPath1 = `${linePath1} L ${points1[points1.length - 1].x} ${height - paddingY} L ${points1[0].x} ${height - paddingY} Z`;
  const areaPath2 = `${linePath2} L ${points2[points2.length - 1].x} ${height - paddingY} L ${points2[0].x} ${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="gradient-s1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="gradient-s2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = height - paddingY - maxVal * pct * scaleY;
          return (
            <line
              key={i}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Baseline ground line */}
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />

        {hasData ? (
          <>
            {/* Area Fills */}
            <path d={areaPath1} fill="url(#gradient-s1)" />
            <path d={areaPath2} fill="url(#gradient-s2)" />

            {/* Lines */}
            <path d={linePath1} fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" />
            <path d={linePath2} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

            {/* Points on Line 1 */}
            {points1.map((p, idx) => (
              <circle
                key={`p1-${idx}`}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#ffffff"
                stroke="#1d4ed8"
                strokeWidth="2"
                className="transition-all hover:scale-125 cursor-pointer"
              />
            ))}

            {/* Points on Line 2 */}
            {points2.map((p, idx) => (
              <circle
                key={`p2-${idx}`}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2"
              />
            ))}
          </>
        ) : (
          /* Clean Flat Baseline Dots */
          points1.map((p, idx) => (
            <circle
              key={`p0-${idx}`}
              cx={p.x}
              cy={height - paddingY}
              r="3"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
          ))
        )}

        {/* X-Axis Labels */}
        {labels.map((lbl, idx) => {
          const x = paddingX + idx * stepX;
          return (
            <text
              key={lbl}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="text-[11px] font-medium fill-slate-400"
            >
              {lbl}
            </text>
          );
        })}
      </svg>

      {/* Clean Zero-Data Empty Overlay */}
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center pb-6 pointer-events-none">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50/90 backdrop-blur-sm border border-slate-200 text-xs font-medium text-slate-500 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Baseline Ready • Telemetry curves will render dynamically once posts are dispatched</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// 14.2 180° SPEEDOMETER DIAL GAUGE
// ==============================================================================
export function SpeedometerDialGauge({
  score = 100,
  maxScore = 100,
  size = 220,
  label = 'Brand Kit Conformance',
}: {
  score?: number;
  maxScore?: number;
  size?: number;
  label?: string;
}) {
  const clampedScore = Math.max(0, Math.min(maxScore, Number(score) || 0));
  const pct = clampedScore / maxScore; // 0 to 1

  const cx = size / 2;
  const cy = size * 0.58;
  const radius = size * 0.42;
  const strokeWidth = 14;
  const needleAngle = -180 + pct * 180;
  const arcLength = Math.PI * radius;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={Math.round(size * 0.62)}
        viewBox={`0 0 ${size} ${Math.round(size * 0.62)}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="speedo-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Gray Track */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active Gradient Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="url(#speedo-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength * (1 - pct)}
        />

        {/* Needle Pointer */}
        <g transform={`rotate(${needleAngle} ${cx} ${cy})`} className="transition-transform duration-700 ease-out">
          <line
            x1={cx}
            y1={cy}
            x2={cx + radius - 6}
            y2={cy}
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={cx + radius - 6} cy={cy} r="3" fill="#10b981" />
        </g>

        {/* Center Metallic Pivot */}
        <circle cx={cx} cy={cy} r="8" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
      </svg>

      <div className="text-center -mt-2">
        <div className="font-heading font-extrabold text-2xl text-foreground tracking-tight">
          {score.toFixed(1)}%
        </div>
        <p className="text-xs text-muted font-medium">{label}</p>
      </div>
    </div>
  );
}

// ==============================================================================
// 14.3 HORIZONTAL STEP-DOWN CONVERSION FUNNEL
// ==============================================================================
export function HorizontalConversionFunnel({
  stages = [
    { label: 'Content Ideas & Topics', value: 0, pct: 0 },
    { label: 'AI Strategist Planned', value: 0, pct: 0 },
    { label: 'Written & Multi-Variant', value: 0, pct: 0 },
    { label: 'QA Verified & Approved', value: 0, pct: 0 },
    { label: 'Published & Monitored', value: 0, pct: 0 },
  ],
}: {
  stages?: { label: string; value: number; pct: number }[];
}) {
  return (
    <div className="space-y-3 w-full">
      {stages.map((stage, idx) => (
        <div key={stage.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </span>
              {stage.label}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {stage.value} ({stage.pct}%)
            </span>
          </div>
          <div className="w-full h-[9px] bg-slate-100 rounded-[6px] overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-[6px] transition-all duration-700"
              style={{ width: `${Math.max(0, Math.min(100, stage.pct))}%` }}
            />
          </div>
        </div>
      ))}
      <div className="pt-1 text-[11px] text-slate-400 text-center">
        Stages update as content advances from ideation to publishing
      </div>
    </div>
  );
}

// ==============================================================================
// 14.4 SENTIMENT & PLATFORM DONUT RING
// ==============================================================================
export function SentimentDonutRing({
  data = [
    { label: 'Instagram', value: 0, color: '#e1306c' },
    { label: 'LinkedIn', value: 0, color: '#0a66c2' },
    { label: 'X (Twitter)', value: 0, color: '#111827' },
  ],
  size = 180,
}: {
  data?: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.42;
  const innerRadius = size * 0.26;

  if (total === 0) {
    return (
      <div className="flex items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Neutral background track */}
          <circle
            cx={cx}
            cy={cy}
            r={(radius + innerRadius) / 2}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={radius - innerRadius}
          />
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx={cx} cy={cy} r={innerRadius - 2} fill="#ffffff" />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            className="text-xs font-mono font-bold fill-slate-400"
          >
            0%
          </text>
        </svg>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-foreground">{item.label}</span>
              <span className="text-slate-400 font-mono text-[11px]">0%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  let currentAngle = 0;

  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    const startRad = (Math.PI * startAngle) / 180;
    const endRad = (Math.PI * endAngle) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const ix1 = cx + innerRadius * Math.cos(endRad);
    const iy1 = cy + innerRadius * Math.sin(endRad);
    const ix2 = cx + innerRadius * Math.cos(startRad);
    const iy2 = cy + innerRadius * Math.sin(startRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const dPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

    return { ...item, dPath };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.dPath}
            fill={slice.color}
            className="transition-opacity hover:opacity-85 cursor-pointer"
          />
        ))}
        <circle cx={cx} cy={cy} r={innerRadius - 4} fill="#ffffff" />
      </svg>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-semibold text-foreground">{item.label}</span>
            <span className="text-muted font-mono">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// 14.5 HIGH-PRECISION CIRCULAR PROGRESS RING
// ==============================================================================
export function CircularProgressRing({
  pct = 0,
  size = 72,
  strokeWidth = 6,
  color = '#1e1e1e',
}: {
  pct?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct / 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-bold font-mono text-foreground">
        {Math.round(pct)}%
      </span>
    </div>
  );
}
