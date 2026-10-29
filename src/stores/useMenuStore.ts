import {create} from "zustand";

interface MenuState {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
    toggleMenu: () => void;
}

export const useMenuStore = create<MenuState>(set => ({
    menuOpen: false,
    setMenuOpen: open => set({menuOpen: open}),
    toggleMenu: () => set(state => ({menuOpen: !state.menuOpen})),
}));
