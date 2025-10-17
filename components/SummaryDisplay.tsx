import React, { useState } from "react";
import type { Summary } from "../types";
import CopyIcon from "./icons/CopyIcon";
import CheckIcon from "./icons/CheckIcon";
import InfoIcon from "./icons/InfoIcon";

interface SummaryDisplayProps {
  summaries: Summary[];
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summaries }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  };

  const countWords = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80)
      return "bg-green-600/30 text-green-300 border-green-500/50";
    if (score >= 50)
      return "bg-yellow-600/30 text-yellow-300 border-yellow-500/50";
    return "bg-red-600/30 text-red-300 border-red-500/50";
  };

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      {summaries.map((summary, index) => (
        <div
          key={index}
          className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4"
        >
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              What is it?
            </h3>
            <p className="text-slate-200 text-lg leading-relaxed">
              {summary.subjectExplanation}
            </p>
          </div>

          <div className="border-t border-slate-700"></div>

          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-3 pt-2">
              Key Information
            </h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {summary.detailedSummary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 text-sm text-slate-400">
            <div className="relative group flex items-center gap-2 cursor-help">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(
                  summary.citationWorthinessScore
                )}`}
              >
                Citation Score: {summary.citationWorthinessScore}
                <InfoIcon className="h-3.5 w-3.5" />
              </div>
              <div className="absolute bottom-full mb-2 w-72 p-3 bg-slate-700 text-slate-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                <p className="font-bold mb-1">Scoring Rationale:</p>
                {summary.scoreJustification}
              </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
              <span>Word Count: {countWords(summary.detailedSummary)}</span>
              <button
                onClick={() =>
                  handleCopy(
                    `${summary.subjectExplanation}\n\n${summary.detailedSummary}`,
                    index
                  )
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500"
                aria-label={`Copy summary ${index + 1}`}
              >
                {copiedIndex === index ? (
                  <>
                    <CheckIcon className="h-4 w-4 text-green-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryDisplay;
