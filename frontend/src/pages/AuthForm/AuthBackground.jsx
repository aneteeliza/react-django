import React, { useState, useEffect, useRef } from 'react';

const AuthBackground = ({ children }) => {
  // Track which image is currently visible
  const [activeIndex, setActiveIndex] = useState(0);
  // Store 3 image indices - we'll cycle through them
  const [imageIndices, setImageIndices] = useState([1, 2, 3]);
  const timeoutRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      // Move to next image in rotation (0 -> 1 -> 2 -> 0 -> etc)
      setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
      
      // After transition completes, prepare the next image that's not currently visible
      timeoutRef.current = setTimeout(() => {
        setImageIndices(prevIndices => {
          const newIndices = [...prevIndices];
          // Calculate which index to update (the one that's not visible and not about to be visible)
          const indexToUpdate = (activeIndex + 2) % 3;
          // Update to next image in sequence (1-13)
          newIndices[indexToUpdate] = (newIndices[indexToUpdate] % 13) + 1;
          return newIndices;
        });
      }, 1000); // Wait for transition to complete
    }, 10000); // Change every 10 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
  }, [activeIndex]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 0 
    }}>
      {/* Render all three background images with different opacities based on which is active */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            backgroundImage: `url(/images/${imageIndices[index]}.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            opacity: activeIndex === index ? 1 : 0,
            transform: activeIndex === index ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
            zIndex: 1,
          }}
        />
      ))}
      
      {/* Foreground content */}
      <div className="relative z-10 flex justify-content-center align-items-center h-100 w-100 backdrop-blur-sm bg-white/20">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;