import { useEdgeStore } from '@/lib/edgestore';
import { useState } from 'react';

type ImagesComponentProps = {
  images: string[]; // Define the prop type as an array of strings
};
const FileUpload: React.FC<ImagesComponentProps> = ({ images }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const { edgestore } = useEdgeStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const setUrls = ({ url, thumbnailUrl }: { url: string; thumbnailUrl: string }) => {
    setImageUrl(url);
    setThumbnailUrl(thumbnailUrl ?? '');  // Provide a fallback value if thumbnailUrl is null
    images.push(imageUrl)
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button
        className='bg-white text-black rounded px-2 hover:opacity-80'
        onClick={async () => {
          if (file) {
            try {
              const res = await edgestore.myPublicImages.upload({ file });
              setUrls({
                url: res.url,
                thumbnailUrl: res.thumbnailUrl ?? '',  // Fallback in case of null
              });
            } catch (error) {
              console.error('Upload failed', error);
            }
          }
        }}
      >
        Upload
      </button>

      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" />
        </div>
      )}

      {thumbnailUrl && (
        <div>
          <h3>Thumbnail:</h3>
          <img src={thumbnailUrl} alt="Thumbnail" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
