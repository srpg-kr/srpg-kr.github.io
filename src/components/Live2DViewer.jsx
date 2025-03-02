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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    let initialDistance = null;
  
    const getDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    };
  
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = getDistance(e.touches);
      }
    };
  
    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && initialDistance) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const multiplier = currentDistance / initialDistance;
  
        const live2dManager = LAppDelegate.getInstance()
                                .getSubdelegate()
                                .getLive2DManager();
        if (live2dManager && live2dManager.adjustZoom) {
          live2dManager.adjustZoom(multiplier);
        }
        // Update initialDistance so that subsequent changes are relative.
        initialDistance = currentDistance;
      }
    };
  
    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        initialDistance = null;
      }
    };
  
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
  
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
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
