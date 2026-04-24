const API_BASE_URL = 'http://18.219.170.119:4000/api';

export interface OpenHouseEvent {
  id: number;
  user_id: number;
  property_id: number;
  date: string;
  start_time: string;
  end_time: string;
  brand_color: string;
  uploaded_logo: string | null;
  status: 'live' | 'upcoming' | 'completed';
  visitors_count: number;
  hot_leads_count: number;
  gallery_images: string[];
  property: {
    address: string;
    data: any;
  };
}

export const getOpenHouses = async (token: string): Promise<OpenHouseEvent[]> => {
  const response = await fetch(`${API_BASE_URL}/solo/open-houses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Failed to fetch open houses');
  }

  return json.data;
};
export const createOpenHouse = async (token: string, payload: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/solo/open-houses`, {
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
    throw new Error(json.message || 'Failed to create open house');
  }

  return json;
};
