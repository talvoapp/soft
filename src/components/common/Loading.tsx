export function Loading({ text = 'جاري التحميل...' }: { text?: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      dir="rtl"
    >
      <div className="text-center">
        {/* ✅ الشعار */}
        <img
          src="/favicon.png"
          alt="Talvo"
          className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-lg animate-pulse"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
}