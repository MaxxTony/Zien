import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getDashboardOverview, DashboardOverviewResponse } from '@/services/dashboardService';

/**
 * Hook to fetch and manage the dashboard overview data.
 * Uses TanStack Query for caching and state management.
 */
export function useDashboard() {
  const { accessToken } = useAuth();

  return useQuery<DashboardOverviewResponse, Error>({
    queryKey: ['dashboardOverview', accessToken],
    queryFn: () => getDashboardOverview(accessToken!),
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}
