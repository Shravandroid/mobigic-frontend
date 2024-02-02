import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
interface FormData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { setToken } = useContext(AppContext);

  const navigate = useNavigate();

  const LoginUser: SubmitHandler<FormData> = async (data) => {
    try {
      let payload = {
        username: data?.username,
        password: data?.password,
      };
      const response = await axios.post("http://localhost:4000/login", payload);
      if (response?.data?.status === 201) {
        toast.success(`${response.data.message}`);
      }
      if (response && response.data.accessToken) {
        const token = response.data.accessToken;
        sessionStorage.setItem("token", token);
        setToken(token);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
      <p className="font-bold text-lg">Login</p>
      <form
        onSubmit={handleSubmit(LoginUser)}
        className="flex flex-col w-1/4 gap-3"
      >
        <div className="">
          <label htmlFor="username">Username</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Login
          </button>

          <button
            type="button"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={() => {
              navigate("/register");
            }}
          >
            Not registered! Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
