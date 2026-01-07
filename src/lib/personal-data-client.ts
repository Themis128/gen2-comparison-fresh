'use client';

import { useEffect, useState } from 'react';

import { type PersonalData, personalData } from './personal-data';

export function usePersonalData() {
  const [data, setData] = useState<PersonalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setData(personalData);
      setData(personalData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}
