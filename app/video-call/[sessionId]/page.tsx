'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  Users,
  MessageCircle,
  Share,
  Circle,
  Square
} from 'lucide-react';

interface VideoCallProps {
  sessionId: string;
}

function VideoCallContent({ sessionId }: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([
    { id: '1', name: 'Dr. Ahmed Vet', isVideoOn: true, isAudioOn: true, isYou: false },
    { id: '2', name: 'You', isVideoOn: true, isAudioOn: true, isYou: true }
  ]);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate call connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    // Call duration timer
    const durationTimer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(durationTimer);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const endCall = () => {
    // In production, this would end the actual call
    window.history.back();
  };

  const openChat = () => {
    // In production, this would open the chat sidebar
    console.log('Opening chat...');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Recording</span>
            </div>
            <div className="text-sm">
              {formatDuration(callDuration)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openChat}
              className="bg-black/50 border-white/20 text-white hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-white/20 text-white hover:bg-white/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex h-screen">
        {/* Remote Video (Main) */}
        <div className="flex-1 relative bg-gray-900">
          {isConnected ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Video className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Dr. Ahmed Vet</h3>
                <p className="text-gray-400">
                  {isVideoOn ? 'Video call in progress' : 'Video is off'}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                <h3 className="text-xl font-medium mb-2">Connecting...</h3>
                <p className="text-gray-400">Please wait while we connect your call</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Video className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-300">You</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-black/50 rounded-full px-6 py-4">
          {/* Mute/Unmute */}
          <Button
            onClick={toggleAudio}
            className={`w-12 h-12 rounded-full ${
              isAudioOn 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAudioOn ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>

          {/* Video On/Off */}
          <Button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full ${
              isVideoOn 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoOn ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            onClick={toggleScreenShare}
            className={`w-12 h-12 rounded-full ${
              isScreenSharing 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <Share className="h-6 w-6" />
          </Button>

          {/* Record */}
          <Button
            onClick={toggleRecording}
            className={`w-12 h-12 rounded-full ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isRecording ? (
              <Square className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </Button>

          {/* End Call */}
          <Button
            onClick={endCall}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Participants List */}
      <div className="absolute top-4 right-4 w-64">
        <Card className="bg-black/50 border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">Participants</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <Video className="h-4 w-4 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {participant.name}
                    </p>
                    <div className="flex items-center space-x-1">
                      {participant.isVideoOn && (
                        <Video className="h-3 w-3 text-green-400" />
                      )}
                      {participant.isAudioOn && (
                        <Mic className="h-3 w-3 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Quality Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-sm text-white">Excellent</span>
        </div>
      </div>
    </div>
  );
}

export default function VideoCallPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  return <VideoCallContent sessionId={sessionId} />;
}
