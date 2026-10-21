import { Link, useParams } from 'react-router-dom';

export function NotFound() {
  const { identifier } = useParams<{ identifier: string }>();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-blue-600 mb-4">404</div>
        <h1 className="text-2xl font-extrabold mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-6">الصفحة التي تبحث عنها غير متاحة</p>
        <Link to={`/${identifier || ''}`} className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}