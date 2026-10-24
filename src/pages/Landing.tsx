import { useState } from 'react';
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Palette,
  Smartphone,
  Check,
  ChevronDown,
  Star,
  ArrowLeft,
  Menu,
  X,
  Zap,
  TrendingUp,
  Clock,
  HeadphonesIcon,
} from 'lucide-react';
import { handleStartClick } from '@/lib/desktopDetection';

const LOGO = '/favicon.png';

// ═══════════════════════════════════════════════════════════════════
// ✅ Data
// ═══════════════════════════════════════════════════════════════════

const FEATURES = [
  {
    icon: ShoppingCart,
    title: 'إدارة المنتجات',
    desc: 'أضف وعدّل منتجاتك بسهولة مع الصور والأسعار والأقسام. دعم كامل للباركود والمخزون.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Package,
    title: 'تتبع الطلبات',
    desc: 'تابع طلبات عملائك لحظة بلحظة. إدارة الشحن والتوصيل والمخزون في مكان واحد.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'إدارة العملاء',
    desc: 'قاعدة بيانات عملاء شاملة مع سجل الطلبات والأرصدة ونظام البونص والنقاط.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: DollarSign,
    title: 'تقارير مالية',
    desc: 'تقارير شاملة عن الأرباح والمبيعات والمصروفات. تحكم كامل في حساباتك.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Palette,
    title: 'تصميم مرن',
    desc: 'خصص متجرك بحرية كاملة — ألوان، خطوط، ترتيب، صفحات. بدون قيود.',
    color: 'from-rose-500 to-red-500',
  },
  {
    icon: Smartphone,
    title: 'متوافق مع الجوال',
    desc: 'يعمل على جميع الأجهزة — كمبيوتر، تابلت، جوال. تجربة تسوق سلسة.',
    color: 'from-indigo-500 to-violet-500',
  },
];

const STEPS = [
  {
    num: '1',
    title: 'سجّل حسابك',
    desc: 'أنشئ حسابك مجاناً في دقيقة واحدة. بدون بطاقة ائتمانية.',
    icon: Users,
  },
  {
    num: '2',
    title: 'أضف منتجاتك',
    desc: 'حمّل منتجاتك مع الصور والأسعار. كل شيء جاهز في دقائق.',
    icon: ShoppingCart,
  },
  {
    num: '3',
    title: 'ابدأ البيع',
    desc: 'متجرك جاهز! شارك الرابط مع عملائك وابدأ استقبال الطلبات.',
    icon: TrendingUp,
  },
];

const PRICING = [
  {
    name: 'المبتدئ',
    price: '200',
    period: 'شهرياً',
    features: [
      'حتى 100 منتج',
      'حتى 500 طلب شهرياً',
      'مساحة تخزين 1 جيجا',
      'دعم عبر البريد',
      'شهادة SSL مجانية',
    ],
    highlighted: false,
    badge: undefined as string | undefined,
  },
  {
    name: 'الاحترافي',
    price: '500',
    period: 'شهرياً',
    features: [
      'منتجات غير محدودة',
      'طلبات غير محدودة',
      'مساحة تخزين 10 جيجا',
      'دعم أولوية 24/7',
      'تقارير متقدمة',
      'تكامل مع بوابات الدفع',
      'ربط النطاق المخصص',
    ],
    highlighted: true,
    badge: 'الأكثر شعبية',
  },
  {
    name: 'المؤسسي',
    price: '1000',
    period: 'شهرياً',
    features: [
      'كل ميزات الاحترافي',
      'مساحة تخزين 100 جيجا',
      'حسابات متعددة',
      'دعم مخصص',
      'تكامل API',
      'تدريب شخصي',
      'مدير حساب مخصص',
    ],
    highlighted: false,
    badge: undefined as string | undefined,
  },
];

