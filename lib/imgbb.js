// Simple and reliable ImgBB uploader
export const uploadToImgBB = async (file) => {
  try {
    console.log("Starting image upload...", file.name, file.size);

    // Validate file
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image size must be less than 10MB");
    }

    // Convert to base64
    const base64Image = await fileToBase64(file);

    const formData = new FormData();
    formData.append("image", base64Image);

    console.log("Uploading to ImgBB...");

    const response = await fetch(
      "https://api.imgbb.com/1/upload?key=3d22f18006a97fc938618785afdd0477",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("ImgBB response:", data);

    if (data.success) {
      return {
        success: true,
        url: data.data.url,
        display_url: data.data.display_url,
        delete_url: data.data.delete_url,
        thumb: data.data.thumb?.url || data.data.url,
      };
    } else {
      throw new Error(data.error?.message || "Upload failed");
    }
  } catch (error) {
    console.error("ImgBB upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Simple image optimization
export const optimizeImage = async (file, maxWidth = 1200) => {
  return new Promise((resolve) => {
    // If file is small, return as-is
    if (file.size < 500000) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const optimizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            console.log(
              `Optimized: ${file.size} → ${optimizedFile.size} bytes`
            );
            resolve(optimizedFile);
          },
          "image/jpeg",
          0.8
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
