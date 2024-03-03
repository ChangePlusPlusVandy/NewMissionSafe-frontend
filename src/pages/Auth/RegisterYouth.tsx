import { yupResolver } from "@hookform/resolvers/yup";
import React, {useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../AuthContext";
import FormError from "./FormError";
import {createYouth} from "../../utils/youthInterface";
import RedCorner from "../../components/RedCorner";
import './RegisterUser.css';


interface FormValues {
  uuid: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  birthDate: Date;
  ageJoined: number;
  schoolName: string;
  schoolDepartureTime: string;
  programArrivalTime: string;
  gender: string;
  pronouns: string;
  race: string;
  ethnicity: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  ssn: string;
  attached_forms: string[];
  attended_events: string[];
  active: boolean;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  ssn: Yup.string().matches(/^\d{10}$/, "SSN must be exactly 10 digits and only contain numbers").required("SSN is required"),
  birthDate: Yup.date().max(new Date(), "Birth date cannot be in the future").required("Birth date is required"),
  middleInitial: Yup.string().max(1, "Middle initial must be only one character"),
  schoolName: Yup.string().required("School name is required"),
  guardianName: Yup.string().required("Guardian name is required"),
  guardianPhone: Yup.string().matches(/^\d{10}$/, "Guardian phone must be exactly 10 digits and only contain numbers").required("Guardian phone is required"),
  guardianEmail: Yup.string().email("Invalid guardian email address").required("Guardian email is required"),
  gender: Yup.string().required("Gender is required"),
  pronouns: Yup.string().optional(),
  race: Yup.string().required("Race is required"),
  ethnicity: Yup.string().required("Ethnicity is required"),
});


const RegisterYouth: React.FC = () => {
  const {currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema), //is this okay
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
        uuid: "dummyId", 
      };
      console.log(finalValues, token);


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
  
  function calculateAgeJoined(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
  

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
          <label htmlFor="middleInitial">Middle Initial</label>
          <input type="text" id="middleInitial" {...register("middleInitial")} />
          {errors.middleInitial && <FormError>{errors.middleInitial.message}</FormError>}
        </div>
        <div>
          <label htmlFor="birthDate">Birth Date</label>
          <input type="date" id="birthDate" {...register("birthDate")} />
          {errors.birthDate && <FormError>{errors.birthDate.message}</FormError>}
        </div>
        <div>
          <label htmlFor="ssn">SSN</label>
          <input type="password" id="ssn" {...register("ssn")} />
          {errors.ssn && <FormError>{errors.ssn.message}</FormError>}
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select id="gender" {...register("gender")}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-Binary">Non-Binary</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <FormError>{errors.gender.message}</FormError>}
        </div>
        <div>
          <label htmlFor="race">Race</label>
          <input type="text" id="race" {...register("race")} />
          {errors.race && <FormError>{errors.race.message}</FormError>}
        </div>
        <div>
          <label htmlFor="ethnicity">Ethnicity</label>
          <input type="text" id="ethnicity" {...register("ethnicity")} />
          {errors.ethnicity && <FormError>{errors.ethnicity.message}</FormError>}
        </div>
        <div>
          <label htmlFor="schoolName">School Name</label>
          <input type="text" id="schoolName" {...register("schoolName")} />
          {errors.schoolName && <FormError>{errors.schoolName.message}</FormError>}
        </div>
        <div>
          <label htmlFor="guardianName">Guardian Name</label>
          <input type="text" id="guardianName" {...register("guardianName")} />
          {errors.guardianName && <FormError>{errors.guardianName.message}</FormError>}
        </div>
        <div>
          <label htmlFor="guardianEmail">Guardian Email</label>
          <input type="email" id="guardianEmail" {...register("guardianEmail")} />
          {errors.guardianEmail && <FormError>{errors.guardianEmail.message}</FormError>}
        </div>
        <div>
          <label htmlFor="guardianPhone">Guardian Phone</label>
          <input type="text" id="guardianPhone" {...register("guardianPhone")} />
          {errors.guardianPhone && <FormError>{errors.guardianPhone.message}</FormError>}
        </div>
        {error && <FormError>{error}</FormError>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};  
export default RegisterYouth;