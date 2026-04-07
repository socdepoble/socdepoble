#!/bin/bash
PROMPT_FILE="auditories/SUPER_PROMPT_AUDITORIA_USABILIDAD_ARQ.md"
TARGET_COMPONENT="src/pages/ProjectPresentation.jsx"

# Extract the top part of the prompt
awk '
BEGIN { p=1 }
/```jsx/ {
    print $0
    p=0
    exit
}
{ if(p) print $0 }
' "$PROMPT_FILE" > temp_prompt.md

# Append the current code
cat "$TARGET_COMPONENT" >> temp_prompt.md

# Extract the bottom part of the prompt
awk '
BEGIN { p=0; code_ended=0 }
/```/ {
    if(!p && !code_ended) {
        # Skip the first ``` jsx start, wait for the closing ```
        if (count == 1) {
            p=1
            code_ended=1
        }
        count++
    }
}
{ 
    if(p && code_ended) {
        print $0 
    }
}
' "$PROMPT_FILE" >> temp_prompt.md

mv temp_prompt.md "$PROMPT_FILE"
echo "Prompt updated successfully!"
