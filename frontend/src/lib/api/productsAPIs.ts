const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const productsApi = {
    getAllProducts: async () => {
        const response = await fetch(`${API_URL}/products/get-all-products`, {
            credentials: "include",
        });

        if (!response.ok) {
        throw new Error("Failed to fetch products");
        }

        return response.json();
    },

    getProduct: async (id: string) => {
        const response = await fetch(`${API_URL}/products/get-product/${id}`, {
            credentials: "include",
        });

        if (!response.ok) {
        throw new Error("Failed to fetch product");
        }

        return response.json();
    },
};