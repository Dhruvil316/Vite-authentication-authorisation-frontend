// src/pages/auth/Signup.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validation";
import { z } from "zod";
import api from "@/lib/axios";

type SignupData = z.infer<typeof signupSchema>;

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupData) => {
    try {
      await api.post("/auth/signup", data);
      alert("Signup successful! Please login.");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4 border rounded"
    >
      <h2 className="text-xl font-bold">Sign Up</h2>

      <input
        type="email"
        {...register("email")}
        placeholder="Email"
        className="input"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input
        type="password"
        {...register("password")}
        placeholder="Password"
        className="input"
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}

      <select {...register("role")} className="input">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && <p className="text-red-500">{errors.role.message}</p>}

      <button type="submit" className="btn w-full">
        Sign Up
      </button>
    </form>
  );
}
