'use client';

import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { useUser } from '@clerk/nextjs';
import { streamClient, generateStreamToken, getUserRoleForStream } from '@/lib/stream';

interface StreamProviderProps {
  children: React.ReactNode;
}

export default function StreamProvider({ children }: StreamProviderProps) {
  const { user, isLoaded } = useUser();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const connectUser = async () => {
      if (!isLoaded || !user) {
        setClient(null);
        return;
      }

      setIsConnecting(true);

      try {
        // Get user role from Clerk metadata
        const userRole = (user.publicMetadata?.role as string) || 'BUYER';
        
        // Generate Stream token
        const token = await generateStreamToken(user.id, userRole);

        // Connect user to Stream Chat
        await streamClient.connectUser(
          {
            id: user.id,
            name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
            image: user.imageUrl,
            role: getUserRoleForStream(userRole),
          },
          token
        );

        setClient(streamClient);
      } catch (error) {
        console.error('Error connecting to Stream Chat:', error);
        setClient(null);
      } finally {
        setIsConnecting(false);
      }
    };

    connectUser();

    // Cleanup on unmount
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [isLoaded, user]);

  // Show loading state while connecting
  if (!isLoaded || isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  // If no user or client, render children without Stream Chat
  if (!user || !client) {
    return <>{children}</>;
  }

  // Render with Stream Chat provider
  return (
    <Chat client={client} theme="str-chat__theme-light">
      {children}
    </Chat>
  );
}











