#!/bin/bash
for file in src/pages/UsersDirectory.jsx src/pages/CommunityDirectory.jsx src/pages/AgentDirectory.jsx src/pages/IaiesMundialsDirectory.jsx src/pages/Directory.jsx; do
  if ! grep -q "SEO from" "$file"; then
    echo "Updating $file"
  fi
done
