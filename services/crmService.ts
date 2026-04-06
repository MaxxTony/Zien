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

export interface AddCRMContactPayload {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country_code: string;
    group_id: number;
    tag_id: number;
}

export interface CRMContact {
    id: string;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    phone: string | null;
    group_id: number;
    tag_id: number;
    status: number;
    notes: any[];
    events: any[];
    source: string | null;
    attribution: string | null;
    heat_index: number;
    heat_factors: any;
    activity_timeline: any;
    pipeline_stage: any;
    budget: any;
    timeline: any;
    pre_approved: any;
    created_at: string;
    updated_at: string;
    group: {
        id: number;
        name: string;
    };
    tag: {
        id: number;
        name: string;
        tag_color: string;
    };
    latest_note: any;
}

export interface CRMLead {
    id: string;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    phone: string;
    source: string;
    status: number;
    score: number;
    group_id: number;
    tag_id: number;
    lead_date_label: string;
    created_at: string;
    updated_at: string;
    group: {
        id: number;
        name: string;
    };
    tag: {
        id: number;
        name: string;
        tag_color: string;
    };
}

export interface CRMFollowUp {
    id: string;
    user_id: number;
    contact_id: string | null;
    subject: string;
    due_at: string;
    status: number;
    completed_at: string | null;
    group_id: number;
    tag_id: number;
    priority: string;
    created_at: string;
    updated_at: string;
    contact: any | null;
    group: {
        id: number;
        name: string;
    } | null;
    tag: {
        id: number;
        name: string;
        tag_color: string;
    } | null;
}

export interface AddCRMFollowUpPayload {
    subject: string;
    contact_id: string | null;
    due_at: string;
    group_id: number | null;
    tag_id: number | null;
    priority: string;
    status: number;
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

export const addCRMGroup = async (accessToken: string, name: string): Promise<any> => {
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

export const addCRMTag = async (accessToken: string, name: string, color: string): Promise<any> => {
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



export const addCRMContact = async (accessToken: string, payload: AddCRMContactPayload): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/contacts`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
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

export interface CRMContactFilters {
    q?: string;
    group_id?: number;
    tag_id?: number;
    status?: number;
}

export const getCRMContacts = async (accessToken: string, filters?: CRMContactFilters): Promise<CRMContact[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const queryParts = [];
        if (filters?.q) queryParts.push(`q=${encodeURIComponent(filters.q)}`);
        if (filters?.group_id !== undefined) queryParts.push(`group_id=${filters.group_id}`);
        if (filters?.tag_id !== undefined) queryParts.push(`tag_id=${filters.tag_id}`);
        if (filters?.status !== undefined) queryParts.push(`status=${filters.status}`);

        const url = queryParts.length > 0
            ? `${CRM_API_BASE_URL}/solo/crm/contacts?${queryParts.join('&')}`
            : `${CRM_API_BASE_URL}/solo/crm/contacts`;

        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const data = await response.json().catch(() => ([]));

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

export const deleteCRMContact = async (accessToken: string, contactId: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/contacts/${contactId}`, {
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

export const updateCRMContactStatus = async (accessToken: string, contactId: string, status: number): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/contacts/${contactId}`, {
            method: 'PATCH',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ status }),
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

export const updateCRMContact = async (accessToken: string, contactId: string, payload: AddCRMContactPayload): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/contacts/${contactId}`, {
            method: 'PATCH',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
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

export const getCRMContactDetail = async (accessToken: string, contactId: string): Promise<CRMContact> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/contacts/${contactId}`, {
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
export const appendCRMNote = async (accessToken: string, contactId: string, content: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/contacts/${contactId}`, {
            method: 'PATCH',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ append_note: { content } }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Server error: ${response.status}`);
        }
    } finally {
        clearTimeout(timeoutId);
    }
};

export const appendCRMEvent = async (accessToken: string, contactId: string, title: string, date: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/contacts/${contactId}`, {
            method: 'PATCH',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ append_event: { title, date } }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || `Server error: ${response.status}`);
        }
    } finally {
        clearTimeout(timeoutId);
    }
};

export const getCRMLeads = async (accessToken: string): Promise<CRMLead[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {




        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/leads`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const data = await response.json().catch(() => ([]));

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

export const deleteCRMLead = async (accessToken: string, leadId: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/leads/${leadId}`, {
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


export const addCRMLead = async (accessToken: string, payload: any): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/leads`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
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

export const updateCRMLead = async (accessToken: string, leadId: string, payload: any): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/leads/${leadId}`, {
            method: 'PATCH',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
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

export const updateCRMGroup = async (accessToken: string, groupId: number, name: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/groups/${groupId}`, {
            method: 'PATCH',
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

export const updateCRMTag = async (accessToken: string, tagId: number, name: string, color: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/tags/${tagId}`, {
            method: 'PATCH',
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

export const getCRMFollowUps = async (accessToken: string): Promise<CRMFollowUp[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/follow-ups`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const data = await response.json().catch(() => ([]));

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

export const createCRMFollowUp = async (accessToken: string, payload: AddCRMFollowUpPayload): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        // Using port 3000 as explicitly requested by the user for follow-ups
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/follow-ups`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
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

export const updateCRMFollowUp = async (accessToken: string, followUpId: string, payload: Partial<AddCRMFollowUpPayload>): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/follow-ups/${followUpId}`, {
            method: 'PATCH',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
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

export const markCRMFollowUpDone = async (accessToken: string, followUpId: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/follow-ups/${followUpId}/done`, {
            method: 'POST',
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

export const rescheduleCRMFollowUp = async (accessToken: string, followUpId: string, dueAt: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/follow-ups/${followUpId}/reschedule`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ due_at: dueAt }),
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

export const deleteCRMFollowUp = async (accessToken: string, followUpId: string): Promise<void> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${CRM_API_BASE_URL}/solo/crm/follow-ups/${followUpId}`, {
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
