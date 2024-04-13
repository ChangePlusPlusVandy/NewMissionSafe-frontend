import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import { createYouth } from "../../utils/youthInterface";
import { v4 as uuidv4 } from "uuid";
import { youthType } from "../../utils/models/youthModel";

interface FormValues {
  firstName: string;
  lastName: string;
  middleInitial?: string;
  birthDate: Date;
  ssn: string;
  confirmSsn: string;
  schoolName: string;
  schoolDepartureTime: string;
  programArrivalTime: string;
  program: string;
  gender: string;
  pronouns: string;
  race: string;
  ethnicity: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  middleInitial: Yup.string()
    .max(1, "Middle initial must be only one character")
    .optional(),
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
  ssn: Yup.string()
    .matches(
      /^\d{10}$/,
      "SSN must be exactly 10 digits and only contain numbers"
    )
    .required("SSN is required"),
  confirmSsn: Yup.string()
    .required()
    .oneOf([Yup.ref("ssn")], "SSN do not match"),
  schoolName: Yup.string().required("School name is required"),
  schoolDepartureTime: Yup.string().required(
    "Please enter school departure time"
  ),
  programArrivalTime: Yup.string().required(
    "Please enter program arrival time"
  ),
  program: Yup.string().required("Select a program"),
  gender: Yup.string().required("Gender is required"),
  race: Yup.string().required("Race is required"),
  ethnicity: Yup.string().required("Ethnicity is required"),
  guardianName: Yup.string().required("Guardian name is required"),
  guardianPhone: Yup.string()
    .matches(
      /^\d{10}$/,
      "Guardian phone must be exactly 10 digits and only contain numbers"
    )
    .required("Guardian phone is required"),
  guardianEmail: Yup.string()
    .email("Invalid guardian email address")
    .required("Guardian email is required"),
  pronouns: Yup.string().required("Please select your pronouns"),
});

const calculateAgeJoined = (birthDate: Date): number => {
  const today = new Date().getTime();
  const x = today - birthDate.getTime();
  return Math.floor(x / 1000 / 60 / 60 / 24 / 365.25);
};

