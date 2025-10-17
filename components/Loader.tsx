
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-10">
      <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
