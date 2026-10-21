import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 p-6"
      dir="rtl"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* ✅ الشعار */}
        <img
          src="/favicon.png"
          alt="Talvo"
          className="w-16 h-16 mx-auto mb-4 rounded-xl opacity-70"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">عذراً</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}