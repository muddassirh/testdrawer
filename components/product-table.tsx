'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onCreateNew: () => void;
  globalFilter: string;
}

// Animation variants
const tableContainerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.05,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  }),
  exit: {
    opacity: 0,
    x: 30,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    scale: 1.01,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    transition: {
      duration: 0.2,
    },
  },
};

const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.9,
  },
};

const buttonHoverVariants = {
  hover: {
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

export function ProductTable({
  data,
  onEdit,
  onDelete,
  onCreateNew,
  globalFilter,
}: ProductTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <motion.div
            className="font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {row.original.name}
          </motion.div>
          <motion.div
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {row.original.description}
          </motion.div>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {row.original.category}
        </motion.div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring' }}
          className="font-medium"
        >
          {row.original.price}
        </motion.div>
      ),
    },
    {
      accessorKey: 'sales',
      header: 'Sales',
      cell: ({ row }) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {row.original.sales.toLocaleString()}
        </motion.div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              status === 'active'
                ? 'bg-green-100 text-green-800'
                : status === 'inactive'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {status}
          </motion.span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <motion.div
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              className="h-8 w-8"
            >
              <motion.div variants={iconVariants} whileHover="hover">
                <Edit className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
          <motion.div
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row.original.id)}
              className="h-8 w-8 text-destructive"
            >
              <motion.div variants={iconVariants} whileHover="hover">
                <Trash2 className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (typeof value === 'string') {
        return value.toLowerCase().includes(filterValue.toLowerCase());
      }
      return false;
    },
  });

  if (data.length === 0) {
    return (
      <motion.div
        className="rounded-lg border bg-card"
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            className="mb-4 text-6xl opacity-30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
          >
            📦
          </motion.div>
          <motion.h3
            className="mb-2 text-xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            No products found
          </motion.h3>
          <motion.p
            className="mb-6 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {globalFilter
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first product'}
          </motion.p>
          {!globalFilter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={onCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Create Product
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-lg border bg-card overflow-hidden"
      variants={tableContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <motion.thead
            className="border-b bg-muted/50"
            variants={headerVariants}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <motion.th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </motion.th>
                ))}
              </tr>
            ))}
          </motion.thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  className="border-b transition-colors"
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  layout
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
