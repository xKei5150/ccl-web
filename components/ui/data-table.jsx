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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  onSort,
  onFilter,
  initialSort,
  initialFilters = {},
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [sortConfig, setSortConfig] = React.useState(initialSort || { key: null, direction: null });
  const [filters, setFilters] = React.useState(initialFilters || {});
  const [activeFiltersCount, setActiveFiltersCount] = React.useState(0);

  // Update active filters count when filters change
  React.useEffect(() => {
    setActiveFiltersCount(Object.keys(filters).filter(key => filters[key] !== undefined && filters[key] !== "").length);
  }, [filters]);

  // Handle sorting change
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        key = null;
        direction = null;
      }
    }
    
    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    
    if (onSort) {
      onSort(newSortConfig);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (!value && value !== 0) {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    if (onFilter) {
      onFilter({});
    }
  };

  // Filter data based on search query and column filters (if onFilter is not provided)
  const filteredData = React.useMemo(() => {
    // If external filtering is handled by the parent (via onFilter), just use the docs
    if (onFilter) return docs;

    let filtered = docs;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        columns.some((column) => {
          const value = getNestedValue(item, column.accessorKey);
          return formatCellValue(value)
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value || value === 0) {
        filtered = filtered.filter((item) => {
          const cellValue = getNestedValue(item, key);
          const formattedCellValue = formatCellValue(cellValue).toLowerCase();
          return formattedCellValue.includes(String(value).toLowerCase());
        });
      }
    });

    return filtered;
  }, [docs, searchQuery, columns, filters, onFilter]);

  // Sort data (if onSort is not provided)
  const sortedData = React.useMemo(() => {
    // If external sorting is handled by the parent (via onSort), just use the filtered data
    if (onSort) return filteredData;

    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, onSort]);

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
    const newSelection = checked ? sortedData : [];
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

  const renderSortIndicator = (column) => {
    if (!column.enableSorting) return null;
    
    if (sortConfig.key === column.accessorKey) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="ml-1 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4" />
      );
    }
    
    return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search all columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          {activeFiltersCount > 0 && (
            <div className="flex items-center">
              <Badge variant="outline" className="flex gap-1 items-center">
                <Filter className="h-3 w-3" />
                {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={clearAllFilters}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableMultiSelect && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.length === sortedData.length}
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={String(column.header || column.accessorKey)}
                >
                  <div className="flex items-center">
                    {column.enableSorting ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent flex items-center"
                        onClick={() => handleSort(column.accessorKey)}
                      >
                        {column.header || column.accessorKey}
                        {renderSortIndicator(column)}
                      </Button>
                    ) : (
                      <span>{column.header || column.accessorKey}</span>
                    )}
                    
                    {column.enableFiltering && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-7 w-7 p-0"
                          >
                            <Filter 
                              className={`h-3 w-3 ${filters[column.accessorKey] ? 'text-primary' : 'opacity-50'}`} 
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-3" align="start">
                          <div className="space-y-2">
                            <h4 className="font-medium">Filter {column.header || column.accessorKey}</h4>
                            <Input
                              placeholder="Filter value..."
                              value={filters[column.accessorKey] || ""}
                              onChange={(e) => handleFilterChange(column.accessorKey, e.target.value)}
                              className="w-full"
                            />
                            <div className="flex justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilterChange(column.accessorKey, "")}
                              >
                                Clear
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => document.body.click()} // Close the popover
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + 
                    (enableMultiSelect ? 1 : 0) + 
                    (actions ? 1 : 0)
                  }
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, rowIndex) => (
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
                        {actions.map((action, actionIndex) => {
                          // Check showCondition if it exists
                          const shouldShow = action.showCondition 
                            ? action.showCondition(row) 
                            : true;
                          
                          if (!shouldShow) return null;
                          
                          // If action has a custom component, render it
                          if (action.component) {
                            return (
                              <div key={actionIndex}>
                                {action.component(row)}
                              </div>
                            );
                          }
                          
                          // Otherwise render the default button
                          return (
                            <Button
                              key={actionIndex}
                              variant="ghost"
                              size="sm"
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon}
                              <span className="sr-only">{action.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
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
