import os

files_to_update = [
    r"VAULTO_Final_Report.md",
    r"fix_report.py",
    r"backend\routes\ai-agent.js",
    r"frontend\src\components\DEVChat.jsx",
    r"frontend\src\App.jsx",
    r"frontend\src\pages\Landing.jsx"
]

for file_path in files_to_update:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replacements
        content = content.replace("ARIAChat", "DEVChat")
        content = content.replace("ARIA", "DEV")
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"File not found: {file_path}")
