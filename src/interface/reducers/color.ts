import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ColorState {
  uidColors: Record<number, string>;
  IidColors: Record<number, string>;
}

export const initialState: ColorState = {
  uidColors: {},
  IidColors: {},
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    colorCell(state, action: PayloadAction<[number, string]>) {
      state.uidColors[action.payload[0]] = action.payload[1];
    },
  },
});

export const { colorCell } = colorSlice.actions;

export const ColorReducers = colorSlice.reducer;
