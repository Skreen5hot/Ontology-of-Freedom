#!/usr/bin/env python3
"""
Script to convert integral-ethics.md to standard markdown format.
"""

import re

def format_markdown(content):
    """Apply markdown formatting rules."""

    # Already processed sections - skip them
    lines = content.split('\n')
    result = []

    for i, line in enumerate(lines):
        # Skip already formatted lines
        if line.startswith('#') or line.startswith('-') or line.startswith('**'):
            result.append(line)
            continue

        # Format section headers (2.3, 2.4, etc.)
        if re.match(r'^\d+\.\d+ ', line) and not line.startswith('##'):
            line = '### ' + line
        # Format subsection headers (2.2.1, etc.)
        elif re.match(r'^\d+\.\d+\.\d+ ', line) and not line.startswith('####'):
            line = '#### ' + line
        # Format numbered lists at start of line
        elif re.match(r'^\d+\. [A-Z]', line):
            # Keep as is - these are proper numbered lists
            pass
        # Format validation approaches, etc.
        elif re.match(r'^\d+\. ', line) and i > 0 and lines[i-1].endswith(':'):
            # Keep numbered list format
            pass

        result.append(line)

    return '\n'.join(result)

# Read the file
with open('integral-ethics.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Apply formatting
formatted = format_markdown(content)

# Write back
with open('integral-ethics.md', 'w', encoding='utf-8') as f:
    f.write(formatted)

print("Markdown formatting applied successfully!")
