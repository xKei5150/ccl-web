"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { UsersRound, Edit, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteDemographic } from "@/app/(app)/dashboard/demographics/actions";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DemographicViewPage = ({ demographic }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteDemographic([demographic.id]);
      if (!response.success) {
        throw new Error(response.message);
      }
      
      toast({
        title: "Record deleted",
        description: "Demographic record was successfully deleted",
        variant: "success",
      });
      
      router.push("/dashboard/demographics");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete demographic record",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  // Calculate total of age groups
  const ageGroupsTotal = demographic.ageGroups?.reduce((sum, group) => sum + (Number(group.count) || 0), 0) || 0;
  
  // Calculate total of chronic diseases
  const diseasesTotal = demographic.chronicDiseases?.reduce((sum, disease) => sum + (Number(disease.count) || 0), 0) || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={`Demographic Data: ${demographic.year}`}
        subtitle="View demographic information"
        icon={<UsersRound className="h-8 w-8" />}
      />

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/demographics")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Demographics
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/demographics/${demographic.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Main details card */}
      <Card>
        <CardHeader>
          <CardTitle>Demographic Information for Year {demographic.year}</CardTitle>
          <CardDescription>Population data and statistics</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Population summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">Total Population</div>
                <div className="text-2xl font-bold">{demographic.totalPopulation || 0}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">Male</div>
                <div className="text-2xl font-bold">{demographic.maleCount || 0}</div>
                <div className="text-xs text-gray-500">
                  {demographic.totalPopulation 
                    ? `${((demographic.maleCount / demographic.totalPopulation) * 100).toFixed(1)}%` 
                    : '0%'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">Female</div>
                <div className="text-2xl font-bold">{demographic.femaleCount || 0}</div>
                <div className="text-xs text-gray-500">
                  {demographic.totalPopulation 
                    ? `${((demographic.femaleCount / demographic.totalPopulation) * 100).toFixed(1)}%` 
                    : '0%'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional counts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">Households</div>
                <div className="text-xl font-bold">{demographic.householdsCount || 'N/A'}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">Registered Voters</div>
                <div className="text-xl font-bold">{demographic.voterCount || 'N/A'}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">PWD Count</div>
                <div className="text-xl font-bold">{demographic.pwdCount || 'N/A'}</div>
              </CardContent>
            </Card>
          </div>

          {/* Age Groups */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Age Groups</h3>
            {demographic.ageGroups && demographic.ageGroups.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between mb-2 text-sm text-gray-500 font-medium px-2">
                  <div>Age Range</div>
                  <div>Count</div>
                </div>
                
                {demographic.ageGroups.map((group, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{group.ageRange}</div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{group.count}</span>
                          <span className="text-xs text-gray-500">
                            {demographic.totalPopulation 
                              ? `(${((group.count / demographic.totalPopulation) * 100).toFixed(1)}%)` 
                              : ''}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex justify-between mt-3 font-semibold px-2">
                  <div>Total</div>
                  <div className="flex items-center gap-2">
                    <span>{ageGroupsTotal}</span>
                    <span className="text-xs text-gray-500">
                      {demographic.totalPopulation 
                        ? `(${((ageGroupsTotal / demographic.totalPopulation) * 100).toFixed(1)}%)` 
                        : ''}
                    </span>
                  </div>
                </div>
                
                {ageGroupsTotal !== demographic.totalPopulation && (
                  <div className="text-amber-600 text-sm mt-1 px-2">
                    Note: Age groups total {ageGroupsTotal !== demographic.totalPopulation ? 
                      (ageGroupsTotal > demographic.totalPopulation ? 'exceeds' : 'is less than') : 'equals'} 
                    total population ({demographic.totalPopulation})
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 italic">No age group data available</div>
            )}
          </div>

          {/* Chronic Diseases */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Chronic Diseases</h3>
            {demographic.chronicDiseases && demographic.chronicDiseases.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between mb-2 text-sm text-gray-500 font-medium px-2">
                  <div>Disease</div>
                  <div>Count</div>
                </div>
                
                {demographic.chronicDiseases.map((disease, index) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{disease.diseaseName}</div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{disease.count}</span>
                          <span className="text-xs text-gray-500">
                            {demographic.totalPopulation 
                              ? `(${((disease.count / demographic.totalPopulation) * 100).toFixed(1)}%)` 
                              : ''}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex justify-between mt-3 font-semibold px-2">
                  <div>Total</div>
                  <div>{diseasesTotal}</div>
                </div>
                
                <div className="text-gray-500 text-sm mt-1 px-2">
                  Note: People may have multiple chronic diseases
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">No chronic disease data available</div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end border-t pt-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(demographic.updatedAt).toLocaleString()}
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the demographic record for year {demographic.year}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DemographicViewPage; 