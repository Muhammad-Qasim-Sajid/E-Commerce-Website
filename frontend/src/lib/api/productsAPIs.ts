const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Variant {
  variantName: string;
  variantImage: string;
  variantPrice: number;
  variantPreviousPrice?: number;
  variantOrder: number;
  variantStock: number;
  _id: string;
}
export interface Product {
  _id: string;
  name: string;
  variants: Variant[];
  smallDescription: string;
  longDescription: string;
  featuredProduct: boolean;
}

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

    getProductsByIds: async (ids: string[]) => {
        const response = await fetch(`${API_URL}/products/get-all-products`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        if (data.success) {
            const filteredProducts = data.data.filter((product: Product) => 
                ids.includes(product._id)
            );
            return { success: true, data: filteredProducts };
        }

        return data;
    }
};