import * as yup from "yup";

export const subjectSchema = yup.object({
  subject_name: yup
    .string()
    .min(2, "Atleast 2 charachters is required.")
    .required("Subject Name is required."),
  subject_codename: yup.string().required("Subject Codename is required."),
});
