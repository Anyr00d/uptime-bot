import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  register: any;
  error?: string;
}

export function FormInput({ id, label, type = "text", register, error }: FormInputProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...register(id)} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
