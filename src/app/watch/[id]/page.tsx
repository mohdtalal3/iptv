'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import ChannelList from '@/components/ChannelList';
import { CHANNELS, getChannelById, Channel } from '@/data/channels';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [channelError, setChannelError] = useState(false);

  // Parse channel ID from params
  useEffect(() => {
    const channelId = params.id as string;
    if (!channelId) {
      router.push('/');
      return;
    }

    const channel = getChannelById(channelId);
    if (!channel) {
      setChannelError(true);
      return;
    }

    setActiveChannel(channel);
    setChannelError(false);
  }, [params.id, router]);

  if (channelError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">❌ Channel Not Found</h1>
          <p className="text-slate-400 mb-6">The channel you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!activeChannel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading channel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3 md:py-4 border-b border-blue-700">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-blue-200 hover:text-white transition text-sm md:text-base font-semibold"
          >
            ← Back to Home
          </Link>
          <h1 className="text-white font-bold text-lg md:text-xl flex items-center gap-2">
            {activeChannel.logo && <span>{activeChannel.logo}</span>}
            {activeChannel.name}
          </h1>
          <div className="w-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 md:gap-6 p-3 md:p-4">
        {/* Video Player */}
        <div className="w-full max-w-4xl mx-auto">
          <VideoPlayer
            streamUrl={activeChannel.streamUrl}
            title={activeChannel.name}
            autoPlay={true}
          />
        </div>

        {/* Share Section */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-white font-semibold text-sm mb-2">Share this channel</h3>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/watch/${activeChannel.id}`}
                className="flex-1 bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:border-blue-500 outline-none"
              />
              <button
                onClick={() => {
                  const text = `${typeof window !== 'undefined' ? window.location.origin : ''}/watch/${activeChannel.id}`;
                  navigator.clipboard.writeText(text);
                  alert('Link copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* All Channels */}
        <div className="w-full">
          <ChannelList
            channels={CHANNELS}
            activeChannelId={activeChannel.id}
            onChannelSelect={(channel: Channel) => {
              router.push(`/watch/${channel.id}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
