import { useEffect, useRef, useState } from "react";
import { useSelectedUser } from "../context/useSelectedUser";
import useSendMessages from "../Hooks/useSendMessages";
import { Image, Loader, Send, Smile, X } from "lucide-react";
import CustomEmojiPicker from "./emojiPicker";

const MessageInput = () => {
  const { selectedUser } = useSelectedUser();
  const { sendMessages, error, sending } = useSendMessages();
  const [messageData, setMessageData] = useState({ message: "" });
  const [fileData, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null); // New ref for the picker itself

  const emojiButtonRef = useRef(null);

  // Cleanup
  useEffect(() => {
    return () => {
      setShowPicker(false);
    };
  }, []);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target) &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const addEmoji = (emoji) => {
    setMessageData((prev) => ({
      ...prev,
      message: prev.message + emoji.emoji,
    }));
  };

  const toggleEmojiPicker = () => {
    setShowPicker(!showPicker);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("message", messageData.message);
    if (fileData) {
      submitData.append("file", fileData);
    }
    submitData.append("recieverId", selectedUser._id);
    console.log("submitData:", submitData);
    await sendMessages(submitData);

    // Reset form
    setMessageData({ message: "" });
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (sending) {
    return <Loader className="size-10 animate-spin" />;
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            name="message"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={messageData.message}
            onChange={handleChange}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="button"
          ref={emojiButtonRef}
          className="hidden sm:flex btn btn-circle text-zinc-400"
          onClick={toggleEmojiPicker}
        >
          <Smile size={20} />
        </button>

        {showPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-16 right-16 z-10"
          >
            <CustomEmojiPicker onSelect={addEmoji} />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error?.message || "Something went wrong!"}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!messageData.message.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error?.message || "Something went wrong!"}
        </p>
      )}
    </div>
  );
};

export default MessageInput;
