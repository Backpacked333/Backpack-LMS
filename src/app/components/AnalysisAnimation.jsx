import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { analyzeHomeworkMock } from '../utils/fakeAiService';

function AnalysisAnimation({ onComplete }) {
  const [statusText, setStatusText] = useState("Extracting Text...");
  const brainRef = useRef(null);
  const textChunksRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate lines of text swirling or fading in
    tl.from(textChunksRef.current.children, {
      opacity: 0,
      x: -20,
      stagger: 0.2,
      duration: 0.5,
    });

    // Brain pulses
    tl.to(brainRef.current, {
      scale: 1.05,
      repeat: 3,
      yoyo: true,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    // Update status text in steps
    tl.call(() => setStatusText("Analyzing Patterns..."));
    tl.to(brainRef.current, { rotation: 20, duration: 0.5 });
    tl.to(brainRef.current, { rotation: -20, duration: 0.5 });
    tl.call(() => setStatusText("Finalizing..."));

    // Emulate AI analysis with a small delay
    tl.call(async () => {
      const result = await analyzeHomeworkMock();
      onComplete(result);
    });

  }, [onComplete]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
      }}
    >
      <h2>AI Analysis</h2>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '50px',
        }}
      >
        {/* Left side: text extraction display */}
        <div ref={textChunksRef}>
          <p>Student Name: Jane Doe</p>
          <p>Homework #2: Algebra</p>
          <p>Equation: x^2 + 5x - 6 = 0</p>
          <p>Answer: x = 1 or x = -6</p>
        </div>

        {/* Right side: "Brain" illustration */}
        <div
          ref={brainRef}
          style={{
            width: 100,
            height: 100,
            background: '#d5f2fa',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
        >
          AI
        </div>
      </div>

      <h4>{statusText}</h4>
    </div>
  );
}

export default AnalysisAnimation;
