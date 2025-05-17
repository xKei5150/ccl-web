import React, { useEffect } from "react";
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
import { useWatch } from "react-hook-form";

export const SupportingDocumentField = ({ control, index, onRemove }) => {
  // Watch the current document to determine if it's an existing document
  const currentDocument = useWatch({
    control,
    name: `supportingDocuments.${index}`,
    defaultValue: null,
  });

  // Determine if this is an existing document from the database
  const isExistingDocument = currentDocument && (
    // Document is just an ID string
    typeof currentDocument === 'string' ||
    // Document has an ID
    (typeof currentDocument === 'object' && currentDocument.id) ||
    // Array of documents with ID in first item
    (Array.isArray(currentDocument) && 
     typeof currentDocument[0] === 'object' && 
     currentDocument[0].id)
  );

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <FormLabel className="text-lg font-semibold">
            Supporting Document {index + 1}
            {isExistingDocument && <span className="ml-2 text-xs text-muted-foreground">(Existing)</span>}
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
                      onFileSelect={(file) => {
                        // Handle the file upload
                        field.onChange(file);
                        
                        // Also update the notes field if needed
                        if (!control._formValues.supportingDocuments[index]?.notes) {
                          control._formValues.supportingDocuments[index] = {
                            ...control._formValues.supportingDocuments[index],
                            notes: '',
                          };
                        }
                      }}
                      value={
                        // Handle three cases:
                        // 1. Document is a string ID
                        typeof control._formValues.supportingDocuments[index] === 'string' 
                          ? control._formValues.supportingDocuments[index]
                        // 2. Document has an ID property (existing document)
                        : control._formValues.supportingDocuments[index]?.id
                          ? control._formValues.supportingDocuments[index]
                        // 3. Document is a new file
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
                    value={field.value || ""}
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
