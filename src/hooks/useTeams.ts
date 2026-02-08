import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Team = Tables<"teams">;

export function useTeams(round: number, refetchInterval = 5000) {
  return useQuery({
    queryKey: ["teams", round],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("round", round)
        .order("skulls", { ascending: false });
      if (error) throw error;
      return data as Team[];
    },
    refetchInterval,
  });
}
