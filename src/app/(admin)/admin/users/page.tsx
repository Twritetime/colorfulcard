"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserList } from "./_components/user-list";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
      </div>
      <div className="flex items-center gap-4">
        <Input
          placeholder="搜索用户..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <UserList />
    </div>
  );
} 