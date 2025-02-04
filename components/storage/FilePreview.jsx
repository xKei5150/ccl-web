import { Eye } from "lucide-react";

export function FilePreview({ file }) {
  if (file.type.startsWith("image/")) {
    return (
      <img
        src={file.url}
        alt={file.name}
        className="w-full h-48 object-cover rounded-md"
      />
    );
  } else if (file.type.startsWith("video/")) {
    return (
      <video
        src={file.url}
        controls
        className="w-full h-48 object-cover rounded-md"
      />
    );
  } else if (file.type.startsWith("audio/")) {
    return <audio src={file.url} controls className="w-full mt-2" />;
  } else {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
        <Eye className="w-8 h-8 text-gray-400" />
      </div>
    );
  }
}