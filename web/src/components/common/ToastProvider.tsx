'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return <Toaster position="bottom-center" reverseOrder={false} toastOptions={{
    className: 'text-sm px-3 py-3 border border-border w-fit'
  }} />;
};
