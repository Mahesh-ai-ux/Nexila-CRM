import React, { useState, useRef } from "react";
import { Input, Tag } from "antd";
import type { InputRef } from "antd";

interface TagInputProps {
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  name?: string; // 👈 to identify which field in parent (optional)
}

const CommonTagInputs: React.FC<TagInputProps> = ({
  initialTags = [],
  onTagsChange,
  // name = "tags",
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef | null>(null);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    onTagsChange?.(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      const newTags = [...tags, trimmedValue];
      setTags(newTags);
      onTagsChange?.(newTags); // Notify parent
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleInputConfirm();
    }
  };

  return (
    <div
      className="common-tag-input"
    
    >
      {tags.map((tag) => (
        <Tag key={tag} closable onClose={() => handleClose(tag)}>
          {tag}
        </Tag>
      ))}

      <Input
        ref={inputRef}
        type="text"
        size="small"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleInputConfirm}
        placeholder="Add a tag"
        style={{ flex: 1, minWidth: 120, border: "none", outline: "none" }}
      />
    </div>
  );
};

export default CommonTagInputs;
