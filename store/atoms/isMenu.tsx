// store/useMenuStore.ts
import { create } from 'zustand'

type MenuStore = {
  isMenu: boolean
  openMenu: () => void
  closeMenu: () => void
}

const useMenuStore = create<MenuStore>((set) => ({
  isMenu: false,
  openMenu: () => set({ isMenu: true }),
  closeMenu: () => set({ isMenu: false }),
}))

export default useMenuStore
