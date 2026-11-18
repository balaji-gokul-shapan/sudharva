import { combineReducers } from "@reduxjs/toolkit";
import appSliceReducer from "./slices/appSlice";
import pincodeReducer from "./slices/pincodeSlice";
import otpRequestReducer from "./slices/otp/otpRequestSlice";
import otpVerifyReducer from "./slices/otp/otpVerifySlice";
import createRegistrationReducer from "./slices/registration/createRegistrationSlice";
import registrationDraftReducer from "./slices/registration/registrationDraftSlice";
import getMasterReducer from "./slices/masters/getMasterSlice";
import getMasterEventCategoriesReducer from "./slices/masters/getMasterEventCategoriesSlice";
import getBloodGroupMasterReducer from "./slices/masters/getBloodGroupmasterSlice";
import createPaymentOrderReducer from "./slices/payment/createPaymentOrderSlice";
import paymentOrderConfirmationReducer from "./slices/payment/paymentOrderConfirmationSlice";
import enterBibNumberReducer from "./slices/bibNumber/enterBibNumberSlice";
import applyCouponCodeReducer from "./slices/couponCode/ApplyCouponCodeSlice";
import loginUserReducer from "./slices/users/userLoginSlice";
import userRegisterReducer from "./slices/users/userRegisterSlice";
import userRefreshTokenReducer from "./slices/users/userRefreshTokenSlice";
import getUserDetailsReducer from "./slices/users/getuserDetailsSlice";
import getRequestOtpReducer from "./slices/forgotPassword/getOtpSlice";
import resetPasswordReducer from "./slices/forgotPassword/resetPasswordSlice";


const combinedReducer = combineReducers({
  app: appSliceReducer,
  pincode: pincodeReducer,
  otpRequest: otpRequestReducer,
  otpVerify: otpVerifyReducer,
  createRegistration: createRegistrationReducer,
  enterBibNumber: enterBibNumberReducer,
  enterBibNumber: enterBibNumberReducer,
  createPaymentOrder: createPaymentOrderReducer,
  paymentOrderConfirmation: paymentOrderConfirmationReducer,
  applyCouponCode: applyCouponCodeReducer,
  registrationDraft: registrationDraftReducer,
  master: getMasterReducer,
  masterEventCategories: getMasterEventCategoriesReducer,
  bloodGroupMaster: getBloodGroupMasterReducer,
  loginUser: loginUserReducer,
  userRegister: userRegisterReducer,
  userRefreshToken: userRefreshTokenReducer,
  getUserDetails: getUserDetailsReducer,
  getRequestOtp: getRequestOtpReducer,
  resetPassword: resetPasswordReducer,
});

const rootReducer = (state, action) => {
  if (action?.type === "app/resetState") {
    return combinedReducer(undefined, action);
  }

  return combinedReducer(state, action);
};

export default rootReducer;
