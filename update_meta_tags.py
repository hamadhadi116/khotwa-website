#!/usr/bin/env python3
import re

# تحسينات Meta Tags لكل صفحة
meta_improvements = {
    'about.html': {
        'description': 'تعرف على مجلس طلاب خطوة: رؤيتنا، رسالتنا، أهدافنا، وفريق العمل. نمثل طلاب برنامج خطوة في جامعة لا تروب - ملبورن منذ 2024.',
        'keywords': 'مجلس طلاب خطوة, من نحن, رؤية المجلس, رسالة المجلس, فريق العمل, جامعة لا تروب, ملبورن, طلاب سعوديين'
    },
    'news.html': {
        'description': 'آخر أخبار وإعلانات مجلس طلاب خطوة. تابع أحدث الفعاليات، الإنجازات، والتغطيات الإخبارية لأنشطة المجلس في ملبورن.',
        'keywords': 'أخبار خطوة, إعلانات المجلس, فعاليات خطوة, أخبار الطلاب, جامعة لا تروب, ملبورن'
    },
    'events.html': {
        'description': 'تصفح جميع فعاليات وأنشطة مجلس طلاب خطوة القادمة. ورش عمل، لقاءات اجتماعية، فعاليات ثقافية، ورحلات ترفيهية في ملبورن.',
        'keywords': 'فعاليات خطوة, أنشطة طلابية, ورش عمل, لقاءات اجتماعية, فعاليات ثقافية, ملبورن, جامعة لا تروب'
    },
    'calendar.html': {
        'description': 'تقويم شامل لجميع فعاليات وأنشطة مجلس طلاب خطوة. خطط مسبقاً واحجز موعدك لحضور الفعاليات القادمة.',
        'keywords': 'تقويم خطوة, جدول الفعاليات, مواعيد الأنشطة, تقويم أكاديمي, جامعة لا تروب'
    },
    'resources.html': {
        'description': 'موارد مفيدة لطلاب خطوة: أدلة أكاديمية، معلومات عن الخدمات الجامعية، نصائح للحياة الجامعية، وروابط مهمة.',
        'keywords': 'موارد طلابية, أدلة أكاديمية, خدمات جامعية, نصائح دراسية, دعم الطلاب, جامعة لا تروب'
    },
    'contact.html': {
        'description': 'تواصل مع مجلس طلاب خطوة. نحن هنا للإجابة على استفساراتك، استقبال اقتراحاتك، وتقديم الدعم اللازم لك.',
        'keywords': 'تواصل معنا, اتصل بنا, استفسارات, اقتراحات, دعم الطلاب, مجلس خطوة'
    },
    'register.html': {
        'description': 'انضم إلى مجلس طلاب خطوة! سجل الآن لتصبح عضواً فعالاً وتساهم في دعم مجتمع طلاب خطوة في ملبورن.',
        'keywords': 'التسجيل, انضم للمجلس, عضوية المجلس, تسجيل عضو جديد, مجلس طلاب خطوة'
    },
    'faq.html': {
        'description': 'الأسئلة الشائعة حول مجلس طلاب خطوة: العضوية، الفعاليات، الخدمات، وكيفية التواصل معنا. إجابات واضحة لجميع استفساراتك.',
        'keywords': 'أسئلة شائعة, FAQ, استفسارات, معلومات عن المجلس, كيفية الانضمام, خدمات المجلس'
    }
}

for filename, meta in meta_improvements.items():
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # تحديث description
        content = re.sub(
            r'<meta name="description" content="[^"]*"',
            f'<meta name="description" content="{meta["description"]}"',
            content
        )
        
        # إضافة keywords إذا لم تكن موجودة
        if 'keywords' in meta and '<meta name="keywords"' not in content:
            keywords_tag = f'  <meta name="keywords" content="{meta["keywords"]}">\n'
            content = content.replace(
                '<meta name="description"',
                keywords_tag + '  <meta name="description"'
            )
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Updated: {filename}")
    except FileNotFoundError:
        print(f"✗ Not found: {filename}")

print("\n✅ Meta tags updated successfully!")
