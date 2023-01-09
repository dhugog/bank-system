import { createSlice } from "@reduxjs/toolkit";

export interface SideMenuState {
  open: boolean;
}

const initialState: SideMenuState = {
  open: false,
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    toggleSideMenu: (state) => {
      state.open = !state.open;
    },
  },
});

export const { toggleSideMenu } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
