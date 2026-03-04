import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Administrative Task Overview</h1>
        <p className="text-muted-foreground">
          Monitor the efficiency of automated healthcare administrative work.
        </p>
      </div>
      <AdminDashboard />
    </div>
  );
}
