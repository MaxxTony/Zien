const API_BASE_URL = 'http://18.219.170.119:4000/api';

export interface SocialPostMedia {
  id: number;
  post_id: number;
  media_url: string;
  media_type: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: number;
  user_id: number;
  campaign_id: number | null;
  property_id: number | null;
  caption: string;
  status: number;
  scheduled_at: string | null;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  media: SocialPostMedia[];
  post_platforms: any[];
}

/**
 * Fetch social posts by status.
 * status=1 → scheduled/upcoming posts
 */
export const getSocialPosts = async (token: string, status?: number): Promise<SocialPost[]> => {
  const params = status !== undefined ? `?status=${status}` : '';
  const response = await fetch(`${API_BASE_URL}/solo/social/posts${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Failed to fetch social posts');
  }

  return json.data;
};

/**
 * Create a new social post (scheduled or immediate).
 */
export const createSocialPost = async (token: string, payload: any): Promise<{ success: boolean; message: string; post: SocialPost }> => {
  const response = await fetch(`${API_BASE_URL}/solo/social/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Failed to create social post');
  }

  return json;
};
