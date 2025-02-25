"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, Zap, ArrowLeftRight } from 'lucide-react';

const MainPage = () => {
  // Configuration constants
  const CONFIG = {
    TILT: {
      MAX_ANGLE: 3, // Maximum tilt angle in degrees
      PERSPECTIVE: 1700, // Perspective distance in pixels
      SCALE: 1, // Slight scale effect on hover
      TRANSITION_SPEED: '2s', // Transition speed in seconds
    },
    LIGHT: {
      SIZE: 400, // Size of the light circle in pixels
      INTENSITY: 0.1, // Maximum intensity of the light
    },
    FLOAT: {
      DURATION: '6s',
      DISTANCE: '8px',
    }
  };
  
  // Define keyframe animations using template literals
  const keyframeStyles = `
    @keyframes float1 {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-${CONFIG.FLOAT.DISTANCE}); }
      100% { transform: translateY(0px); }
    }
    @keyframes float2 {
      0% { transform: translateY(-${CONFIG.FLOAT.DISTANCE}); }
      50% { transform: translateY(0px); }
      100% { transform: translateY(-${CONFIG.FLOAT.DISTANCE}); }
    }
    @keyframes float3 {
      0% { transform: translateY(-${CONFIG.FLOAT.DISTANCE}/2); }
      50% { transform: translateY(${CONFIG.FLOAT.DISTANCE}/2); }
      100% { transform: translateY(-${CONFIG.FLOAT.DISTANCE}/2); }
    }
    @keyframes tilt1 {
      0% { transform: rotate(-1deg); }
      50% { transform: rotate(1deg); }
      100% { transform: rotate(-1deg); }
    }
    @keyframes tilt2 {
      0% { transform: rotate(1deg); }
      50% { transform: rotate(-1deg); }
      100% { transform: rotate(1deg); }
    }
    @keyframes tilt3 {
      0% { transform: rotate(-0.5deg); }
      50% { transform: rotate(0.5deg); }
      100% { transform: rotate(-0.5deg); }
    }
  `;
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // Update container ref if needed in the future
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if mouse is inside container
    const mouseIsInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    setIsInside(mouseIsInside);

    // Clamp the position for the light effect
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));
    
    // Set the clamped position for the light effect
    setMousePosition({
      x: clampedX,
      y: clampedY
    });

    // Calculate tilt angles based on mouse position relative to container center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxDistance = Math.max(rect.width, rect.height);
    
    // Calculate relative position from center (-1 to 1)
    const relativeX = (x - centerX) / maxDistance;
    const relativeY = (y - centerY) / maxDistance;
    
    // Apply tilt with smooth clamping for extreme positions
    const tiltX = -relativeY * CONFIG.TILT.MAX_ANGLE * 2;
    const tiltY = relativeX * CONFIG.TILT.MAX_ANGLE * 2;
    
    setTilt({
      x: tiltX,
      y: tiltY
    });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#070303] text-[#f7ebe9]">
      <style dangerouslySetInnerHTML={{ __html: keyframeStyles }} />
      {/* Hero Section */}
      <div className="flex-1 p-8 animate-gradient bg-gradient-to-b from-[#070303] via-[#070303] via-[#070303] via-[#296b44]/5 to-[#296b44]/10 text-[#f7ebe9]">
        <div 
          ref={containerRef}
          className="max-w-7xl mx-auto bg-[#ffffff]/5 rounded-3xl p-8 backdrop-blur-lg border border-[#f7ebe9]/20 shadow-2xl relative overflow-hidden"
          style={{
            transform: `
              perspective(${CONFIG.TILT.PERSPECTIVE}px) 
              rotateX(${tilt.x}deg) 
              rotateY(${tilt.y}deg)
              scale(${isInside ? CONFIG.TILT.SCALE : 1})
            `,
            transition: `transform ${CONFIG.TILT.TRANSITION_SPEED} ease-out`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div 
            className="absolute pointer-events-none mix-blend-soft-light inset-0"
            style={{
              background: isInside ? `radial-gradient(${CONFIG.LIGHT.SIZE}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,${CONFIG.LIGHT.INTENSITY}), rgba(255,255,255,0) 70%)` : 'none',
              transition: 'background 100ms ease-out',
            }}
          />
          <div 
            className="flex flex-col h-[calc(100vh-8rem)] justify-center relative"
          >
            <div className="absolute inset-0 bg-[url('/images/abstract-bg.png')] opacity-5 bg-cover bg-center"></div>
            
            {/* Hero Content */}
            <div className="z-10 text-center px-4 mb-12">
              <h1 className="text-[80px] font-bold text-[#f7ebe9]">SoroFinance</h1>
              <h2 className="text-3xl font-medium mb-10 text-[#f7ebe9]">Smart Accounting & Payments<br/>for Stellar Projects</h2>
              <p className="text-xl mb-8 text-[#f7ebe9]/80">
                A structured way to manage your project&apos;s finances, automate payments,<br/>and streamline SCF applications.
              </p>
              
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://forms.gle/PiXrFdKPPFoRqwXp9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ae5042] text-[#f7ebe9] px-6 py-3 rounded-full font-bold hover:bg-[#378090] transition-colors text-base cursor-pointer"
                >
                  Give feedback
                </a>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-6 z-10 px-4 max-w-4xl mx-auto">
              {[
                { 
                  Icon: Wallet, 
                  title: "Budget Management", 
                  desc: "Plan structured budgets with milestone-based calculations" 
                },
                { 
                  Icon: Zap, 
                  title: "Automated Payments", 
                  desc: "Set up and execute payments with time-based triggers" 
                },
                { 
                  Icon: ArrowLeftRight, 
                  title: "Token Swaps", 
                  desc: "Pay in commonly used currencies found in DEXs" 
                },
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="bg-[#ffffff]/5 rounded-xl p-6 backdrop-blur-xl border border-[#f7ebe9]/20 transform-gpu hover:scale-110 transition-all duration-300 hover:bg-[#ffffff]/10 hover:border-[#f7ebe9]/30 shadow-lg relative overflow-hidden"
                  style={{
                    animation: `
                      float${i + 1} ${CONFIG.FLOAT.DURATION} ease-in-out infinite,
                      tilt${i + 1} ${CONFIG.FLOAT.DURATION} ease-in-out infinite
                    `,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <div className="absolute -right-8 -bottom-8 opacity-5">
                    <feature.Icon size={180} strokeWidth={0.5} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-semibold mb-2 text-[#f7ebe9]">{feature.title}</h3>
                    <p className="text-sm text-[#f7ebe9]/80">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
