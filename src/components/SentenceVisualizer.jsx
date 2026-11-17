import React, { useState, useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { speakText, LANGUAGE_CONFIG } from '../lib/core.js';
import { baseWordDict } from '../data/sentences.js';

// --- Harmonious Line Color Palette ---
export const HARMONIOUS_LINE_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#6366f1'  // Indigo
];

// --- Word With Hover Tooltip & Individual Pronunciation ---
export const WordWithTooltip = ({
  word,
  color = '#2563eb',
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  customMeta = null,
  targetLang = 'en'
}) => {
  const [hovered, setHovered] = useState(false);
  const speechLang = LANGUAGE_CONFIG[targetLang]?.speechLang || 'en-US';
  const cleanKey = String(word || '')
    .toLowerCase()
    .replace(/[.,?!¿¡"]/g, '')
    .trim();

  const meta =
    customMeta ||
    baseWordDict[word] ||
    baseWordDict[cleanKey] || {
      ipa: `/${cleanKey}/`,
      pos: '核心词块',
      meaning: '点击喇叭可单独听该词常速/慢速发音'
    };

  return (
    <span
      className="relative inline-block select-none"
      onMouseEnter={() => {
        setHovered(true);
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (onMouseLeave) onMouseLeave();
      }}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          speakText(word, 0.95, 1.0, null, speechLang);
        }}
        style={
          isHighlighted
            ? {
                backgroundColor: `${color}18`,
                borderColor: color,
                color: '#0f172a'
              }
            : undefined
        }
        className={`cursor-pointer px-1.5 py-0.5 rounded-md font-extrabold text-sm md:text-[15px] transition-all border ${
          isHighlighted
            ? 'shadow-2xs scale-105'
            : 'border-transparent text-slate-900 hover:bg-slate-100 hover:border-slate-300'
        }`}
      >
        {word}
      </span>

      {hovered && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 p-2.5 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 text-left pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-1 border-b border-slate-700/80 pb-1.5 mb-1.5">
            <div>
              <div className="text-xs font-extrabold text-white">{word}</div>
              <div className="text-[10px] font-mono text-amber-300">{meta.ipa}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(word, 0.95, 1.0, null, speechLang);
                }}
                className="px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-bold flex items-center gap-0.5"
              >
                <Volume2 className="w-2.5 h-2.5" />
                <span>发音</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(word, 0.6, 1.0, null, speechLang);
                }}
                className="px-1.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-[10px] font-bold"
              >
                🐢
              </button>
            </div>
          </div>
          <div className="text-[10.5px] leading-snug text-slate-200">
            <span className="inline-block px-1 py-0.2 bg-slate-800 text-blue-300 rounded text-[9.5px] font-bold mr-1">
              {meta.pos}
            </span>
            <span>{meta.meaning}</span>
          </div>
        </div>
      )}
    </span>
  );
};

