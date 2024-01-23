import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../AuthContext";
import FormError from "./Auth/FormError";
import { createCode, createEvent } from "../utils/eventInterface";
import "./CreateEvent.css";
import { eventType } from "../utils/models/eventModel";

interface FormValues {
  name: string;
  description: string;
  date: Date;
  programs: string;
  staff: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Event name is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Event date is required"),
  programs: Yup.string().required("Program is required"),
  staff: Yup.string().required("Staff name is required"),
});

const CreateEvent: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {}, [currentUser, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      // Generate a unique event code
      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error(
          "Authentication token is not available. Please log in."
        );
      } else {
        const eventCode = await createCode(token);

        // Construct the event object
        const event: eventType = {
          name: values.name,
          description: values.description,
          code: eventCode,
          date: values.date,
          programs: [values.programs], // Assuming programs is a single string, convert to array
          staff: [values.staff], // Assuming staff is a single string, convert to array
          // include other fields as necessary
        };

        // Create the event
        const response = await createEvent(event, token);
        console.log(response);

        // Redirect to home page or another relevant page
        navigate("/");
      }
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
    <div className="create-event-container">
      <h1>Create Event</h1>
      <p>Enter the following information to create a new event.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="event-name">Event Name</label>
          <input type="event-name" id="event-name" {...register("name")} />
          {errors.name != null && <FormError>{errors.name.message}</FormError>}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="description"
            id="description"
            {...register("description")}
          />
          {errors.description != null && (
            <FormError>{errors.description.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" {...register("date")} />
          {errors.description != null && (
            <FormError>{errors.description.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="programs">Programs</label>
          <input type="programs" id="programs" {...register("programs")} />
          {errors.description != null && (
            <FormError>{errors.description.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="staff">Staff</label>
          <input type="staff" id="staff" {...register("staff")} />
          {errors.name != null && <FormError>{errors.name.message}</FormError>}
          {errors && <FormError>{error}</FormError>}
        </div>
        <button
          className="create-event-button"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Submitting" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
