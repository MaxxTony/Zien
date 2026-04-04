const CRM_API_BASE_URL = 'http://18.219.170.119:4000/api';
const REQUEST_TIMEOUT_MS = 15000;

export interface CRMOverviewResponse {
    stats: {
        totalContacts: {
            value: string;
            change: string;
        };
        activeDeals: {
            value: string;
            change: string;
        };
        hotLeads: {
            value: string;
            change: string;
        };
        avgHeatIndex: {
            value: string;
            change: string;
        };
    };
    recentLeads: Array<{
        name: string;
        source: string;
        time: string;
        score: number;
    }>;
    sourceAttribution: Array<{
        source: string;
        leads: number;
        conversion: string;
        roi: string;
        color: string;
    }>;
    activityLog: Array<any>;
}

export const getCRMOverview = async (accessToken: string): Promise<CRMOverviewResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/dashboard/overview`, {
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
            throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

export interface CRMMetaResponse {
    groups: Array<{
        id: number;
        user_id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }>;
    tags: Array<{
        id: number;
        user_id: number;
        name: string;
        tag_color: string;
        created_at: string;
        updated_at: string;
    }>;
}

export const getCRMMeta = async (accessToken: string): Promise<CRMMetaResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/meta`, {
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
            throw new Error(data.message || `Server error: ${response.status}`);
        }

        return data;
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

export const deleteCRMGroup = async (accessToken: string, groupId: number): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/groups/${groupId}`, {
            method: 'DELETE',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Server error: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

export const deleteCRMTag = async (accessToken: string, tagId: number): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/tags/${tagId}`, {
            method: 'DELETE',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Server error: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

export const addCRMGroup = async (accessToken: string, name: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/groups`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Server error: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

export const addCRMTag = async (accessToken: string, name: string, color: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/tags`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ name, tag_color: color }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Server error: ${response.status}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out.');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};
