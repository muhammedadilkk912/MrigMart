import React, { useEffect, useState } from 'react'
import Login from '../page/Login'

const LoginPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-xl relative p-4">

        <button
          onClick={() => setOpen(false)}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ×
        </button>

        <Login />

      </div>

    </div>
  );
};

export default LoginPopup;
