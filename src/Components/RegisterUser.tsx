import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterUser = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const registerUser: SubmitHandler<FormData> = async (data) => {
    try {
      let payload = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        username: data?.username,
        password: data?.password,
        confirmPassword: data?.confirmPassword,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_MOBIGIC_BACKEND_LINK}/users`,
        payload
      );
      if (response?.data?.status === 201) {
        toast.success(`${response.data.message}`);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
      <p className="font-bold text-lg">Register User</p>
      <form
        onSubmit={handleSubmit(registerUser)}
        className="flex flex-col w-1/4 gap-3"
      >
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text"
            id="firstName"
            {...register("firstName", { required: "First Name is required" })}
          />
          {errors.firstName && (
            <p className="error">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text"
            id="lastName"
            {...register("lastName", { required: "Last Name is required" })}
          />
          {errors.lastName && (
            <p className="error">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="error">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Register
          </button>
          <Link to="/login">
            <button className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Login
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterUser;
