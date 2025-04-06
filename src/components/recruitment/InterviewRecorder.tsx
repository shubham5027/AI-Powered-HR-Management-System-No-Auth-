
// import React, { useState, useRef, useEffect } from 'react';
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { toast } from 'sonner';
// import { Mic, MicOff, Video, VideoOff, CheckCircle } from 'lucide-react';

// interface InterviewRecorderProps {
//   onRecordingComplete: (blob: Blob) => void;
//   maxDuration?: number; // in seconds
// }

// export function InterviewRecorder({
//   onRecordingComplete,
//   maxDuration = 180 // default 3 minutes
// }: InterviewRecorderProps) {
//   const [cameraOn, setCameraOn] = useState(false);
//   const [micOn, setMicOn] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [recordingComplete, setRecordingComplete] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);
//   const timerRef = useRef<number | null>(null);
  
//   // Clean up when component unmounts
//   useEffect(() => {
//     return () => {
//       stopMediaTracks();
//       if (timerRef.current) {
//         window.clearInterval(timerRef.current);
//       }
//     };
//   }, []);
  
//   const stopMediaTracks = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//   };
  
//   // Toggle camera
//   const toggleCamera = async () => {
//     if (cameraOn) {
//       setCameraOn(false);
//       stopMediaTracks();
//       setStream(null);
//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//     } else {
//       try {
//         const videoStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: micOn
//         });
        
//         setStream(videoStream);
//         if (videoRef.current) {
//           videoRef.current.srcObject = videoStream;
//         }
//         setCameraOn(true);
//         toast.success("Camera activated");
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//         toast.error("Could not access camera. Please check permissions.");
//       }
//     }
//   };
  
//   // Toggle microphone
//   const toggleMic = async () => {
//     if (micOn) {
//       setMicOn(false);
//       if (!cameraOn) {
//         stopMediaTracks();
//         setStream(null);
//       } else if (stream) {
//         // If camera is on, get a stream with just video
//         try {
//           const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: false
//           });
//           setStream(videoOnlyStream);
//           if (videoRef.current) {
//             videoRef.current.srcObject = videoOnlyStream;
//           }
//         } catch (error) {
//           console.error("Error accessing camera only:", error);
//         }
//       }
//     } else {
//       try {
//         const audioStream = await navigator.mediaDevices.getUserMedia({
//           video: cameraOn,
//           audio: true
//         });
        
//         setStream(audioStream);
//         if (videoRef.current && cameraOn) {
//           videoRef.current.srcObject = audioStream;
//         }
//         setMicOn(true);
//         toast.success("Microphone activated");
//       } catch (error) {
//         console.error("Error accessing microphone:", error);
//         toast.error("Could not access microphone. Please check permissions.");
//       }
//     }
//   };
  
//   // Start recording
//   const startRecording = () => {
//     if (!stream || !micOn) {
//       toast.error("Microphone must be enabled to record");
//       return;
//     }
    
//     try {
//       const options = {
//         mimeType: 'audio/webm'
//       };
      
//       // Create media recorder with audio track only
//       const audioStream = new MediaStream(stream.getAudioTracks());
//       const mediaRecorder = new MediaRecorder(audioStream, options);
      
//       chunksRef.current = [];
      
//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           chunksRef.current.push(e.data);
//         }
//       };
      
//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
//         setAudioBlob(audioBlob);
//         setRecordingComplete(true);
//         onRecordingComplete(audioBlob);
//       };
      
//       mediaRecorderRef.current = mediaRecorder;
//       mediaRecorder.start();
//       setRecording(true);
      
//       // Set timer
//       setRecordingTime(0);
//       timerRef.current = window.setInterval(() => {
//         setRecordingTime(prev => {
//           if (prev >= maxDuration - 1) {
//             stopRecording();
//             return maxDuration;
//           }
//           return prev + 1;
//         });
//       }, 1000);
      
//       toast.success("Recording started");
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       toast.error("Failed to start recording. Please try again.");
//     }
//   };
  
//   // Stop recording
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && recording) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
      
//       if (timerRef.current) {
//         window.clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
      
//       toast.success("Recording completed");
//     }
//   };
  
