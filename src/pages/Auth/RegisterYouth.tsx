import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import {createYouth} from "../../utils/youthInterface";
import RedCorner from "../../components/RedCorner";
import './RegisterUser.css';


interface FormValues {
  firstName: string;
  lastName: string;
  birthDate: Date;
  ssn: string;
  confirmSsn: string;
  email: string;
  program: string;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("First Name is required"),
  email: Yup.string()
  .email("Invalid email address")
  .required("Email is required"),
  ssn: Yup.string()
    .matches(/^\d{10}$/, "SSN must be exactly 10 digits and only contain numbers")
    .required("SSN is required"),
  confirmSsn: Yup.string()
  .oneOf([Yup.ref("ssn")], "SSNs do not match")
  .required("Confirm SSN is required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
    program: Yup.string().required("Program selection is required"),
});

const RegisterYouth: React.FC = () => {
  const {currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      const token =  await currentUser?.getIdToken();

      const {confirmSsn, ...newValues} = values;
      const finalValues = {...newValues, active: true, firebaseUID: "dummyID"};
      console.log(finalValues, token)

      if (token) {
        createYouth(finalValues, token);
      } else { 
        throw Error("no token found");
      }

      navigate("/"); // Redirect to home page
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Handle unexpected error type
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="registration-container">
    <RedCorner/>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" {...register("firstName")} />
          {errors.firstName && <FormError>{errors.firstName.message}</FormError>}
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" {...register("lastName")} />
          {errors.lastName && <FormError>{errors.lastName.message}</FormError>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} />
          {errors.email && <FormError>{errors.email.message}</FormError>}
        </div>
        <div>
          <label htmlFor="ssn">SSN</label>
          <input type="password" id="ssn" {...register("ssn")} />
          {errors.ssn && <FormError>{errors.ssn.message}</FormError>}
        </div>
        <div>
          <label htmlFor="confirmSsn">Confirm SSN</label>
          <input type="password" id="confirmSsn" {...register("confirmSsn")} />
          {errors.confirmSsn && (
            <FormError>{errors.confirmSsn.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="birthDate">Birth Date</label>
          <input type="date" id="birthDate" {...register("birthDate")} />
          {errors.birthDate && <FormError>{errors.birthDate.message}</FormError>}
        </div>
        <div>
          <label htmlFor="program">Program</label>
          <select id="program" {...register("program")}>
            <option value="YLSC"> YLSC</option>
            <option value="SCD">SCD</option>
            <option value="InVest">InVest</option>
            <option value="Power Boxing & Fitness">Power Boxing & Fitness</option>
          </select>
          {errors.program && <FormError>{errors.program.message}</FormError>}
        </div>
        {error && <FormError>{error}</FormError>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting" : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterYouth;