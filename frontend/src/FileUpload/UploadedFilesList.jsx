import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  styled,
} from "@mui/material";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#F1EFFF",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: "80%", // Increased width
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Added box shadow
  transition: "transform 0.3s, box-shadow 0.3s", // Added transition for hover effect
  "&:hover": {
    transform: "translateY(-5px)", // Lifted up on hover
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)", // Stronger box shadow on hover
  },
}));

const StyledFileName = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const StyledFileSize = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const StyledDownloadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: "#FFF",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const UploadedFilesList = ({ uploadedFiles, botToken, channelId }) => {
  const [downloadProgress, setDownloadProgress] = useState({});

  const handleDownload = async (fileName, fileHash, fileSize) => {
    try {
      setDownloadProgress((prevState) => ({
        ...prevState,
        [fileHash]: 0,
      }));
      const response = await fetch(
        `http://localhost:8000/api/retrieve/${fileHash}?fileSize=${fileSize}&fileName=${fileName}&botToken=${botToken}&channelId=${channelId}`,
        {
          method: "GET",
          responseType: "blob",
          onProgress: (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setDownloadProgress((prevState) => ({
                ...prevState,
                [fileHash]: progress,
              }));
            }
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${fileName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Error downloading file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setDownloadProgress((prevState) => ({
        ...prevState,
        [fileHash]: 0,
      }));
    }
  };

  return (
    <StyledBox>
      <Typography variant="h5" gutterBottom>
        Uploaded Files
      </Typography>
      <List>
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file, index) => (
            <StyledCard key={index}>
              <CardContent>
                <StyledFileName variant="h6" gutterBottom>
                  {file.fileName}
                </StyledFileName>
                <StyledFileSize variant="body2">
                  File Size: {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                </StyledFileSize>
                <Divider />
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <StyledDownloadButton
                      variant="contained"
                      onClick={() =>
                        handleDownload(
                          file.fileName,
                          file.fileHash,
                          file.fileSize
                        )
                      }
                      disabled={downloadProgress[file.fileHash] > 0}
                    >
                      {downloadProgress[file.fileHash] > 0 ? (
                        <CircularProgress
                          variant="determinate"
                          value={downloadProgress[file.fileHash]}
                          size={24}
                          style={{ color: "#FFF" }}
                        />
                      ) : (
                        "Download"
                      )}
                    </StyledDownloadButton>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          ))
        ) : (
          <Typography variant="body1">No files uploaded yet.</Typography>
        )}
      </List>
    </StyledBox>
  );
};

export default UploadedFilesList;
