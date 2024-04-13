import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  program: string;
  role: number;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
  program: Yup.string().required("Program selection is required"),
  role: Yup.number().required("Please select a role"),
});

const RegisterStaff: React.FC = () => {
  const { registerUser, currentUser } = useAuth();
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
      const name = values.firstName + " " + values.lastName;
      

      const finalValues = {
          ...values,
          firebaseUID: currentUser ? currentUser.uid : "No UID found", 
          active: true,
        };
      
      

      const { password, confirmPassword, ...rest } = finalValues;
      console.log(rest)
      await registerUser(name, values.email, values.password, rest);

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <FormError>{errors.firstName.message}</FormError>
          )}
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
          <label htmlFor="program">Program</label>
          <select id="program" {...register("program")}>
            <option value="">Select One</option>
            <option value="YLSC">YLSC</option>
            <option value="SCD">SCD</option>
            <option value="InVest">InVest</option>
            <option value="Power Boxing & Fitness">
              Power Boxing & Fitness
            </option>
          </select>
          {errors.program && <FormError>{errors.program.message}</FormError>}
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select id="role" {...register("role")}>
            <option value="">Select One</option>
            <option value={1}>Admin</option>
            <option value={2}>Manager</option>
            <option value={3}>Counselor</option>
            <option value={4}>Staff</option>
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
          {errors.confirmPassword && (
            <FormError>{errors.confirmPassword.message}</FormError>
          )}
        </div>
        {error && <FormError>{error}</FormError>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterStaff;
