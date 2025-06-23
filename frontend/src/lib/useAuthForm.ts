import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type AuthFormData = z.infer<typeof authSchema>;

export function useAuthForm(onSubmit: (data: AuthFormData) => void) {
  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
