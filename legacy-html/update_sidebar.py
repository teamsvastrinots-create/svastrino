import glob, re

def update_sidebar():
    for f in glob.glob('E:/projectsvastrino/svastrino/*.html'):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Remove task history
        # We look for the general structure of the task history link to remove it.
        # It's an anchor tag with href="#" containing the text "Task history".
        task_history_pattern = re.compile(
            r'\s*<a[^>]*href="#"[^>]*>\s*<span[^>]*>history</span>\s*<span[^>]*>Task history</span>\s*</a>', 
            re.MULTILINE | re.IGNORECASE
        )
        content = task_history_pattern.sub('', content)

        # Add lock to Career Tools
        def add_lock(match):
            a_tag = match.group(0)
            
            # Add flex-1 if not present
            a_tag = re.sub(r'class="text-\[13px\]"', 'class="text-[13px] flex-1"', a_tag)
            
            # Inject lock if not already there
            if 'freemium-only' not in a_tag:
                a_tag = a_tag.replace('</a>', '  <span class="freemium-only material-symbols-outlined text-[16px] opacity-70">lock</span>\n      </a>')
            return a_tag
            
        career_tools_pattern = re.compile(
            r'      <a class="flex items-center[^>]*href="(?:psychometric-test\.html|my-test-results\.html|webinars\.html)".*?</a>',
            re.DOTALL
        )
        
        content = career_tools_pattern.sub(add_lock, content)

        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)

if __name__ == "__main__":
    update_sidebar()
