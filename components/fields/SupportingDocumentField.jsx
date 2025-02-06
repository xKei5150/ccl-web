import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { FilePreview } from "@/components/ui/file-preview";
import DocumentPreview from "@/components/layout/DocumentPreview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export const SupportingDocumentField = ({ control, index, onRemove }) => {
  const getDocumentData = (fieldValue) => {
    if (fieldValue instanceof File) {
      return null; // For FilePreview, we handle it separately
    }
    // If it's not a File object, we *assume* it's the full document
    // from the database.  This handles the initial load and after-submission states.
    return fieldValue;
  };
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <FormLabel className="text-lg font-semibold">
            Supporting Document {index + 1}
          </FormLabel>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Remove document</span>
          </Button>
        </div>
        <div className="grid sm:grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name={`supportingDocuments.${index}.file`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <FileUpload
                      onFileSelect={(file) => field.onChange(file)}
                      value={
                        control._formValues.supportingDocuments[index]?.id
                          ? control._formValues.supportingDocuments[index]
                          : field.value
                      }
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
                        "application/pdf": [".pdf"],
                        "video/*": [".mp4", ".webm"],
                      }}
                      onRemove={() => field.onChange(null)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`supportingDocuments.${index}.notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional notes about this document..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
