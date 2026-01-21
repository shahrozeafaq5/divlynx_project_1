import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import "@/models/User";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";



export default async function AdminOrdersPage() {
  let serializedOrders: any[] = [];

  try {
    const conn = await connectDB();
    if (!conn) return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <AdminOrdersTable initialOrders={serializedOrders} />
      </div>
    );

    const orders = await Order.find({})
      .populate("user", "email")
      .populate("items.book", "title")
      .sort({ createdAt: -1 });

    serializedOrders = JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("AdminOrdersPage SSR error:", error);
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>
      <AdminOrdersTable initialOrders={serializedOrders} />
    </div>
  );
}
