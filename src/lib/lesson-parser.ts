// src/lib/lesson-parser.ts

import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import * as pdfParse from "pdf-parse";

type Block = {
  type:
    | "HEADING"
    | "TEXT"
    | "IMAGE"
    | "BULLET_LIST"
    | "CALLOUT"
    | "SECTION";
  content?: string;
  imageUrl?: string;
};

export async function parseLessonDocument(
  filePath: string
): Promise<Block[]> {
  const ext = filePath.split(".").pop()?.toLowerCase();

  if (ext === "docx") return parseDocx(filePath);
  if (ext === "pdf") return parsePdf(filePath);

  const text = await fs.readFile(filePath, "utf8");
  return textToBlocks(text);
}

async function parseDocx(
  filePath: string
): Promise<Block[]> {
  const result = await mammoth.convertToHtml(
    { path: filePath },
    {
      convertImage: mammoth.images.inline(
        async (image) => {
          const buffer = await image.read(
            "base64"
          );

          const filename =
            "lesson-" +
            Date.now() +
            ".png";

          const uploadPath = path.join(
            process.cwd(),
            "public",
            "uploads",
            filename
          );

          await fs.writeFile(
            uploadPath,
            Buffer.from(buffer, "base64")
          );

          return {
            src: `/uploads/${filename}`,
          };
        }
      ),
    }
  );

  return htmlToBlocks(result.value);
}

async function parsePdf(
  filePath: string
): Promise<Block[]> {
  const buffer = await fs.readFile(filePath);
  const data = await (pdfParse as any)(buffer);

  return textToBlocks(data.text);
}

function htmlToBlocks(html: string): Block[] {
  const blocks: Block[] = [];

  const lines = html
    .replace(/<\/p>/g, "\n")
    .replace(/<\/h[1-6]>/g, "\n")
    .replace(/<\/li>/g, "\n")
    .split("\n");

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // IMAGE
    const img = line.match(
      /<img.*?src="(.*?)"/
    );

    if (img) {
      blocks.push({
        type: "IMAGE",
        imageUrl: img[1],
      });
      continue;
    }

    // HEADING
    if (line.match(/^<h[1-6]/)) {
      blocks.push({
        type: "HEADING",
        content: stripHtml(line),
      });
      continue;
    }

    // BULLET
    if (line.includes("<li")) {
      blocks.push({
        type: "BULLET_LIST",
        content: stripHtml(line),
      });
      continue;
    }

    blocks.push({
      type: "TEXT",
      content: stripHtml(line),
    });
  }

  return blocks;
}

function textToBlocks(text: string): Block[] {
  const blocks: Block[] = [];

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    blocks.push({
      type: "TEXT",
      content: line,
    });
  }

  return blocks;
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}