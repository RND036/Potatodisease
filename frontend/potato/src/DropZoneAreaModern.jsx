// DropzoneAreaModern.jsx
import React from "react";
import { useDropzone } from "react-dropzone";
import { Typography, Box } from "@mui/material";

const DropzoneAreaModern = ({ onChange }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles); // same as DropzoneArea onChange
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 2,
        padding: 4,
        textAlign: "center",
        backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="body1" color="textSecondary">
        Drag and drop an image of a potato plant leaf to process, or click to select a file
      </Typography>
    </Box>
  );
};

export default DropzoneAreaModern;
