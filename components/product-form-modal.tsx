'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validations';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  editProduct?: Product | null;
  buttonPosition?: { x: number; y: number };
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  editProduct,
  buttonPosition = { x: 0, y: 0 },
}: ProductFormModalProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: editProduct || {
      name: '',
      description: '',
      price: '',
      category: '',
      status: 'active',
    },
  });

  React.useEffect(() => {
    if (editProduct) {
      reset(editProduct);
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        category: '',
        status: 'active',
      });
    }
  }, [editProduct, reset]);

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const statusValue = watch('status');

  const formContent = (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label htmlFor="price">Price</Label>
        <Input id="price" placeholder="$0.00" {...register('price')} />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          placeholder="e.g., Electronics, Furniture"
          {...register('category')}
        />
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="status">Status</Label>
        <Select
          value={statusValue}
          onValueChange={(value) =>
            setValue('status', value as 'active' | 'inactive' | 'pending')
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        )}
      </motion.div>

      <motion.div
        className="flex gap-2 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          {editProduct ? 'Update Product' : 'Create Product'}
        </Button>
      </motion.div>
    </form>
  );

  // Mobile: Use drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DrawerContent open={isOpen}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <DrawerHeader>
                <DrawerTitle>
                  {editProduct ? 'Edit Product' : 'Create New Product'}
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">{formContent}</div>
            </motion.div>
          </DrawerContent>
        </motion.div>
      </Drawer>
    );
  }

  // Desktop: Modal with button-origin animation
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
      />

      {/* Modal content originating from button */}
      <motion.div
        className="fixed z-50 w-full max-w-2xl"
        initial={{
          left: buttonPosition.x,
          top: buttonPosition.y,
          scale: 0,
          opacity: 0,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          left: '50%',
          top: '50%',
          scale: 1,
          opacity: 1,
          x: '-50%',
          y: '-50%',
        }}
        exit={{
          left: buttonPosition.x,
          top: buttonPosition.y,
          scale: 0,
          opacity: 0,
          x: '-50%',
          y: '-50%',
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
          mass: 0.8,
        }}
        style={{
          transformOrigin: 'center center',
        }}
      >
        <div className="rounded-lg border bg-background p-0 shadow-2xl">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">
              {editProduct ? 'Edit Product' : 'Create New Product'}
            </h2>
          </div>
          <div className="px-6 py-6">{formContent}</div>
        </div>
      </motion.div>
    </>
  );
}