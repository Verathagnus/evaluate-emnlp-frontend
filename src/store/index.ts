import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import navigationReducer from './navigationMenu/navigation'
import { docsApi } from '../services/docs'

export const store = configureStore({
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(docsApi.middleware),
  reducer: {
    navigation: navigationReducer,
  },
})
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
