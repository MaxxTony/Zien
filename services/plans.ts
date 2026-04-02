const API_BASE_URL = 'http://18.219.170.119:4000/api';
const CHECKOUT_API_URL = 'http://18.219.170.119:4000/api';
const REQUEST_TIMEOUT_MS = 15000;

export interface Price {
  id: number;
  billing_interval: 'monthly' | 'annually' | 'yearly';
  interval_count: number;
  price: string;
  currency: string;
}

export interface Addon {
  id: number;
  name: string;
  slug: string;
  description: string;
  addon_type: string;
  prices: Price[];
}

export interface Plan {
  id: number;
  roleId: number;
  name: string;
  slug: string;
  description: string | null;
  features: string[];
  prices: Price[];
  addons: Addon[];
}

export interface CheckoutPayload {
  addon_ids: number[];
  billing: string;
  country_code: string;
  email: string;
  first_name: string;
  last_name: string;
  license_number: string;
  password: string;
  phone: string;
  plan_id: number;
  primary_market: string;
}

export interface TeamCheckoutPayload {
  addon_ids: number[];
  billing: string;
  country_code: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
  plan_id: number;
  primary_market: string;
  team_name: string;
}

export interface PlansResponse {
  plans: Plan[];
  soloRoleId: number;
  teamRoleId: number;
}

export const fetchSoloPlans = async (): Promise<Plan[]> => {
  const result = await fetchAllPlans();
  return result.plans.filter(p => p.roleId === result.soloRoleId);
};

export const fetchTeamPlans = async (): Promise<Plan[]> => {
  const result = await fetchAllPlans();
  return result.plans.filter(p => p.roleId === result.teamRoleId);
};

const fetchAllPlans = async (): Promise<PlansResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/website/register/plans`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const registerSoloCheckout = async (payload: CheckoutPayload): Promise<any> => {
  return registerCheckout(payload, 'solo');
};

export const registerTeamCheckout = async (payload: TeamCheckoutPayload): Promise<any> => {
  return registerCheckout(payload, 'team');
};

const registerCheckout = async (payload: any, flow: 'solo' | 'team'): Promise<any> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${CHECKOUT_API_URL}/website/register/${flow}/checkout`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Registration timed out. Please check your connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const completeCheckout = async (sessionId: string): Promise<any> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${CHECKOUT_API_URL}/website/register/checkout/complete`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Completion check timed out. Please check your connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
