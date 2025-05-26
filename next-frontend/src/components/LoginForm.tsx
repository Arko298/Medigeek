import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useRole } from "./RoleContext";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "@/redux/api/userApiSlice";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

const Login = () => {
 const dispatch=useDispatch();
 const router=useRouter();
 const [login,{isLoading}]= useLoginUserMutation();
 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const userData=await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      
      console.log(userData);

      const credentials={
        _id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        isAdmin: userData.isAdmin,
      }
      dispatch(setCredentials(credentials));
      if (data.remember){
        localStorage.setItem("rememberMe","true");
      }else{
        localStorage.removeItem("rememberMe");
      }
      toast.success("Login successful!!");
      router.push("/home");
    } catch (error) {
      toast.error("Login failed. Please check your credentials");
    }
  }
  return (
    <div>
      {/* Logo at the top */}
      <div className="absolute top-4 left-4">
        <Image src="/Header_Images/MediGeek_Logo.png" alt="Logo" className="mx-auto h-24" 
        width={200} height={100} />
      </div>

      {/* Login Box */}
      <div className="max-w-md w-full bg-blured p-8 border border-black rounded shadow-lg">
        <div className="text-left font-medium text-xl mb-6">Login</div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-black">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                minLength: {
                  value: 6,
                  message: "Email must be at least 6 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Email must not exceed 30 characters",
                },
              })}
              name="email"
              type="text"
              className={`w-full p-2 border rounded mt-1 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-600"
            >
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              name="password"
              type="password"
              className={`w-full p-2 border rounded mt-1 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                {...register("remember")}
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-sm text-blue-500">
              Forgot Password?
            </a>
          </div>

  

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white text-sm py-2 px-4 rounded-md hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        {/* Signup Redirect */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-500 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;