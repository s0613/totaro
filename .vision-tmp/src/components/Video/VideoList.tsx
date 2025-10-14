import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { videoApi } from '../../lib/api';
import { Video } from '../../lib/supabase';
import { VideoCard } from './VideoCard';

interface VideoListProps {
  onVideoPlay?: (video: Video) => void;
  refreshTrigger?: number;
}

export const VideoList: React.FC<VideoListProps> = ({
  onVideoPlay,
  refreshTrigger,
}) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVideos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      const data = await videoApi.getUserVideos(user.id);
      setVideos(data);
    } catch (err: any) {
      console.error('Error loading videos:', err);
      setError('비디오 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [user, refreshTrigger]);

  const handleDelete = async (videoId: string) => {
    if (!confirm('정말로 이 비디오를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await videoApi.deleteVideo(videoId);
      setVideos(videos.filter((v) => v.id !== videoId));
    } catch (err: any) {
      console.error('Error deleting video:', err);
      alert('비디오 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">비디오 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          비디오가 없습니다
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          새로운 비디오를 생성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          내 비디오 ({videos.length})
        </h2>
        <button
          onClick={loadVideos}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          새로고침
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onPlay={onVideoPlay}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
