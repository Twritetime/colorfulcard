"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryList } from "./_components/category-list";
import { CategoryForm } from "./_components/category-form";

export default function CategoriesPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加分类
        </Button>
      </div>
      <CategoryList onEdit={() => setIsOpen(true)} />
      <CategoryForm open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
} 