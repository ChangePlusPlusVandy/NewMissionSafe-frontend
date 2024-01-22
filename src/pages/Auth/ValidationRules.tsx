import * as Yup from 'yup';

export const emailValidation = Yup.string()
  .email("Invalid email address")
  .required("Email is required");