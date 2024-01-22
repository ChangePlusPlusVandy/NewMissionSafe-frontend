import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import './Login.css';
import RedCorner from "../../components/RedCorner";

interface FormValues {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      const alal = await login(values.email, values.password);
      console.log(alal);
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
    <div className="login-container">
      <RedCorner/>
      <h1>Login</h1>
      <p>Please sign in to continue</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} />
          {errors.email != null && (
            <FormError>{errors.email.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
          {errors.password != null && (
            <FormError>{errors.password.message}</FormError>
          )}
          {errors && <FormError>{error}</FormError>}
        </div>
        <button className="login-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting" : "Login"}
        </button>
      </form>
      <div className="bottom-text">
        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
        <p>
          Forgot your password? <Link to="/forgot-password">Reset</Link>
        </p>
      </div>
    </div>
    
  );
};

export default Login;

