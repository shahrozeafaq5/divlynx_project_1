import AdminStats from "@/components/admin/AdminStats";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <AdminStats />

      <div className="mt-8">
        <p className="text-gray-600">
          Welcome to BookNest Admin Panel. Use the sidebar to manage books and
          orders.
        </p>
      </div>
    </div>
  );
}
