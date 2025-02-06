"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Edit2, Trash, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


export function DataTable({
  data,
  columns,
  pageSize = 10,
  onRowClick,
  actions,
  enableMultiSelect = false,
  onSelectionChange,
  baseUrl,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRows, setSelectedRows] = React.useState([]);

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    } else if (baseUrl && row.id) {
      router.push(`${baseUrl}/${row.id}`);
    }
  };

  const handleCheckboxChange = (checked, row) => {
    const updatedSelection = checked
      ? [...selectedRows, row]
      : selectedRows.filter((r) => r !== row);
    setSelectedRows(updatedSelection);
    onSelectionChange?.(updatedSelection);
  };

  const handleSelectAll = (checked) => {
    const newSelection = checked ? paginatedData : [];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search all columns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {enableMultiSelect && selectedRows.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => onSelectionChange?.(selectedRows)}
            className="ml-2"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Selected ({selectedRows.length})
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableMultiSelect && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.length === paginatedData.length}
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={String(column.header || column.accessorKey)}>
                  {column.header || column.accessorKey}
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={onRowClick || baseUrl ? "cursor-pointer" : ""}
                onClick={() => handleRowClick(row)}
              >
                {enableMultiSelect && (
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    className="w-[50px]"
                  >
                    <Checkbox
                      checked={selectedRows.includes(row)}
                      onCheckedChange={(checked) => handleCheckboxChange(checked, row)}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={String(column.header || column.accessorKey)}>
                    {column.cell ? (
                      column.cell(row)
                    ) : column.accessorKey ? (
                      String(row[column.accessorKey])
                    ) : null}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant="ghost"
                          size="sm"
                          onClick={() => action.onClick(row)}
                        >
                          {action.icon}
                          <span className="sr-only">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}