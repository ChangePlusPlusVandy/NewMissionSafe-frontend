import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  programs: string;
  counselor: boolean;
  admin: boolean;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(5, "Password must be at least 5 characters").required("Password is required"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords do not match").required("Confirm password is required"),
  programs: Yup.string().required("Program selection is required"),
  counselor: Yup.boolean(),
  admin: Yup.boolean()
});

// add object for firebase uid here

const RegisterStaff: React.FC = () => {
  const { registerUser, currentUser } = useAuth();
  const [role, setRole] = useState("");
  const [uid, setUid] = useState(""); // State variable for storing UID

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };
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
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  const onSubmit = async (values: FormValues) => {
    try {
      values.counselor = role === "counselor";
      values.admin = role === "admin";
      setError("");
      console.log("User values: ", values);

      const name = values.firstName + " " + values.lastName;
      const firebaseUID = await registerUser(name, values.email, values.password);
      setUid(firebaseUID);

      console.log("User id is: ", firebaseUID);
      navigate("/"); // Redirect to home page
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Staff Registration Page</h1>
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
            <option value="Program A">Program A</option>
            <option value="Program B">Program B</option>
            <option value="Program C">Program C</option>
            <option value="Program D">Program D</option>
          </select>
          {errors.programs && <FormError>{errors.programs.message}</FormError>}
        </div>
        <div>
          <div>Select one of the following:</div>
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
