import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function ResultFeedback({ analysisResult }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });
  }, []);

  if (!analysisResult) {
    return <div>Loading result...</div>;
  }

  const { grade, feedback } = analysisResult;

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>Final Grade: {grade}</h1>
      <div style={{ marginTop: 20, maxWidth: 400 }}>
        <h3>Feedback:</h3>
        <ul>
          {feedback.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ResultFeedback;
