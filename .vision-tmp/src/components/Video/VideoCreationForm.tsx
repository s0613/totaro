import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { videoApi } from '../../lib/api';
import { falService, pollVideoStatus } from '../../lib/falService';

interface VideoCreationFormProps {
  onVideoCreated?: (videoId: string) => void;
}

export const VideoCreationForm: React.FC<VideoCreationFormProps> = ({
  onVideoCreated,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);

    try {
      // 1. Create video record in Supabase
      const video = await videoApi.createVideo({
        title,
        prompt,
        user_id: user.id,
      });

      setProgress(10);

      // 2. Generate video using fal.ai (async)
      const { request_id } = await falService.generateVideoAsync({
        prompt,
        duration,
        aspectRatio,
      });

      // Update video with request_id
      await videoApi.updateVideo(video.id, {
        fal_request_id: request_id,
        status: 'processing',
      });

      setProgress(20);

      // 3. Poll for video status
      const result = await pollVideoStatus(
        request_id,
        (status) => {
          // Update progress
          if (status.progress) {
            setProgress(20 + (status.progress * 0.7)); // 20% -> 90%
          }

          // Update video status in database
          videoApi.updateVideo(video.id, {
            status: status.status,
          });
        }
      );

      setProgress(90);

      // 4. Update video with final result
      await videoApi.updateVideo(video.id, {
        status: 'completed',
        video_url: result.video_url,
        thumbnail_url: result.thumbnail_url,
        duration: result.duration,
      });

      setProgress(100);

      // Reset form
      setTitle('');
      setPrompt('');
      setDuration(5);

      // Notify parent
      onVideoCreated?.(video.id);
    } catch (err: any) {
      console.error('Error creating video:', err);
      setError(err.message || '비디오 생성에 실패했습니다.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">새 비디오 생성</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            비디오 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 아름다운 일몰 풍경"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            비디오 프롬프트
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="생성하고 싶은 비디오를 상세히 설명해주세요..."
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            예: "해변에서 파도가 부드럽게 밀려오는 모습, 석양이 지평선에 걸쳐있고 갈매기들이 날아다니는 평화로운 장면"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              화면 비율
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="16:9">16:9 (가로)</option>
              <option value="9:16">9:16 (세로)</option>
              <option value="1:1">1:1 (정사각형)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              길이 (초)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={3}
              max={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        {loading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>생성 중...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? '비디오 생성 중...' : '비디오 생성'}
        </button>
      </form>
    </div>
  );
};
