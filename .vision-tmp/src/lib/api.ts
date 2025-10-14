import { supabase, Video } from './supabase';

// Video API functions
export const videoApi = {
  // Create a new video record
  async createVideo(data: {
    title: string;
    prompt: string;
    user_id: string;
  }): Promise<Video> {
    const { data: video, error } = await supabase
      .from('videos')
      .insert([
        {
          title: data.title,
          prompt: data.prompt,
          user_id: data.user_id,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return video;
  },

  // Get all videos for a user
  async getUserVideos(userId: string): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a single video by ID
  async getVideoById(videoId: string): Promise<Video> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update video status and metadata
  async updateVideo(
    videoId: string,
    updates: Partial<Omit<Video, 'id' | 'user_id' | 'created_at'>>
  ): Promise<Video> {
    const { data, error } = await supabase
      .from('videos')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', videoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a video
  async deleteVideo(videoId: string): Promise<void> {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) throw error;
  },

  // Upload video file to Supabase Storage
  async uploadVideo(
    videoId: string,
    file: Blob,
    userId: string
  ): Promise<string> {
    const fileName = `${userId}/${videoId}.mp4`;

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },

  // Download video from URL and upload to Supabase
  async downloadAndUploadVideo(
    videoId: string,
    videoUrl: string,
    userId: string
  ): Promise<string> {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    return this.uploadVideo(videoId, blob, userId);
  },
};

// Authentication helper functions
export const authApi = {
  // Sign up with email and password
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });

    if (error) throw error;

    // Create user record in users table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: name,
          },
        ]);

      if (insertError) throw insertError;
    }

    return data;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to video updates
  subscribeToVideos(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('videos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};
