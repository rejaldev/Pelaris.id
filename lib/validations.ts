import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(6, 'Password minimal 6 karakter'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
// Alias for backward compatibility
export type LoginInput = LoginFormData;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama wajib diisi')
    .min(2, 'Nama minimal 2 karakter'),
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(6, 'Password minimal 6 karakter'),
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password wajib diisi'),
  role: z.enum(['OWNER', 'MANAGER', 'KASIR'], {
    message: 'Pilih role yang valid',
  }),
  cabangId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================
// PRODUCT SCHEMAS
// ============================================

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama produk wajib diisi')
    .min(2, 'Nama produk minimal 2 karakter'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  productType: z.enum(['SINGLE', 'VARIANT']),
  isActive: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const variantSchema = z.object({
  sku: z
    .string()
    .min(1, 'SKU wajib diisi')
    .regex(/^[A-Za-z0-9-_]+$/, 'SKU hanya boleh huruf, angka, dash, underscore'),
  variantName: z.string().min(1, 'Nama varian wajib diisi'),
  variantValue: z.string().min(1, 'Nilai varian wajib diisi'),
  price: z
    .number()
    .min(0, 'Harga tidak boleh negatif'),
  stock: z
    .number()
    .int('Stok harus bilangan bulat')
    .min(0, 'Stok tidak boleh negatif'),
});

export type VariantFormData = z.infer<typeof variantSchema>;

// ============================================
// TRANSACTION SCHEMAS
// ============================================

export const checkoutSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+62|62|0)8[1-9][0-9]{7,10}$/.test(val),
      'Format nomor HP tidak valid'
    ),
  paymentMethod: z.enum(['CASH', 'DEBIT', 'TRANSFER', 'QRIS']),
  cashReceived: z
    .number()
    .min(0, 'Jumlah uang tidak boleh negatif')
    .optional(),
  discount: z
    .number()
    .min(0, 'Diskon tidak boleh negatif')
    .default(0),
  discountType: z.enum(['NOMINAL', 'PERCENTAGE']).default('NOMINAL'),
  bankName: z.string().optional(),
  referenceNo: z.string().optional(),
}).refine(
  (data) => {
    // If CASH, cashReceived is required
    if (data.paymentMethod === 'CASH') {
      return data.cashReceived !== undefined && data.cashReceived > 0;
    }
    return true;
  },
  {
    message: 'Masukkan jumlah uang yang diterima',
    path: ['cashReceived'],
  }
).refine(
  (data) => {
    // If TRANSFER/DEBIT, bankName might be needed
    if (data.paymentMethod === 'TRANSFER' || data.paymentMethod === 'DEBIT') {
      return true; // Optional for now
    }
    return true;
  },
  {
    message: 'Nama bank wajib diisi',
    path: ['bankName'],
  }
);

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ============================================
// CABANG SCHEMAS
// ============================================

export const cabangSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama cabang wajib diisi')
    .min(2, 'Nama cabang minimal 2 karakter'),
  address: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+62|62|0)[0-9]{9,13}$/.test(val),
      'Format nomor telepon tidak valid'
    ),
  isActive: z.boolean().default(true),
});

export type CabangFormData = z.infer<typeof cabangSchema>;

// ============================================
// SETTINGS SCHEMAS
// ============================================

export const printerSettingsSchema = z.object({
  autoPrintEnabled: z.boolean().default(true),
  printerName: z.string().optional(),
  paperWidth: z.enum(['58', '80']).default('58'),
  storeName: z.string().min(1, 'Nama toko wajib diisi'),
  branchName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  footerText1: z.string().optional(),
  footerText2: z.string().optional(),
});

export type PrinterSettingsFormData = z.infer<typeof printerSettingsSchema>;

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nama kategori wajib diisi')
    .min(2, 'Nama kategori minimal 2 karakter'),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ============================================
// REQUEST PRODUCT SCHEMAS
// ============================================

export const requestProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama produk wajib diisi')
    .min(2, 'Nama produk minimal 2 karakter'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  productType: z.enum(['SINGLE', 'VARIANT']),
});

export type RequestProductFormData = z.infer<typeof requestProductSchema>;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate data with a schema and return errors in a simple format
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((err) => {
    const path = err.path.join('.') || 'root';
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return { success: false, errors };
}

/**
 * Get first error message from Zod error
 */
export function getFirstError(error: z.ZodError): string {
  return error.issues[0]?.message || 'Validation error';
}
