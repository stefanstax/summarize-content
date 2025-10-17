import React from "react";

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  text,
  setText,
  handleSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your article text here..."
        required
        className="flex-grow w-full h-40 px-4 py-3 bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-[#5152fb] focus:outline-none transition-shadow duration-200 resize-y"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center px-6 py-3 font-semibold bg-[#5152fb] rounded-md hover:bg-[#4849D2] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#5152fb] transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Summarizing...
          </>
        ) : (
          "Summarize"
        )}
      </button>
    </form>
  );
};

export default TextInput;