// --- 3-Layer Sentence Visualizer with Harmonious Colored SVG Lines ---
export const MiniSentenceVisualizer = ({ en, lit, nat, mapping, targetLang = 'en' }) => {
  const containerRef = useRef(null);
  const enRefs = useRef([]);
  const litRefs = useRef([]);
  const natRefs = useRef([]);
  const [lines, setLines] = useState([]);
  const [hoveredEnIdx, setHoveredEnIdx] = useState(null);

  const computeLines = () => {
    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    mapping.forEach((m) => {
      const color = HARMONIOUS_LINE_COLORS[m.enIdx % HARMONIOUS_LINE_COLORS.length];
      const enEl = enRefs.current[m.enIdx];
      const litEl = litRefs.current[m.litIdx];

      if (enEl && litEl) {
        const r1 = enEl.getBoundingClientRect();
        const r2 = litEl.getBoundingClientRect();
        newLines.push({
          enIdx: m.enIdx,
          color,
          x1: r1.left + r1.width / 2 - cRect.left,
          y1: r1.bottom - cRect.top - 1,
          x2: r2.left + r2.width / 2 - cRect.left,
          y2: r2.top - cRect.top + 1
        });
      }

      if (m.natIdx !== null && m.natIdx !== undefined) {
        const natEl = natRefs.current[m.natIdx];
        if (litEl && natEl) {
          const r2 = litEl.getBoundingClientRect();
          const r3 = natEl.getBoundingClientRect();
          newLines.push({
            enIdx: m.enIdx,
            color,
            x1: r2.left + r2.width / 2 - cRect.left,
            y1: r2.bottom - cRect.top - 1,
            x2: r3.left + r3.width / 2 - cRect.left,
            y2: r3.top - cRect.top + 1
          });
        }
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    const timer = setTimeout(computeLines, 60);
    window.addEventListener('resize', computeLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeLines);
    };
  }, [en, lit, nat, mapping]);

  return (
    <div ref={containerRef} className="relative py-1 select-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {lines.map((line, idx) => {
          const isHighlighted = hoveredEnIdx === line.enIdx;
          const isDimmed = hoveredEnIdx !== null && hoveredEnIdx !== line.enIdx;
          const midY = (line.y1 + line.y2) / 2;
          const d = `M ${line.x1} ${line.y1} C ${line.x1} ${midY}, ${line.x2} ${midY}, ${line.x2} ${line.y2}`;
          return (
            <path
              key={idx}
              d={d}
              fill="none"
              stroke={line.color}
              strokeWidth={isHighlighted ? 2.8 : 1.75}
              strokeOpacity={isDimmed ? 0.2 : isHighlighted ? 1 : 0.72}
              className="transition-all duration-150"
            />
          );
        })}
      </svg>

      {/* Row 1: Target Language Words */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-1 mb-3.5">
        {en.map((word, idx) => {
          const color = HARMONIOUS_LINE_COLORS[idx % HARMONIOUS_LINE_COLORS.length];
          return (
            <div key={idx} ref={(el) => (enRefs.current[idx] = el)}>
              <WordWithTooltip
                word={word}
                color={color}
                isHighlighted={hoveredEnIdx === idx}
                onMouseEnter={() => setHoveredEnIdx(idx)}
                onMouseLeave={() => setHoveredEnIdx(null)}
                targetLang={targetLang}
              />
            </div>
          );
        })}
      </div>

      {/* Row 2: Literal Word-for-Word Translation */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-3.5 pl-0.5">
        {lit.map((word, idx) => {
          const mapped = mapping.find((m) => m.litIdx === idx);
          const enIdx = mapped ? mapped.enIdx : idx;
          const color = HARMONIOUS_LINE_COLORS[enIdx % HARMONIOUS_LINE_COLORS.length];
          const isHighlighted = hoveredEnIdx === enIdx;
          return (
            <span
              key={idx}
              ref={(el) => (litRefs.current[idx] = el)}
              style={isHighlighted ? { color, fontWeight: 700 } : undefined}
              className="text-[11px] text-slate-400 px-1 rounded transition-colors"
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Row 3: Natural Chinese Expression */}
      <div className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-1 pl-0.5">
        {nat.map((word, idx) => {
          const mappedList = mapping.filter((m) => m.natIdx === idx);
          const isHighlighted = mappedList.some((m) => m.enIdx === hoveredEnIdx);
          const primaryColor =
            mappedList.length > 0
              ? HARMONIOUS_LINE_COLORS[mappedList[0].enIdx % HARMONIOUS_LINE_COLORS.length]
              : '#0f172a';
          return (
            <span
              key={idx}
              ref={(el) => (natRefs.current[idx] = el)}
              style={isHighlighted ? { color: primaryColor } : undefined}
              className={`text-xs font-bold px-1 rounded transition-colors ${
                isHighlighted ? 'underline decoration-2' : 'text-slate-700'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

