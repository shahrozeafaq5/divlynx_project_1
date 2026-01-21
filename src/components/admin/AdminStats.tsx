import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Order from "@/models/Order";
import User from "@/models/User";

export default async function AdminStats() {
  let stats = [
    { label: "Total Books", value: 0 },
    { label: "Total Orders", value: 0 },
    { label: "Total Users", value: 0 },
    { label: "Revenue", value: "$0.00" },
  ];

  try {
    const conn = await connectDB();
    if (!conn) return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    );

    const [books, orders, users, revenueAgg] = await Promise.all([
      Book.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

    const revenue = revenueAgg[0]?.total ?? 0;

    stats = [
      { label: "Total Books", value: books },
      { label: "Total Orders", value: orders },
      { label: "Total Users", value: users },
      { label: "Revenue", value: `$${revenue.toFixed(2)}` },
    ];
  } catch (error) {
    console.error("AdminStats SSR error:", error);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl shadow p-5"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-2xl font-semibold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
