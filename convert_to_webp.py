#!/usr/bin/env python3.11
"""
تحويل الصور إلى تنسيق WebP لتحسين الأداء
"""

from PIL import Image
import os
from pathlib import Path

def convert_to_webp(input_path, output_path=None, quality=85):
    """
    تحويل صورة إلى WebP
    
    Args:
        input_path: مسار الصورة الأصلية
        output_path: مسار الصورة المحولة (اختياري)
        quality: جودة الصورة (0-100)
    """
    if output_path is None:
        output_path = Path(input_path).with_suffix('.webp')
    
    try:
        # فتح الصورة
        img = Image.open(input_path)
        
        # تحويل إلى RGB إذا كانت RGBA
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')
        
        # حفظ بتنسيق WebP
        img.save(output_path, 'WebP', quality=quality, method=6)
        
        # حساب نسبة التوفير
        original_size = os.path.getsize(input_path)
        webp_size = os.path.getsize(output_path)
        savings = ((original_size - webp_size) / original_size) * 100
        
        print(f"✅ تم التحويل: {input_path}")
        print(f"   الحجم الأصلي: {original_size / 1024:.2f} KB")
        print(f"   الحجم الجديد: {webp_size / 1024:.2f} KB")
        print(f"   التوفير: {savings:.1f}%")
        
        return True
    except Exception as e:
        print(f"❌ خطأ في تحويل {input_path}: {e}")
        return False

def main():
    """البحث عن جميع الصور وتحويلها"""
    img_dir = Path('/home/ubuntu/khotwa-website/assets/img')
    
    # أنواع الصور المدعومة
    extensions = ['.jpg', '.jpeg', '.png']
    
    converted = 0
    for ext in extensions:
        for img_path in img_dir.glob(f'*{ext}'):
            webp_path = img_path.with_suffix('.webp')
            if not webp_path.exists():
                if convert_to_webp(img_path):
                    converted += 1
    
    print(f"\n✨ تم تحويل {converted} صورة بنجاح!")

if __name__ == '__main__':
    main()
