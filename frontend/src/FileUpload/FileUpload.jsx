import React, { useEffect, useRef, useState } from "react";
import "./FileUpload.css";
import axios from "axios";
import UploadedFilesList from "./UploadedFilesList";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import {
  doc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";

const FileUpload = (props) => {
  const inputRef = useRef();
  const botTokenRef = useRef(null);
  const channelIdRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [uploadedFiles, setUploadedFiles] = useState(
    JSON.parse(localStorage.getItem("uploadedFiles")) || []
  );
  const [botToken, setBotToken] = useState("");
  const [channelId, setChannelId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const user = auth.currentUser;
      if (user) {
        const firestore = getFirestore();
        const userCollectionRef = collection(
          firestore,
          `users/${user.uid}/files`
        );
        const querySnapshot = await getDocs(userCollectionRef);
        const files = querySnapshot.docs.map((doc) => doc.data());
        setUploadedFiles(files);
        localStorage.setItem("uploadedFiles", JSON.stringify(files));
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleUpload = async () => {
    if (!props.name) {
      navigate("/login");
      return;
    }

    if (!botToken || !channelId) {
      if (!botToken) {
        botTokenRef.current.focus();
      } else {
        channelIdRef.current.focus();
      }

      setErrorMessage(
        "Please fill in the BOT_TOKEN and Channel ID before uploading a file."
      );
      return;
    } else {
      setErrorMessage("");
    }

    if (uploadStatus === "done") {
      clearFileInput();
      return;
    }

    try {
      setUploadStatus("uploading");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        `/api/upload?botToken=${botToken}&channelId=${channelId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/ form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      const { fileName, fileHash, fileSize } = response.data;

      const user = auth.currentUser;
      if (user) {
        const firestore = getFirestore();
        const userCollectionRef = collection(
          firestore,
          `users/${user.uid}/files`
        );
        const fileDocRef = doc(userCollectionRef);

        await setDoc(fileDocRef, {
          fileHash,
          fileName,
          fileSize,
        });
      }

      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        { fileName, fileHash, fileSize },
      ]);
      setUploadStatus("done");
    } catch (error) {
      setUploadStatus("select");
      setErrorMessage(
        "An error occurred during file upload. Please try again."
      );
    }
  };

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <h3>
            Welcome{" "}
            {props.name ? (
              props.name
            ) : (
              <span className="text-muted">Guest</span>
            )}
          </h3>
        </div>
        <div className="header-right">
          {props.name ? (
            <button className="btn btn-logout" onClick={handleSignOut}>
              Logout
            </button>
          ) : (
            <button className="btn btn-login" onClick={handleLogin}>
              Sign Up / Login
            </button>
          )}
        </div>
      </header>
      <div className="input-container">
        <div className="input-field">
          <label htmlFor="botToken">BOT_TOKEN</label>
          <input
            type="text"
            id="botToken"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
            placeholder="Enter BOT_TOKEN"
            ref={botTokenRef}
          />
        </div>
        <div className="input-field">
          <label htmlFor="channelId">Channel ID</label>
          <input
            type="text"
            id="channelId"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="Enter Channel ID"
            ref={channelIdRef}
          />
        </div>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="file-upload-area">
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {!selectedFile && (
          <button
            className="file-btn"
            onClick={!props.name ? handleLogin : onChooseFile}
          >
            <span className="material-symbols-outlined">upload</span> Upload
            File
          </button>
        )}
        {selectedFile && (
          <>
            <div className="file-card">
              <span className="material-symbols-outlined icon">
                description
              </span>
              <div className="file-info">
                <div style={{ flex: 1 }}>
                  <h6>{selectedFile?.name}</h6>
                  <div className="progress-bg">
                    <div
                      className="progress"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {uploadStatus === "select" ? (
                  <button onClick={clearFileInput}>
                    <span className="material-symbols-outlined close-icon">
                      close
                    </span>
                  </button>
                ) : (
                  <div className="check-circle">
                    {uploadStatus === "uploading" ? (
                      `${progress}%`
                    ) : uploadStatus === "done" ? (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "20px" }}
                      >
                        check
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            <button className="upload-btn" onClick={handleUpload}>
              {uploadStatus === "select" || uploadStatus === "uploading"
                ? "Upload"
                : "Done"}
            </button>
          </>
        )}
      </div>
      <div className="file-list-container">
        {<UploadedFilesList
          uploadedFiles={uploadedFiles}
          botToken={botToken}
          channelId={channelId}
        />}
      </div>
    </div>
  );
};

export default FileUpload;
