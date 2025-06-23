"use client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useAuthForm } from "@/lib/useAuthForm";
import { useAuthStore } from "@/stores/auth";
import { authapi } from "@/lib/api";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const { form, onSubmit } = useAuthForm(async (data) => {
    try {
      const res = await authapi.post("/login", data);
      // console.log(res);
      setCookie("token", res.data.token, { maxAge: 60 * 60 * 24 });
      useAuthStore.getState().setToken(res.data.token);
      router.push("/dashboard");
    } catch (err) {
      alert("Login failed!");
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-semibold">Login</h2>
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
      <Button type="submit">Login</Button>
    </form>
  );
}
