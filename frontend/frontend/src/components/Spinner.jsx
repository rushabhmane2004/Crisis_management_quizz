import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Spinner = () => (
  <div className="flex justify-center items-center w-full py-8">
    <FaSpinner className="animate-spin text-3xl text-blue-600" />
  </div>
);

export default Spinner;
