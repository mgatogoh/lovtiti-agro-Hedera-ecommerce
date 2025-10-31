'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Users, 
  Search,
  MoreVertical,
  Settings,
  ArrowLeft
} from 'lucide-react';
import StreamProvider from '@/components/StreamProvider';
import ChatChannelList from '@/components/chat/ChatChannelList';
import ChatChannel from '@/components/chat/ChatChannel';

function MessagingContent() {
  const [activeChannel, setActiveChannel] = useState<{id: string, type: string} | null>(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);

  const handleChannelSelect = (channelId: string, channelType: string) => {
    setActiveChannel({ id: channelId, type: channelType });
  };

  const handleBackToList = () => {
    setActiveChannel(null);
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    setIsAudioCall(false);
  };

  const startAudioCall = () => {
    setIsAudioCall(true);
    setIsVideoCall(false);
  };

  const endCall = () => {
    setIsVideoCall(false);
    setIsAudioCall(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Messages</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <ChatChannelList onChannelSelect={handleChannelSelect} />
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {activeChannel ? (
              <ChatChannel 
                channelId={activeChannel.id}
                channelType={activeChannel.type}
                onBack={handleBackToList}
              />
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a chat from the sidebar to start messaging
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Video Call Modal */}
        {isVideoCall && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <Video className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Video Call
                </h3>
                <p className="text-gray-500 mb-4">
                  Starting video call...
                </p>
                <div className="flex space-x-2 justify-center">
                  <Button onClick={endCall} variant="outline">
                    End Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Call Modal */}
        {isAudioCall && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <Phone className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Audio Call
                </h3>
                <p className="text-gray-500 mb-4">
                  Starting audio call...
                </p>
                <div className="flex space-x-2 justify-center">
                  <Button onClick={endCall} variant="outline">
                    End Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagingPage() {
  return (
    <StreamProvider>
      <MessagingContent />
    </StreamProvider>
  );
}
