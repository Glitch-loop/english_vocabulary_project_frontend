import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlert, IApp } from "../../Interfaces/interfaces";

const initialState:IApp = {
  currentAlert: undefined,
  queueAlert: []
}

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    enqueueAlert: (state, action: PayloadAction<{type?: string, alertData?: IAlert}>) => {
      const { type, alertData } = action.payload;
      if (type === 'reload' && state.queueAlert.length > 0) {
        return { ...state, currentAlert: state.queueAlert[0], queueAlert: state.queueAlert.slice(1) };
      }
      if (!state.currentAlert) {
        return { ...state, currentAlert: alertData };
      }
      return { ...state, queueAlert: [...state.queueAlert, alertData!] };
    },
    resetCurrentAlert: (state) => {
      return {...state, currentAlert: undefined}
    }
  }
})

export const {
  enqueueAlert,
  resetCurrentAlert,
} = appSlice.actions;