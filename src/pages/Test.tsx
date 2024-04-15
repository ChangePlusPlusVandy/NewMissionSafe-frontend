import React, { useEffect, useState } from "react";
import { getImage } from "../utils/formInterface";
import { useAuth } from "../AuthContext";
import { Image } from "@mantine/core";

const Test: React.FC = () => {
  const { currentUser } = useAuth();
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = await currentUser?.getIdToken();
        if (token) {
          const res = await getImage(
            "17131151687780_woman-standing-desk-illustration-1390x2048-mgojat4v.png",
            token
          );
          if (res) {
            const reader = res.getReader();
            const chunks: Uint8Array[] = [];
            let chunk;

            // Read the stream and collect chunks
            while (!(chunk = await reader.read()).done) {
              chunks.push(chunk.value);
            }

            // Concatenate all chunks into a single Uint8Array
            const imageData = new Uint8Array(
              chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0)
            );
            let offset = 0;
            for (const chunk of chunks) {
              imageData.set(chunk, offset);
              offset += chunk.byteLength;
            }

            // Convert Uint8Array to Base64 string
            const base64String = btoa(String.fromCharCode(...imageData));

            // Create data URL
            const url = `data:image/png;base64,${base64String}`;

            // Set the URL to state
            setImgUrl(url);
          }
          
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchImage();

    // Clean up the URL when component unmounts
    return () => {
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [currentUser]); // Add currentUser to dependencies array

  return (
    <div>
      {imgUrl && <Image w={"50%"} src={imgUrl} alt="Image" />}
    </div>
    
  )
};

export default Test;
