import { Order } from '../lib/types';

export const orders: Order[] = [
  {
    _id: '1',
    customerName: 'Alexander Rothschild',
    customerEmail: 'alex@email.com',
    customerPhone: '+1234567890',
    customerAddress: '123 Luxury Street, New York',
    items: [
      {
        productId: '1',
        variantId: '1',
        variantSnapshot: {
          name: 'Silver / Black',
          price: 1299.99,
          image: '/1.png'
        },
        quantity: 1,
        totalPrice: 1299.99,
        product: {
          name: 'Chronograph Pro'
        }
      }
    ],
    shippingPrice: 500,
    totalPrice: 1799.99,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    shippingTrackingNumber: 'TRK123456789',
    trackingToken: 'GW-2024-7890',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    customerName: 'Victoria Chen',
    customerEmail: 'victoria@email.com',
    customerPhone: '+1234567891',
    customerAddress: '456 Elegance Avenue, London',
    items: [
      {
        productId: '2',
        variantId: '2',
        variantSnapshot: {
          name: 'Rose Gold / Brown',
          price: 1399.99,
          image: '/2.png'
        },
        quantity: 1,
        totalPrice: 1399.99,
        product: {
          name: 'Classic Dress Watch'
        }
      }
    ],
    shippingPrice: 500,
    totalPrice: 1899.99,
    paymentStatus: 'Pending',
    orderStatus: 'Confirmed',
    shippingTrackingNumber: 'TRK123456790',
    trackingToken: 'GW-2024-7889',
    createdAt: '2024-01-14T14:45:00Z'
  },
  {
    _id: '3',
    customerName: 'James Vanderbilt',
    customerEmail: 'james@email.com',
    customerPhone: '+1234567892',
    customerAddress: '789 Prestige Road, Paris',
    items: [
      {
        productId: '3',
        variantId: '3',
        variantSnapshot: {
          name: 'Blue / Steel',
          price: 1599.99,
          image: '/3.png'
        },
        quantity: 2,
        totalPrice: 3199.98,
        product: {
          name: 'Diver Series 300'
        }
      }
    ],
    shippingPrice: 500,
    totalPrice: 3699.98,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    shippingTrackingNumber: 'TRK123456791',
    trackingToken: 'GW-2024-7888',
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    _id: '4',
    customerName: 'Isabella Rossi',
    customerEmail: 'isabella@email.com',
    customerPhone: '+1234567893',
    customerAddress: '321 Heritage Lane, Milan',
    items: [
      {
        productId: '1',
        variantId: '1',
        variantSnapshot: {
          name: 'Silver / Black',
          price: 1299.99,
          image: '/1.png'
        },
        quantity: 1,
        totalPrice: 1299.99,
        product: {
          name: 'Chronograph Pro'
        }
      },
      {
        productId: '2',
        variantId: '2',
        variantSnapshot: {
          name: 'White / Brown Leather',
          price: 899.99,
          image: '/4.png'
        },
        quantity: 1,
        totalPrice: 899.99,
        product: {
          name: 'Classic Dress Watch'
        }
      }
    ],
    shippingPrice: 500,
    totalPrice: 2699.98,
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    trackingToken: 'GW-2024-7887',
    createdAt: '2024-01-12T16:20:00Z'
  },
  {
    _id: '5',
    customerName: 'Mohammed Al-Farsi',
    customerEmail: 'mohammed@email.com',
    customerPhone: '+1234567894',
    customerAddress: '654 Royal Boulevard, Dubai',
    items: [
      {
        productId: '3',
        variantId: '3',
        variantSnapshot: {
          name: 'Black / Rubber',
          price: 1499.99,
          image: '/5.png'
        },
        quantity: 3,
        totalPrice: 4499.97,
        product: {
          name: 'Diver Series 300'
        }
      }
    ],
    shippingPrice: 500,
    totalPrice: 4999.97,
    paymentStatus: 'Paid',
    orderStatus: 'Pending',
    trackingToken: 'GW-2024-7886',
    createdAt: '2024-01-11T11:10:00Z'
  }
];