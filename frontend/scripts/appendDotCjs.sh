#!/bin/bash

# List of Node.js core modules to exclude
excluded_modules=("fs" "fs/promises" "http" "https" "path" "url" "os" "crypto" "stream" "util" "events" "child_process" "buffer" "dns" "querystring" "readline" "tls" "zlib")

# Function to check if a string is a Node.js core module
is_core_module() {
  local module=$1
  for excluded in "${excluded_modules[@]}"; do
    if [[ "$module" == "$excluded" ]]; then
      return 0
    fi
  done
  return 1
}

# Specify the folder to search (replace with your folder path)
folder_to_search="dist"

# Loop through all JavaScript files in the specified folder and subdirectories
for file in $(find "$folder_to_search" -type f -name "*.cjs"); do
#   echo "Processing file: $file"
  
  # Create a temporary file for modified content
  temp_file=$(mktemp)

  # Read the file line by line
  while IFS= read -r line; do
    # Match lines with require statements and extract the argument inside require()
    if [[ "$line" =~ require\([[:space:]]*[\"\`]([^\"\`]+)[\"\`][[:space:]]*\) ]]; then
      module="${BASH_REMATCH[1]}"
      
      # Debug: print the matched module
    #   echo "Found require: $module"
      
      # Check if the module is a path (contains '/') and not a core module
      if [[ "$module" == */* ]] && ! is_core_module "$module"; then
        # Use sed to replace require with .cjs appended to module if it is a valid path
        new_line=$(echo "$line" | sed "s|require('$module')|require('$module.cjs')|g")
        new_line=$(echo "$new_line" | sed "s|require(\"$module\")|require(\"$module.cjs\")|g")

        # Debug: print the modified line
        # echo "Modified line: $new_line"
        # Write the modified line to the temp file
        echo "$new_line" >> "$temp_file"
      else
        # Otherwise, write the original line to the temp file
        # echo "No modification: $line"
        echo "$line" >> "$temp_file"
      fi
    else
      # If no require statement, just write the original line to the temp file
    #   echo "No require match: $line"
      echo "$line" >> "$temp_file"
    fi
  done < "$file"

  # Replace the original file with the modified one
  mv "$temp_file" "$file"
done
