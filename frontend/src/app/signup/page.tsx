"use client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useAuthForm } from "@/lib/useAuthForm";
import { authapi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export default function SignupPage() {
  const { form, onSubmit } = useAuthForm(async (data) => {
    try {
      const res = await authapi.post("/signup/dashboard", data);
      setCookie("token", res.data.token, { maxAge: 60 * 60 * 24 }); // Sets a cookie for 24 hours
      const value = getCookie("token");
      useAuthStore.getState().setToken(res.data.token);
    } catch (err) {
      alert(err);
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-semibold">Signup</h2>
      <FormInput
        id="email"
        label="Email"
        register={form.register}
        error={form.formState.errors.email?.message}
      />
      <FormInput
        id="password"
        label="Password"
        type="password"
        register={form.register}
        error={form.formState.errors.password?.message}
      />
      <Button type="submit">Sign Up</Button>
    </form>
  );
}