const TESTIMONIALS = [
  {
    quote:
      'أفضل منصة استخدمتها! بدأت متجري في يوم واحد وسجلت أول 50 طلب في الأسبوع الأول.',
    name: 'أحمد محمد',
    role: 'صاحب متجر إلكترونيات',
    avatar: '👨‍💼',
    rating: 5,
  },
  {
    quote:
      'المرونة في التصميم رائعة. قدرت أعمل متجر يشبه البراند بتاعي بالظبط بدون كود.',
    name: 'سارة علي',
    role: 'مؤسسة متجر ملابس',
    avatar: '👩‍💼',
    rating: 5,
  },
  {
    quote:
      'الدعم الفني ممتاز. أي مشكلة تحل في دقائق. والأرباح تضاعفت خلال 3 شهور.',
    name: 'محمد حسن',
    role: 'صاحب متجر منتجات طبيعية',
    avatar: '👨‍💻',
    rating: 5,
  },
];

const FAQ = [
  {
    q: 'هل أحتاج بطاقة ائتمانية للبدء؟',
    a: 'لا، يمكنك البدء مجاناً. بطاقة الائتمان مطلوبة فقط عند ترقية الخطة المدفوعة.',
  },
  {
    q: 'هل يمكنني تغيير التصميم لاحقاً؟',
    a: 'بالتأكيد! يمكنك تغيير الألوان والخطوط والترتيب في أي وقت من لوحة التحكم.',
  },
  {
    q: 'هل يعمل المتجر على الجوال؟',
    a: 'نعم، المتجر متوافق 100% مع جميع الأجهزة — جوال، تابلت، كمبيوتر.',
  },
  {
    q: 'كيف أستلم أموال المبيعات؟',
    a: 'يمكنك ربط حسابك البنكي أو بوابات الدفع الإلكترونية (فوري، باي موب، سترايب).',
  },
  {
    q: 'هل يمكنني ربط نطاق مخصص (domain)؟',
    a: 'نعم، في الخطة الاحترافية يمكنك ربط نطاقك الخاص مثل www.mystore.com.',
  },
  {
    q: 'هل هناك رسوم إضافية على المبيعات؟',
    a: 'لا، نأخذ رسوم الاشتراك الشهري فقط. أرباحك 100% لك.',
  },
];

