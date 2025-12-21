export interface Image {
  id: string
  url: string
  alt: string
}

export interface Variant {
  id: string
  name: string
  price: number
  stock: number
  sku: string
}

export interface Collection {
  id: number
  name: string
  description: string
  price: number
  discount?: number
  category: string
  sku: string
  stock: number
  images: Image[]
  variants: Variant[]
  isFeatured: boolean
  rating?: number
  status: 'published' | 'draft' | 'archived'
  specifications?: {
    movement?: string
    caseMaterial?: string
    waterResistance?: string
    diameter?: string
  }
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export interface ShippingAddress {
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type OrderItem = {
  productId: string;
  variantId: string;
  variantSnapshot: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  totalPrice: number;
  product?: {
    name: string;
  };
};

type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  shippingPrice: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingTrackingNumber?: string;
  trackingToken: string;
  createdAt: string;
};