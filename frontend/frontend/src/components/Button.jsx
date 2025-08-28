import React from 'react';

const Button = ({ children, ...props }) => (
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow font-semibold transition w-full"
    {...props}
  >
    {children}
  </button>
);

export default Button;
