import { useEffect, useState } from "react";
import { useFormik } from "formik";

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Box,
} from "@mui/material";
import {
  validationSchema,
  handleQuestion,
} from "../validations/FormValidation";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "../styles/form.css";

function Form() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [VehicleData, setVehicleData] = useState([{}]);

  // Fetch vehicle data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/vehicle`
      );
      setVehicleData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Formik form configuration
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      type: "",
      model: "",
      name: "",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/booking`,
          values
        );
        console.log(response);
        if (response.status === 201) {
          toast.success(response.data.message);
          setTimeout(()=>{
            window.location.reload()
          },1000)
        }
      } catch (error) {
        console.error("Failed to submit form", error);
        if (error.response.status === 400) {
          toast.error(error.response.data.error);
        } else if (error.response.status === 404) {
          toast.error(error.response.data.error);
        } else if (error.response.status === 500) {
          toast.error(error.response.data.error);
        }
      }
    },
  });

  // Handle moving to the next question in the form
  const handleNextQuestion = async (event) => {
    await handleQuestion(event, formik, currentQuestion, setCurrentQuestion);
  };

  // Render the current question based on the currentQuestion state
  const renderCurrentQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return (
          <div>
            <h1>Please Enter Your Name</h1>
            <Box sx={{ marginTop: "10px" }}>
              <TextField
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                className="input-field"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Box>
            <Box sx={{ marginTop: "10px" }}>
              <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                className="input-field"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Box>
          </div>
        );
      case 2:
        return (
          <>
            <h1>Please Select Type Of Vehicle</h1>
            <FormControl component="fieldset">
              <FormLabel component="legend">Type Of Vehicles</FormLabel>
              <RadioGroup
                aria-label="type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel value="car" control={<Radio />} label="car" />
                <FormControlLabel
                  value="baik"
                  control={<Radio />}
                  label="baik"
                />
              </RadioGroup>
              {formik.touched.type && formik.errors.type && (
                <div style={{ color: "red" }}>{formik.errors.type}</div>
              )}
            </FormControl>
          </>
        );
      case 3:
        const selectedType = formik.values.type;
        const filteredModels = VehicleData.filter(
          (model) => model.type.toString() === selectedType
        );

        // Create a Set to store unique model values
        const uniqueModels = new Set();

        // Filter out duplicate models and populate the uniqueModels Set
        const uniqueFilteredModels = filteredModels.filter((model) => {
          if (!uniqueModels.has(model.model)) {
            uniqueModels.add(model.model);
            return true;
          }
          return false;
        });
        return (
          <>
            <h1>Please Select Model</h1>
            <FormControl component="fieldset">
              <FormLabel component="legend">MOdel of vhicle</FormLabel>
              <RadioGroup
                aria-label="model"
                name="model"
                value={formik.values.model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {uniqueFilteredModels.map((model) => (
                  <FormControlLabel
                    key={model.id}
                    value={model.model.toString()}
                    control={<Radio />}
                    label={model.model}
                  />
                ))}
              </RadioGroup>
              {formik.touched.model && formik.errors.model && (
                <div style={{ color: "red" }}>{formik.errors.model}</div>
              )}
            </FormControl>
          </>
        );
      case 4:
        const selectedModel = formik.values.model;
        const filteredName = VehicleData.filter((model) => {
          return model.model.toString() === selectedModel;
        });
        return (
          <>
            <h1>Please Select Vehicle Name</h1>
            <FormControl component="fieldset">
              <FormLabel component="legend">Name Of vehicles</FormLabel>
              <RadioGroup
                aria-label="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {filteredName.map((name) => (
                  <FormControlLabel
                    key={name.id}
                    value={name.name.toString()}
                    control={<Radio />}
                    label={name.name}
                  />
                ))}
              </RadioGroup>
              {formik.touched.name && formik.errors.name && (
                <div style={{ color: "red" }}>{formik.errors.name}</div>
              )}
            </FormControl>
          </>
        );
      case 5:
        return (
          <div>
            <h1>Plese Slect Date</h1>
            <TextField
              type="date"
              label="Start Date"
              name="startDate"
              InputLabelProps={{
                shrink: true,
              }}
              required
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
            />
            <Box sx={{ marginTop: "10px" }}>
              <TextField
                type="date"
                label="End Date"
                name="endDate"
                InputLabelProps={{
                  shrink: true,
                }}
                required
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                inputProps={{
                  min:
                    formik.values.startDate ||
                    new Date().toISOString().split("T")[0],
                }}
              />
            </Box>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit} className="form-container">
        {renderCurrentQuestion()}
        {currentQuestion < 5 && (
          <div className="button-container">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          </div>
        )}
        {currentQuestion === 5 && (
          <div className="button-container">
            <Button
              type="submit"
              onSubmit={formik.handleSubmit}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </div>
        )}
        <ToastContainer className="toast-container" />
      </form>
    </div>
  );
}

export default Form;
