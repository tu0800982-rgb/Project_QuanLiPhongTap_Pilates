import { create } from 'zustand'
import type { User } from '../types'
type State = { user: User | null; setUser: (user: User) => void; logout: () => void }
export const useAuthStore = create<State>(set => ({ user: JSON.parse(localStorage.getItem('pilates-user') || 'null'), setUser: user => { localStorage.setItem('pilates-user', JSON.stringify(user)); set({ user }) }, logout: () => { localStorage.removeItem('pilates-user'); set({ user: null }) } }))
