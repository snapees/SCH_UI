import * as yup from "yup";

export const registerSchema = yup.object({
  school_name: yup
    .string()
    .min(8, "School name must be at least 8 characters long.")
    .required("School name is required"),
  email: yup
    .string()
    .email("It must be an email")
    .required("Email is required"),
  owner_name: yup
    .string()
    .min(3, "Owner name must be at least 3 characters long.")
    .required("Owner name is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Confirm Passwords must match with Password")
    .required("Confirm Password is required"),
});
