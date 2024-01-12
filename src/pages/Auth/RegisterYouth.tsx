import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { emailValidation, passwordValidation } from './ValidationRules'; 
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";

interface FormValues {
  firstName: string;
  lastName: string;
  birthDate: Date;
  ssn: string;
  email: string;
  password: string;
  program: string;
  active: boolean;
  confirmPassword: string;
  attached_forms?: string[];
  attended_events?: string[];
}

interface Youth {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  program: string;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("First Name is required"),
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  ssn: Yup.string()
    .matches(/^\d{10}$/, "SSN must be exactly 10 digits and only contain numbers")
    .required("SSN is required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
});




const RegisterYouth: React.FC = () => {
  const { registerUser, currentUser } = useAuth();
  const navigate = useNavigate();
  const [uid, setUid] = useState<string>("");


  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

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
      console.log(values);

      const name = values.firstName + " " + values.lastName;
      const firebaseUID = await registerUser(name, values.email, values.password);
      setUid(firebaseUID);
      console.log("User id is: ", firebaseUID);

      console.log("User id is: ", uid);
      navigate('/youth-details'); // Redirect to youth details page

      navigate("/"); // Redirect to home page
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      setError(err.message);
    }
  };
  

  function getUserData(values: FormValues): Youth | null {
    if (currentUser) {
      const youthData: Youth = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        birthDate: values.birthDate, // You need to adjust this based on how you store birth dates
        program: values.program, // Adjust based on your data
      };
      
      return youthData;
    }
    return null;
  }

  return (
    <div>
      <h1>Youth Registration Page</h1>
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
          <label htmlFor="birthDate">Birth Date</label>
          <input type="date" id="birthDate" {...register("birthDate")} />
          {errors.birthDate && <FormError>{errors.birthDate.message}</FormError>}
        </div>
        <div>
          <label htmlFor="program">Program</label>
          <select id="program" {...register("program")}>
            <option value="Program A">Program A</option>
            <option value="Program B">Program B</option>
            <option value="Program C">Program C</option>
            <option value="Program D">Program D</option>
          </select>
          {errors.program && <FormError>{errors.program.message}</FormError>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
          {errors.password && <FormError>{errors.password.message}</FormError>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <FormError>{errors.confirmPassword.message}</FormError>}
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