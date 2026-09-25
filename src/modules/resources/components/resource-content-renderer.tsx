import React from "react";

interface ResourceContentRendererProps {
  content: string;
}

/**
 * Custom lightweight Markdown parser & renderer optimized for Career Guides:
 * - Automatically anchors ## and ### headings with slugified IDs for Table of Contents
 * - Renders GitHub-flavored markdown tables with responsive wrappers and borders
 * - Handles callouts, blockquotes, ordered/unordered lists, and bold/italic text
 */
export function ResourceContentRenderer({ content }: ResourceContentRendererProps) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="prose prose-slate max-w-none space-y-6 text-[15px] sm:text-base leading-relaxed text-slate-700">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={idx}
                id={block.id}
                className="scroll-mt-28 border-b border-slate-200 pb-2 pt-6 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={idx}
                id={block.id}
                className="scroll-mt-28 pt-4 text-lg sm:text-xl font-bold tracking-tight text-slate-900"
              >
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={idx} className="leading-relaxed">
                {renderInlineMarkdown(block.text)}
              </p>
            );

          case "list":
            return (
              <ul key={idx} className="space-y-2 pl-5 list-disc marker:text-[#013089]">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );

          case "numbered-list":
            return (
              <ol key={idx} className="space-y-2 pl-5 list-decimal marker:font-semibold marker:text-[#013089]">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ol>
            );

          case "table":
            return (
              <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-900">
                      {block.headers.map((h, hIdx) => (
                        <th key={hIdx} className="px-4 py-3 border-r border-slate-200/80 last:border-r-0">
                          {renderInlineMarkdown(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {block.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 border-r border-slate-100 last:border-r-0 text-slate-700">
                            {renderInlineMarkdown(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "hr":
            return <hr key={idx} className="my-6 border-t border-slate-200" />;

          default:
            return null;
        }
      })}
    </div>
  );
}

interface BlockH2 {
  type: "h2";
  text: string;
  id: string;
}

interface BlockH3 {
  type: "h3";
  text: string;
  id: string;
}

interface BlockP {
  type: "paragraph";
  text: string;
}

interface BlockList {
  type: "list";
  items: string[];
}

interface BlockNumList {
  type: "numbered-list";
  items: string[];
}

interface BlockTable {
  type: "table";
  headers: string[];
  rows: string[][];
}

interface BlockHr {
  type: "hr";
}

type MarkdownBlock = BlockH2 | BlockH3 | BlockP | BlockList | BlockNumList | BlockTable | BlockHr;

function parseMarkdownBlocks(raw: string): MarkdownBlock[] {
  const lines = raw.split("\n");
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // HR
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // H2
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      const text = h2Match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      blocks.push({ type: "h2", text, id });
      i++;
      continue;
    }

    // H3
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      const text = h3Match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      blocks.push({ type: "h3", text, id });
      i++;
      continue;
    }

    // Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (l: string) =>
          l
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());
        const headers = parseRow(tableLines[0]);
        const dataRows = tableLines.slice(2).map(parseRow); // Skip separator row
        blocks.push({ type: "table", headers, rows: dataRows });
        continue;
      }
    }

    // Unordered List
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Numbered List
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "numbered-list", items });
      continue;
    }

    // Standard Paragraph
    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("* ") &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) &&
      lines[i].trim() !== "---"
    ) {
      pLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: pLines.join(" ") });
  }

  return blocks;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  // Regex to match **bold**, *italic*, `code`, and [links](url)
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);

  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return (
        <em key={idx} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      );
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={idx}
          className="rounded-sm bg-slate-100 px-1.5 py-0.5 font-mono text-[12.5px] font-semibold text-[#013089]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          className="font-semibold text-[#013089] hover:underline"
          target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
          rel={linkMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return token;
  });
}
