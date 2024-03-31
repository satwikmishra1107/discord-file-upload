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
// import { auth } from "../Firebase";
// import { collection, getDocs, getFirestore } from "firebase/firestore";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#F1EFFF", // Purple background
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const StyledFileName = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main, // Purple color
}));

const StyledFileSize = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary, // Secondary text color
}));

const StyledDownloadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.primary.main, // Purple background
  color: "#FFF", // White text color
  "&:hover": {
    backgroundColor: theme.palette.primary.dark, // Darker purple on hover
  },
}));

const UploadedFilesList = ({uploadedFiles}) => {
  const [downloadProgress, setDownloadProgress] = useState({});

  const handleDownload = async (fileName, fileHash, fileSize) => {
    try {
      setDownloadProgress((prevState) => ({
        ...prevState,
        [fileHash]: 0,
      }));
      const response = await fetch(
        `https://two5mb.onrender.com/api/retrieve/${fileHash}?fileSize=${fileSize}&fileName=${fileName}`,
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
                          style={{ color: "#FFF" }} // White progress indicator
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
