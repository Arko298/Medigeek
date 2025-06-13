import Image from "next/image";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Updated import
import { useRegisterUserMutation } from "@/redux/api/userApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

interface FormData {
  fullName: string;
  userName: string;
  email: string;
  collegeName: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [signup, { isLoading }] = useRegisterUserMutation();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await signup({
        fullName: data.fullName,
        userName: data.userName,
        email: data.email,
        collegeName: data.collegeName,
        password: data.password
      }).unwrap();
      
      dispatch(setCredentials({
        _id: response._id,
        fullName: response.fullName,
        email: response.email,
        collegeName: response.collegeName,
        isAdmin: response.isAdmin,
      }));
      
      toast.success("Signup successful!");
      router.push("/home");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <>
    <div>
      {/* Logo at the top */}
            <div className="absolute top-4 left-4">
              <Image src="/Header_Images/MediGeek_Logo.png" alt="Logo" className="mx-auto h-24" 
              width={200} height={100} />
            </div>
            </div>
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blur">
      {/* Logo */}
      

      {/* Sign Up Form */}
      <div className="w-full max-w-md bg-blur p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              {...register("fullName", { required: "Full name is required" })}
              type="text"
              placeholder="Enter your full name"
              className={`w-full p-2 border rounded-md ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("userName", { 
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters"
                }
              })}
              type="text"
              placeholder="Enter your username"
              className={`w-full p-2 border rounded-md ${
                errors.userName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.userName && (
              <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
            )}
          </div>

          {/* College Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Name
            </label>
            <input
              {...register("collegeName", { required: "College name is required" })}
              type="text"
              placeholder="Enter your college name"
              className={`w-full p-2 border rounded-md ${
                errors.collegeName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.collegeName && (
              <p className="text-red-500 text-xs mt-1">{errors.collegeName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email"
              placeholder="Enter your email"
              className={`w-full p-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              type="password"
              placeholder="Enter your password"
              className={`w-full p-2 border rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return "Passwords don't match";
                  }
                }
              })}
              type="password"
              placeholder="Confirm your password"
              className={`w-full p-2 border rounded-md ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignUp;