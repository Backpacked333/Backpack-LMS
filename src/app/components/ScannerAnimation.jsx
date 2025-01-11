import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// A placeholder paper shape. Replace with your own SVG or image for more realism.
function PaperIllustration() {
  return (
    <div
      style={{
        width: 200,
        height: 280,
        background: '#fff',
        border: '2px solid #bbb',
        borderRadius: 4,
      }}
    />
  );
}

function ScannerAnimation({ onComplete }) {
  const paperRef = useRef(null);
  const beamRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // After the animation finishes, wait ~1s then call onComplete
        gsap.delayedCall(1, onComplete);
      },
    });

    // Move the paper in from left to center:
    tl.from(paperRef.current, {
      x: -300,
      duration: 1.2,
      ease: 'power2.out',
    });

    // The scanning beam sweeps over the paper
    tl.to(beamRef.current, {
      y: 0,
      duration: 1.5,
      ease: 'power1.inOut',
    });

    // Move the beam off again
    tl.to(beamRef.current, {
      y: 300,
      duration: 1.2,
      ease: 'power2.in',
    });

    // Then animate paper out (or shrink) if you like
    tl.to(paperRef.current, {
      scale: 0.5,
      autoAlpha: 0,
      duration: 0.8,
    });
  }, [onComplete]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Represent the scanner bed area */}
      <div
        style={{
          width: 400,
          height: 300,
          background: '#e5e5e5',
          border: '4px solid #ccc',
          borderRadius: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* The paper */}
        <div
          ref={paperRef}
          style={{
            position: 'absolute',
            top: 50,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <PaperIllustration />
        </div>

        {/* The scanning beam */}
        <div
          ref={beamRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 40,
            background: 'rgba(100, 200, 255, 0.3)',
            boxShadow: '0 0 8px rgba(100, 200, 255, 0.7)',
            transform: 'translateY(-300px)', // start off screen
          }}
        />
      </div>
      <h3>Scanning in Progress...</h3>
    </div>
  );
}

export default ScannerAnimation;