//   // Reset recording
//   const resetRecording = () => {
//     setRecordingComplete(false);
//     setAudioBlob(null);
//     setRecordingTime(0);
//     chunksRef.current = [];
//   };
  
//   return (
//     <div className="space-y-4">
//       {/* Video preview */}
//       <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center overflow-hidden">
//         {cameraOn ? (
//           <video 
//             ref={videoRef} 
//             autoPlay 
//             muted 
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="text-center p-4">
//             <VideoOff className="h-12 w-12 mx-auto text-gray-400 mb-2" />
//             <p className="text-gray-500">Camera is off</p>
//           </div>
//         )}
//       </div>
      
//       {/* Controls */}
//       <div className="flex justify-center space-x-4">
//         <Button
//           onClick={toggleCamera}
//           variant={cameraOn ? "default" : "outline"}
//           className="flex items-center gap-2"
//           type="button"
//           disabled={recording}
//         >
//           {cameraOn ? (
//             <>
//               <VideoOff className="h-4 w-4" />
//               <span>Turn Off Camera</span>
//             </>
//           ) : (
//             <>
//               <Video className="h-4 w-4" />
//               <span>Turn On Camera</span>
//             </>
//           )}
//         </Button>
        
//         <Button
//           onClick={toggleMic}
//           variant={micOn ? "default" : "outline"}
//           className="flex items-center gap-2"
//           type="button"
//           disabled={recording}
//         >
//           {micOn ? (
//             <>
//               <MicOff className="h-4 w-4" />
//               <span>Turn Off Mic</span>
//             </>
//           ) : (
//             <>
//               <Mic className="h-4 w-4" />
//               <span>Turn On Mic</span>
//             </>
//           )}
//         </Button>
//       </div>
      
//       {/* Recording controls */}
//       <div className="space-y-4">
//         {(recording || recordingTime > 0) && (
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span>Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
//               <span>{Math.floor(maxDuration / 60)}:{(maxDuration % 60).toString().padStart(2, '0')}</span>
//             </div>
//             <Progress value={(recordingTime / maxDuration) * 100} className="h-2" />
//           </div>
//         )}
        
//         <div className="flex justify-center space-x-4">
//           {!recording && !recordingComplete && (
//             <Button
//               onClick={startRecording}
//               className="bg-red-500 hover:bg-red-600 text-white"
//               disabled={!micOn || recording}
//             >
//               Start Recording
//             </Button>
//           )}
          
//           {recording && (
//             <Button
//               onClick={stopRecording}
//               variant="outline"
//               className="border-red-500 text-red-500 hover:bg-red-50"
//             >
//               Stop Recording
//             </Button>
//           )}
          
//           {recordingComplete && (
//             <div className="flex flex-col items-center gap-2">
//               <div className="flex items-center text-green-600 gap-1">
//                 <CheckCircle className="h-5 w-5" />
//                 <span>Recording complete</span>
//               </div>
//               <Button onClick={resetRecording} variant="outline" size="sm">
//                 Record Again
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { toast } from 'sonner';
// import { 
//   Mic, 
//   MicOff, 
//   Video, 
//   VideoOff, 
//   CheckCircle, 
//   AlertTriangle, 
//   CheckCircle2, 
//   XCircle
// } from 'lucide-react';

// interface InterviewRecorderProps {
//   onRecordingComplete: (audioBlob: Blob, videoFrames?: Blob[]) => void;
//   maxDuration?: number; // in seconds
//   frameCaptureFps?: number; // frames per second for video capture
// }

// export function InterviewRecorder({
//   onRecordingComplete,
//   maxDuration = 180, // default 3 minutes
//   frameCaptureFps = 1 // capture 1 frame per second by default
// }: InterviewRecorderProps) {
//   const [cameraOn, setCameraOn] = useState(false);
//   const [micOn, setMicOn] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [recordingComplete, setRecordingComplete] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [videoFrames, setVideoFrames] = useState<Blob[]>([]);
//   const [faceDetected, setFaceDetected] = useState<boolean | null>(null);
//   const [showFaceAlert, setShowFaceAlert] = useState(false);
  
