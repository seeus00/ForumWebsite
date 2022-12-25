import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AuthState {
    isLoggedIn: boolean,
    userId: string
}

const initialState: AuthState = {
    isLoggedIn: false,
    userId: ""
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserLogin: (state, action: PayloadAction<string>) => {
            state.isLoggedIn = true;
            state.userId = action.payload;
        }
    }
});

export const { setUserLogin } = authSlice.actions;
export default authSlice.reducer;