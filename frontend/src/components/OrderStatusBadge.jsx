const LABELS = {
  pending_confirmation: "Pending Confirmation",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  rejected: "Rejected",
  cancelled: "Cancelled",
};


export default function OrderStatusBadge({
  status,
}) {
  return (
    <span
      className={`status-badge status-${status}`}
    >
      {LABELS[status] || status}
    </span>
  );
}
