// @/components/layout/DataPageLayout.jsx
"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Trash, Plus, Edit2, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useQueryParams } from "@/hooks/use-query-parans";
import { ConfirmationDialog } from "@/components/layout/ConfirmationDialog";
import { useState } from "react";

const DataPageLayout = ({
  title,
  subtitle,
  icon: Icon,
  columns,
  data = [],
  baseUrl,
  newItemUrl,
  deleteAction,
  newButtonLabel = "New",
  customActions = [],
  emptyMessage,
  exportComponent: ExportComponent,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { setQueryParams } = useQueryParams();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, rows: [] });
  const [selectedRows, setSelectedRows] = useState([]);

  const handleDelete = (rows) => {
    setDeleteDialog({ isOpen: true, rows });
  };

  const confirmDelete = () => {
    const rows = deleteDialog.rows;
    toast({
      title: "Deleting records",
      description: `Deleting ${rows.length} record(s)`,
      variant: "destructive",
    });
    deleteAction(rows.map((row) => row.id));
    setDeleteDialog({ isOpen: false, rows: [] });
  };

  const handlePageChange = (page) => {
    setQueryParams({ page });
  };

  const handleSelectionChange = (rows) => {
    setSelectedRows(rows);
  };

  // Default actions that will be available for all tables
  const defaultActions = [
    {
      label: "Edit",
      icon: <Edit2 className="h-4 w-4" />,
      onClick: (row) => router.push(`${baseUrl}/${row.id}/edit`),
    },
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      onClick: (row) => handleDelete([row]),
    },
  ];

  // Combine default actions with any custom actions
  const actions = [...defaultActions, ...customActions];

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No {title.toLowerCase()} yet
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {emptyMessage || `Get started by creating a new ${title.toLowerCase()}.`}
      </p>
      <Button onClick={() => router.push(newItemUrl)}>
        <Plus className="mr-2 h-4 w-4" /> {newButtonLabel}
      </Button>
    </div>
  );

  return (
    <>
      <div className="flex justify-between">
        <PageHeader title={title} subtitle={subtitle} icon={Icon && <Icon />} />
        <div className="flex space-x-2 mb-8">
          {ExportComponent && <ExportComponent />}
          <Button onClick={() => router.push(newItemUrl)}>
            <Plus className="mr-2 h-4 w-4" /> {newButtonLabel}
          </Button>
        </div>
      </div>
      <main className="max-w-6xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {data.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <DataTable
                  data={data}
                  columns={columns}
                  actions={actions}
                  enableMultiSelect
                  onSelectionChange={handleSelectionChange}
                  onPageChange={handlePageChange}
                  baseUrl={baseUrl}
                />
                <div className="flex space-x-2 mt-4">
                  {selectedRows.length > 0 && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedRows)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Selected ({selectedRows.length})
                    </Button>
                  )}
                  {ExportComponent && data.length > 0 && (
                    <div className="ml-auto">
                      <ExportComponent />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, rows: [] })}
        onConfirm={confirmDelete}
        title={`Delete ${title}`}
        description={`Are you sure you want to delete ${
          deleteDialog.rows.length
        } ${title.toLowerCase()}${
          deleteDialog.rows.length > 1 ? "es" : ""
        }? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default DataPageLayout;