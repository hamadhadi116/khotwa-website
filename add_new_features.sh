#!/bin/bash

# Add new CSS and JS files to all HTML pages

for file in *.html; do
  # Skip if already has pagination.css
  if grep -q "pagination.css" "$file"; then
    echo "✓ $file already updated"
    continue
  fi
  
  # Add CSS files before </head>
  sed -i 's|</head>|  <link rel="stylesheet" href="/assets/pagination.css">\n  <link rel="stylesheet" href="/assets/advanced-filters.css">\n  <link rel="stylesheet" href="/assets/feedback.css">\n</head>|' "$file"
  
  # Add JS files before </body>
  sed -i 's|</body>|  <script src="/assets/pagination.js"></script>\n  <script src="/assets/advanced-filters.js"></script>\n  <script src="/assets/feedback.js"></script>\n  <script src="/assets/newsletter.js"></script>\n  <script src="/assets/form-validation.js"></script>\n</body>|' "$file"
  
  echo "✓ Updated $file"
done

# Add RSS feed link to index.html
if ! grep -q "application/rss+xml" index.html; then
  sed -i 's|</head>|  <link rel="alternate" type="application/rss+xml" title="أخبار مجلس طلاب خطوة" href="/feed.xml">\n</head>|' index.html
  echo "✓ Added RSS feed link to index.html"
fi

echo ""
echo "All files updated successfully!"
