import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
  Control,
  FieldError as RHFFieldError,
} from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldSet, FieldLegend } from "./field";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { EyeClosed, Eye } from "lucide-react";
import { Switch } from "./switch";
import { Textarea } from "./textarea";
import { Controller } from "react-hook-form";

type FormFieldProps<T extends FieldValues> = {
  label: string;
  type: string;
  id: string;
  register: UseFormRegister<T>;
  errors?: any;
  placeholder?: string;
  isVisible?: boolean;
  setIsVisible?: (visible: boolean | ((prev: boolean) => boolean)) => void;
  name: Path<T>;
  classname?: string;
  disabled?: boolean;
  defaultValue?: string | Date | number | boolean;
  inputType?: "input" | "textarea" | "select" | "switch";
  showLabel?: boolean;
  registerOptions?: RegisterOptions<T>;
  control?: Control<T>;
};

export function FormBox<T extends FieldValues>({
  isVisible,
  setIsVisible,
  label,
  type,
  placeholder,
  id,
  register,
  errors,
  name,
  classname,
  disabled = false,
  defaultValue,
  inputType,
  showLabel = true,
  registerOptions,
  control,
}: FormFieldProps<T>) {
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);

  return (
    <div className={`${classname}`}>
      <FieldSet>
        <FieldLegend className="w-full relative">
          <Field>
            {showLabel && (
              <FieldLabel
                htmlFor={id}
                className={cn(
                  "text-sm text-SoftBlack",
                  errors ? "text-red-600" : "",
                )}
              >
                {label}
              </FieldLabel>
            )}
            {inputType === "textarea" ? (
              <Textarea
                id={id}
                {...register(name, registerOptions)}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  "focus:outline-blue-500 focus:ring-blue-500",
                  errors ? "border-red-600" : "",
                )}
                defaultValue={
                  defaultValue instanceof Date
                    ? defaultValue.toISOString().split("T")[0]
                    : typeof defaultValue === "boolean"
                      ? String(defaultValue)
                      : defaultValue
                }
                rows={4}
              />
            ) : inputType === "switch" ? (
              <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    id={id}
                    checked={value}
                    onCheckedChange={onChange}
                    disabled={disabled}
                  />
                )}
              />
            ) : (
              <Input
                type={isVisible ? "text" : type}
                placeholder={placeholder}
                className={cn(
                  "focus:outline-blue-500 focus:ring-blue-500 py-5.5",
                  errors ? "border-red-600" : "",
                )}
                id={id}
                {...register(name, registerOptions)}
                disabled={disabled}
                defaultValue={
                  defaultValue instanceof Date
                    ? defaultValue.toISOString().split("T")[0]
                    : typeof defaultValue === "boolean"
                      ? String(defaultValue)
                      : defaultValue
                }
              />
            )}
          </Field>
          {type === "password" && (
            <button
              type="button"
              className="absolute top-[50%] right-2 text-xs border-0 focus:outline-none font-semibold cursor-pointer text-gray-700 w-fit"
              onClick={toggleVisibility}
            >
              {isVisible ? <Eye /> : <EyeClosed />}
            </button>
          )}
        </FieldLegend>
      </FieldSet>
      {errors?.message && (
        <FieldError className="text-xs text-red-600">
          {String(errors?.message)}
        </FieldError>
      )}
    </div>
  );
}
