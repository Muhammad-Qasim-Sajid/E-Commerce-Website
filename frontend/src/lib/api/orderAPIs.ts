import { getCsrfToken } from '../utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const orderApi = {
    getAllOrders: async (cursor?: string) => {
        const csrfToken = getCsrfToken();

        const url = cursor 
        ? `${API_URL}/orders/get-all-orders?cursor=${cursor}`
        : `${API_URL}/orders/get-all-orders`;

        const response = await fetch(url, {
            credentials: 'include',
            headers: {
                ...(csrfToken && { 'X-CSRF-Token': csrfToken })
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        return response.json();
    },

    getOrder: async (id: string) => {
        const csrfToken = getCsrfToken();

        const response = await fetch(`${API_URL}/orders/get-order/${id}`, {
            credentials: 'include',
            headers: {
                ...(csrfToken && { 'X-CSRF-Token': csrfToken })
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order');
        }

        return response.json();
    },

    updatePaymentStatus: async (id: string, paymentStatus: string) => {
        const csrfToken = getCsrfToken();

        const response = await fetch(`${API_URL}/orders/edit-payment-status/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRF-Token': csrfToken })
            },
            body: JSON.stringify({ paymentStatus })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update payment status');
        }

        return response.json();
    },

    updateOrderStatus: async (id: string, orderStatus: string) => {
        const csrfToken = getCsrfToken();
        
        const response = await fetch(`${API_URL}/orders/edit-order-status/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRF-Token': csrfToken })
            },
            body: JSON.stringify({ orderStatus })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update order status');
        }

        return response.json();
    },

    updateShippingTracking: async (id: string, shippingTrackingNumber: string) => {
        const csrfToken = getCsrfToken();
        
        const response = await fetch(`${API_URL}/orders/edit-shipping-tracking-number/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRF-Token': csrfToken })
            },
            body: JSON.stringify({ shippingTrackingNumber })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update shipping tracking');
        }

        return response.json();
    },

    deleteOrder: async (id: string) => {
        const csrfToken = getCsrfToken();
        
        const response = await fetch(`${API_URL}/orders/delete-order/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRF-Token': csrfToken })
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete order');
        }

        return response.json();
    }
};