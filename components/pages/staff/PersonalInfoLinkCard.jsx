"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalInfoSelect } from "@/components/form/PersonalInfoSelect";

export function PersonalInfoLinkCard({ staff, personalInfoList }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Personal Information Linked</h3>
          <p className="text-sm text-gray-500 mb-4">Link this staff member to their personal information record</p>
          <div className="flex gap-2 justify-center items-center">
            <PersonalInfoSelect
              userId={staff.id}
              personalInfo={personalInfoList}
              className="w-[300px]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open("/dashboard/personal/new", "_blank")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}