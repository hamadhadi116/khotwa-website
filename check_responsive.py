#!/usr/bin/env python3
"""
فحص توافق الموقع مع أحجام الشاشات المختلفة
"""

# قائمة الصفحات للفحص
pages = [
    "index.html",
    "about.html",
    "news.html",
    "events.html",
    "gallery.html",
    "faq.html",
    "contact.html"
]

# أحجام الشاشات
screen_sizes = {
    "Mobile (iPhone)": "375x667",
    "Mobile (Android)": "360x640",
    "Tablet (iPad)": "768x1024",
    "Desktop (Laptop)": "1280x800",
    "Desktop (Full HD)": "1920x1080"
}

print("=" * 60)
print("فحص التوافق مع الأجهزة المختلفة")
print("=" * 60)
print()

print(f"✅ عدد الصفحات: {len(pages)}")
print(f"✅ أحجام الشاشات: {len(screen_sizes)}")
print()

print("الصفحات المطلوب فحصها:")
for i, page in enumerate(pages, 1):
    print(f"  {i}. {page}")

print()
print("أحجام الشاشات:")
for device, size in screen_sizes.items():
    print(f"  - {device}: {size}")

print()
print("=" * 60)
print("التوصية: فحص يدوي على المتصفح مطلوب")
print("=" * 60)
