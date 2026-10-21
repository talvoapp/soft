import { useParams, Link } from 'react-router-dom';
import { useShopStore } from '@/store/shopStore';
import { BlockRenderer } from '@/components/BlockRenderer';

export function ContentPage() {
  const { identifier, slug } = useParams<{ identifier: string; slug: string }>();
  const { config } = useShopStore();

  const pages = config?.pages || [];
  const page = pages.find(p => p.slug === slug && p.is_published);

  if (!page) {
    return (
      <div className="text-center py-32">
        <p className="text-4xl mb-4">📄</p>
        <h1 className="text-2xl font-extrabold mb-2">الصفحة غير موجودة</h1>
        <Link to={`/${identifier}`} className="text-blue-600 hover:underline">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center">{page.title}</h1>

      {page.blocks && page.blocks.length > 0 && (
        <div className="mb-6">
          {page.blocks.map(block => <BlockRenderer key={block.id} section={block} />)}
        </div>
      )}

      {page.content && (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      )}
    </div>
  );
}