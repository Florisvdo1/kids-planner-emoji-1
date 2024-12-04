import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DayPlan } from '@db/schema';

interface UpdateDayPlanData {
  morning_emojis: string[];
  midday_emojis: string[];
  evening_emojis: string[];
  homework_completed: boolean;
}

export function useDayPlan() {
  const queryClient = useQueryClient();

  const { data: dayPlan, isLoading, error } = useQuery<DayPlan>({
    queryKey: ['dayPlan'],
    queryFn: async () => {
      const response = await fetch('/api/dayplan');
      if (!response.ok) {
        throw new Error('Failed to fetch day plan');
      }
      return response.json();
    },
  });

  const updateDayPlan = useMutation({
    mutationFn: async (data: UpdateDayPlanData) => {
      const response = await fetch('/api/dayplan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update day plan');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch the day plan query
      queryClient.invalidateQueries({ queryKey: ['dayPlan'] });
    },
  });

  return {
    dayPlan,
    isLoading,
    error,
    updateDayPlan: updateDayPlan.mutate,
    isUpdating: updateDayPlan.isPending,
  };
}
