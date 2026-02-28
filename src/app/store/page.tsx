import type { Metadata } from 'next';
import { StoreClient } from './StoreClient';

export const metadata: Metadata = {
  title: 'Store',
  description: 'Browse therapy devices for rental and purchase with guided setup paths.',
};

export default function StorePage() {
  return <StoreClient />;
}