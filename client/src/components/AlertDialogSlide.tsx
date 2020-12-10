import React, { useEffect,useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import Share from "@material-ui/icons/Share";
import { useRootStore } from "../core/RootStateContext";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const [open, setOpen] = useState(false);
  const { filesStore } = useRootStore();
  useEffect(() => {
    filesStore.getAllUsers();
  }, []);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <Share />
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Share With"}</DialogTitle>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={filesStore.users}
          onChange={()=>{}}
          input={<input />}
        >
          {filesStore.users.map(user => (
          <MenuItem id={file.id} key={file.id} name={file.name} size={file.size} />
        ))}
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {}
        </Select>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
