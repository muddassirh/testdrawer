"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  TrendingUp,
  Home as HomeIcon,
  BarChart3,
  DollarSign,
  Box,
  Grid3x3,
  Truck,
  Tag,
  Users,
  UserCheck,
  FileText,
  Settings,
} from "lucide-react";
import { ProductTable } from "@/components/product-table";
import { ProductFormModal } from "@/components/product-form-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialProducts } from "@/lib/mockData";
import { Product, ProductFormData } from "@/types";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const searchBarVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Simulated API functions
const fetchProducts = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const stored = localStorage.getItem("products");
  return stored ? JSON.parse(stored) : initialProducts;
};

const createProduct = async (data: ProductFormData): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const products = await fetchProducts();
  const newProduct: Product = {
    id: Math.max(...products.map((p) => p.id), 0) + 1,
    ...data,
    sales: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  const updated = [newProduct, ...products];
  localStorage.setItem("products", JSON.stringify(updated));
  return newProduct;
};

const updateProduct = async ({
  id,
  data,
}: {
  id: number;
  data: ProductFormData;
}): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const products = await fetchProducts();
  const updated = products.map((p) => (p.id === id ? { ...p, ...data } : p));
  localStorage.setItem("products", JSON.stringify(updated));
  return updated.find((p) => p.id === id)!;
};

const deleteProduct = async (id: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const products = await fetchProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(filtered));
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [buttonPosition, setButtonPosition] = React.useState({ x: 0, y: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(
    null
  );

  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      setEditProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const stats = React.useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      totalSales: products.reduce((sum, p) => sum + p.sales, 0),
      revenue: products.reduce(
        (sum, p) => sum + parseFloat(p.price.replace(/[$,]/g, "")),
        0
      ),
    }),
    [products]
  );

  const handleCreateProduct = (formData: ProductFormData) => {
    createMutation.mutate(formData);
  };

  const handleEditProduct = (formData: ProductFormData) => {
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data: formData });
    }
  };

  const handleDeleteProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    setProductToDelete(product || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduct(null);
  };

  const openCreateModal = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setEditProduct(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 p-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
            SP
          </div>
          <div>
            <div className="text-sm font-semibold">Organization</div>
          </div>
        </div>

        <nav className="space-y-1">
          <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
            AP
          </div>

          <a
            href="#"
            className="flex items-center gap-3 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <DollarSign className="h-4 w-4" />
            Sales
          </a>

          <div className="mb-2 mt-6 px-2 text-xs font-semibold text-muted-foreground">
            Catalog
          </div>

          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Box className="h-4 w-4" />
            Products
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Grid3x3 className="h-4 w-4" />
            Categories
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Truck className="h-4 w-4" />
            Suppliers
          </a>

          <div className="mb-2 mt-6 px-2 text-xs font-semibold text-muted-foreground">
            Marketing
          </div>

          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Tag className="h-4 w-4" />
            Promotions
          </a>

          <div className="mb-2 mt-6 px-2 text-xs font-semibold text-muted-foreground">
            People
          </div>

          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Users className="h-4 w-4" />
            Customers
          </a>
          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <UserCheck className="h-4 w-4" />
            Prescribers
          </a>

          <div className="mb-2 mt-6 px-2 text-xs font-semibold text-muted-foreground">
            Insights
          </div>

          <a
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <FileText className="h-4 w-4" />
            Reports
          </a>
        </nav>

        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold">
            S
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl py-8">
          {/* Page Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.1,
            }}
          >
            <motion.h1
              className="text-3xl font-bold tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Home
            </motion.h1>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                label: "Total Products",
                value: stats.total,
                change: "+12% from last month",
              },
              {
                label: "Active Products",
                value: stats.active,
                change: "+8% from last month",
              },
              {
                label: "Total Sales",
                value: stats.totalSales.toLocaleString(),
                change: "+23% from last month",
              },
              {
                label: "Total Value",
                value: `$${stats.revenue.toLocaleString()}`,
                change: "+18% from last month",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statCardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card className="cursor-default overflow-hidden">
                  <CardContent className="p-6">
                    <motion.div
                      className="text-sm font-medium text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {stat.label}
                    </motion.div>
                    <motion.div
                      className="mt-2 text-3xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.4 + index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <motion.div
                      className="mt-2 flex items-center gap-1 text-sm text-green-600"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <motion.div
                        animate={{
                          y: [0, -3, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </motion.div>
                      {stat.change}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions Bar */}
          <motion.div
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="relative flex-1 sm:max-w-md"
              variants={searchBarVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 0.5,
                  delay: 1,
                }}
              >
                <Search className="h-4 w-4" />
              </motion.div>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 transition-all focus:shadow-md"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.9,
              }}
            >
              <Button
                ref={buttonRef}
                onClick={openCreateModal}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Product
              </Button>
            </motion.div>
          </motion.div>

          {/* Product Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 1,
            }}
          >
            <ProductTable
              data={filteredProducts}
              onEdit={openEditModal}
              onDelete={handleDeleteProduct}
              onCreateNew={openCreateModal}
              globalFilter={searchQuery}
            />
          </motion.div>
        </div>
      </main>

      {/* Product Form Modal with Button Origin Animation */}
      <AnimatePresence mode="wait">
        {isModalOpen && (
          <ProductFormModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={editProduct ? handleEditProduct : handleCreateProduct}
            editProduct={editProduct}
            buttonPosition={buttonPosition}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {deleteDialogOpen && (
          <DeleteConfirmationDialog
            isOpen={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setProductToDelete(null);
            }}
            onConfirm={confirmDelete}
            productName={productToDelete?.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
