import { Heading } from '@/components/ui/heading';
import { Card, CardContent } from '@/components/ui/card';
import { ExampleForm } from './example-form';
import { createDocument } from '@/lib/data-fetching';

export const metadata = {
  title: 'New Example | CCL',
  description: 'Create a new example record',
};

/**
 * Server action to create a new business record
 */
async function createBusiness(formData) {
  'use server';
  
  const data = Object.fromEntries(formData.entries());
  
  // Convert string date to Date object
  if (data.registrationDate) {
    data.registrationDate = new Date(data.registrationDate);
  }
  
  return createDocument('business', data, '/dashboard/example');
}

/**
 * Create new example page
 */
export default function NewExamplePage() {
  return (
    <div className="space-y-6">
      <Heading
        title="Create New Business"
        description="Add a new business record to the system"
      />
      
      <Card>
        <CardContent className="pt-6">
          <ExampleForm action={createBusiness} />
        </CardContent>
      </Card>
    </div>
  );
} 