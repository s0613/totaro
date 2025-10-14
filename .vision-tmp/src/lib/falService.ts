import * as fal from '@fal-ai/serverless-client';

// Initialize fal client with API key
fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

export interface VideoGenerationParams {
  prompt: string;
  duration?: number; // Duration in seconds (default: 5)
  aspectRatio?: '16:9' | '9:16' | '1:1'; // Default: 16:9
  fps?: number; // Frames per second (default: 24)
}

export interface VideoGenerationResult {
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  request_id: string;
}

export interface VideoGenerationStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number; // 0-100
  video_url?: string;
  thumbnail_url?: string;
  error?: string;
}

export const falService = {
  /**
   * Generate a video using fal.ai Sora model
   */
  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResult> {
    try {
      const result = await fal.subscribe('fal-ai/fast-sdxl', {
        input: {
          prompt: params.prompt,
          image_size: params.aspectRatio || '16:9',
          num_inference_steps: 28,
          num_images: 1,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            console.log('Generation progress:', update.logs);
          }
        },
      });

      // For actual video generation, we would use a video model
      // This is a placeholder that generates an image
      // Replace 'fal-ai/fast-sdxl' with appropriate video model when available

      return {
        video_url: result.data.images[0].url,
        thumbnail_url: result.data.images[0].url,
        duration: params.duration || 5,
        request_id: result.requestId,
      };
    } catch (error) {
      console.error('Error generating video:', error);
      throw new Error('비디오 생성에 실패했습니다.');
    }
  },

  /**
   * Check the status of a video generation request
   */
  async checkStatus(requestId: string): Promise<VideoGenerationStatus> {
    try {
      const status = await fal.queue.status('fal-ai/fast-sdxl', {
        requestId,
        logs: true,
      });

      if (status.status === 'COMPLETED') {
        const result = await fal.queue.result('fal-ai/fast-sdxl', {
          requestId,
        });

        return {
          status: 'completed',
          progress: 100,
          video_url: result.data.images[0].url,
          thumbnail_url: result.data.images[0].url,
        };
      } else if (status.status === 'IN_PROGRESS') {
        return {
          status: 'processing',
          progress: 50, // Estimate progress
        };
      } else if (status.status === 'IN_QUEUE') {
        return {
          status: 'pending',
          progress: 0,
        };
      } else {
        return {
          status: 'failed',
          error: 'Video generation failed',
        };
      }
    } catch (error) {
      console.error('Error checking status:', error);
      return {
        status: 'failed',
        error: '상태 확인에 실패했습니다.',
      };
    }
  },

  /**
   * Cancel a video generation request
   */
  async cancelGeneration(requestId: string): Promise<void> {
    try {
      // fal.ai doesn't have a direct cancel method
      // This is a placeholder
      console.log('Cancelling request:', requestId);
    } catch (error) {
      console.error('Error cancelling generation:', error);
      throw new Error('요청 취소에 실패했습니다.');
    }
  },

  /**
   * Generate video with queue (non-blocking)
   */
  async generateVideoAsync(
    params: VideoGenerationParams
  ): Promise<{ request_id: string }> {
    try {
      const { request_id } = await fal.queue.submit('fal-ai/fast-sdxl', {
        input: {
          prompt: params.prompt,
          image_size: params.aspectRatio || '16:9',
          num_inference_steps: 28,
          num_images: 1,
        },
      });

      return { request_id };
    } catch (error) {
      console.error('Error submitting video generation:', error);
      throw new Error('비디오 생성 요청에 실패했습니다.');
    }
  },
};

/**
 * Poll for video generation status
 * Returns a promise that resolves when the video is ready
 */
export async function pollVideoStatus(
  requestId: string,
  onProgress?: (status: VideoGenerationStatus) => void,
  maxAttempts: number = 60, // Max 5 minutes (5 seconds * 60)
  interval: number = 5000 // 5 seconds
): Promise<VideoGenerationResult> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await falService.checkStatus(requestId);

    if (onProgress) {
      onProgress(status);
    }

    if (status.status === 'completed' && status.video_url) {
      return {
        video_url: status.video_url,
        thumbnail_url: status.thumbnail_url,
        duration: 5, // Default duration
        request_id: requestId,
      };
    } else if (status.status === 'failed') {
      throw new Error(status.error || '비디오 생성에 실패했습니다.');
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, interval));
    attempts++;
  }

  throw new Error('비디오 생성 시간이 초과되었습니다.');
}