const RegisterYouth: React.FC = () => {
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

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      const token = await currentUser?.getIdToken();

      const finalValues = {
        ...values,
        active: true,
        ageJoined: calculateAgeJoined(values.birthDate),
        attended_events: [],
        attached_forms: [],
        uuid: uuidv4(),
      };

      const { confirmSsn, middleInitial, ...rest } = finalValues;
      const newMiddleInitial = middleInitial === "" ? " " : middleInitial;
      const x = {
        middleInitial: newMiddleInitial,
        ...rest,
      };

      if (token) {
        console.log(x);
        await createYouth(x as youthType, token);

        alert("Youth creation successful");
        navigate("/");
      } else {
        throw Error("no token found");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Handle unexpected error type
        setError("An unknown error occurred");
      }

      console.log("this the err: ", error);
    }
  };

  return (
    <div className="registration-container">
      <h2>Register Youth</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">First Name </label>
          <input type="text" id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <FormError>{errors.firstName.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="lastName">Last Name </label>
          <input type="text" id="lastName" {...register("lastName")} />
          {errors.lastName && <FormError>{errors.lastName.message}</FormError>}
        </div>
        <div>
          <label htmlFor="middleInitial">Middle Initial </label>
          <input
            type="text"
            id="middleInitial"
            {...register("middleInitial")}
          />
          {errors.middleInitial && (
            <FormError>{errors.middleInitial.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="birthDate">Birth Date </label>
          <input type="date" id="birthDate" {...register("birthDate")} />
          {errors.birthDate && (
            <FormError>{errors.birthDate.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="ssn">SSN </label>
          <input type="password" maxLength={10} id="ssn" {...register("ssn")} />
          {errors.ssn && <FormError>{errors.ssn.message}</FormError>}
        </div>
        <div>
          <label htmlFor="confirmSsn">Confirm SSN </label>
          <input
            type="password"
            maxLength={10}
            id="confirmSsn"
            {...register("confirmSsn")}
          />
          {errors.confirmSsn && (
            <FormError>{errors.confirmSsn.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="gender">Gender </label>
          <select id="gender" {...register("gender")}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-Binary">Non-Binary</option>
            <option value="Other">Other</option>
            <option value="Prefer Not to Say">Prefer Not to Say</option>
          </select>
          {errors.gender && <FormError>{errors.gender.message}</FormError>}
        </div>
        <div>
          <label htmlFor="ethnicity">Ethnicity </label>
          <select id="ethnicity" {...register("ethnicity")}>
            <option value="">Select One</option>
            <option value="Hispanic or Latino">Hispanic or Latino</option>
            <option value="NOT Hispanic or Latino">
              NOT Hispanic or Latino
            </option>
          </select>
          {errors.ethnicity && (
            <FormError>{errors.ethnicity.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="race">Race </label>
          <select id="race" {...register("race")}>
            {errors.race && <FormError>{errors.race.message}</FormError>}
            <option value="">Select One</option>
            <option value="Asian">Asian</option>
            <option value="Black/African American">
              Black/African American
            </option>
            <option value="Middle Eastern">Middle Eastern</option>
            <option value="Native American/Alaskan">
              Native American/Alaskan
            </option>
            <option value="Native Hawaiian/Pacific Islander">
              Native Hawaiian/Pacific Islander
            </option>
            <option value="White">White</option>
          </select>
        </div>
        <div>
          <label htmlFor="pronouns">Pronouns </label>
          <select id="pronouns" {...register("pronouns")}>
            <option value="">Select One</option>
            <option value="He/Him/His">He/Him/His</option>
            <option value="She/Her/Hers">She/Her/Hers</option>
            <option value="They/Them/Their">They/Them/Their</option>
            <option value="Prefer Not to Say">Prefer Not to Say</option>
          </select>
          {errors.ethnicity && (
            <FormError>{errors.ethnicity.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="schoolName">School Name </label>
          <input type="text" id="schoolName" {...register("schoolName")} />
          {errors.schoolName && (
            <FormError>{errors.schoolName.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="schoolDepartureTime">School Departure Time </label>
          <input
            type="time"
            id="schoolDepartureTime"
            {...register("schoolDepartureTime")}
          />
          {errors.schoolDepartureTime && (
            <FormError>{errors.schoolDepartureTime.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="programArrivalTime">Program Arrival Time </label>
          <input
            type="time"
            id="programArrivalTime"
            {...register("programArrivalTime")}
          />
          {errors.programArrivalTime && (
            <FormError>{errors.programArrivalTime.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="program">Program </label>
          <select id="program" {...register("program")}>
            <option value="">Select Program</option>
            <option value="YLSC"> YLSC</option>
            <option value="SCD">SCD</option>
            <option value="InVest">InVest</option>
            <option value="Power Boxing & Fitness">
              Power Boxing & Fitness
            </option>
          </select>
          {errors.program && <FormError>{errors.program.message}</FormError>}
        </div>
        <div>
          <label htmlFor="guardianName">Guardian Name </label>
          <input type="text" id="guardianName" {...register("guardianName")} />
          {errors.guardianName && (
            <FormError>{errors.guardianName.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="guardianEmail">Guardian Email </label>
          <input
            type="email"
            id="guardianEmail"
            {...register("guardianEmail")}
          />
          {errors.guardianEmail && (
            <FormError>{errors.guardianEmail.message}</FormError>
          )}
        </div>
        <div>
          <label htmlFor="guardianPhone">Guardian Phone </label>
          <input
            type="text"
            id="guardianPhone"
            maxLength={10}
            {...register("guardianPhone")}
          />
          {errors.guardianPhone && (
            <FormError>{errors.guardianPhone.message}</FormError>
          )}
        </div>
        {error && <FormError>{error}</FormError>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
};
export default RegisterYouth;
