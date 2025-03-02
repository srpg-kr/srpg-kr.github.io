// src/components/Live2DViewer.jsx
import React, { useRef, useEffect } from 'react';
// Import sample classes from the Cubism Web Samples (assume they have been compiled and are accessible)
import { LAppDelegate } from '../live2d/lappdelegate';

const Live2DViewer = () => {
  // Create a ref if you plan to supply your own canvas.
  // Note: In the original main.ts (&#8203;:contentReference[oaicite:1]{index=1}) the LAppDelegate does not require a canvas,
  // so if needed you may adjust LAppDelegate to accept a canvas element.
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Pass the canvas element to LAppDelegate for initialization.
    if (!LAppDelegate.getInstance().initialize(canvas)) {
      console.error("Live2D initialization failed.");
      return;
    }

    // Start the main loop (this sets up the update and render cycle)
    LAppDelegate.getInstance().run();

    // Cleanup on unmount.
    return () => {
      LAppDelegate.releaseInstance();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const handleWheel = (e) => {
      e.preventDefault(); // Prevent page scroll
      const zoomFactor = 1 - e.deltaY * 0.001; // Adjust sensitivity as needed
  
      // Assume your LAppView instance (obtained via subdelegate.getView()) has an adjustScale method.
      const subdelegate = LAppDelegate.getInstance().getSubdelegate();
      if (subdelegate && subdelegate.getLive2DManager()) {
        subdelegate.getLive2DManager().adjustZoom(zoomFactor);
      }
    };
  
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);
  

  return (
    <canvas
    ref={canvasRef}
    className='l2d-canvas'
    />
  );
};

export default Live2DViewer;
