// ═══════════════════════════════════════════════════════════════════
// ✅ Desktop App Detection & Launch
// ═══════════════════════════════════════════════════════════════════
//
// الطريقة:
// 1. نحاول فتح protocol `talvo://`
// 2. إذا فُتح التطبيق → الصفحة تفقد التركيز (blur/visibilitychange)
// 3. إذا لم يُفتح خلال timeout → التطبيق غير مثبت
//
// ⚠️ يحتاج أن يسجل Talvo Desktop نفسه كـ protocol handler
// ═══════════════════════════════════════════════════════════════════

const DESKTOP_PROTOCOL = 'talvo';
const DOWNLOAD_URL = 'https://github.com/talvoapp/talvo-desktop/releases/latest';
const PROTOCOL_WORKS_KEY = 'talvo_protocol_works';

// ═══════════════════════════════════════════════════════════════════
// ✅ Core: محاولة فتح التطبيق
// ═══════════════════════════════════════════════════════════════════

export function tryOpenDesktopApp(
  path: string = 'settings/shop',
  timeoutMs: number = 2000
): Promise<boolean> {
  return new Promise((resolve) => {
    let resolved = false;

    // ✅ إذا فتح التطبيق → الصفحة تفقد التركيز
    const handleBlur = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(true);
    };

    // ✅ إذا خفت الصفحة (بعض المتصفحات) → التطبيق فتح
    const handleVisibility = () => {
      if (document.hidden && !resolved) {
        resolved = true;
        cleanup();
        resolve(true);
      }
    };

    // ✅ مؤقت — إذا لم يفتح شيء → غير مثبت
    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(false);
    }, timeoutMs);

    // ✅ تنظيف
    let iframe: HTMLIFrameElement | null = null;

    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      iframe = null;
    };

    // ✅ مستمعون
    window.addEventListener('blur', handleBlur, { once: true });
    document.addEventListener('visibilitychange', handleVisibility, { once: true });

    // ✅ محاولة فتح protocol
    const protocolUrl = `${DESKTOP_PROTOCOL}://${path}`;

    try {
      // ✅ Safari يستخدم location.href (iframe لا يعمل)
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (isSafari) {
        window.location.href = protocolUrl;
      } else {
        // ✅ Chrome/Edge/Firefox → iframe (لا يغادر الصفحة)
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.src = protocolUrl;
        document.body.appendChild(iframe);
      }
    } catch (err) {
      // فشل في إنشاء iframe → نترك المؤقت ينتهي
      console.warn('Failed to open protocol:', err);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// ✅ فتح صفحة التحميل
// ═══════════════════════════════════════════════════════════════════

export function openDownloadPage(): void {
  window.open(DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
}

// ═══════════════════════════════════════════════════════════════════
// ✅ Smart Handler: يستخدم الذاكرة لتسريع المحاولات التالية
// ═══════════════════════════════════════════════════════════════════

export interface StartResult {
  opened: boolean;
  needsDownload: boolean;
}

export async function handleStartClick(
  onDesktopOpened?: () => void,
  onNeedsDownload?: () => void
): Promise<StartResult> {
  // ✅ إذا نجح protocol سابقاً → حاول مباشرة بـ timeout قصير
  const lastWorked = localStorage.getItem(PROTOCOL_WORKS_KEY) === 'true';

  if (lastWorked) {
    const openedFast = await tryOpenDesktopApp('settings/shop', 1000);
    if (openedFast) {
      localStorage.setItem(PROTOCOL_WORKS_KEY, 'true');
      onDesktopOpened?.();
      return { opened: true, needsDownload: false };
    }
    // فشل → امسح الذاكرة
    localStorage.removeItem(PROTOCOL_WORKS_KEY);
  }

  // ✅ محاولة عادية
  const opened = await tryOpenDesktopApp('settings/shop', 2000);

  if (opened) {
    localStorage.setItem(PROTOCOL_WORKS_KEY, 'true');
    onDesktopOpened?.();
    return { opened: true, needsDownload: false };
  }

  // ❌ التطبيق غير مثبت → GitHub Releases
  onNeedsDownload?.();
  openDownloadPage();
  return { opened: false, needsDownload: true };
}

// ═══════════════════════════════════════════════════════════════════
// ✅ فتح التطبيق على صفحة محددة
// ═══════════════════════════════════════════════════════════════════

export async function openDesktopAt(path: string): Promise<boolean> {
  return tryOpenDesktopApp(path, 2000);
}