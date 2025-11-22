


// --- API FUNCTIONS ---

const getBackendUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5005';
    }
    return 'https://api.websopen.com';
};

const API_URL = getBackendUrl();

const getOwnerId = () => {
    // Try to get from localStorage, or URL params as fallback
    return localStorage.getItem('owner_id') || new URLSearchParams(window.location.search).get('owner_id');
};

export const api = {
    unifiedLogin: async (codeOrPhone: string) => {
        const ownerId = getOwnerId();
        if (!ownerId) throw new Error("Owner ID missing");

        const response = await fetch(`${API_URL}/api/unified-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner_id: ownerId, code_or_phone: codeOrPhone })
        });
        return response.json();
    },

    verifyWhatsappCode: async (phone: string, code: string) => {
        const ownerId = getOwnerId();
        if (!ownerId) throw new Error("Owner ID missing");

        const response = await fetch(`${API_URL}/api/verify-whatsapp-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner_id: ownerId, phone, code })
        });
        return response.json();
    },

    updateClientInfo: async (phone: string, name: string) => {
        const ownerId = getOwnerId();
        if (!ownerId) throw new Error("Owner ID missing");

        const response = await fetch(`${API_URL}/api/client/update-info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner_id: ownerId, user_identifier: phone, name })
        });
        return response.json();
    },

    fetchInitialData: async (userIdentifier: string) => {
        const ownerId = getOwnerId();
        if (!ownerId) throw new Error("Owner ID missing");

        // Note: backend expects chat_id, we use userIdentifier (phone)
        const response = await fetch(`${API_URL}/api/client/initial-data?owner_id=${ownerId}&chat_id=${userIdentifier}`);
        return response.json();
    },

    fetchCatalog: async () => {
        const ownerId = getOwnerId();
        if (!ownerId) throw new Error("Owner ID missing");

        const response = await fetch(`${API_URL}/api/products?owner_id=${ownerId}`);
        if (!response.ok) throw new Error("Failed to fetch catalog");
        return response.json();
    },

    fetchCheckoutData: async () => {
        const ownerId = getOwnerId();
        // We need the user identifier (phone) to get addresses
        const userIdentifier = localStorage.getItem('kioscoUserIdentifier');

        if (!ownerId || !userIdentifier) throw new Error("Missing data for checkout");

        const response = await fetch(`${API_URL}/api/client/get-checkout-data?owner_id=${ownerId}&chat_id=${userIdentifier}`);
        return response.json();
    },

    initiateOrder: async (payload: any) => {
        const ownerId = getOwnerId();
        if (!ownerId) throw new Error("Owner ID missing");

        const response = await fetch(`${API_URL}/api/client/initiate-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner_id: ownerId, payload })
        });
        return response.json();
    },

    fetchOrderStatus: async (orderId: string) => {
        const ownerId = getOwnerId();
        if (!ownerId) throw new Error("Owner ID missing");

        const response = await fetch(`${API_URL}/api/order/${orderId}/status?owner_id=${ownerId}`);
        return response.json();
    },

    submitFeedback: async (orderId: string, rating: number, comment: string) => {
        const ownerId = getOwnerId();
        if (!ownerId) throw new Error("Owner ID missing");

        const response = await fetch(`${API_URL}/api/order/submit-feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner_id: ownerId, order_id: orderId, rating, comment })
        });
        return response.json();
    }
};