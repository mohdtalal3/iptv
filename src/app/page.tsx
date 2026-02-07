'use client';

import { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import ChannelList from '@/components/ChannelList';
import { CHANNELS, Channel } from '@/data/channels';

export default function Home() {
  // Default to first channel
  const [activeChannel, setActiveChannel] = useState<Channel>(CHANNELS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col gap-4 md:gap-6 p-3 md:p-4">
        {/* Video Player Section - Full Width on Mobile, Sticky */}
        <div className="w-full md:w-3/4 mx-auto">
          <VideoPlayer
            streamUrl={activeChannel.streamUrl}
            title={activeChannel.name}
            autoPlay={true}
          />
        </div>

        {/* Channel List Section */}
        <div className="w-full">
          <ChannelList
            channels={CHANNELS}
            activeChannelId={activeChannel.id}
            onChannelSelect={(channel) => setActiveChannel(channel)}
          />
        </div>
      </div>
    </div>
  );
}
