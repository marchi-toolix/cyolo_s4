import React, { useCallback, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { useDropzone } from "react-dropzone";
import logo from "../logo.png";
import { UploadFile } from "../core/api";

import { observer } from "mobx-react";
import { useRootStore } from "../core/RootStateContext";
import FileCard from '../components/FileCard';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  files: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "1em",
  }
}));

const Main: React.FC = () => {
  const {filesStore} = useRootStore();
  const classes = useStyles();
  const onDrop = useCallback(async (acceptedFiles) => {
    let formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    const res = UploadFile(formData);
    if (res) {
      alert("Perfect! ");
    } else {
      alert("Oops! ");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  useEffect(() => {
    filesStore.loadFiles();    
  }, []);

  return  (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div className={classes.paper}>
        <img src={logo} alt="Logo" />
        <Typography component="h1" variant="h2">
          Super Simplistic Storage Solution (S4)
        </Typography>
        <Box>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop a filea here, or click to select file</p>
                )}
          </div>
        </Box>
      </div>
      <Box className={classes.files}>
        {filesStore.files.map(file => (
          <FileCard id={file.ID} key={file.id} name={file.name} size={file.size} />
        ))}
        </Box>
        </Container>
  );
};

export default observer(Main)
