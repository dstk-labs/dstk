import { create } from 'zustand';

export const useTeamStore = create<{
  selectedTeam: null | string;
  setSelectedTeam: (id: string) => void;
}>((set) => ({
  selectedTeam: localStorage.getItem('dstkSelectedTeam'),
  setSelectedTeam: (id) => {
    localStorage.setItem('dstkSelectedTeam', id);
    set({ selectedTeam: id });
  },
}));
