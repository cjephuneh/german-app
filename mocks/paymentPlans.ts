import { PaymentPlan } from '@/types';

export const paymentPlans: PaymentPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    currency: 'USD',
    features: [
      'Unlimited AI conversations',
      'Basic German vocabulary',
      'Grammar exercises',
      'Limited document uploads (3)',
    ],
    duration: 1,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    currency: 'USD',
    features: [
      'Everything in Basic',
      'Advanced vocabulary and grammar',
      'Unlimited document uploads',
      'Personalized learning path',
      'Progress tracking',
    ],
    duration: 1,
  },
  {
    id: 'annual',
    name: 'Annual Premium',
    price: 199.99,
    currency: 'USD',
    features: [
      'Everything in Premium',
      'Save 17% compared to monthly',
      'Offline mode',
      'Priority support',
    ],
    duration: 12,
  },
];