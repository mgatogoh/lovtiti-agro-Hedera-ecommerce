'use client';

import { useState, useEffect } from 'react';
import { Channel, MessageList, MessageInput, Thread, Window } from 'stream-chat-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Users, 
  Settings,
  ArrowLeft 
} from 'lucide-react';

interface ChatChannelProps {
  channelId: string;
  channelType: string;
  onBack?: () => void;
}

export default function ChatChannel({ channelId, channelType, onBack }: ChatChannelProps) {
  const [channel, setChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeChannel = async () => {
      try {
        // This will be handled by the parent component that has access to the Stream client
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing channel:', error);
        setIsLoading(false);
      }
    };

    initializeChannel();
  }, [channelId, channelType]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <CardTitle className="text-lg">Chat Channel</CardTitle>
              <p className="text-sm text-gray-500">Channel ID: {channelId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <div className="h-full">
          <Channel channel={channel}>
            <Window>
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </div>
      </CardContent>
    </Card>
  );
}











