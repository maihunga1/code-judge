import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserSlice {
  username?: string;
  email?: string;
  idToken?: string;
  userId?: string;
}

const initialState: UserSlice = {
  username: undefined,
  email: undefined,
  idToken: undefined,
  userId: undefined,
}

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserSlice>) => {
      state.username = action.payload.username
      state.email = action.payload.email
      state.idToken = action.payload.idToken
      state.userId = action.payload.userId
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions

const userReducer = userSlice.reducer;

export default userReducer;