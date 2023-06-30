import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'

const initialState = {
  navigation: [
    { name: 'Home', href: '/admin/home', current: true },
    { name: 'Create Credentials', href: '/admin/credentials', current: false },
    { name: 'View Submissions', href: '/admin/submissions', current: false },
    { name: 'Edit References', href: '/admin/references', current: false },
  ]
}

export const navigationSlice = createSlice({
  initialState,
  name: 'navigation',
  reducers: {
    setCurrentHome: (state) => {
      state.navigation = [
        { name: 'Home', href: '/admin/home', current: true },
        { name: 'Create Credentials', href: '/admin/credentials', current: false },
        { name: 'View Submissions', href: '/admin/submissions', current: false },
        { name: 'Edit References', href: '/admin/references', current: false },
      ]
    },
    setCurrentCC: (state) => {
      state.navigation = [
        { name: 'Home', href: '/admin/home', current: false },
        { name: 'Create Credentials', href: '/admin/credentials', current: true },
        { name: 'View Submissions', href: '/admin/submissions', current: false },
        { name: 'Edit References', href: '/admin/references', current: false },
      ]
    },
    setCurrentVS: (state) => {
      state.navigation = [
        { name: 'Home', href: '/admin/home', current: false },
        { name: 'Create Credentials', href: '/admin/credentials', current: false },
        { name: 'View Submissions', href: '/admin/submissions', current: true },
        { name: 'Edit References', href: '/admin/references', current: false },
      ];
    },
    setCurrentER: (state) => {
      state.navigation = [
        { name: 'Home', href: '/admin/home', current: false },
        { name: 'Create Credentials', href: '/admin/credentials', current: false },
        { name: 'View Submissions', href: '/admin/submissions', current: false },
        { name: 'Edit References', href: '/admin/references', current: true },
      ];
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentHome, setCurrentCC, setCurrentVS, setCurrentER } = navigationSlice.actions

export const selectNavigationMenu = (state: RootState) =>
  state.navigation.navigation;

export default navigationSlice.reducer
