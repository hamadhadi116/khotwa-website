#!/usr/bin/env python3
import re

# تحسينات Alt Text
alt_text_updates = {
    'photo-2025-04-26-21-25-14': 'صورة جماعية لأعضاء مجلس طلاب خطوة في جامعة لا تروب - ملبورن، يظهر فيها الفريق في لقاء تعارفي'
}

for filename in ['index.html', 'about.html', 'news.html', 'events.html', 'calendar.html', 'resources.html', 'contact.html', 'register.html', 'faq.html']:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # تحديث alt text للصورة الرئيسية
        for img_name, alt_text in alt_text_updates.items():
            pattern = f'<img([^>]*) src="/assets/img/{img_name}\\.(jpg|webp)"([^>]*)>'
            replacement = f'<img\\1 src="/assets/img/{img_name}.\\2"\\3 alt="{alt_text}">'
            content = re.sub(pattern, replacement, content)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Updated alt text in: {filename}")
    except FileNotFoundError:
        print(f"✗ Not found: {filename}")

print("\n✅ Alt text updated successfully!")
