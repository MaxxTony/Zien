import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getDigitalCards, DigitalCard } from '@/services/digitalCardService';

export function useDigitalCards() {
  const { accessToken } = useAuth();

  return useQuery<DigitalCard[]>({
    queryKey: ['digital-cards', accessToken],
    queryFn: () => getDigitalCards(accessToken || ''),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
