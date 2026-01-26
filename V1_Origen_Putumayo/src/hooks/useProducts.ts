// src/hooks/useProducts.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type ProductPublic = {
  product_id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  availability: 'available' | 'out_of_stock' | 'on_demand';
  is_top: boolean;
  top_reason: string | null;
  company_name: string;
  images: string[];
  created_at: string;
};

export function useProducts() {
  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('products_public')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProducts(data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  return { products, loading, error };
}