//   // References
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const timerRef = useRef<number | null>(null);
//   const frameCapturerRef = useRef<number | null>(null);
//   const faceCheckTimerRef = useRef<number | null>(null);
//   const noFaceDetectionCountRef = useRef(0);
  
//   // Clean up when component unmounts
//   useEffect(() => {
//     return () => {
//       stopMediaTracks();
//       if (timerRef.current) {
//         window.clearInterval(timerRef.current);
//       }
//       if (frameCapturerRef.current) {
//         window.clearInterval(frameCapturerRef.current);
//       }
//       if (faceCheckTimerRef.current) {
//         window.clearTimeout(faceCheckTimerRef.current);
//       }
//     };
//   }, []);
  
//   const stopMediaTracks = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//     }
//   };
  
//   // Capture a single frame from video
//   const captureVideoFrame = (): Blob | null => {
//     if (!videoRef.current || !canvasRef.current || !cameraOn) return null;
    
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
    
//     if (!context) return null;
    
//     // Set canvas dimensions to match video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
    
//     // Draw current video frame to canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     // Convert canvas to blob
//     return new Promise<Blob | null>((resolve) => {
//       canvas.toBlob((blob) => {
//         resolve(blob);
//       }, 'image/jpeg', 0.85); // JPEG at 85% quality
//     });
//   };
  
//   // Check if a face is visible in the video frame
//   const checkFacePresence = async () => {
//     if (!cameraOn || !videoRef.current) {
//       setFaceDetected(null);
//       return;
//     }
    
//     try {
//       // Use simple heuristic for face detection in browser
//       // This is a placeholder for actual face detection
//       // In a real implementation, you could use a lightweight model like face-api.js
      
//       // For now, we'll assume face is present if there's enough movement/contrast in the center
//       const videoEl = videoRef.current;
//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');
      
//       if (!context) return;
      
//       canvas.width = videoEl.videoWidth;
//       canvas.height = videoEl.videoHeight;
      
//       // Draw the current frame
//       context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      
//       // Sample the center region where a face would likely be
//       const centerX = Math.floor(canvas.width / 2);
//       const centerY = Math.floor(canvas.height / 2);
//       const sampleSize = Math.min(100, Math.floor(Math.min(canvas.width, canvas.height) / 4));
      
//       const imageData = context.getImageData(
//         centerX - sampleSize/2, 
//         centerY - sampleSize/2, 
//         sampleSize, 
//         sampleSize
//       );
      
//       // Calculate variance in pixel values as a simple proxy for "something is there"
//       let sum = 0;
//       let sumSquared = 0;
//       const pixelCount = imageData.data.length / 4; // RGBA values
      
//       for (let i = 0; i < imageData.data.length; i += 4) {
//         const brightness = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
//         sum += brightness;
//         sumSquared += brightness * brightness;
//       }
      
//       const mean = sum / pixelCount;
//       const variance = sumSquared / pixelCount - mean * mean;
      
//       // Higher variance suggests more detail (potential face)
//       // This is very naive and just for demonstration
//       const isFacePresent = variance > 200; // Arbitrary threshold
      
//       setFaceDetected(isFacePresent);
      
//       if (!isFacePresent) {
//         noFaceDetectionCountRef.current += 1;
        
//         // If no face detected for 3 consecutive checks, show warning
//         if (noFaceDetectionCountRef.current >= 3) {
//           setShowFaceAlert(true);
//         }
//       } else {
//         noFaceDetectionCountRef.current = 0;
//         setShowFaceAlert(false);
//       }
//     } catch (error) {
//       console.error('Error checking face presence:', error);
//       setFaceDetected(null);
//     }
    
//     // Schedule next check
//     faceCheckTimerRef.current = window.setTimeout(checkFacePresence, 1000);
//   };
  
//   // Toggle camera
//   const toggleCamera = async () => {
//     if (cameraOn) {
//       setCameraOn(false);
//       stopMediaTracks();
//       setStream(null);
//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//       setFaceDetected(null);
//       if (faceCheckTimerRef.current) {
//         window.clearTimeout(faceCheckTimerRef.current);
//       }
//     } else {
//       try {
//         const videoStream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//             facingMode: "user"
//           },
//           audio: micOn
//         });
        
