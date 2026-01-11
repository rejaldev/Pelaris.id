'use client';

import { useForm, UseFormReturn, FieldValues, Path, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodError } from 'zod';
import { useState, useCallback } from 'react';

interface UseZodFormOptions<T extends FieldValues> {
  schema: z.ZodSchema;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (error: Error) => void;
}

interface UseZodFormReturn<T extends FieldValues> extends UseFormReturn<T> {
  isSubmitting: boolean;
  submitError: string | null;
  setSubmitError: (error: string | null) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  getFieldError: (name: Path<T>) => string | undefined;
  hasFieldError: (name: Path<T>) => boolean;
}

export function useZodForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onError,
}: UseZodFormOptions<T>): UseZodFormReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cast schema to any to support both Zod v3 and v4
  const form = useForm<T>({
    resolver: zodResolver(schema as any) as any,
    defaultValues,
  });

  const handleFormSubmit = useCallback(
    async (data: T) => {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        await onSubmit(data);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Terjadi kesalahan';
        setSubmitError(errorMessage);
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, onError]
  );

  const getFieldError = useCallback(
    (name: Path<T>): string | undefined => {
      const error = form.formState.errors[name];
      return error?.message as string | undefined;
    },
    [form.formState.errors]
  );

  const hasFieldError = useCallback(
    (name: Path<T>): boolean => {
      return !!form.formState.errors[name];
    },
    [form.formState.errors]
  );

  return {
    ...form,
    isSubmitting,
    submitError,
    setSubmitError,
    onSubmit: form.handleSubmit(handleFormSubmit),
    getFieldError,
    hasFieldError,
  };
}

// Validation helper for inline validation
export function validateWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _form: 'Validation failed' } };
  }
}

// Async validation helper
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: Record<string, string> }> {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _form: 'Validation failed' } };
  }
}

export default useZodForm;
