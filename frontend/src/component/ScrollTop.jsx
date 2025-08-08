// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the pathname changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollTop;
