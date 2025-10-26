import { useState, useRef, useEffect } from "react";
import { uploadToImgBB, optimizeImage } from "../../lib/imgbb";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
}) {
  const editorRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasLinks, setHasLinks] = useState(false);

  // Initialize editor content and check for links
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
    checkForLinks();
  }, [value]);

  // Check if content has links for highlighting
  const checkForLinks = () => {
    if (editorRef.current) {
      const hasLinks = editorRef.current.querySelectorAll("a[href]").length > 0;
      setHasLinks(hasLinks);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      checkForLinks();
    }
  };

  // FIXED: Better key handling - allow normal Enter key behavior
  const handleKeyDown = (e) => {
    // Allow normal Enter key behavior for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      // Let the browser handle the Enter key normally
      return;
    }

    // Shift+Enter for soft break (if needed)
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      execCommand("insertHTML", "<br>");
    }
  };

  // Fix: Better command execution
  const execCommand = (command, value = null) => {
    try {
      document.execCommand(command, false, value);
      editorRef.current.focus();
      handleInput();
    } catch (error) {
      console.log(`Command ${command} not supported`);
    }
  };

  // Fix: Insert HTML at cursor position properly
  const insertHTML = (html) => {
    try {
      document.execCommand("insertHTML", false, html);
      editorRef.current.focus();
      handleInput();
    } catch (error) {
      console.log("Error inserting HTML:", error);
    }
  };

  // Format actions
  const formatBold = () => execCommand("bold");
  const formatItalic = () => execCommand("italic");
  const formatUnderline = () => execCommand("underline");
  const formatStrike = () => execCommand("strikeThrough");

  // Alignment
  const alignLeft = () => execCommand("justifyLeft");
  const alignCenter = () => execCommand("justifyCenter");
  const alignRight = () => execCommand("justifyRight");

  // Lists
  const insertBulletList = () => execCommand("insertUnorderedList");
  const insertNumberedList = () => execCommand("insertOrderedList");

  // Links - IMPROVED with better UX
  const insertLink = () => {
    const selection = window.getSelection();
    if (!selection.toString().trim()) {
      alert("Please select some text to create a link");
      return;
    }

    const url = prompt("Enter URL:", "https://");
    if (url) {
      // Create link with better styling
      execCommand("createLink", url);

      // Style the newly created link
      setTimeout(() => {
        const links = editorRef.current.querySelectorAll("a");
        const lastLink = links[links.length - 1];
        if (lastLink) {
          lastLink.style.color = "#8b5cf6";
          lastLink.style.textDecoration = "underline";
          lastLink.style.fontWeight = "500";
          lastLink.target = "_blank"; // Open in new tab
          lastLink.rel = "noopener noreferrer";
        }
        handleInput();
      }, 100);
    }
  };

  const removeLink = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const link = range.startContainer.parentElement.closest("a");
      if (link) {
        // Extract text and replace link with just text
        const text = document.createTextNode(link.textContent);
        link.parentNode.replaceChild(text, link);
        handleInput();
      } else {
        alert("No link found at cursor position");
      }
    }
  };

  // IMPROVED: Better link detection and management
  const showLinkManager = () => {
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const link = range ? range.startContainer.parentElement.closest("a") : null;

    if (link) {
      // Edit existing link
      const currentUrl = link.href;
      const newUrl = prompt("Edit URL:", currentUrl);
      if (newUrl !== null) {
        link.href = newUrl;
        handleInput();
      }
    } else {
      // Create new link
      insertLink();
    }
  };

  // Colors
  const changeTextColor = () => {
    const color = prompt("Enter text color (name or hex):", "#000000");
    if (color) execCommand("foreColor", color);
  };

  const changeBackgroundColor = () => {
    const color = prompt("Enter background color (name or hex):", "#ffff00");
    if (color) execCommand("backColor", color);
  };

  // Clear formatting
  const clearFormatting = () => execCommand("removeFormat");

  // Insert horizontal line
  const insertHorizontalLine = () => {
    insertHTML(
      '<hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">'
    );
  };

  // Insert table
  const insertTable = () => {
    const rows = parseInt(prompt("Number of rows:", "3")) || 3;
    const cols = parseInt(prompt("Number of columns:", "3")) || 3;

    let tableHTML =
      '<table style="border-collapse: collapse; width: 100%; margin: 15px 0; border: 1px solid #ddd; background: white;">';

    // Create header row
    tableHTML += '<thead><tr style="background-color: #f8f9fa;">';
    for (let i = 0; i < cols; i++) {
      tableHTML += `<th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: 600;">Header ${
        i + 1
      }</th>`;
    }
    tableHTML += "</tr></thead>";

    // Create data rows
    tableHTML += "<tbody>";
    for (let i = 0; i < rows; i++) {
      tableHTML += "<tr>";
      for (let j = 0; j < cols; j++) {
        tableHTML += `<td style="border: 1px solid #ddd; padding: 12px; text-align: left;"><br></td>`;
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</tbody></table>";

    insertHTML(tableHTML);
  };

  // IMPROVED: Image upload handler - inserts at cursor position within text
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPEG, PNG, GIF, etc.)");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      console.log("Optimizing image...");
      const optimizedFile = await optimizeImage(file);
      console.log("Uploading to ImgBB...");
      const result = await uploadToImgBB(optimizedFile);

      if (result.success) {
        console.log("Image uploaded successfully:", result.url);

        // Create responsive image with better styling
        const imgHTML = `
          <div class="image-container" style="
            margin: 20px 0; 
            text-align: center;
            background: #f9fafb;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          ">
            <img 
              src="${result.url}" 
              alt="Uploaded image" 
              style="
                max-width: 100%; 
                height: auto; 
                border-radius: 8px; 
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                display: inline-block;
              "
              onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\\'color: #ef4444; padding: 20px;\\'>Image failed to load</p>'"
            />
            <div style="
              font-size: 12px; 
              color: #6b7280; 
              margin-top: 8px;
              font-style: italic;
            ">
              📸 Image uploaded via ImgBB
            </div>
          </div>
        `;

        // Insert image at current cursor position
        insertHTML(imgHTML);

        // Success message
        setTimeout(() => {
          alert("✅ Image uploaded and inserted successfully!");
        }, 300);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`❌ Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  // Insert line break (soft enter)
  const insertLineBreak = () => {
    insertHTML("<br>");
  };

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50 rounded-t-lg">
        <div className="flex flex-wrap gap-1 items-center">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={formatBold}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors font-bold border border-gray-300"
              title="Bold (Ctrl+B)"
            >
              B
            </button>
            <button
              type="button"
              onClick={formatItalic}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors italic border border-gray-300"
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <button
              type="button"
              onClick={formatUnderline}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors underline border border-gray-300"
              title="Underline (Ctrl+U)"
            >
              U
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={alignLeft}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Align Left"
            >
              ⬅
            </button>
            <button
              type="button"
              onClick={alignCenter}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Align Center"
            >
              ⏸
            </button>
            <button
              type="button"
              onClick={alignRight}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Align Right"
            >
              ➡
            </button>
          </div>

          {/* Lists */}
          {/* <div className="flex gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={insertBulletList}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              onClick={insertNumberedList}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Numbered List"
            >
              1. List
            </button>
          </div> */}

          {/* Colors */}
          {/* <div className="flex gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={changeTextColor}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300 text-red-500"
              title="Text Color"
            >
              A
            </button>
            <button
              type="button"
              onClick={changeBackgroundColor}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300 bg-yellow-200"
              title="Background Color"
            >
              A
            </button>
          </div> */}

          {/* Links - IMPROVED with visual feedback */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={showLinkManager}
              className={`px-3 py-2 rounded transition-colors border border-gray-300 ${
                hasLinks
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "hover:bg-gray-200"
              }`}
              title={hasLinks ? "Edit Link" : "Insert Link"}
            >
              🔗
            </button>
            <button
              type="button"
              onClick={removeLink}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Remove Link"
            >
              🚫
            </button>
          </div>

          {/* Tables & Lines */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={insertTable}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Insert Table"
            >
              📊
            </button>
            <button
              type="button"
              onClick={insertHorizontalLine}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Horizontal Line"
            >
              ➖
            </button>
            <button
              type="button"
              onClick={insertLineBreak}
              className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
              title="Line Break (Shift+Enter)"
            >
              ↵
            </button>
          </div>

          {/* Image Upload */}
          {/* <div className="flex gap-1">
            <label
              className={`px-3 py-2 rounded transition-colors border border-gray-300 cursor-pointer ${
                isUploading ? "bg-blue-200 text-blue-700" : "hover:bg-gray-200"
              }`}
            >
              {isUploading ? "📤 Uploading..." : "🖼️ Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div> */}

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={clearFormatting}
            className="px-3 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
            title="Clear Formatting"
          >
            🧹
          </button>
        </div>

        {/* Upload Status */}
        {isUploading && (
          <div className="mt-2 text-sm text-blue-600 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
            Uploading image to ImgBB...
          </div>
        )}
      </div>

      {/* Editor Area - FIXED: Enter key now works properly */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="min-h-[400px] p-6 focus:outline-none text-gray-800 text-lg leading-relaxed prose prose-lg max-w-none"
        style={{
          fontFamily: "'Inter', sans-serif",
          direction: "ltr",
          textAlign: "left",
          unicodeBidi: "plaintext",
          lineHeight: "1.6",
        }}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Editor Tips */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-500 flex flex-wrap gap-4">
          <span>
            💡 <strong>Tips:</strong>
          </span>
          <span>
            • Press <kbd className="px-1 bg-gray-200 rounded">Enter</kbd> for
            new paragraph
          </span>
          <span>
            • Press{" "}
            <kbd className="px-1 bg-gray-200 rounded">Shift + Enter</kbd> for
            line break
          </span>
          <span>• Select text and click 🔗 to add links</span>
          {/* <span>• Click 🖼️ to insert images anywhere</span> */}
        </div>
      </div>
    </div>
  );
}
