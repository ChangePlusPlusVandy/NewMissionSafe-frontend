import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import RedCorner from "../../components/RedCorner";
import './RegisterUser.css';


interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  programs: string;
  admin: boolean; 
  counselor: boolean;
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
  programs: Yup.string().required("Program selection is required"),
  admin: Yup.boolean().required("Please select a staff type"),
  counselor: Yup.boolean().required("Please select a staff type")
});

const RegisterStaff: React.FC = () => {
  const { registerUser, currentUser } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const handleRoleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
    setValue("admin", event.target.value === "admin");
    setValue("counselor", event.target.value === "counselor");
    await trigger(["admin", "counselor"]); 
  };

  const [error, setError] = useState<string>("");

  const onSubmit = async (values: FormValues) => {
    try {
      if (!role) {
        setError("Please select a role (Admin, Counselor)");
        return;
      }


      setError("");
      console.log("User values: ", values);

      const name = values.firstName + " " + values.lastName;
      await registerUser(name, values.email, values.password);

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
      <RedCorner />
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
          <label htmlFor="programs">Program</label>
          <select id="programs" {...register("programs")}>
            <option value="YLSC"> YLSC</option>
            <option value="SCD">SCD</option>
            <option value="InVest">InVest</option>
            <option value="Power Boxing & Fitness">Power Boxing & Fitness</option>
          </select>
          {errors.programs && <FormError>{errors.programs.message}</FormError>}
        </div>
        <div>
          <div>Select one of the following:</div>
          <div className="role-selection">
            <div>
              <label>
              <input type="radio" value="staff" checked={role === "staff"} onChange={handleRoleChange} />
                Staff
              </label>
            </div>
            <div>
              <label>
              <input type="radio" value="counselor" checked={role === "counselor"} onChange={handleRoleChange} />
                Counselor
              </label>
            </div>
            <div>
              <label>
                <input type="radio" value="admin" checked={role === "admin"} onChange={handleRoleChange} />
                Admin
              </label>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
          {errors.password && <FormError>{errors.password.message}</FormError>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <FormError>{errors.confirmPassword.message}</FormError>
          )}
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

export default RegisterStaff;
