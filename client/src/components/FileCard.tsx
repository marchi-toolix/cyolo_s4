import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FileCardProps } from "../core/types";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import Share from "@material-ui/icons/Share";
import Delete from "@material-ui/icons/Delete";
import { useRootStore } from "../core/RootStateContext";
import AlertDialogSlide from './AlertDialogSlide'
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
    fontSize: "4em",
    display: "flex",
    placeContent: "center",
    placeItems: "center",
    margin: "0 auto",
  },
});

export default function FileCard({ name, size, id }: FileCardProps) {
  const { filesStore } = useRootStore();
    const { deleteFile } = filesStore
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActions style={{ direction: "rtl" }}>
        <Button size="small" color="primary">
          <AlertDialogSlide/>
        </Button>
        <Button onClick={()=>{
            console.log(id);
            deleteFile(id)
        }} size="small" color="primary">
          <Delete />
        </Button>
      </CardActions>
      <CardActionArea>
        <InsertDriveFile className={classes.media} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {size} bytes
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
