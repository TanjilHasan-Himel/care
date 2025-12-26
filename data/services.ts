export type Service = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  features: string[];
};

export const services: Service[] = [
  {
    id: 'svc-baby',
    slug: 'baby-care',
    name: 'Baby Care',
    shortDescription: 'Certified babysitters for infants and toddlers.',
    description:
      'Compassionate caregivers trained in infant CPR, feeding schedules, and sleep routines to keep your little one safe and happy.',
    pricePerHour: 12,
    pricePerDay: 80,
    features: ['Feeding & diaper care', 'Sleep routine management', 'Playtime & learning', 'Emergency CPR trained']
  },
  {
    id: 'svc-elderly',
    slug: 'elderly-care',
    name: 'Elderly Service',
    shortDescription: 'Respectful support for seniors at home.',
    description:
      'Attentive elder caregivers for mobility support, medication reminders, companionship, and daily task assistance.',
    pricePerHour: 14,
    pricePerDay: 95,
    features: ['Medication reminders', 'Mobility & exercise help', 'Meal prep & hydration', 'Companionship']
  },
  {
    id: 'svc-sick',
    slug: 'sick-care',
    name: 'Sick People Service',
    shortDescription: 'Recovery-focused care for sick family members.',
    description:
      'Experienced attendants who monitor vitals, prepare nutritious meals, and coordinate with your physician’s instructions.',
    pricePerHour: 16,
    pricePerDay: 110,
    features: ['Vitals monitoring', 'Doctor instruction adherence', 'Hygiene & comfort', 'Nutritional support']
  }
];

export const getServiceBySlug = (slug: string) => services.find((service) => service.slug === slug);
