const API_BASE_URL = 'http://18.219.170.119:4000/api';
const REQUEST_TIMEOUT_MS = 15000;

export interface StatItem {
  value: string;
  trend: string;
}

export interface DashboardStats {
  totalLeads: StatItem;
  activeListings: StatItem;
  estRevenue: StatItem;
  guardianAlerts: StatItem;
}

export interface ActiveLead {
  name: string;
  note: string;
  badge: string;
  badgeTone: 'hot' | 'new' | 'muted';
  color: string;
}

export interface DashboardOverviewResponse {
  stats: DashboardStats;
  leadVelocity: number[];
  activeLeads: ActiveLead[];
  crmSnapshot?: {
    new: number;
    negotiation: number;
    closing: number;
  };
  latestUpdates?: any[];
}

export const getDashboardOverview = async (accessToken: string): Promise<DashboardOverviewResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/solo/dashboard/overview`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Dashboard request timed out. Please check your connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
