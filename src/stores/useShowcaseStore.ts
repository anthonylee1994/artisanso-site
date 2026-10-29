import {create} from "zustand";

interface ShowcaseState {
    categoryId: string;
    switched: boolean;
    selectCategory: (id: string) => void;
}

export const useShowcaseStore = create<ShowcaseState>(set => ({
    categoryId: "all",
    switched: false,
    selectCategory: id => set({categoryId: id, switched: true}),
}));
