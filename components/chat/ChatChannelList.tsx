'use client';

import { useState, useEffect } from 'react';
import { ChannelList } from 'stream-chat-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  MessageCircle,
  Users,
  Settings 
} from 'lucide-react';

interface ChatChannelListProps {
  onChannelSelect?: (channelId: string, channelType: string) => void;
}

export default function ChatChannelList({ onChannelSelect }: ChatChannelListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filters = {
    type: 'messaging',
    members: { $in: ['current-user-id'] }, // This will be replaced with actual user ID
  };

  const sort = {
    last_message_at: 'desc' as const,
  };

  const options = {
    state: true,
    watch: true,
    presence: true,
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <span>Messages</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="h-full">
          <ChannelList
            filters={filters}
            options={options}
            showChannelSearch
            additionalChannelSearchProps={{
              searchForChannels: true,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}







