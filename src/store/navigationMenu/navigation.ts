import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'

const initialState = {
  navigation: [
    { name: 'Home', href: '#', current: true },
    { name: 'Create Credentials', href: '#', current: false },
    { name: 'View Submissions', href: '/admin/submissions', current: false },
  ]
}

export const navigationSlice = createSlice({
  initialState,
  name: 'navigation',
  reducers: {

    setCurrentHome: (state) => {
      state.navigation = [
        { name: 'Home', href: '#', current: true },
        { name: 'Create Credentials', href: '#', current: false },
        { name: 'View Submissions', href: '/admin/submissions', current: false },
      ]
    },
    setCurrentCC: (state) => {
      state.navigation = [
        { name: 'Home', href: '#', current: false },
        { name: 'Create Credentials', href: '#', current: true },
        { name: 'View Submissions', href: '/admin/submissions', current: false },
      ]
    },
    setCurrentVS: (state) => {
      state.navigation = [
        { name: 'Home', href: '#', current: false },
        { name: 'Create Credentials', href: '#', current: false },
        { name: 'View Submissions', href: '/admin/submissions', current: true },
      ]
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentHome, setCurrentCC, setCurrentVS } = navigationSlice.actions

export const selectNavigationMenu = (state: RootState) =>
  state.navigation.navigation;

export default navigationSlice.reducer
