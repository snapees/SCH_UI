import * as yup from "yup";

export const studentSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .required("Name is required"),
  email: yup
    .string()
    .email("It must be an email")
    .required("Email is required"),
  student_class: yup.string().required("Student Class is Required field."),
  age: yup.string().required("Age is Required field."),
  gender: yup.string().required("Gender is Required field."),
  guardian: yup
    .string()
    .min(4, "Must Contain atleast 4 charachter.")
    .required("Guardian is Required field."),
  guardian_phone: yup
    .string()
    .min(10, "Must Contain atleast 10 charachter.")
    .required("Guardian Phone is Required field."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Confirm Passwords must match with Password")
    .required("Confirm Password is required"),
});

export const studentEditSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .required("Name is required"),
  email: yup
    .string()
    .email("It must be an email")
    .required("Email is required"),
  student_class: yup.string().required("Student Class is Required field."),
  age: yup.string().required("Age is Required field."),
  gender: yup.string().required("Gender is Required field."),
  guardian: yup
    .string()
    .min(4, "Must Contain atleast 4 charachter.")
    .required("Guardian is Required field."),
  guardian_phone: yup
    .string()
    .min(10, "Must Contain atleast 10 charachter.")
    .required("Guardian Phone is Required field."),
  password: yup.string().min(8, "Password must be at least 8 characters long."),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Confirm Passwords must match with Password"),
});
