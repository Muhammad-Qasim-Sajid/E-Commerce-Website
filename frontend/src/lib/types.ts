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

export interface Product {
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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string
  productId: number
  name: string
  variant: string
  price: number
  quantity: number
  image?: string
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

export interface Order {
  id: string
  customer: Customer
  items: OrderItem[]
  total: number
  shippingCost: number
  tax: number
  status: OrderStatus
  shippingAddress: ShippingAddress
  createdAt: string
  notes?: string
}