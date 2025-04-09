import React, { useState, useEffect, useRef } from 'react';
import axios from "../helper/Axios";
import { Camera } from 'lucide-react';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const Interview_Demo = ({
  initialQuestion,
  onAnswerComplete
}) => {
  const [stream, setStream] = useState(null);
  const [timeLeft, setTimeLeft] = useState(50);
  const [isRecording, setIsRecording] = useState(false);
  const [question, setQuestion] = useState(initialQuestion);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [questions, setQuestions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const speechSynthesisRef = useRef(null);

  // Text-to-speech functionality
  const speakQuestion = (text) => {
    if (speechSynthesis.speaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };


  useEffect(() => {
    if (question.text && stream) {
      speakQuestion(question.text);
    }
  }, [question]);

  const fetchQuestionsAndStart = async (email) => {
    try {
      const response = await axios.get(`/api/candidate_questions-by-email/${email}`);
      if (response.data && response.data.length > 0) {
        const questionData = response.data[0];
        setQuestions(questionData);
  
        const firstQuestion = {
          id: 1,
          text: questionData["Qustion1"],
          totalQuestions: Object.keys(questionData).length - 1,
          currentQuestion: 1,
        };
        
        setQuestion(firstQuestion); // Set question first
        setCandidateEmail(email);
        await startCamera();
      } else {
        setApiError("No questions found for this candidate.");
      }
      setLoading(false);
    } catch (err) {
      setApiError("Failed to fetch questions. Please try again.");
      setLoading(false);
    }
  };
  




  useEffect(() => {
   Swal.fire({
         title: 'Demo Interview',
         html: `
           <div style="text-align: left; margin-top: 10px;">
           
              <div style="margin-top: 20px; ">
                 <strong>Email :-</strong><br>
                 <input 
                   type="email" 
                   id="email" 
                   placeholder="Enter your email" 
                   style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px; focus:none; outline:none;"
                 >
               </div>
             
             <div style="border-top: 1px solid #eee; padding-top: 15px;">
               <strong>Upload Resume :-</strong><br><br>
               <div style="display: flex; align-items: center;">
                 <label for="resumeUpload" style="
                   display: inline-block;
                   padding: 8px;
                   background: #f8f9fa;
                   border: 1px solid #ddd;
                   border-radius: 4px;
                   cursor: pointer;
                 ">Choose file</label>
                 <span id="fileName" style="margin-left: 10px; color: #666;">No file chosen</span>
                 <input 
                   type="file" 
                   id="resumeUpload" 
                   accept=".pdf,.doc,.docx" 
                   style="display: none;"
                 >
               </div>
               
             
             </div>
           </div>
         `,
         showCancelButton: true,
         confirmButtonText: 'Submit',
         cancelButtonText: 'Cancel',
         confirmButtonColor: '#3498db',
         cancelButtonColor: '#6c757d',
         width: '600px',
         focusConfirm: false,
         reverseButtons: true, // Places cancel button on left
         preConfirm: () => {
           const email = document.getElementById('email').value;
           // const jobTitle = document.getElementById('jobTitle').value;
           const resume = document.getElementById('resumeUpload').files[0];
     
           if (!email || !resume) {
             Swal.showValidationMessage('Both email and resume are required');
             return false;
           }
     
           if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
             Swal.showValidationMessage('Please enter a valid email address');
             return false;
           }
     
           return { email,  resume };
         },
         didOpen: () => {
           // File selection handler
           document.getElementById('resumeUpload').addEventListener('change', (e) => {
             const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
             document.getElementById('fileName').textContent = fileName;
           });
         }
       }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { email, resume } = result.value;
        setResumeFile(resume);
        fetchQuestionsAndStart(email);
      }
    });
  }, []);

  useEffect(() => {
    let timer;

    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (currentQuestionIndex < question.totalQuestions - 1) {
              const nextQuestionIndex = currentQuestionIndex + 1;
              setCurrentQuestionIndex(nextQuestionIndex);
              setQuestion({
                id: nextQuestionIndex + 1,
                text: questions[`Qustion${nextQuestionIndex + 1}`],
                totalQuestions: question.totalQuestions,
                currentQuestion: nextQuestionIndex + 1
              });
              setTimeLeft(50);
            } else {
              handleInterviewComplete();
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, timeLeft, questions, currentQuestionIndex]);


  // Handle next question
  const handleNextQuestion = () => {
    if (question.currentQuestion < question.totalQuestions) {
      const nextQuestionIndex = question.currentQuestion + 1;
      setQuestion({
        ...question,
        id: nextQuestionIndex,
        text: questions[`Qustion${nextQuestionIndex}`],
        currentQuestion: nextQuestionIndex,
      });
      setTimeLeft(50);
    } else {
      Swal.fire({
        title: "End of Questions",
        text: "You have completed all the questions!",
        icon: "info",
        confirmButtonText: "Finish",
      }).then(() => handleInterviewComplete());
    }
  };

  const handleInterviewComplete = async () => {
    setInterviewComplete(true);
    stopCamera();

    // Create final video blob from all recorded chunks
    const finalBlob = new Blob(recordedChunks, { type: 'video/webm' });

    // Create form data for API request
    const formData = new FormData();
    formData.append('email', candidateEmail);
    formData.append('resume', resumeFile);
    formData.append('video', finalBlob, 'interview.webm');

    try {
      setIsAnalyzing(true);
      const response = await axios.post('/api/candidaate/analyze/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // if (response.data.status === 'success') {
      //   Swal.fire({
      //     title: 'Analysis Complete!',
      //     text: 'Your interview has been analyzed successfully and sent to HR for further processing.',
      //     icon: 'success',
      //     showCancelButton: true,
      //     confirmButtonText: 'OK',
      //     cancelButtonText: 'Stay',
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       navigate("/");
      //     }
      //   });
      // }

    } catch (error) {
      console.error('Analysis error:', error);
      Swal.fire({
        title: 'Analysis Failed',
        text: 'There was an error analyzing your interview. Please contact support.',
        icon: 'error',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };


  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9,opus')
        ? 'video/webm; codecs=vp9,opus'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType,
        videoBitsPerSecond: 2500000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.start(1000);
      // setIsRecording(true);
      setTimeLeft(50);
      setError(null);

    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        'Unable to access camera. Please ensure you have granted camera permissions and no other application is using the camera.'
      );
    }
  };

  const stopCamera = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }

    setIsRecording(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (interviewComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 flex flex-col  items-center justify-center  ">
        <div className="bg-white rounded-lg p-8 max-w-md w-full flex flex-col items-center justify-center mx-4 shadow-lg processing">
          <h2 className="text-2xl font-bold text-center mb-4">
            {isAnalyzing ? 'Processing...' : 'Interview Complete!'}
          </h2>
          <div className="text-center">
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                {/* Circular Loader */}
                <div className="relative w-16 h-16 mb-4">
                  <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-transparent border-t-blue-600 border-b-blue-600 rounded-full animate-spin"></div>
                  </div>
                </div>

                <p className="text-gray-600">
                  Please wait while we analyze your interview responses...
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Thank you for completing the interview. Your responses have been recorded.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-[200px] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors goto cursor-pointer"
                >
                  Go to Home page
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="w-full mx-auto p-[40px]">
      <div className=" max-h-[100%]">
        {/* <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm ">
          
          <div className="absolute bottom-4 right-4">
            <div className="bg-green-500 px-3 py-1 rounded-full text-white text-sm">
              AI Interviewer
            </div>
          </div>
        </div> */}

        <div className="relative overflow-hidden rounded-lg   shadow-sm h-[700px] camera-border">
          <img
            src="./AI-Video-Interviews.jpg"
            alt="AI Interviewer"
            className="`w-full  object-cover absolute h-[140px] bg-black border-3 border-white rounded-2xl sidecamera"
          />
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full  object-cover h-[750px] ${!stream ? 'hidden' : ''}`}
          />

          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center  ">
              <Camera className="w-16 h-16 text-gray-400 mb-4 " />
              <p className="text-gray-500 text-center max-w-md px-4">
                Camera will start automatically after email verification...
              </p>
              {error && (
                <p className="text-red-500 text-sm mt-2 px-4 text-center max-w-md">
                  {error}
                </p>
              )}
            </div>
          )}

          {isRecording && (
            <div className="absolute top-4 right-4 ">
              <div className="rounded-lg border border-red-500 bg-white/90 p-4 shadow-sm recording">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-gray-900">Recording</span>
                </div>
                <span className="text-xs text-gray-700">{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white question1 mt-4 p-4 rounded-lg border border-gray-200 shadow-sm ready1 ">
        {/* Start Interview Section */}
        {!hasStarted ? (
          <div className='flex my-0 mx-auto flex-col items-center gap-4 '>
            <button
              className=" ready px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm transition duration-300 shadow-md transform hover:scale-105 cursor-pointer"
              onClick={() => {
                Swal.fire({
                  title: 'Are you ready to start the interview?',
                  text: 'Please ensure that your camera and microphone are working properly.',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, Start Interview',
                  cancelButtonText: 'Cancel',
                  reverseButtons: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    setHasStarted(true);
                    setIsRecording(true);

                    // Fetch questions and then speak the first question
                    fetchQuestionsAndStart(candidateEmail).then(() => {
                      if (question.text) {
                        speakQuestion(question.text);
                      }
                    });
                  }
                });
              }}
            >
              Start Interview when you are ready
            </button>

            <p>
              <b> Note:</b> Please check Camera and Microphone working properly before starting the interview
            </p>
          </div>
        ) : (
          // Question Section
          <div className=''>
            <div className="flex justify-between items-center mb-2 question">
              <h2 className="text-lg font-semibold">
                Question {question.currentQuestion} of {question.totalQuestions}
              </h2>
              
              <div className="flex flex-col">
                {/* Repeat Question Button */}
                <button
                  onClick={() => speakQuestion(question.text)}
                  disabled={isSpeaking}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  {isSpeaking ? (
                    <>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      Speaking...
                    </>
                  ) : (
                    'Repeat Question'
                  )}
                </button>

                {/* Next Button (Disabled when speaking) */}
                <button
                  className={`px-6 py-2 text-white font-medium rounded-lg text-sm transition duration-300 shadow-md transform cursor-pointer next ${isSpeaking
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 focus:ring-4 focus:ring-blue-300 hover:scale-105'
                    }`}
                  onClick={handleNextQuestion}
                  disabled={isSpeaking}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Question Text */}
            <p className="text-gray-700 question">{question.text}</p>
          </div>
        )}      </div>
    </div>
  );
};

export default Interview_Demo;