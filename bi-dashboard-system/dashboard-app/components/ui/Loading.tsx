// dashboard-app/components/ui/Loading.tsx

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`spinner ${sizes[size]}`}></div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-50">
      <div className="text-center">
        <div className="spinner w-12 h-12 mx-auto mb-4"></div>
        <p className="text-accent-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl border border-accent-200 shadow-sm p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-accent-200 rounded w-3/4"></div>
        <div className="h-4 bg-accent-200 rounded w-1/2"></div>
        <div className="h-32 bg-accent-200 rounded"></div>
      </div>
    </div>
  );
}