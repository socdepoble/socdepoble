import os
import re

files_to_fix = [
    'src/core/rhizome/affinityBridge.js',
    'src/core/rhizome/livingArchitecture.js'
]

for filepath in files_to_fix:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace \` with `
    # Replace \${ with ${
    # Replace \' with ' inside template literals (we'll just do global for now if it's safe)
    # Wait, \' is valid in strings but we can just do \` and \${
    new_content = content.replace('\\`', '`').replace('\\${', '${')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
    else:
        print(f"No changes for {filepath}")
