import React, { useEffect } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { SupportingDocumentField } from './SupportingDocumentField';
import { Plus } from 'lucide-react';

const DynamicSupportingDocument = ({ control }) => {
  const { fields: documentsFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control,
    name: "supportingDocuments",
  });

  // Watch supporting documents to handle format conversions
  const supportingDocuments = useWatch({
    control,
    name: "supportingDocuments",
    defaultValue: [],
  });

  // Add a document field with proper initial values
  const handleAddDocument = () => {
    appendDocument({ file: null, notes: '' });
  };

  return (
    <div className="space-y-4">
      {documentsFields.map((field, index) => (
        <SupportingDocumentField
          key={field.id}
          control={control}
          index={index}
          onRemove={() => removeDocument(index)}
        />
      ))}
      <Button
        type="button"
        onClick={handleAddDocument}
        className="mt-4 flex items-center gap-2"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        Add Supporting Document
      </Button>
    </div>
  );
};

export default DynamicSupportingDocument;