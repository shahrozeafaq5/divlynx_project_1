import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import "@/models/User";


export default async function AdminOrdersPage() {
  await connectDB();
  
  const orders = await Order.find({})
    .populate("user", "email")
    .populate("items.book", "title")
    .sort({ createdAt: -1 });

  const serializedOrders = JSON.parse(JSON.stringify(orders));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>
      <AdminOrdersTable initialOrders={serializedOrders} />
    </div>
  );
}