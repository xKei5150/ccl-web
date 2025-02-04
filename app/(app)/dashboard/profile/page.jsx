import UserProfile from "@/components/layout/StaffCard";
import ActivityTable from "@/components/layout/ActivityTable";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 px-4 space-y-8">
        <UserProfile
          name="Jonathan Ive"
          role="Product Designer"
          description="Passionate about creating intuitive and beautiful user experiences. Focused on the intersection of design and technology, with a keen eye for detail and a commitment to simplicity."
          avatarUrl="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
        />
        <ActivityTable />
      </div>
    )
};