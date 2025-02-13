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

const getNestedValue = (obj, path) => {
  if (!obj || !path) return '';
  
  const value = path.split('.').reduce((curr, key) => curr?.[key], obj);
  return value ?? '';
};

const formatCellValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export function DataTable({
  data: {
    docs,
    totalPages,
    page,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  },
  columns,
  onPageChange,
  onRowClick,
  actions,
  enableMultiSelect = false,
  onSelectionChange,
  baseUrl,
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState([]);

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return docs;

    return docs.filter((item) =>
      columns.some((column) => {
        const value = getNestedValue(item, column.accessorKey);
        return formatCellValue(value)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
    );
  }, [docs, searchQuery, columns]);

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    } else if (baseUrl && row.id) {
      window.location.href = `${baseUrl}/${row.id}`;
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
    const newSelection = checked ? filteredData : [];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const renderCell = (row, column) => {
    if (column.cell) {
      return column.cell(row);
    }

    if (column.accessorKey) {
      const value = getNestedValue(row, column.accessorKey);
      return formatCellValue(value);
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <Input
          placeholder="Search all columns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableMultiSelect && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.length === filteredData.length}
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
            {filteredData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={onRowClick || baseUrl ? "cursor-pointer hover:bg-muted/50" : ""}
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
                    {renderCell(row, column)}
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
                onClick={() => onPageChange?.(prevPage)}
                className={!hasPrevPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => onPageChange?.(pageNum)}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange?.(nextPage)}
                className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
