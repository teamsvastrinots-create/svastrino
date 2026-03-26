import glob
import re

def fix_css():
    for f in glob.glob('E:/projectsvastrino/svastrino/*.html'):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # If it doesn't already have the CSS block, add it right before </style>
        if '.freemium-only { display: none !important; }' not in content:
            # We want to insert the CSS rules just before the closing </style> tag.
            new_css = """
    .freemium-only { display: none !important; }
    .freemium-mode .freemium-only { display: flex !important; }
    .freemium-mode .freemium-only-block { display: block !important; }
"""
            # Replace </style> with new_css + </style>
            content = content.replace('</style>', new_css + '  </style>')
            
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
                print(f"Fixed CSS in {f}")

if __name__ == "__main__":
    fix_css()
