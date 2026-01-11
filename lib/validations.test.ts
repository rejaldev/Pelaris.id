import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  checkoutSchema,
  cabangSchema,
  categorySchema,
  requestProductSchema,
  validateForm,
} from './validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should pass with valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Format email tidak valid');
      }
    });

    it('should fail with empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should fail with short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Password minimal 6 karakter');
      }
    });
  });

  describe('registerSchema', () => {
    it('should pass with valid data', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'KASIR',
      });
      expect(result.success).toBe(true);
    });

    it('should fail when passwords do not match', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'different',
        role: 'KASIR',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Password tidak cocok');
      }
    });

    it('should fail with invalid role', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'INVALID',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('checkoutSchema', () => {
    it('should pass with CASH payment and cashReceived', () => {
      const result = checkoutSchema.safeParse({
        paymentMethod: 'CASH',
        cashReceived: 50000,
      });
      expect(result.success).toBe(true);
    });

    it('should fail with CASH payment without cashReceived', () => {
      const result = checkoutSchema.safeParse({
        paymentMethod: 'CASH',
      });
      expect(result.success).toBe(false);
    });

    it('should pass with QRIS payment without cashReceived', () => {
      const result = checkoutSchema.safeParse({
        paymentMethod: 'QRIS',
      });
      expect(result.success).toBe(true);
    });

    it('should pass with valid customer phone', () => {
      const result = checkoutSchema.safeParse({
        paymentMethod: 'QRIS',
        customerPhone: '081234567890',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with invalid customer phone', () => {
      const result = checkoutSchema.safeParse({
        paymentMethod: 'QRIS',
        customerPhone: '12345',
      });
      expect(result.success).toBe(false);
    });

    it('should pass with discount', () => {
      const result = checkoutSchema.safeParse({
        paymentMethod: 'TRANSFER',
        discount: 10,
        discountType: 'PERCENTAGE',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('cabangSchema', () => {
    it('should pass with valid data', () => {
      const result = cabangSchema.safeParse({
        name: 'Cabang Jakarta',
        address: 'Jl. Test No. 123',
        phone: '021123456789',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with empty name', () => {
      const result = cabangSchema.safeParse({
        name: '',
      });
      expect(result.success).toBe(false);
    });

    it('should fail with invalid phone format', () => {
      const result = cabangSchema.safeParse({
        name: 'Cabang Test',
        phone: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('categorySchema', () => {
    it('should pass with valid name', () => {
      const result = categorySchema.safeParse({
        name: 'Electronics',
      });
      expect(result.success).toBe(true);
    });

    it('should fail with short name', () => {
      const result = categorySchema.safeParse({
        name: 'A',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('requestProductSchema', () => {
    it('should pass with valid data', () => {
      const result = requestProductSchema.safeParse({
        name: 'New Product',
        categoryId: 'cat-123',
        productType: 'SINGLE',
      });
      expect(result.success).toBe(true);
    });

    it('should fail without categoryId', () => {
      const result = requestProductSchema.safeParse({
        name: 'New Product',
        categoryId: '',
        productType: 'SINGLE',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('validateForm helper', () => {
    it('should return success with valid data', () => {
      const result = validateForm(loginSchema, {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should return errors object with invalid data', () => {
      const result = validateForm(loginSchema, {
        email: 'invalid',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.email).toBe('Format email tidak valid');
        expect(result.errors.password).toBe('Password minimal 6 karakter');
      }
    });
  });
});