//         setStream(videoStream);
//         if (videoRef.current) {
//           videoRef.current.srcObject = videoStream;
//         }
//         setCameraOn(true);
//         toast.success("Camera activated");
        
//         // Start face detection check
//         checkFacePresence();
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//         toast.error("Could not access camera. Please check permissions.");
//       }
//     }
//   };
  
//   // Toggle microphone
//   const toggleMic = async () => {
//     if (micOn) {
//       setMicOn(false);
//       if (!cameraOn) {
//         stopMediaTracks();
//         setStream(null);
//       } else if (stream) {
//         try {
//           // If camera is on, get a stream with just video
//           const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
//             video: {
//               width: { ideal: 1280 },
//               height: { ideal: 720 },
//               facingMode: "user"
//             },
//             audio: false
//           });
//           setStream(videoOnlyStream);
//           if (videoRef.current) {
//             videoRef.current.srcObject = videoOnlyStream;
//           }
//         } catch (error) {
//           console.error("Error accessing camera only:", error);
//         }
//       }
//     } else {
//       try {
//         const audioStream = await navigator.mediaDevices.getUserMedia({
//           video: cameraOn ? {
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//             facingMode: "user"
//           } : false,
//           audio: true
//         });
        
//         setStream(audioStream);
//         if (videoRef.current && cameraOn) {
//           videoRef.current.srcObject = audioStream;
//         }
//         setMicOn(true);
//         toast.success("Microphone activated");
//       } catch (error) {
//         console.error("Error accessing microphone:", error);
//         toast.error("Could not access microphone. Please check permissions.");
//       }
//     }
//   };
  
//   // Start recording
//   const startRecording = () => {
//     if (!stream || !micOn) {
//       toast.error("Microphone must be enabled to record");
//       return;
//     }
    
//     try {
//       const options = {
//         mimeType: 'audio/webm'
//       };
      
//       // Create media recorder with audio track only
//       const audioStream = new MediaStream(stream.getAudioTracks());
//       const mediaRecorder = new MediaRecorder(audioStream, options);
      
//       audioChunksRef.current = [];
//       setVideoFrames([]);
      
//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           audioChunksRef.current.push(e.data);
//         }
//       };
      
//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//         setAudioBlob(audioBlob);
//         setRecordingComplete(true);
//         onRecordingComplete(audioBlob, videoFrames);
//       };
      
//       mediaRecorderRef.current = mediaRecorder;
//       mediaRecorder.start();
//       setRecording(true);
      
//       // Set timer for recording duration
//       setRecordingTime(0);
//       timerRef.current = window.setInterval(() => {
//         setRecordingTime(prev => {
//           if (prev >= maxDuration - 1) {
//             stopRecording();
//             return maxDuration;
//           }
//           return prev + 1;
//         });
//       }, 1000);
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { Mic, MicOff, Video, VideoOff, CheckCircle, Camera } from 'lucide-react';

interface InterviewRecorderProps {
  onRecordingComplete: (audioBlob: Blob, imageBlob: Blob | null) => void;
  maxDuration?: number; // in seconds
}

