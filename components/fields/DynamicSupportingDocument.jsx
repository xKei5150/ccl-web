import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { SupportingDocumentField } from './SupportingDocumentField';

const DynamicSupportingDocument = ({ control }) => {
  const { fields: documentsFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control,
    name: "supportingDocuments",
  });
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
        onClick={() => appendDocument({ file: null, notes: '' })}
        className="mt-4"
      >
        Add Supporting Document
      </Button>
    </div>
  );
};

export default DynamicSupportingDocument;