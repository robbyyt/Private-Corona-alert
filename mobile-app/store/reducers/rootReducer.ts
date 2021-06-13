import { PayloadAction } from "@reduxjs/toolkit";
import * as actionTypes from "../actions/actionTypes";

interface IStoreState {
  locationErrorMessage: string
};

const INITIAL_STATE: IStoreState = {
  locationErrorMessage: ''
};

export const rootReducer = (state: IStoreState = INITIAL_STATE, action: PayloadAction<string>) => {
  switch(action.type) {
    case actionTypes.SET_ERROR_MSG:
      return {
        ...state,
        locationErrorMessage: action.payload
      }
    default:
      return {
        ...state
      };
  }
};
