"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getFinancingAuditHistory } from "@/app/(app)/dashboard/financing/actions";
import { Clock, ClipboardEdit, Trash2, FileCheck, BadgeAlert, Info } from "lucide-react";

const ActionIcons = {
  create: <ClipboardEdit className="h-4 w-4 mr-2" />,
  update: <ClipboardEdit className="h-4 w-4 mr-2" />,
  delete: <Trash2 className="h-4 w-4 mr-2" />,
  state_change: <FileCheck className="h-4 w-4 mr-2" />,
};

const ActionColors = {
  create: "bg-green-50 text-green-700 border-green-200",
  update: "bg-blue-50 text-blue-700 border-blue-200",
  delete: "bg-red-50 text-red-700 border-red-200",
  state_change: "bg-purple-50 text-purple-700 border-purple-200",
};

const StateColors = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function FinancingAuditHistory({ recordId }) {
  const [auditHistory, setAuditHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuditHistory() {
      if (!recordId) {
        console.log('No recordId provided, skipping audit history fetch');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching audit history for recordId:', recordId);
        const history = await getFinancingAuditHistory(recordId);
        console.log('Audit history fetched:', history?.length || 0, 'entries');
        setAuditHistory(history || []);
      } catch (error) {
        console.error("Error fetching audit history:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAuditHistory();
  }, [recordId]);

  function formatTimestamp(timestamp) {
    if (!timestamp) return "N/A";
    
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function formatActionType(action) {
    const actionLabels = {
      create: "Created",
      update: "Updated",
      delete: "Deleted",
      state_change: "Status Changed"
    };
    
    return actionLabels[action] || action;
  }

  function formatStateChange(entry) {
    if (entry.action !== 'state_change') return null;
    
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className={StateColors[entry.previousState] || ""}>
          {entry.previousState?.replace(/_/g, ' ') || 'None'}
        </Badge>
        <span>→</span>
        <Badge variant="outline" className={StateColors[entry.newState] || ""}>
          {entry.newState?.replace(/_/g, ' ') || 'None'}
        </Badge>
      </div>
    );
  }

  function formatChanges(entry) {
    if (!entry) return null;
    
    if (entry.action === 'state_change') {
      return formatStateChange(entry);
    }
    
    if (entry.action === 'create') {
      return <span className="text-sm text-muted-foreground">Record created</span>;
    }
    
    if (entry.action === 'delete') {
      return <span className="text-sm text-muted-foreground">Record deleted</span>;
    }
    
    if (!entry.changes || Object.keys(entry.changes).length === 0) {
      return <span className="text-sm text-muted-foreground">No detailed changes recorded</span>;
    }
    
    // For updates, show a summary of changes
    return (
      <div className="space-y-1">
        {Object.keys(entry.changes).map(field => {
          const change = entry.changes[field];
          if (!change) return null;
          
          // Handle complex fields like groups
          if (field === 'groups' && change.changed) {
            return (
              <div key={field} className="text-sm">
                <span className="font-medium">Groups:</span> Changed from {change.oldCount} to {change.newCount} groups
              </div>
            );
          }
          
          if (field === 'finalCalculations' && change.changed) {
            return (
              <div key={field} className="text-sm">
                <span className="font-medium">Calculations:</span> Changed from {change.oldCount} to {change.newCount} calculations
              </div>
            );
          }
          
          // Handle simple field changes
          const oldValue = change.old !== undefined ? change.old : 'empty';
          const newValue = change.new !== undefined ? change.new : 'empty';
          
          return (
            <div key={field} className="text-sm">
              <span className="font-medium">{field}:</span> Changed from &ldquo;{oldValue}&rdquo; to &ldquo;{newValue}&rdquo;
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Audit History
        </CardTitle>
        <CardDescription>Complete record of all changes made to this financing record</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Skeleton loader while fetching data
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : auditHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Info className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No audit history available</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This could be because the record is new or audit logging was recently enabled.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Changes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="align-top whitespace-nowrap">
                    {formatTimestamp(entry?.timestamp)}
                  </TableCell>
                  <TableCell className="align-top">
                    {entry?.user?.email || entry?.user || 'System'}
                  </TableCell>
                  <TableCell className="align-top whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ActionColors[entry?.action] || ""}`}>
                      {ActionIcons[entry?.action] || <BadgeAlert className="h-4 w-4 mr-2" />}
                      {formatActionType(entry?.action)}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    {formatChanges(entry)}
                    
                    {entry?.notes && (
                      <>
                        <Separator className="my-2" />
                        <div className="text-sm text-muted-foreground italic">
                          Note: {entry.notes}
                        </div>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 