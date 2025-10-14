import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { videoApi } from '../lib/api';
import { subscriptions } from '../lib/api';
import { Video } from '../lib/supabase';

export const useRealtimeVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Load initial videos
  useEffect(() => {
    const loadVideos = async () => {
      if (!user) {
        setVideos([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await videoApi.getUserVideos(user.id);
        setVideos(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading videos:', err);
        setError('비디오 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [user]);

  // Setup real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = subscriptions.subscribeToVideos(user.id, (payload) => {
      console.log('Realtime update:', payload);

      switch (payload.eventType) {
        case 'INSERT':
          // New video created
          setVideos((prev) => [payload.new as Video, ...prev]);
          break;

        case 'UPDATE':
          // Video updated
          setVideos((prev) =>
            prev.map((v) =>
              v.id === payload.new.id ? (payload.new as Video) : v
            )
          );
          break;

        case 'DELETE':
          // Video deleted
          setVideos((prev) => prev.filter((v) => v.id !== payload.old.id));
          break;
      }
    });

    setChannel(subscription);

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [user]);

  const refresh = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await videoApi.getUserVideos(user.id);
      setVideos(data);
      setError(null);
    } catch (err: any) {
      console.error('Error refreshing videos:', err);
      setError('비디오 목록을 새로고침하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      await videoApi.deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch (err: any) {
      console.error('Error deleting video:', err);
      throw new Error('비디오 삭제에 실패했습니다.');
    }
  };

  return {
    videos,
    loading,
    error,
    refresh,
    deleteVideo,
  };
};
