import React, { useState, useCallback } from "react";
import { summarizeText } from "./services/geminiService";
import type { Summary } from "./types";
import TextInput from "./components/TextInput";
import SummaryDisplay from "./components/SummaryDisplay";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import SparklesIcon from "./components/icons/SparklesIcon";

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("English");

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!text.trim()) {
        setError("Please paste some text to summarize.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setSummaries([]);

      try {
        const result = await summarizeText(text, language);

        setSummaries(result.summaries);
      } catch (err) {
        console.error(err);
        if (
          err instanceof Error &&
          err.message.includes("API_KEY environment variable not set")
        ) {
          setError(
            "The Gemini API key is not configured. The `API_KEY` environment variable must be available for this application to work. Please check your setup."
          );
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "An unknown error occurred. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [text, language]
  );

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100">
            Summary ANY Content
          </h1>
          <p className="text-slate-400 mt-2">
            Paste any text to generate three distinct, AI-powered summaries with
            citation scores.
          </p>
        </header>
        <main>
          <div className="mb-4">
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Which lanuage should be used?
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-[#5152fb] focus:outline-none transition-shadow duration-200 disabled:opacity-50"
            >
              <option value="English">English</option>
              <option value="Serbian">Serbian</option>
            </select>
          </div>

          <TextInput
            text={text}
            setText={setText}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}

          {summaries.length > 0 && !isLoading && (
            <SummaryDisplay summaries={summaries} />
          )}

          {!isLoading && !error && summaries.length === 0 && (
            <div className="text-center mt-12 p-8 border-2 border-dashed border-slate-700 rounded-xl">
              <SparklesIcon className="mx-auto h-12 w-12 text-white" />
              <h2 className="mt-4 text-xl font-medium text-slate-300">
                Your summaries will appear here
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                First a quick definition, then the key information, with a
                citation score.
              </p>
            </div>
          )}
        </main>

        <footer className="text-center mt-12 text-white">
          <a
            href="https://maypact.com/"
            target="_blank"
            className="hover:underline flex justify-center items-center gap-2"
          >
            Powered by{" "}
            <img
              src="https://maypact.com/wp-content/uploads/2025/02/Maypact-favicon.png"
              className="w-[20px] h-[20px] invert"
            />{" "}
            MAYPACT
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
