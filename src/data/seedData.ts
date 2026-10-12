import { Product, Customer, Order, Coupon, Review, AdminNotification, StoreSettings } from '../types';

export const initialStoreSettings: StoreSettings = {
  storeName: 'Nailash',
  tagline: 'Elegance, Made for You',
  supportEmail: 'care@nailashfashion.com',
  phone: '+92 42 3578 9900',
  whatsapp: '+92 300 1234567',
  address: 'Gulberg III, MM Alam Road, Atelier Galleria',
  city: 'Lahore, Pakistan',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  taxRate: 0,
  freeShippingThreshold: 15000,
  defaultShippingFee: 350,
  jazzCashMerchantNumber: '03001234567',
  jazzCashAccountTitle: 'NAILASH APPAREL PVT LTD',
  bannerAnnouncement: 'Complimentary Express Shipping Across Pakistan on Orders Over Rs. 15,000 · International Delivery Available'
};

export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Embroidered Lawn Suit (3-Piece)',
    sku: 'NL-LWN-001',
    category: 'Women',
    subcategory: 'Luxury Lawn',
    description: 'A masterpiece of breathable luxury. Crafted from premium 100% fine count lawn, featuring intricate schiffli and tilla thread embroidery along the neckline, hemlines, and sleeve cuffs. Accompanied by a pure digital printed silk chiffon dupatta and tailored dyed cambric trousers.',
    shortDescription: '3-Piece embroidered luxury lawn suit with digital printed pure silk dupatta.',
    price: 18500,
    salePrice: 16500,
    discountPercentage: 11,
    images: [
      '/assets/hero_fashion_editorial.jpg',
      '/assets/cat_women_collection.jpg',
      '/assets/cat_new_arrivals.jpg'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-airy-dress-41851-large.mp4',
    brand: 'Nailash Atelier',
    tags: ['Lawn', 'Summer', 'Embroidered', 'Festive', '3-Piece'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    status: 'published',
    lowStockThreshold: 5,
    fabric: 'Fine Lawn Shirt, Pure Chiffon Dupatta, Cambric Trousers',
    careInstructions: 'Dry clean recommended. Gentle hand wash in cold water with mild detergent. Do not bleach or tumble dry.',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-25T14:30:00Z',
    colors: [
      {
        id: 'col-sage',
        name: 'Sage Green',
        hex: '#97A87A',
        sizes: [
          { size: 'XS', stock: 6 },
          { size: 'S', stock: 12 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 3 },
          { size: 'XXL', stock: 2 }
        ]
      },
      {
        id: 'col-gold',
        name: 'Terracotta Gold',
        hex: '#DB9558',
        sizes: [
          { size: 'XS', stock: 4 },
          { size: 'S', stock: 9 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 4 },
          { size: 'XL', stock: 2 },
          { size: 'XXL', stock: 1 }
        ]
      },
      {
        id: 'col-ivory',
        name: 'Antique Ivory',
        hex: '#FCF9EA',
        sizes: [
          { size: 'XS', stock: 5 },
          { size: 'S', stock: 7 },
          { size: 'M', stock: 11 },
          { size: 'L', stock: 5 },
          { size: 'XL', stock: 2 },
          { size: 'XXL', stock: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod-002',
    name: 'Handcrafted Silk Organza Peshwas',
    sku: 'NL-FST-002',
    category: 'Women',
    subcategory: 'Festive Pret',
    description: 'An ethereal floor-length kalidar peshwas fashioned on delicate organza. Adorned with marodi work, gota patti detailing, and hand-placed sequins on the bodice and hemline. Finished with an embellished silk net dupatta and banarasi silk churidar.',
    shortDescription: 'Regal organza kalidar peshwas with hand-rendered gota and marodi embellishments.',
    price: 38500,
    salePrice: 34900,
    discountPercentage: 9,
    images: [
      '/assets/cat_women_collection.jpg',
      '/assets/banner_promotional_silk.jpg',
      '/assets/cat_new_arrivals.jpg'
    ],
    brand: 'Nailash Couture',
    tags: ['Organza', 'Festive', 'Wedding', 'Peshwas', 'Formal'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    status: 'published',
    lowStockThreshold: 4,
    fabric: 'Pure Silk Organza with Silk Lining',
    careInstructions: 'Dry clean only. Store wrapped in muslin cloth away from direct sunlight.',
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
    colors: [
      {
        id: 'col-soft-green',
        name: 'Soft Sage',
        hex: '#A8BBA3',
        sizes: [
          { size: 'XS', stock: 2 },
          { size: 'S', stock: 4 },
          { size: 'M', stock: 5 },
          { size: 'L', stock: 3 },
          { size: 'XL', stock: 1 },
          { size: 'XXL', stock: 1 }
        ]
      },
      {
        id: 'col-warm-amber',
        name: 'Desert Gold',
        hex: '#DB9558',
        sizes: [
          { size: 'XS', stock: 3 },
          { size: 'S', stock: 6 },
          { size: 'M', stock: 4 },
          { size: 'L', stock: 2 },
          { size: 'XL', stock: 1 },
          { size: 'XXL', stock: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod-003',
    name: 'Raw Silk Straight Cut Kurta & Trousers',
    sku: 'NL-PRT-003',
    category: 'Women',
    subcategory: 'Ready To Wear',
    description: 'Sophisticated modern minimalism for the contemporary woman. Pure raw silk tunic featuring clean structural lines, subtle hand-knotted buttons, and delicate organza cuffs. Paired with coordinating straight silhouette cropped raw silk trousers.',
    shortDescription: 'Minimalist 2-piece pure raw silk kurta set with modern tailored finish.',
    price: 14500,
    images: [
      '/assets/cat_new_arrivals.jpg',
      '/assets/hero_fashion_editorial.jpg'
    ],
    brand: 'Nailash Pret',
    tags: ['Raw Silk', 'Pret', 'Minimalist', 'Workwear', 'Modern'],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    status: 'published',
    lowStockThreshold: 5,
    fabric: '100% 80-gram Pure Raw Silk',
    careInstructions: 'Dry clean only. Steam iron on reverse.',
    createdAt: '2026-03-10T09:30:00Z',
    updatedAt: '2026-03-28T16:00:00Z',
    colors: [
      {
        id: 'col-sage-dark',
        name: 'Muted Sage',
        hex: '#97A87A',
        sizes: [
          { size: 'XS', stock: 8 },
          { size: 'S', stock: 14 },
          { size: 'M', stock: 18 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 6 },
          { size: 'XXL', stock: 3 }
        ]
      },
      {
        id: 'col-ivory-cream',
        name: 'Ivory Cream',
        hex: '#FCF9EA',
        sizes: [
          { size: 'XS', stock: 5 },
          { size: 'S', stock: 11 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 7 },
          { size: 'XL', stock: 4 },
          { size: 'XXL', stock: 2 }
        ]
      }
    ]
  },
  {
    id: 'prod-004',
    name: 'Men’s Tailored Raw Silk Kurta & Pajama',
    sku: 'NL-MEN-004',
    category: 'Men',
    subcategory: 'Eastern Wear',
    description: 'Exemplary tailoring tailored for the discerning modern gentleman. Cut from lustrous textured raw silk with band collar, invisible placket, and hand-finished stitch accents. Includes fitted cotton silk pajama with drawstring waist.',
    shortDescription: 'Hand-tailored pure raw silk kurta set for men in refined earthy tones.',
    price: 16500,
    salePrice: 14800,
    discountPercentage: 10,
    images: [
      '/assets/cat_men_collection.jpg',
      '/assets/banner_promotional_silk.jpg'
    ],
    brand: 'Nailash Men',
    tags: ['Men', 'Kurta', 'Raw Silk', 'Festive', 'Tailored'],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    status: 'published',
    lowStockThreshold: 4,
    fabric: 'Raw Silk Kurta with Cotton Silk Pajama',
    careInstructions: 'Dry clean only. Steam press.',
    createdAt: '2026-03-01T14:00:00Z',
    updatedAt: '2026-03-24T18:00:00Z',
    colors: [
      {
        id: 'col-men-sage',
        name: 'Olive Sage',
        hex: '#97A87A',
        sizes: [
          { size: 'S', stock: 5 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 14 },
          { size: 'XL', stock: 6 },
          { size: 'XXL', stock: 3 },
          { size: 'XS', stock: 2 }
        ]
      },
      {
        id: 'col-men-gold',
        name: 'Warm Ochre',
        hex: '#DB9558',
        sizes: [
          { size: 'S', stock: 4 },
          { size: 'M', stock: 9 },
          { size: 'L', stock: 11 },
          { size: 'XL', stock: 4 },
          { size: 'XXL', stock: 2 },
          { size: 'XS', stock: 1 }
        ]
      }
    ]
  },
  {
    id: 'prod-005',
    name: 'Artisanal Hand-Embroidered Velvet Shawl',
    sku: 'NL-SHWL-005',
    category: 'Women',
    subcategory: 'Heritage Artisanal',
    description: 'An heirloom keepsake crafted from plush micro-velvet. Features heavy resham and tilla hand embroidery over the four-sided borders, with delicate floral booti motifs scattered across the central field.',
    shortDescription: 'Pure micro-velvet bridal & festive shawl with intricate antique zardozi borders.',
    price: 29500,
    images: [
      '/assets/cat_new_arrivals.jpg',
      '/assets/hero_fashion_editorial.jpg'
    ],
    brand: 'Nailash Heirloom',
    tags: ['Velvet', 'Shawl', 'Embroidery', 'Winter Formal', 'Heirloom'],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    status: 'published',
    lowStockThreshold: 3,
    fabric: 'Heavy 9000 Micro Velvet',
    careInstructions: 'Professional dry clean only.',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
    colors: [
      {
        id: 'col-forest-sage',
        name: 'Deep Sage Velvet',
        hex: '#97A87A',
        sizes: [
          { size: 'S', stock: 4 },
          { size: 'M', stock: 5 },
          { size: 'L', stock: 3 },
          { size: 'XS', stock: 2 },
          { size: 'XL', stock: 2 },
          { size: 'XXL', stock: 1 }
        ]
      },
      {
        id: 'col-bronze-gold',
        name: 'Burnt Topaz',
        hex: '#DB9558',
        sizes: [
          { size: 'S', stock: 2 },
          { size: 'M', stock: 3 },
          { size: 'L', stock: 2 },
          { size: 'XS', stock: 1 },
          { size: 'XL', stock: 1 },
          { size: 'XXL', stock: 1 }
        ]
      }
    ]
  },
  {
    id: 'prod-006',
    name: 'Men’s Handcrafted Prince Coat Set',
    sku: 'NL-MEN-006',
    category: 'Men',
    subcategory: 'Eastern Wear',
    description: 'A stately formal silhouette featuring an embroidered Italian jamawar waistcoat coat, paired with an Egyptian cotton classic kurta and fitted trousers.',
    shortDescription: 'Regal structured prince coat with delicate crest embroidery.',
    price: 32000,
    salePrice: 28800,
    discountPercentage: 10,
    images: [
      '/assets/cat_men_collection.jpg',
      '/assets/banner_promotional_silk.jpg'
    ],
    brand: 'Nailash Men',
    tags: ['Men', 'Prince Coat', 'Wedding', 'Formal'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    status: 'published',
    lowStockThreshold: 3,
    fabric: 'Embossed Jamawar with Pure Cotton inner lining',
    careInstructions: 'Dry clean only.',
    createdAt: '2026-03-12T15:00:00Z',
    updatedAt: '2026-03-26T17:00:00Z',
    colors: [
      {
        id: 'col-prince-sage',
        name: 'Sage Smoke',
        hex: '#A8BBA3',
        sizes: [
          { size: 'S', stock: 2 },
          { size: 'M', stock: 4 },
          { size: 'L', stock: 5 },
          { size: 'XL', stock: 2 },
          { size: 'XXL', stock: 1 },
          { size: 'XS', stock: 1 }
        ]
      }
    ]
  }
];

export const initialOrders: Order[] = [
  {
    id: 'NL-2026-000101',
    customer: {
      fullName: 'Ayesha Khan',
      phone: '03214567890',
      email: 'ayesha.k@example.com',
      address: 'House 42-B, Street 7, Phase 5, DHA',
      city: 'Lahore',
      area: 'DHA Phase 5',
      postalCode: '54792'
    },
    items: [
      {
        productId: 'prod-001',
        productName: 'Embroidered Lawn Suit (3-Piece)',
        sku: 'NL-LWN-001',
        image: '/assets/hero_fashion_editorial.jpg',
        colorName: 'Sage Green',
        size: 'M',
        price: 16500,
        quantity: 1,
        subtotal: 16500
      }
    ],
    itemCount: 1,
    subtotal: 16500,
    discount: 0,
    shippingFee: 0, // above threshold
    total: 16500,
    paymentMethod: 'jazzcash',
    paymentStatus: 'paid',
    paidAt: '2026-03-29T12:05:00Z',
    jazzCashReference: 'JC-8921849102',
    jazzCashPhone: '03214567890',
    orderStatus: 'shipped',
    createdAt: '2026-03-29T11:42:00Z',
    updatedAt: '2026-03-30T14:10:00Z',
    timeline: [
      { status: 'pending', timestamp: '2026-03-29T11:42:00Z', note: 'Order placed via JazzCash' },
      { status: 'confirmed', timestamp: '2026-03-29T12:05:00Z', note: 'Payment verified successfully' },
      { status: 'processing', timestamp: '2026-03-29T16:00:00Z', note: 'Dispatched to quality control atelier' },
      { status: 'packed', timestamp: '2026-03-30T09:30:00Z', note: 'Custom gift boxed with dust bag' },
      { status: 'shipped', timestamp: '2026-03-30T14:10:00Z', note: 'TCS Tracking # 9482910401' }
    ]
  },
  {
    id: 'NL-2026-000102',
    customer: {
      fullName: 'Hamza Farooq',
      phone: '03009876543',
      email: 'hamza.f@example.com',
      address: 'Apartment 4B, Creek Vistas, Clifton Block 4',
      city: 'Karachi',
      area: 'Clifton',
      postalCode: '75600'
    },
    items: [
      {
        productId: 'prod-004',
        productName: 'Men’s Tailored Raw Silk Kurta & Pajama',
        sku: 'NL-MEN-004',
        image: '/assets/cat_men_collection.jpg',
        colorName: 'Olive Sage',
        size: 'L',
        price: 14800,
        quantity: 1,
        subtotal: 14800
      }
    ],
    itemCount: 1,
    subtotal: 14800,
    discount: 1480,
    couponCode: 'ELEGANCE10',
    shippingFee: 350,
    total: 13670,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'processing',
    createdAt: '2026-03-31T09:15:00Z',
    updatedAt: '2026-03-31T10:30:00Z',
    timeline: [
      { status: 'pending', timestamp: '2026-03-31T09:15:00Z', note: 'Cash on Delivery order created' },
      { status: 'confirmed', timestamp: '2026-03-31T09:40:00Z', note: 'Customer phone confirmation received' },
      { status: 'processing', timestamp: '2026-03-31T10:30:00Z', note: 'Being prepared for packing' }
    ]
  },
  {
    id: 'NL-2026-000103',
    customer: {
      fullName: 'Zainab Malik',
      phone: '03335551234',
      email: 'zainab.m@example.com',
      address: 'Villa 12, Street 18, F-7/2',
      city: 'Islamabad',
      area: 'Sector F-7',
      postalCode: '44000'
    },
    items: [
      {
        productId: 'prod-002',
        productName: 'Handcrafted Silk Organza Peshwas',
        sku: 'NL-FST-002',
        image: '/assets/cat_women_collection.jpg',
        colorName: 'Desert Gold',
        size: 'S',
        price: 34900,
        quantity: 1,
        subtotal: 34900
      }
    ],
    itemCount: 1,
    subtotal: 34900,
    discount: 0,
    shippingFee: 0,
    total: 34900,
    paymentMethod: 'jazzcash',
    paymentStatus: 'paid',
    paidAt: '2026-03-24T14:45:00Z',
    jazzCashReference: 'JC-7719284910',
    jazzCashPhone: '03335551234',
    orderStatus: 'delivered',
    createdAt: '2026-03-24T14:20:00Z',
    updatedAt: '2026-03-27T16:00:00Z',
    timeline: [
      { status: 'pending', timestamp: '2026-03-24T14:20:00Z', note: 'Order placed' },
      { status: 'confirmed', timestamp: '2026-03-24T14:45:00Z', note: 'JazzCash transaction validated' },
      { status: 'processing', timestamp: '2026-03-25T10:00:00Z', note: 'Tailoring finishing & steam pressing' },
      { status: 'packed', timestamp: '2026-03-25T17:00:00Z', note: 'Luxury garment box packaging' },
      { status: 'shipped', timestamp: '2026-03-26T11:00:00Z', note: 'Leopard Courier # 8827361' },
      { status: 'delivered', timestamp: '2026-03-27T16:00:00Z', note: 'Delivered and signed by customer' }
    ]
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-owner',
    name: 'Naila Sher',
    email: 'nailasher020@gmail.com',
    phone: '03001234567',
    city: 'Lahore',
    totalOrders: 0,
    totalSpent: 0,
    status: 'active',
    createdAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 'cust-001',
    name: 'Ayesha Khan',
    email: 'ayesha.k@example.com',
    phone: '03214567890',
    city: 'Lahore',
    totalOrders: 3,
    totalSpent: 52000,
    lastOrderDate: '2026-03-29T11:42:00Z',
    status: 'active',
    createdAt: '2025-11-10T10:00:00Z'
  },
  {
    id: 'cust-002',
    name: 'Hamza Farooq',
    email: 'hamza.f@example.com',
    phone: '03009876543',
    city: 'Karachi',
    totalOrders: 1,
    totalSpent: 13670,
    lastOrderDate: '2026-03-31T09:15:00Z',
    status: 'active',
    createdAt: '2026-03-31T09:10:00Z'
  },
  {
    id: 'cust-003',
    name: 'Zainab Malik',
    email: 'zainab.m@example.com',
    phone: '03335551234',
    city: 'Islamabad',
    totalOrders: 2,
    totalSpent: 64400,
    lastOrderDate: '2026-03-24T14:20:00Z',
    status: 'active',
    createdAt: '2026-01-14T12:00:00Z'
  },
  {
    id: 'cust-004',
    name: 'Fatima Tariq',
    email: 'fatima.t@example.com',
    phone: '03451122334',
    city: 'Faisalabad',
    totalOrders: 0,
    totalSpent: 0,
    status: 'active',
    createdAt: '2026-03-20T16:30:00Z'
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-001',
    code: 'ELEGANCE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 10000,
    maxDiscount: 3000,
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 84,
    isActive: true
  },
  {
    id: 'coup-002',
    code: 'NAILASH2000',
    discountType: 'fixed',
    discountValue: 2000,
    minOrder: 20000,
    startDate: '2026-03-15',
    endDate: '2026-06-30',
    usageLimit: 200,
    usedCount: 31,
    isActive: true
  },
  {
    id: 'coup-003',
    code: 'FESTIVE15',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 25000,
    maxDiscount: 5000,
    startDate: '2026-03-20',
    endDate: '2026-05-10',
    usageLimit: 150,
    usedCount: 22,
    isActive: true
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    productName: 'Embroidered Lawn Suit (3-Piece)',
    customerName: 'Sana Qureshi',
    customerEmail: 'sana.q@example.com',
    rating: 5,
    comment: 'The quality of the lawn and delicacy of the threadwork exceeded my expectations. The silk dupatta drapes like water. Truly luxury pret at its finest!',
    status: 'approved',
    date: '2026-03-28'
  },
  {
    id: 'rev-002',
    productId: 'prod-001',
    productName: 'Embroidered Lawn Suit (3-Piece)',
    customerName: 'Mariam Siddiqui',
    customerEmail: 'mariam.s@example.com',
    rating: 5,
    comment: 'Gorgeous sage green color and exact sizing as per the chart. Arrived in a lovely keepsake box in Lahore within 2 days.',
    status: 'approved',
    date: '2026-03-25'
  },
  {
    id: 'rev-003',
    productId: 'prod-002',
    productName: 'Handcrafted Silk Organza Peshwas',
    customerName: 'Zainab Malik',
    customerEmail: 'zainab.m@example.com',
    rating: 5,
    comment: 'Wore this to a family wedding in Islamabad and received countless compliments! The gota work is authentic and pristine.',
    status: 'approved',
    date: '2026-03-28'
  }
];

export const initialNotifications: AdminNotification[] = [
  {
    id: 'notif-001',
    type: 'order',
    title: 'New Order Received',
    message: 'Hamza Farooq placed order #NL-2026-000102 for Rs. 13,670 (COD).',
    timestamp: '2026-03-31T09:15:00Z',
    read: false,
    linkTab: 'orders',
    orderId: 'NL-2026-000102'
  },
  {
    id: 'notif-002',
    type: 'payment',
    title: 'JazzCash Payment Confirmed',
    message: 'Payment of Rs. 16,500 received for order #NL-2026-000101 (Ref: JC-8921849102).',
    timestamp: '2026-03-29T12:05:00Z',
    read: true,
    linkTab: 'payments',
    orderId: 'NL-2026-000101'
  },
  {
    id: 'notif-003',
    type: 'stock',
    title: 'Low Stock Alert',
    message: 'Embroidered Lawn Suit (Sage Green - XL) has reached low stock threshold (3 remaining).',
    timestamp: '2026-03-30T10:00:00Z',
    read: false,
    linkTab: 'inventory'
  }
];
