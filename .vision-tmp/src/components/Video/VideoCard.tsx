import React from 'react';
import { Video } from '../../lib/supabase';

interface VideoCardProps {
  video: Video;
  onPlay?: (video: Video) => void;
  onDelete?: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onDelete,
}) => {
  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: '대기 중', color: 'bg-gray-500' },
      processing: { label: '생성 중', color: 'bg-yellow-500' },
      completed: { label: '완료', color: 'bg-green-500' },
      failed: { label: '실패', color: 'bg-red-500' },
    };

    const config = statusConfig[video.status];

    return (
      <span
        className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div
        className="relative h-48 bg-gray-200 cursor-pointer"
        onClick={() => video.status === 'completed' && onPlay?.(video)}
      >
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        )}

        {/* Play overlay for completed videos */}
        {video.status === 'completed' && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white opacity-0 hover:opacity-100 transition-opacity"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        )}

        {/* Processing overlay */}
        {video.status === 'processing' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">생성 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {video.title}
          </h3>
          {getStatusBadge()}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {video.prompt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(video.created_at)}</span>
          {video.duration && (
            <span>{video.duration}초</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {video.status === 'completed' && (
            <>
              <button
                onClick={() => onPlay?.(video)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                재생
              </button>
              {video.video_url && (
                <a
                  href={video.video_url}
                  download
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium text-center"
                >
                  다운로드
                </a>
              )}
            </>
          )}
          <button
            onClick={() => onDelete?.(video.id)}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};
