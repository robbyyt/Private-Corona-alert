import * as actionTypes from "./actionTypes";
import { PayloadAction } from "@reduxjs/toolkit";

export const setErrorMsg = (message: string): PayloadAction<string> => ({
  type: actionTypes.SET_ERROR_MSG,
  payload: message
});
