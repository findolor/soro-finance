"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Zap, ArrowLeftRight } from 'lucide-react';

const MainPage = () => {
  // Configuration constants
  const CONFIG = {
    TILT: {
      MAX_ANGLE: 3, // Maximum tilt angle in degrees
      PERSPECTIVE: 1800, // Perspective distance in pixels
      SCALE: 1, // Slight scale effect on hover
      TRANSITION_SPEED: '2s', // Transition speed in seconds
    },
    LIGHT: {
      SIZE: 500, // Size of the light circle in pixels
      INTENSITY: 0.1, // Maximum intensity of the light
    },
    FLOAT: {
      DURATION: '6s',
      DISTANCE: '8px',
    },
    BUTTON: {
      DURATION: '8s',
      DISTANCE: '2px',
      TILT: '0.5deg',
    },
    GLOW: {
      PRIMARY_COLOR: '#ae5042',
      SECONDARY_COLOR: '#296b44',
      ACCENT_COLOR: '#378090',
      INTENSITY: '4px',
      PULSE_DURATION: '6s',
    },
    HOVER: {
      DURATION: '800ms', // Slower hover transition duration
    },
    CURSOR: {
      SIZE: '20px',
      BORDER_SIZE: '2px',
      COLOR: '#f7ebe9',
      GLOW_COLOR: '#ae5042',
      GLOW_INTENSITY: '10px',
      TRANSITION_SPEED: '150ms',
      BLEND_MODE: 'difference',
      Z_INDEX: 9999,
      HOVER_SIZE: '40px',
      HOVER_OPACITY: '0.5'
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
    @keyframes buttonMove {
      0% { transform: translateX(-${CONFIG.BUTTON.DISTANCE}) rotate(-${CONFIG.BUTTON.TILT}); }
      50% { transform: translateX(${CONFIG.BUTTON.DISTANCE}) rotate(${CONFIG.BUTTON.TILT}); }
      100% { transform: translateX(-${CONFIG.BUTTON.DISTANCE}) rotate(-${CONFIG.BUTTON.TILT}); }
    }
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 5px ${CONFIG.GLOW.PRIMARY_COLOR}40, 0 0 10px ${CONFIG.GLOW.PRIMARY_COLOR}20; }
      50% { box-shadow: 0 0 15px ${CONFIG.GLOW.PRIMARY_COLOR}60, 0 0 20px ${CONFIG.GLOW.PRIMARY_COLOR}30; }
      100% { box-shadow: 0 0 5px ${CONFIG.GLOW.PRIMARY_COLOR}40, 0 0 10px ${CONFIG.GLOW.PRIMARY_COLOR}20; }
    }
    @keyframes textGlow {
      0% { text-shadow: 0 0 5px ${CONFIG.GLOW.PRIMARY_COLOR}40; }
      50% { text-shadow: 0 0 10px ${CONFIG.GLOW.PRIMARY_COLOR}60, 0 0 15px ${CONFIG.GLOW.PRIMARY_COLOR}30; }
      100% { text-shadow: 0 0 5px ${CONFIG.GLOW.PRIMARY_COLOR}40; }
    }
    @keyframes borderGlow {
      0% { box-shadow: 0 0 5px ${CONFIG.GLOW.SECONDARY_COLOR}40, inset 0 0 3px ${CONFIG.GLOW.SECONDARY_COLOR}20; }
      50% { box-shadow: 0 0 10px ${CONFIG.GLOW.SECONDARY_COLOR}60, inset 0 0 5px ${CONFIG.GLOW.SECONDARY_COLOR}30; }
      100% { box-shadow: 0 0 5px ${CONFIG.GLOW.SECONDARY_COLOR}40, inset 0 0 3px ${CONFIG.GLOW.SECONDARY_COLOR}20; }
    }
    @keyframes cursorPulse {
      0% { box-shadow: 0 0 5px ${CONFIG.CURSOR.GLOW_COLOR}40; }
      50% { box-shadow: 0 0 ${CONFIG.CURSOR.GLOW_INTENSITY} ${CONFIG.CURSOR.GLOW_COLOR}60; }
      100% { box-shadow: 0 0 5px ${CONFIG.CURSOR.GLOW_COLOR}40; }
    }
  `;
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [globalMousePosition, setGlobalMousePosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cursorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // Check if we're on a mobile device
        setIsMobile(window.innerWidth < 768);
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Add event listeners for interactive elements
  useEffect(() => {
    if (isMobile) return;
    
    // Function to handle cursor expansion on hover
    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.width = CONFIG.CURSOR.HOVER_SIZE;
        cursorRef.current.style.height = CONFIG.CURSOR.HOVER_SIZE;
        cursorRef.current.style.opacity = CONFIG.CURSOR.HOVER_OPACITY;
        cursorRef.current.style.backgroundColor = CONFIG.CURSOR.COLOR;
        cursorRef.current.style.mixBlendMode = 'screen';
      }
    };
    
    // Function to reset cursor on mouse leave
    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.width = CONFIG.CURSOR.SIZE;
        cursorRef.current.style.height = CONFIG.CURSOR.SIZE;
        cursorRef.current.style.opacity = '1';
        cursorRef.current.style.backgroundColor = 'transparent';
        cursorRef.current.style.mixBlendMode = 'difference';
      }
    };
    
    // Select all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
    
    // Add event listeners to all interactive elements
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });
    
    // Cleanup function
    return () => {
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isMobile]);

  useEffect(() => {
    // Hide cursor as soon as possible
    if (!isMobile) {
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
      
      // Apply cursor: none to all elements immediately
      const applyNoCursor = () => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
          * {
            cursor: none !important;
          }
          html, body, #__next, div, a, button, input, textarea, select, svg, iframe, img, canvas {
            cursor: none !important;
          }
          *:hover {
            cursor: none !important;
          }
        `;
        document.head.appendChild(styleElement);
        return styleElement;
      };
      
      const styleElement = applyNoCursor();
      
      // Ensure cursor is hidden on dynamically loaded content
      const observer = new MutationObserver(() => {
        // Reapply cursor: none to any new elements
        document.querySelectorAll('*:not([style*="cursor: none"])').forEach(element => {
          (element as HTMLElement).style.cursor = 'none';
        });
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      return () => {
        document.documentElement.style.cursor = '';
        document.body.style.cursor = '';
        document.head.removeChild(styleElement);
        observer.disconnect();
      };
    }
  }, [isMobile]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Update global mouse position for cursor
    setGlobalMousePosition({
      x: e.clientX,
      y: e.clientY
    });
    
    if (!containerRef.current || isMobile) return;
    
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
  }, [isMobile, containerRef]);

  useEffect(() => {
    // Register the mouse move handler with high performance options
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Direct DOM manipulation for cursor positioning - more responsive than state updates
    const handleDirectMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && !isMobile) {
        // Use direct style manipulation for better performance during fast movements
        const x = e.clientX;
        const y = e.clientY;
        
        // Use transform with hardware acceleration for better performance
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        
        // Re-hide the cursor on every movement to ensure it stays hidden
        if (e.target instanceof HTMLElement) {
          e.target.style.cursor = 'none';
        }
      }
    };

    // Add direct event listener for cursor movement with capture to get it first
    document.addEventListener('mousemove', handleDirectMouseMove, { 
      passive: true,
      capture: true  // Use capture to get the event before other handlers
    });
    
    // Hide cursor when mouse moves fast
    const handleMouseMoveCapture = (e: MouseEvent) => {
      if (!isMobile) {
        if (e.target instanceof HTMLElement) {
          e.target.style.cursor = 'none';
        }
      }
    };
    
    // Capture all mouse events to ensure cursor stays hidden
    document.addEventListener('mouseover', handleMouseMoveCapture, { capture: true });
    document.addEventListener('mouseout', handleMouseMoveCapture, { capture: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleDirectMouseMove, { capture: true });
      document.removeEventListener('mouseover', handleMouseMoveCapture, { capture: true });
      document.removeEventListener('mouseout', handleMouseMoveCapture, { capture: true });
    };
  }, [isMobile, handleMouseMove]);

  // Add mouse leave/enter detection for the whole document
  useEffect(() => {
    if (isMobile) return;

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
      
      // Re-hide cursor when mouse re-enters document
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen flex flex-col bg-[#070303] text-[#f7ebe9]" style={{ cursor: !isMobile ? 'none' : 'auto' }}>
      <style dangerouslySetInnerHTML={{ __html: keyframeStyles }} />
      
      {/* Custom Cursor */}
      {!isMobile && (
        <>
          {/* Add a global style to hide cursor on the entire document */}
          <style dangerouslySetInnerHTML={{ __html: `
            * {
              cursor: none !important;
            }
            html, body, #__next, div, a, button, input, textarea, select, svg, iframe, img, canvas {
              cursor: none !important;
            }
            *:hover {
              cursor: none !important;
            }
          `}} />
          <div
            ref={cursorRef}
            className="fixed pointer-events-none"
            style={{
              width: CONFIG.CURSOR.SIZE,
              height: CONFIG.CURSOR.SIZE,
              borderRadius: '50%',
              border: `${CONFIG.CURSOR.BORDER_SIZE} solid ${CONFIG.CURSOR.COLOR}`,
              backgroundColor: 'transparent',
              transform: `translate3d(${globalMousePosition.x}px, ${globalMousePosition.y}px, 0)`,
              transition: `width ${CONFIG.CURSOR.TRANSITION_SPEED} ease, height ${CONFIG.CURSOR.TRANSITION_SPEED} ease, opacity ${CONFIG.CURSOR.TRANSITION_SPEED} ease, background-color ${CONFIG.CURSOR.TRANSITION_SPEED} ease`,
              mixBlendMode: CONFIG.CURSOR.BLEND_MODE as React.CSSProperties['mixBlendMode'],
              zIndex: CONFIG.CURSOR.Z_INDEX,
              boxShadow: `0 0 ${CONFIG.CURSOR.GLOW_INTENSITY} ${CONFIG.CURSOR.GLOW_COLOR}40`,
              animation: `cursorPulse ${CONFIG.GLOW.PULSE_DURATION} ease-in-out infinite`,
              left: `-${parseInt(CONFIG.CURSOR.SIZE) / 2}px`,
              top: `-${parseInt(CONFIG.CURSOR.SIZE) / 2}px`,
              willChange: 'transform',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d'
            }}
          />
        </>
      )}
      
      {/* Hero Section */}
      <div className="flex-1 p-4 md:p-8 animate-gradient bg-gradient-to-b from-[#070303] via-[#070303] via-[#070303] via-[#296b44]/5 to-[#296b44]/10 text-[#f7ebe9]">
        <div 
          ref={containerRef}
          className="max-w-7xl mx-auto bg-[#ffffff]/5 rounded-3xl p-4 md:p-8 backdrop-blur-lg border border-[#f7ebe9]/20 shadow-2xl relative overflow-hidden"
          style={{
            transform: !isMobile ? `
              perspective(${CONFIG.TILT.PERSPECTIVE}px) 
              rotateX(${tilt.x}deg) 
              rotateY(${tilt.y}deg)
              scale(${isInside ? CONFIG.TILT.SCALE : 1})
            ` : 'none',
            transition: `transform ${CONFIG.TILT.TRANSITION_SPEED} ease-out`,
            transformStyle: 'preserve-3d',
            boxShadow: `0 0 ${CONFIG.GLOW.INTENSITY} ${CONFIG.GLOW.SECONDARY_COLOR}30, inset 0 0 20px ${CONFIG.GLOW.SECONDARY_COLOR}10`,
            animation: `pulseGlow ${CONFIG.GLOW.PULSE_DURATION} ease-in-out infinite`
          }}
        >
          <div 
            className="absolute pointer-events-none mix-blend-soft-light inset-0"
            style={{
              background: isInside && !isMobile ? `radial-gradient(${CONFIG.LIGHT.SIZE}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,${CONFIG.LIGHT.INTENSITY}), rgba(255,255,255,0) 70%)` : 'none',
              transition: 'background 100ms ease-out',
            }}
          />
          <div 
            className="flex flex-col min-h-[500px] md:h-[calc(100vh-8rem)] justify-center relative "
          >
            <div className="absolute inset-0 bg-[url('/images/abstract-bg.png')] opacity-5 bg-cover bg-center"></div>
            
            {/* Hero Content */}
            <div className="z-10 text-center px-2 md:px-4 mb-8 md:mb-12">
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-bold text-[#f7ebe9] mb-2 md:mb-4"
                style={{
                  textShadow: `0 0 10px ${CONFIG.GLOW.PRIMARY_COLOR}40, 0 0 20px ${CONFIG.GLOW.PRIMARY_COLOR}20`,
                  animation: `textGlow ${CONFIG.GLOW.PULSE_DURATION} ease-in-out infinite`
                }}
              >SoroFinance</h1>
              <h2 
                className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 md:mb-16 text-[#f7ebe9]"
                style={{
                  textShadow: `0 0 5px ${CONFIG.GLOW.SECONDARY_COLOR}30`
                }}
              >Smart Accounting & Payments<br className="hidden sm:block"/>for Stellar Projects</h2>
              <p className="text-base md:text-xl mb-6 md:mb-10 text-[#f7ebe9]/80 px-2">
                A structured way to manage your project&apos;s finances, automate payments,<br className="hidden md:block"/>and streamline SCF applications.
              </p>
              
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://forms.gle/PiXrFdKPPFoRqwXp9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ae5042] text-[#f7ebe9] px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:bg-[#378090] text-sm sm:text-base cursor-pointer transform-gpu"
                  style={{
                    animation: !isMobile ? `buttonMove ${CONFIG.BUTTON.DURATION} ease-in-out infinite` : 'none',
                    boxShadow: `0 0 10px ${CONFIG.GLOW.PRIMARY_COLOR}60, 0 0 20px ${CONFIG.GLOW.PRIMARY_COLOR}30`,
                    transition: 'background-color 0.3s ease-in-out, transform 0.2s ease, box-shadow 0.3s ease-in-out'
                  }}
                >
                  Give feedback
                </a>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 z-10 px-2 md:px-4 max-w-4xl mx-auto">
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
                  className="rounded-xl p-4 md:p-6 border border-[#f7ebe9]/20 transform-gpu hover:scale-[1.05] md:hover:scale-[1.05] hover:border-[#f7ebe9]/30 shadow-lg relative overflow-hidden bg-white/[0.02]"
                  style={{
                    animation: !isMobile ? `
                      float${i + 1} ${CONFIG.FLOAT.DURATION} ease-in-out infinite,
                      tilt${i + 1} ${CONFIG.FLOAT.DURATION} ease-in-out infinite,
                      borderGlow ${CONFIG.GLOW.PULSE_DURATION} ease-in-out infinite
                    ` : 'none',
                    animationDelay: `${i * 0.2}s`,
                    boxShadow: `0 0 8px ${CONFIG.GLOW.SECONDARY_COLOR}30, inset 0 0 5px ${CONFIG.GLOW.SECONDARY_COLOR}20`,
                    transition: `all ${CONFIG.HOVER.DURATION} cubic-bezier(0.175, 0.885, 0.32, 1.275)`
                  }}
                >
                  <div className="absolute -right-8 -bottom-8 opacity-5">
                    <feature.Icon size={isMobile ? 120 : 180} strokeWidth={0.5} />
                  </div>
                  <div className="relative">
                    <h3 
                      className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-[#f7ebe9]"
                      style={{
                        textShadow: `0 0 5px ${CONFIG.GLOW.ACCENT_COLOR}40`
                      }}
                    >{feature.title}</h3>
                    <p className="text-xs md:text-sm text-[#f7ebe9]/80">{feature.desc}</p>
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
