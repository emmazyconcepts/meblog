// Generate slug from title
export const generateSlug = (title) => {
  if (!title) return "untitled-post";

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Calculate reading time
export const calculateReadTime = (content) => {
  if (!content) return 1;

  try {
    // Remove HTML tags for accurate word count
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(words.length / wordsPerMinute));
  } catch (error) {
    return 1;
  }
};

// Safe date formatting function
export const formatDate = (dateString) => {
  if (!dateString) return "Recently";

  try {
    // Handle Firestore timestamps
    if (dateString && typeof dateString === "object" && dateString.toDate) {
      const date = dateString.toDate();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // Handle string dates
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Recently";
  }
};

// Extract plain text from HTML for excerpts
export const htmlToText = (html) => {
  if (!html) return "";

  try {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  } catch (error) {
    return html || "";
  }
};

// Generate excerpt from content
export const generateExcerpt = (content, length = 150) => {
  if (!content) return "No content available...";

  try {
    const text = htmlToText(content);
    return text.length > length ? text.substring(0, length) + "..." : text;
  } catch (error) {
    return "No content available...";
  }
};

// Generate keywords from title and excerpt
export const generateKeywords = (title, excerpt) => {
  const text = `${title || ""} ${excerpt || ""}`.toLowerCase();
  const words = text.split(/\s+/).filter((word) => word.length > 2);
  const uniqueWords = [...new Set(words)];
  return uniqueWords.slice(0, 20);
};
