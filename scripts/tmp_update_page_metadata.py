from pathlib import Path
import re


ROOT = Path("app")


def to_route_path(rel_path: str) -> str:
    if rel_path == "page.tsx":
        return "/"
    return "/" + rel_path[: -len("/page.tsx")]


def main() -> None:
    changed = 0
    for file_path in sorted(ROOT.glob("**/page.tsx")):
        content = file_path.read_text(encoding="utf-8")
        rel = file_path.relative_to(ROOT).as_posix()
        route_path = to_route_path(rel)

        metadata_block = re.search(
            r"export const metadata: Metadata = \{[\s\S]*?\}\s*;",
            content,
            flags=re.MULTILINE,
        )
        if not metadata_block:
            continue

        block = metadata_block.group(0)
        title_match = re.search(r"title:\s*'([^']*)'", block)
        desc_match = re.search(r"description:\s*('(?:[^'\\]|\\.)*'|`[\s\S]*?`)", block)
        if not title_match or not desc_match:
            continue

        title = title_match.group(1)
        description = desc_match.group(1).strip()

        replacement = (
            "export const metadata: Metadata = createPageMetadata({\n"
            f"  title: '{title}',\n"
            f"  description: {description},\n"
            f"  path: '{route_path}',\n"
            "});"
        )

        updated = content.replace(block, replacement, 1)
        if "createPageMetadata" not in updated:
            updated = updated.replace(
                "import type { Metadata } from 'next';\n",
                "import type { Metadata } from 'next';\nimport { createPageMetadata } from '@/lib/seo-metadata';\n",
                1,
            )

        if updated != content:
            file_path.write_text(updated, encoding="utf-8")
            changed += 1

    print(f"Updated {changed} page files")


def ensure_imports() -> None:
    changed = 0
    for file_path in sorted(ROOT.glob("**/page.tsx")):
        content = file_path.read_text(encoding="utf-8")
        if "createPageMetadata(" not in content:
            continue
        if "from '@/lib/seo-metadata'" in content:
            continue

        updated = re.sub(
            r"(import type \{ Metadata \} from 'next';\r?\n)",
            r"\1import { createPageMetadata } from '@/lib/seo-metadata';\n",
            content,
            count=1,
        )

        if updated != content:
            file_path.write_text(updated, encoding="utf-8")
            changed += 1

    print(f"Inserted imports in {changed} page files")


if __name__ == "__main__":
    main()
    ensure_imports()