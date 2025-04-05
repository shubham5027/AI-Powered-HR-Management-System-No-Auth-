
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { Mic, MicOff, Video, VideoOff, CheckCircle } from 'lucide-react';

interface InterviewRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopMediaTracks();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
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
        onRecordingComplete(audioBlob);
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
      
      toast.success("Recording completed");
    }
  };
  
  // Reset recording
  const resetRecording = () => {
    setRecordingComplete(false);
    setAudioBlob(null);
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
