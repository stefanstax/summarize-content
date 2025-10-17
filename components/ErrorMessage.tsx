
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mt-8 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md animate-fade-in" role="alert">
      <p className="font-semibold">Error</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
