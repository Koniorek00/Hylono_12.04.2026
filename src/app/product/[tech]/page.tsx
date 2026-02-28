import type { Metadata } from 'next';
import { ProductClient } from './ProductClient';

type Params = Promise<{ tech: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tech } = await params;
  const normalizedTech = tech.toUpperCase();

  return {
    title: `${normalizedTech} | Product Details`,
    description: `Explore ${normalizedTech} technology details, benefits, and protocol guidance.`,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { tech } = await params;

  return <ProductClient tech={tech} />;
}