// ═══════════════════════════════════════════════════════════════════
// ✅ Component
// ═══════════════════════════════════════════════════════════════════

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [opening, setOpening] = useState(false);

  const onStart = async () => {
    if (opening) return;
    setOpening(true);
    try {
      await handleStartClick();
    } catch (err) {
      console.error('Start handler failed:', err);
    } finally {
      setOpening(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════════════ */}
      {/* Header */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src={LOGO} alt="Talvo" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-extrabold text-gray-900">
              Talvo Shop
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-700">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              المميزات
            </a>
            <a href="#how" className="hover:text-blue-600 transition-colors">
              كيف يعمل
            </a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">
              الأسعار
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              الأسئلة
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition-colors">
              تسجيل دخول
            </button>
            <button
              onClick={onStart}
              disabled={opening}
              className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-wait"
            >
              {opening ? 'جاري...' : 'ابدأ مجاناً'}
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white p-4 space-y-2">
            <a
              href="#features"
              className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              المميزات
            </a>
            <a
              href="#how"
              className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              كيف يعمل
            </a>
            <a
              href="#pricing"
              className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              الأسعار
            </a>
            <a
              href="#faq"
              className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              الأسئلة
            </a>
            <div className="pt-2 border-t border-gray-200 space-y-2">
              <button className="w-full px-4 py-2 text-blue-600 font-bold border-2 border-blue-600 rounded-lg">
                تسجيل دخول
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onStart();
                }}
                disabled={opening}
                className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-70 disabled:cursor-wait"
              >
                {opening ? 'جاري الفتح...' : 'ابدأ مجاناً'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Hero */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32 px-4 md:px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-blue-600 mb-6 shadow-sm">
            <Zap className="w-4 h-4" />
            منصة المتاجر الإلكترونية الأولى
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            أنشئ متجرك الإلكتروني
            <br />
            <span className="bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
              في دقائق
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة لإدارة متجرك الإلكتروني مع كل الميزات التي تحتاجها.
            ابدأ مجاناً، بدون بطاقة ائتمانية، بدون قيود.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStart}
              disabled={opening}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-extrabold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {opening ? (
                'جاري الفتح...'
              ) : (
                <>
                  ابدأ مجاناً
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 rounded-xl font-extrabold text-lg hover:border-blue-600 transition-colors">
              شاهد العرض التوضيحي
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="font-bold">بدون بطاقة ائتمانية</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="font-bold">إلغاء في أي وقت</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span className="font-bold">دعم 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Stats Bar */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-blue-400">
              1000+
            </div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">متجر نشط</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-green-400">
              50K+
            </div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">طلب شهرياً</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-amber-400">
              99.9%
            </div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">وقت التشغيل</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-purple-400">
              4.9/5
            </div>
            <div className="text-xs md:text-sm text-gray-400 mt-1">تقييم العملاء</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Features */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 md:py-28 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Star className="w-4 h-4" />
              المميزات
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              كل ما تحتاجه لإدارة متجرك
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              أدوات احترافية لإدارة كاملة لمتجرك الإلكتروني
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* How It Works */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="how" className="py-20 md:py-28 px-4 md:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Clock className="w-4 h-4" />
              كيف يعمل
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              3 خطوات فقط للبدء
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              متجرك جاهز في أقل من 10 دقائق
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative">
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-extrabold shadow-lg">
                      {step.num}
                    </div>
                    <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-l from-transparent via-blue-300 to-transparent -z-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Pricing */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-20 md:py-28 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <DollarSign className="w-4 h-4" />
              الأسعار
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              خطط تناسب احتياجاتك
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ابدأ مجاناً، ترقّي عندما تحتاج. بدون التزامات.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {PRICING.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl md:scale-105 border-0'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-xs font-extrabold">
                    {plan.badge}
                  </div>
                )}

                <h3
                  className={`text-2xl font-extrabold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <span
                    className={`text-5xl font-extrabold ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={
                      plan.highlighted ? 'text-white/80' : 'text-gray-500'
                    }
                  >
                    {' '}
                    ج.م / {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-green-300' : 'text-green-500'
                        }`}
                      />
                      <span
                        className={
                          plan.highlighted ? 'text-white' : 'text-gray-700'
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onStart}
                  disabled={opening}
                  className={`w-full py-3 rounded-xl font-extrabold transition-all disabled:opacity-70 disabled:cursor-wait ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {opening
                    ? 'جاري الفتح...'
                    : plan.highlighted
                    ? 'ابدأ الآن'
                    : 'اختر الخطة'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Testimonials */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Star className="w-4 h-4" />
              آراء العملاء
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              عملاؤنا يتحدثون
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FAQ */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 md:py-28 px-4 md:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <HeadphonesIcon className="w-4 h-4" />
              الأسئلة الشائعة
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              عندك سؤال؟
            </h2>
            <p className="text-lg text-gray-600">
              الأجوبة على أكثر الأسئلة شيوعاً
            </p>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-100 transition-colors"
                >
                  <span className="font-extrabold text-gray-900">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Final CTA */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            جاهز لبدء متجرك؟
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            انضم إلى آلاف التجار الذين يبيعون عبر Talvo Shop
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStart}
              disabled={opening}
              className="px-10 py-4 bg-white text-blue-600 rounded-xl font-extrabold text-lg hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
            >
              {opening ? 'جاري الفتح...' : 'ابدأ مجاناً 🚀'}
            </button>
            <button className="px-10 py-4 border-2 border-white/30 text-white rounded-xl font-extrabold text-lg hover:bg-white/10 transition-colors">
              تواصل معنا
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Footer */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={LOGO} alt="Talvo" className="w-10 h-10 rounded-xl" />
                <span className="text-xl font-extrabold text-gray-900">
                  Talvo Shop
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                منصة المتاجر الإلكترونية الأولى. أنشئ متجرك في دقائق.
              </p>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 mb-3">المنتج</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#features" className="hover:text-blue-600">
                    المميزات
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-blue-600">
                    الأسعار
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    التحديثات
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 mb-3">الشركة</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    تواصل معنا
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    الوظائف
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-extrabold text-gray-900 mb-3">قانوني</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    الشروط والأحكام
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    سياسة الاسترداد
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Talvo Shop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}