import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = [...Array.from(files ?? [])];
      if (fileArray.length > 4) {
        toast.error(`You can only upload up to 4 media files`);
        return;
      }
      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload only image files");
          return false;
        }
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`File size should be less than 2MB`);
          return false;
        }
        return true;
      });
      setSelectedFiles([]);
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFiles((prev) => [
            ...prev,
            { file, preview: reader.result as string },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);
  return { selectedFiles, setSelectedFiles, handleFiles };
}
