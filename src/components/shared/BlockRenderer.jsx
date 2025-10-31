import { levelFontSize, levelMap } from "@/lib/helper";
import { Heading, Text } from "@chakra-ui/react";
import React from "react";

/**
 * Renders an array of text fragments with inline style information.
 *
 * Each content fragment supports basic text formatting such as:
 * bold, italic, underline, and custom color.
 *
 * @param {Array<{ text: string, styles?: { bold?: boolean, italic?: boolean, underline?: boolean, color?: string } }>} content
 *   Array of text fragments to render.
 * @returns {JSX.Element[] | undefined} An array of styled <span> elements, or undefined if no content.
 *
 * @example
 * const content = [
 *   { text: "Hello", styles: { bold: true } },
 *   { text: " world", styles: { color: "teal" } },
 * ];
 * renderContent(content);
 */

const renderContent = (content) =>
  content?.map((c, idx) => {
    const style = {}

    if (c.styles?.bold) style.fontWeight = "bold";
    if (c.styles?.italic) style.fontStyle = "italic";
    if (c.styles?.underline) style.textDecoration = "underline";
    if (c.styles?.color) style.color = c.styles.color;

    return (
      <span key={idx} style={style}>
        {c.text}
      </span>
    );
  });

  
/**
 * Renders structured content blocks (e.g., paragraphs, headings, lists).
 *
 * Each block object may contain a type (e.g. "paragraph", "heading"),
 * and a `content` array compatible with `renderContent()`.
 *
 * @component
 * @param {Object} props
 * @param {Array<{ type: string, content: ReturnType<typeof renderContent> }>} props.blocks
 *   Array of block objects to render.
 * @returns {JSX.Element[]} Rendered block elements.
 *
 * @example
 * const blocks = [
 *   { type: "heading", content: [{ text: "Hello", styles: { bold: true } }] },
 *   { type: "paragraph", content: [{ text: "This is an example." }] }
 * ];
 * <BlockRenderer blocks={blocks} />;
 */

const BlockRenderer = ({ blocks }) => {
  let parsedBlocks = [];

  if (Array.isArray(blocks)) {
    parsedBlocks = blocks;
  }

  else if (blocks && typeof blocks.blocks === "string") {
    try {
      parsedBlocks = JSON.parse(blocks.blocks);
    } catch {
      parsedBlocks = [];
    }
  }

  else if (typeof blocks === "string") {
    try {
      parsedBlocks = JSON.parse(blocks);
    } catch {
      parsedBlocks = [];
    }
  }

  return (
    <>
      {parsedBlocks?.map((block) => {
        const style = {
          color:
            block.props?.textColor && block.props.textColor !== "default"
              ? block.props.textColor
              : undefined,
          backgroundColor:
            block.props?.backgroundColor && block.props.backgroundColor !== "default"
              ? block.props.backgroundColor
              : undefined,
          textAlign: block.props?.textAlignment || "left",
          marginBottom: "1em",
        };

        switch (block.type) {
          case "paragraph":
            return (
              <Text key={block.id} style={style}>
                {Array.isArray(block.content) && renderContent(block.content)}
                {block.children?.length > 0 && <BlockRenderer blocks={block.children} />}
              </Text>
            );

          case "heading":
            return (
              <Heading 
                as={levelMap[block.props?.level]} 
                fontSize={levelFontSize[block.props?.level]} 
                key={block.id} 
                style={style}
              >
                {Array.isArray(block.content) && renderContent(block.content)}
                {block.children?.length > 0 && <BlockRenderer blocks={block.children} />}
              </Heading>
            );

          case "list":
            const ListTag = block.props?.listType === "numbered" ? "ol" : "ul";
            return (
              <ListTag key={block.id} style={style}>
                {block.items?.map((item, idx) => (
                  <li key={idx}>
                    {renderContent(item)}
                    {/* If a list item has children, render them recursively */}
                    {block.children?.length > 0 && <BlockRenderer blocks={block.children} />}
                  </li>
                ))}
              </ListTag>
            );

          // Add more block types as needed
          default:
            return (
              <div key={block.id} style={style}>
                {Array.isArray(block.content) && renderContent(block.content)}
                {block.children?.length > 0 && <BlockRenderer blocks={block.children} />}
              </div>
            );
        }
      })}
    </>
  );
};

export default BlockRenderer;