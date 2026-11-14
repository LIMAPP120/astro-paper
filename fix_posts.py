import os
import re

posts_dir = "src/content/posts"

for filename in os.listdir(posts_dir):
    if not filename.endswith(".md"):
        continue

    filepath = os.path.join(posts_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Match frontmatter
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)", content, re.DOTALL)
    if not match:
        continue

    fm_text = match.group(1)
    body = match.group(2)

    new_fm_lines = []
    tags = []

    for line in fm_text.split("\n"):
        line = line.strip()
        if not line: continue

        if line.startswith("date:"):
            date_val = line.split(":", 1)[1].strip()
            if len(date_val) == 10: # YYYY-MM-DD
                date_val += "T00:00:00Z"
            new_fm_lines.append(f"pubDatetime: {date_val}")
        elif line.startswith("category:"):
            cat_val = line.split(":", 1)[1].strip().strip('"').strip("'")
            tags.append(f"  - \"{cat_val}\"")
        elif line.startswith("heroImage:"):
            img_val = line.split(":", 1)[1].strip()
            new_fm_lines.append(f"ogImage: {img_val}")
        elif line.startswith(("order:", "difficulty:", "prev:", "next:")):
            continue # Remove these
        else:
            new_fm_lines.append(line)

    if tags:
        new_fm_lines.append("tags:")
        new_fm_lines.extend(tags)
    else:
        new_fm_lines.append("tags:\n  - \"others\"")

    fm_str = "\n".join(new_fm_lines)
    if "title:" not in fm_str:
        fm_str += f"\ntitle: \"{filename.replace('.md', '').title()}\""
    if "description:" not in fm_str:
        fm_str += "\ndescription: \"Read this AI article.\""

    new_content = f"---\n{fm_str}\n---\n{body}"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

print("✅ All .md posts fixed successfully!")
