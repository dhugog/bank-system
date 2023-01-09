import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";

const FileInput = (props: {
  text?: string;
  onChange: (file: File | null) => void;
}) => {
  const { text, onChange } = props;

  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string | null>();

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <>
      <Button variant="contained" component="label" sx={{ mt: 1 }}>
        {text ?? "Upload File"}
        <input
          accept="image/*"
          type="file"
          id="select-image"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.length ? e.target.files[0] : null;

            setSelectedImage(file);
            onChange(file);
          }}
        />
      </Button>

      {imageUrl && selectedImage && (
        <Box mt={2} textAlign="center">
          <img src={imageUrl} alt={selectedImage.name} height="100px" />
        </Box>
      )}
    </>
  );
};

export default FileInput;
