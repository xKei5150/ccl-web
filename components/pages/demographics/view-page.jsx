"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { 
  UsersRound, 
  Edit, 
  ArrowLeft, 
  Trash2, 
  Users, 
  Mars, 
  Venus, 
  HomeIcon, 
  VoteIcon, 
  Accessibility, 
  PieChart, 
  Activity, 
  Calendar 
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title={`Demographics: ${demographic.year}`}
        subtitle="View demographic information"
        icon={<UsersRound className="h-8 w-8" />}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard/demographics")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push(`/dashboard/demographics/${demographic.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit Record
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </PageHeader>
      
      <main className="max-w-6xl mx-auto space-y-6">
        {/* Main details card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Demographic Information for Year {demographic.year}</CardTitle>
            </div>
            <CardDescription>Population data and statistics</CardDescription>
            <Separator className="mt-2" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Population summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Population Summary</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Total Population
                      </div>
                      <div className="text-2xl font-bold">{demographic.totalPopulation || 0}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mars className="h-4 w-4" />
                        Male
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-2xl font-bold">{demographic.maleCount || 0}</div>
                        <div className="text-xs text-muted-foreground">
                          {demographic.totalPopulation 
                            ? `${((demographic.maleCount / demographic.totalPopulation) * 100).toFixed(1)}%` 
                            : '0%'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Venus className="h-4 w-4" />
                        Female
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-2xl font-bold">{demographic.femaleCount || 0}</div>
                        <div className="text-xs text-muted-foreground">
                          {demographic.totalPopulation 
                            ? `${((demographic.femaleCount / demographic.totalPopulation) * 100).toFixed(1)}%` 
                            : '0%'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional counts */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Additional Statistics</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <HomeIcon className="h-4 w-4" />
                        Households
                      </div>
                      <div className="text-xl font-bold">{demographic.householdsCount || 'N/A'}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <VoteIcon className="h-4 w-4" />
                        Registered Voters
                      </div>
                      <div className="text-xl font-bold">{demographic.voterCount || 'N/A'}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Accessibility className="h-4 w-4" />
                        PWD Count
                      </div>
                      <div className="text-xl font-bold">{demographic.pwdCount || 'N/A'}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Age Groups */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                <span>Age Groups</span>
              </h3>
              {demographic.ageGroups && demographic.ageGroups.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground font-medium px-2">
                    <div>Age Range</div>
                    <div>Count</div>
                  </div>
                  
                  {demographic.ageGroups.map((group, index) => (
                    <Card key={index} className="border-0 shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="font-medium flex items-center gap-2">
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                            {group.ageRange}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{group.count}</span>
                            <span className="text-xs text-muted-foreground">
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
                      <span className="text-xs text-muted-foreground">
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
                <div className="text-muted-foreground italic">No age group data available</div>
              )}
            </div>

            {/* Chronic Diseases */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Chronic Diseases</span>
              </h3>
              {demographic.chronicDiseases && demographic.chronicDiseases.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground font-medium px-2">
                    <div>Disease</div>
                    <div>Count</div>
                  </div>
                  
                  {demographic.chronicDiseases.map((disease, index) => (
                    <Card key={index} className="border-0 shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            {disease.diseaseName}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{disease.count}</span>
                            <span className="text-xs text-muted-foreground">
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
                  
                  <div className="text-muted-foreground text-sm mt-1 px-2">
                    Note: People may have multiple chronic diseases
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground italic">No chronic disease data available</div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-4 flex justify-end">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last updated: {new Date(demographic.updatedAt).toLocaleString()}
            </div>
          </CardFooter>
        </Card>
      </main>

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