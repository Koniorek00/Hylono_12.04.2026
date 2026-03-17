export type PartnerType = 'clinic' | 'distributor' | 'showroom';

export interface PartnerLocation {
  id: string;
  name: string;
  type: PartnerType;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  hours: string;
  rating: number;
  features: string[];
  coordinates: { lat: number; lng: number };
}

export const partnerTypeLabels: Record<PartnerType, string> = {
  clinic: 'Wellness Clinic',
  distributor: 'Authorized Distributor',
  showroom: 'Hylono Showroom',
};

export const partnerLocations: PartnerLocation[] = [
  {
    id: '1',
    name: 'Hylono Showroom Warsaw',
    type: 'showroom',
    address: 'ul. Nowy Swiat 25',
    city: 'Warsaw',
    country: 'Poland',
    phone: '+48 22 123 4567',
    email: 'warsaw@hylono.com',
    hours: 'Mon-Fri 9:00-18:00',
    rating: 5,
    features: ['HBOT', 'PEMF', 'RLT', 'Hydrogen'],
    coordinates: { lat: 52.23, lng: 21.01 },
  },
  {
    id: '2',
    name: 'BioWellness Krakow',
    type: 'clinic',
    address: 'ul. Florianska 12',
    city: 'Krakow',
    country: 'Poland',
    phone: '+48 12 345 6789',
    email: 'info@biowellness.pl',
    website: 'https://biowellness.pl',
    hours: 'Mon-Sat 8:00-20:00',
    rating: 4.8,
    features: ['HBOT', 'PEMF'],
    coordinates: { lat: 50.06, lng: 19.94 },
  },
  {
    id: '3',
    name: 'Regeneration Center Berlin',
    type: 'clinic',
    address: 'Friedrichstrasse 100',
    city: 'Berlin',
    country: 'Germany',
    phone: '+49 30 1234567',
    email: 'info@regen-berlin.de',
    website: 'https://regen-berlin.de',
    hours: 'Mon-Fri 9:00-19:00',
    rating: 4.9,
    features: ['HBOT', 'RLT', 'Hydrogen'],
    coordinates: { lat: 52.52, lng: 13.4 },
  },
  {
    id: '4',
    name: 'Nordic Wellness Solutions',
    type: 'distributor',
    address: 'Storgatan 45',
    city: 'Stockholm',
    country: 'Sweden',
    phone: '+46 8 123 456',
    email: 'sales@nws.se',
    hours: 'Mon-Fri 8:00-17:00',
    rating: 4.7,
    features: ['HBOT', 'PEMF', 'RLT'],
    coordinates: { lat: 59.33, lng: 18.07 },
  },
  {
    id: '5',
    name: 'Vitality Hub Prague',
    type: 'clinic',
    address: 'Vaclavske namesti 5',
    city: 'Prague',
    country: 'Czech Republic',
    phone: '+420 123 456 789',
    email: 'hello@vitalityhub.cz',
    hours: 'Mon-Fri 10:00-20:00',
    rating: 4.6,
    features: ['HBOT', 'PEMF'],
    coordinates: { lat: 50.08, lng: 14.43 },
  },
  {
    id: '6',
    name: 'MedTech Austria',
    type: 'distributor',
    address: 'Mariahilfer Strasse 88',
    city: 'Vienna',
    country: 'Austria',
    phone: '+43 1 234 5678',
    email: 'sales@medtech.at',
    hours: 'Mon-Fri 9:00-17:00',
    rating: 4.8,
    features: ['HBOT', 'PEMF', 'RLT', 'Hydrogen'],
    coordinates: { lat: 48.2, lng: 16.37 },
  },
];
