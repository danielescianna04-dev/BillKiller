export default function DashboardLoading() {
  return (
    <div className="space-y-6 px-4 sm:px-0 pb-6 animate-pulse">
      {/* Hero Cards Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg" />
        ))}
      </div>
      
      {/* Subscriptions Skeleton */}
      <div className="bg-gray-200 h-64 rounded-lg" />
      
      {/* Charts Skeleton */}
      <div className="bg-gray-200 h-96 rounded-lg" />
    </div>
  )
}
