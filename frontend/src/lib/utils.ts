import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CSRF Token Utility
export const getCsrfToken = () => {
  if (typeof document === 'undefined') return '';

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrfToken') {
      return decodeURIComponent(value);
    }
  }
  return '';
};

// Cart Utility
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const cartJson = localStorage.getItem('greatness-cart');
  if (!cartJson) {
    return [];
  }

  try {
    return JSON.parse(cartJson);
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('greatness-cart', JSON.stringify(items));
};

export const addToCart = (productId: string, variantId: string): CartItem[] => {
  const cart = getCart();

  const existingItemIndex = cart.findIndex(item => item.productId === productId && item.variantId === variantId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      productId,
      variantId,
      quantity: 1
    });
  }

  saveCart(cart);

  window.dispatchEvent(new Event('cartUpdated'));

  return cart;
};

export const removeFromCart = (productId: string, variantId: string): CartItem[] => {
  const cart = getCart();
  const updatedCart = cart.filter(
    item => !(item.productId === productId && item.variantId === variantId)
  );

  saveCart(updatedCart);

  window.dispatchEvent(new Event('cartUpdated'));

  return updatedCart;
};

export const clearCart = (): CartItem[] => {
  const emptyCart: CartItem[] = [];
  saveCart(emptyCart);

  window.dispatchEvent(new Event('cartUpdated'));

  return emptyCart;
};