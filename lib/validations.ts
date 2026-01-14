import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required').regex(/^\$?\d+\.?\d{0,2}$/, 'Invalid price format'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['active', 'inactive', 'pending'], {
    errorMap: () => ({ message: 'Status must be active, inactive, or pending' })
  })
});

export type ProductFormData = z.infer<typeof productSchema>;
