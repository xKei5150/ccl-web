import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Card } from "@/components/ui/card";
  
  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      action: "Updated profile picture",
      date: "2 hours ago",
      type: "Profile Update",
    },
    {
      id: 2,
      action: "Completed project milestone",
      date: "Yesterday",
      type: "Project",
    },
    {
      id: 3,
      action: "Added new design assets",
      date: "3 days ago",
      type: "Content",
    },
    {
      id: 4,
      action: "Reviewed team submissions",
      date: "1 week ago",
      type: "Review",
    },
  ];
  
  const ActivityTable = () => {
    return (
      <Card className="w-full max-w-screen mx-auto p-6 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activity</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.action}</TableCell>
                <TableCell>{activity.type}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {activity.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  };
  
  export default ActivityTable;