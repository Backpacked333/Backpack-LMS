import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, FileText, Bot, CheckCircle, Loader, AlertTriangle, ThumbsUp,ThumbsDown } from "lucide-react";

// AnimatedBackground component
const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    // Set canvas size
    const setCanvasSize = () => {
      const { clientWidth: width, clientHeight: height } = canvas.parentElement;
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.scale(2, 2);
      return { width, height };
    };

    let { width, height } = setCanvasSize();
    
    // Initialize dots
    const spacing = 18;
    const dots = [];
    for(let y = 0; y < height; y += spacing) {
      for(let x = 0; x < width; x += spacing) {
        dots.push({
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          size: 1,
          offset: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.2 + 0.8,
          opacity: Math.random() * 0.3 + 0.6,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseRadius = 100;
    let mouseInfluence = false;

    // Mouse interaction
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseInfluence = true;
    };

    const handleMouseOut = () => {
      mouseInfluence = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    const animate = () => {
      context.fillStyle = '#111827'; // Dark background
      context.fillRect(0, 0, width * 2, height * 2);

      const time = Date.now() * 0.001;
      const globalWave = Math.sin(time * 0.5) * 2;

      dots.forEach((dot) => {
        const waveX = Math.sin(time * dot.speed + dot.offset + dot.baseX * 0.02) * 2;
        const waveY = Math.cos(time * 0.8 + dot.offset + dot.baseY * 0.02) * 2;

        const angle = Math.atan2(dot.baseY - height/2, dot.baseX - width/2);
        const distance = Math.sqrt(Math.pow(dot.baseX - width/2, 2) + Math.pow(dot.baseY - height/2, 2));
        const circularWave = Math.sin(distance * 0.05 - time * 2) * 1;

        dot.x = dot.baseX + waveX + circularWave * Math.cos(angle);
        dot.y = dot.baseY + waveY + circularWave * Math.sin(angle);

        if (mouseInfluence) {
          const dx = mouseX - dot.x;
          const dy = mouseY - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * 8;
            dot.x -= dx * force / dist;
            dot.y -= dy * force / dist;
          }
        }

        const opacityWave = Math.sin(time * 1.5 + dot.phase + distance * 0.01) * 0.3;
        dot.opacity = 0.2 + opacityWave + (globalWave * 0.1); // Reduced base opacity

        const sizeVar = 1 + Math.sin(time + dot.phase) * 0.2;
        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
        context.arc(dot.x, dot.y, dot.size * sizeVar, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      ({ width, height } = setCanvasSize());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#111827' }}
    />
  );
};

// Insight Box Component
const InsightBox = ({ type, title, content }) => {
  const getTypeStyles = () => {
    switch(type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'success':
        return <ThumbsUp size={20} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-500" />;
      case 'error':
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return <Bot size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className={`rounded-lg border p-4 my-4 ${getTypeStyles()}`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm opacity-90">{content}</p>
        </div>
      </div>
    </div>
  );
};

const TypewriterText = ({ text, delay = 1, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return <span className="font-nunito text-sm text-black">{displayedText}</span>;
};

const HomeworkScannerDemo = () => {
  const [stage, setStage] = useState(0);
  const [processingStages, setProcessingStages] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileInputRef = useRef(null);

  const renderAnalysis = () => (
    <div className="prose max-w-none space-y-4">
      <TypewriterText text="Analyzing student's response..." delay={1} />
      
      <InsightBox
        type="success"
        title="Strong Understanding"
        content="Student correctly identifies the fraction 2/6 and demonstrates clear understanding of the relationship between parts and whole."
      />

      <TypewriterText text={`
Document Analysis:
→ Question identified: Mrs. Frances drew a picture on the board and asked students about fraction representation
→ Visual element detected: Bar divided into 6 parts with 2 parts colored
→ Student response located: Multiple answers found
      `} delay={1} />

      <InsightBox
        type="warning"
        title="Potential Enhancement"
        content="While the answer is correct, student could benefit from learning about equivalent fractions (e.g., 1/3)."
      />

      <TypewriterText text={`
Detailed Evaluation:
1. Emily's Answer:
   ✓ Correctly identified fraction as 2/6
   ✓ Demonstrated understanding by:
     - Counting total parts (6)
     - Identifying colored parts (2)
     - Making correct ratio (2/6)
   ✓ Provided clear explanation of reasoning
      `} delay={1} />

      <InsightBox
        type="success"
        title="Clear Reasoning"
        content="Student shows excellent ability to explain their thinking process, breaking down the problem into clear steps."
      />

      <TypewriterText text={`
Recommendations:
• Encourage student to continue explaining reasoning
• Consider introducing equivalent fractions
• Ready for more complex fraction concepts
      `} delay={1} />
    </div>
  );

  const mockTranscript = `Task: Analyze student's understanding of fractions

Document Analysis:
→ Question identified: Mrs. Frances drew a picture on the board and asked students about fraction representation
→ Visual element detected: Bar divided into 6 parts with 2 parts colored
→ Student response located: Multiple answers found

Detailed Evaluation:
1. Emily's Answer:
   ✓ Correctly identified fraction as 2/6
   ✓ Demonstrated understanding by:
     - Counting total parts (6)
     - Identifying colored parts (2)
     - Making correct ratio (2/6)
   ✓ Provided clear explanation of reasoning

Student Understanding Assessment:
▸ Numerical Comprehension: Excellent
▸ Visual Interpretation: Strong
▸ Explanation Quality: Clear and logical
▸ Overall Assessment: Complete understanding demonstrated

Recommendations:
• Encourage student to continue explaining reasoning
• Consider introducing equivalent fractions
• Ready for more complex fraction concepts`;

  const stages = [
    { 
      name: 'Original Document', 
      description: 'High-resolution scan of homework',
      key: 'original'
    },
    { 
      name: 'Image Processing', 
      description: 'Enhancing document clarity',
      key: 'binary'
    },
    { 
      name: 'Text Detection', 
      description: 'Identifying written content',
      key: 'boxes'
    }
  ];

  const handleFile = async (file) => {
    try {
      setError(null);
      setStage(1);
      setAnalysisComplete(false);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/process-homework', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const result = await response.json();
      setProcessingStages(result.stages);
      setStage(2);
      
      // Start stage progression
      setCurrentStageIndex(0);
      const progressInterval = setInterval(() => {
        setCurrentStageIndex(prev => {
          if (prev >= stages.length) {
            clearInterval(progressInterval);
            setTimeout(() => setAnalysisComplete(true), 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);

    } catch (err) {
      setError(err.message);
      setStage(0);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Panel - Document Processing (60%) */}
      <div className="w-[60%] relative bg-gray-900">
        <AnimatedBackground />
        <div className="relative z-10 h-full flex flex-col">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Document Processing</h2>
            
            {/* Content Container */}
            <div className="flex-1 flex items-center justify-center p-4">
              {stage === 0 ? (
                <div 
                  className={`w-full max-w-lg border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${dragActive ? 'border-blue-400 bg-blue-500 bg-opacity-10' : 'border-gray-600'}
                    ${error ? 'border-red-400' : ''}
                    bg-white bg-opacity-5 backdrop-blur-sm`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className={`w-12 h-12 ${error ? 'text-red-400' : 'text-blue-400'}`} />
                    </div>
                    <div className='text-white'>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                      >
                        Click to upload
                      </button>
                      {' '}or drag and drop
                    </div>
                    <div className="text-sm text-gray-400">
                      Upload a homework image to begin analysis
                    </div>
                    {error && (
                      <div className="flex items-center justify-center text-red-400 space-x-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full">
                  {/* Grid layout processing stages */}
                  {stage >= 1 && processingStages && (
                    <div className="w-full h-full grid grid-cols-3 gap-4 items-stretch">
                      {stages.map((s, index) => (
                        <div 
                          key={index}
                          className={`bg-gray-800 rounded-xl shadow-lg p-4 transition-all duration-500
                            border border-gray-700 flex flex-col ${
                            index <= currentStageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            {index < currentStageIndex ? (
                              <CheckCircle className="text-green-400" size={18} />
                            ) : index === currentStageIndex ? (
                              <Loader className="text-blue-400 animate-spin" size={18} />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                            )}
                            <div>
                              <h3 className="font-semibold text-white text-sm">{s.name}</h3>
                              <p className="text-xs text-gray-400">{s.description}</p>
                            </div>
                          </div>
                          {processingStages[s.key] && (
                            <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden relative">
                              <img 
                                src={`data:image/jpeg;base64,${processingStages[s.key]}`}
                                alt={s.name}
                                className="absolute inset-0 w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  
      {/* Right Panel - AI Analysis (40%) */}
      <div className="w-[40%] bg-white overflow-y-auto">
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bot className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">AI Analysis</h2>
          </div>
          
          {/* Grade Indicator */}
          {analysisComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-600 mb-1">Estimated Grade</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">A-</span>
                <span className="text-lg font-medium text-green-600">(92%)</span>
              </div>
            </div>
            {/* Feedback Icons */}
            <div className="flex flex-col space-y-1 pl-2 border-l border-green-200">
              <button 
                className="text-gray-400 text-green-500 transition-colors"
                title="Agree with estimation"
              >
                <ThumbsUp color="green" className="w-5 h-5" />
              </button>
              <button 
                className="text-gray-400 text-red-500 transition-colors"
                title="Disagree with estimation"
              >
                <ThumbsDown color="red" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
          
          {stage === 0 && (
            <div className="text-gray-500 text-center py-12">
              Upload a document to begin analysis
            </div>
          )}
  
          {stage >= 1 && !analysisComplete && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Loader className="animate-spin text-blue-500" size={20} />
                <span className="text-gray-600">Analyzing document...</span>
              </div>
            </div>
          )}
  
          {analysisComplete && renderAnalysis()}
        </div>
      </div>
    </div>
  );
};

export default HomeworkScannerDemo;