export function InterviewRecorder({
  onRecordingComplete,
  maxDuration = 180 // default 3 minutes
}: InterviewRecorderProps) {
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [captureInterval, setCaptureInterval] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    canvasRef.current = document.createElement('canvas');
  }, []);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopMediaTracks();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (captureInterval) {
        window.clearInterval(captureInterval);
      }
    };
  }, [captureInterval]);
  
  const stopMediaTracks = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // Toggle camera
  const toggleCamera = async () => {
    if (cameraOn) {
      setCameraOn(false);
      stopMediaTracks();
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } else {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: micOn
        });
        
        setStream(videoStream);
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
        }
        setCameraOn(true);
        toast.success("Camera activated");
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast.error("Could not access camera. Please check permissions.");
      }
    }
  };
  
  // Toggle microphone
  const toggleMic = async () => {
    if (micOn) {
      setMicOn(false);
      if (!cameraOn) {
        stopMediaTracks();
        setStream(null);
      } else if (stream) {
        // If camera is on, get a stream with just video
        try {
          const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          setStream(videoOnlyStream);
          if (videoRef.current) {
            videoRef.current.srcObject = videoOnlyStream;
          }
        } catch (error) {
          console.error("Error accessing camera only:", error);
        }
      }
    } else {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          video: cameraOn,
          audio: true
        });
        
        setStream(audioStream);
        if (videoRef.current && cameraOn) {
          videoRef.current.srcObject = audioStream;
        }
        setMicOn(true);
        toast.success("Microphone activated");
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast.error("Could not access microphone. Please check permissions.");
      }
    }
  };
  
  // Capture image from video stream
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          setImageBlob(blob);
        }
      }, 'image/jpeg', 0.95);
    }
  };
  
  // Start recording
  const startRecording = () => {
    if (!stream || !micOn) {
      toast.error("Microphone must be enabled to record");
      return;
    }
    
    try {
      const options = {
        mimeType: 'audio/webm'
      };
      
      // Create media recorder with audio track only
      const audioStream = new MediaStream(stream.getAudioTracks());
      const mediaRecorder = new MediaRecorder(audioStream, options);
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setRecordingComplete(true);
        onRecordingComplete(audioBlob, imageBlob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
      
      // Set timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
      
      // If camera is on, start capturing images at intervals
      if (cameraOn) {
        // Capture initial image
        captureImage();
        
        // Set up interval to capture an image every 15 seconds
        const interval = window.setInterval(() => {
          captureImage();
        }, 15000);
        
        setCaptureInterval(interval);
      }
      
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording. Please try again.");
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (captureInterval) {
        window.clearInterval(captureInterval);
        setCaptureInterval(null);
      }
      
      // Capture final image if camera is on
      if (cameraOn) {
        captureImage();
      }
      
      toast.success("Recording completed");
    }
  };
  
  // Manual image capture
  const handleCaptureImage = () => {
    if (cameraOn) {
      captureImage();
      toast.success("Image captured for analysis");
    } else {
      toast.error("Camera must be enabled to capture image");
    }
  };
  
  // Reset recording
  const resetRecording = () => {
    setRecordingComplete(false);
    setAudioBlob(null);
    setImageBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
  };
  
  return (
    <div className="space-y-4">
      {/* Video preview */}
      <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center overflow-hidden">
        {cameraOn ? (
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <VideoOff className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Camera is off</p>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={toggleCamera}
          variant={cameraOn ? "default" : "outline"}
          className="flex items-center gap-2"
          type="button"
          disabled={recording}
        >
          {cameraOn ? (
            <>
              <VideoOff className="h-4 w-4" />
              <span>Turn Off Camera</span>
            </>
          ) : (
            <>
              <Video className="h-4 w-4" />
              <span>Turn On Camera</span>
            </>
          )}
        </Button>
        
        <Button
          onClick={toggleMic}
          variant={micOn ? "default" : "outline"}
          className="flex items-center gap-2"
          type="button"
          disabled={recording}
        >
          {micOn ? (
            <>
              <MicOff className="h-4 w-4" />
              <span>Turn Off Mic</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              <span>Turn On Mic</span>
            </>
          )}
        </Button>
        
        {cameraOn && !recording && !recordingComplete && (
          <Button
            onClick={handleCaptureImage}
            variant="outline"
            className="flex items-center gap-2"
            type="button"
          >
            <Camera className="h-4 w-4" />
            <span>Capture Image</span>
          </Button>
        )}
      </div>
      
      {/* Recording controls */}
      <div className="space-y-4">
        {(recording || recordingTime > 0) && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
              <span>{Math.floor(maxDuration / 60)}:{(maxDuration % 60).toString().padStart(2, '0')}</span>
            </div>
            <Progress value={(recordingTime / maxDuration) * 100} className="h-2" />
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          {!recording && !recordingComplete && (
            <Button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={!micOn || recording}
            >
              Start Recording
            </Button>
          )}
          
          {recording && (
            <Button
              onClick={stopRecording}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Stop Recording
            </Button>
          )}
          
          {recordingComplete && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center text-green-600 gap-1">
                <CheckCircle className="h-5 w-5" />
                <span>Recording complete</span>
              </div>
              <Button onClick={resetRecording} variant="outline" size="sm">
                Record Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
