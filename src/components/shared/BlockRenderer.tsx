import { levelFontSize, levelMap } from "@/lib/helper";
import { Heading, Text } from "@chakra-ui/react";
import React from "react";

const renderContent = (content: any) =>
  content?.map((c: any, idx: any) => {
    const style: any = {}

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


const BlockRenderer = ({ blocks }: any) => {
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
      {parsedBlocks?.map((block: any) => {
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
                {block.items?.map((item: any, idx: any) => (
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