import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";


import { LoginUser } from "../core/api";
import { LoginInputs } from "../core/types";

import logo from "../logo.png";

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
    width: "50%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const LoginScreen: React.FC = () => {
  let history = useHistory();
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm<LoginInputs>();
  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    try {
      LoginUser(data);
      history.push("/main");
    } catch (error) {
      console.log(error);
    }
  }; // your form submit function which will invoke after successful validation

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <img src={logo} alt="Logo" />
        <Typography component="h1" variant="h3">
        Super Simplistic Storage Solution (S4)
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            inputRef={register({ required: true })}
          />
          {errors.name && <span>This field is required</span>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
};
