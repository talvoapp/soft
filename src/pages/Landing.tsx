export function Landing() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6"
    >
      <div className="text-center max-w-2xl">
        {/* ✅ الشعار */}
        <div className="mb-6 flex justify-center">
          <img
            src="/favicon.png"
            alt="Talvo"
            className="w-28 h-28 rounded-3xl shadow-lg object-cover ring-4 ring-white"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<div class="text-7xl">🏪</div>';
            }}
          />
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
          Talvo Shop
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          منصة المتاجر الإلكترونية
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-md text-right">
          <p className="text-sm font-bold text-gray-700 mb-3">
            📌 للوصول إلى متجر، استخدم رابط المتجر:
          </p>
          <div className="space-y-2 text-sm" dir="ltr">
            <code className="block bg-gray-50 p-3 rounded-lg text-gray-700">
              https://talvo-shop.vercel.app/
              <span className="text-blue-600 font-bold">elmasa</span>
            </code>
            <code className="block bg-gray-50 p-3 rounded-lg text-gray-700">
              https://talvo-shop.vercel.app/
              <span className="text-blue-600 font-bold">3</span>
            </code>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} Talvo. All rights reserved.
        </p>
      </div>
    </div>
  );
}