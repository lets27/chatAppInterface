import EmojiPicker from "emoji-picker-react";

const CustomEmojiPicker = ({ onSelect }) => (
  <EmojiPicker
    onEmojiClick={onSelect}
    width={300}
    height={350}
    previewConfig={{ showPreview: false }}
  />
);

export default CustomEmojiPicker;
