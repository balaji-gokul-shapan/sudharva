import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import pincodeReducer from "./slices/pincodeSlice";
import otpRequestReducer from "./slices/otp/otpRequestSlice";
import otpVerifyReducer from "./slices/otp/otpVerifySlice";
import createRegistrationReducer from "./slices/registration/createRegistrationSlice";
import registrationDraftReducer from "./slices/registration/registrationDraftSlice";
import getMasterReducer from "./slices/masters/getMasterSlice";
import getMasterEventCategoriesReducer from "./slices/masters/getMasterEventCategoriesSlice";
import createPaymentOrderReducer from "./slices/payment/createPaymentOrderSlice";
import paymentOrderConfirmationReducer from "./slices/payment/paymentOrderConfirmationSlice";
import enterBibNumberReducer from "./slices/bibNumber/enterBibNumberSlice";
import loginUserReducer from "./slices/users/userLoginSlice";
import userRegisterReducer from "./slices/users/userRegisterSlice";
import userRefreshTokenReducer from "./slices/users/userRefreshTokenSlice";
import getUserDetailsReducer from "./slices/users/getuserDetailsSlice";

const rootReducer = combineReducers({
  app: appReducer,
  pincode: pincodeReducer,
  otpRequest: otpRequestReducer,
  otpVerify: otpVerifyReducer,
  createRegistration: createRegistrationReducer,
  enterBibNumber: enterBibNumberReducer,
  createPaymentOrder: createPaymentOrderReducer,
  paymentOrderConfirmation: paymentOrderConfirmationReducer,
  registrationDraft: registrationDraftReducer,
  master: getMasterReducer,
  masterEventCategories: getMasterEventCategoriesReducer,
  loginUser: loginUserReducer,
  userRegister: userRegisterReducer,
  userRefreshToken: userRefreshTokenReducer,
  getUserDetails: getUserDetailsReducer,
});

export default rootReducer;
