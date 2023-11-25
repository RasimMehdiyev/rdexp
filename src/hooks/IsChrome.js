import { useState, useEffect } from 'react';

const IsChrome = () => {
  const [isChrome, setIsChrome] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    console.log(userAgent.includes('Chrome'));
    const isChromium = /Chrome/.test(userAgent);// gives false in Chrome
    
    const isEdge = /Edg/.test(userAgent); // Edge also includes "Chrome" in its user agent
    const isOpera = /OPR/.test(userAgent); // Opera also includes "Chrome" in its user agent
    setIsChrome(isChromium && !isEdge && !isOpera);
  }, []);

  return isChrome;
};

export default IsChrome;
