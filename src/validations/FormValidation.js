import * as Yup from "yup";

// Validation schema for form fields
export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  type: Yup.string().required("Type of Vehicle is required"),
  model: Yup.string().required("Specific Model is required"),
});

// Handle form submission and question flow
export async function handleQuestion(
  event,
  formik,
  currentQuestion,
  setCurrentQuestion
) {
  event.preventDefault();
  const isValid = await formik.validateForm();
  const keys = Object.keys(isValid);

  // Check the current question and move to the next question or handle form validation

  if (
    currentQuestion === 1 &&
    !keys.includes("firstName") &&
    !keys.includes("lastName")
  ) {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  } else if (currentQuestion === 2 && !keys.includes("type")) {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  } else if (currentQuestion === 3 && !keys.includes("model")) {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  } else if (currentQuestion === 4 && !keys.includes("name")) {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  } else {
    formik.setTouched(isValid, true);
  }
}
