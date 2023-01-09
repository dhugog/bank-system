import { Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { login } from "../../../features/auth/authActions";

import styles from "./Login.module.css";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(login({ email, password }));
  };

  return (
    <>
      <div className={styles.header}>
        <Typography variant="h5">BNB Bank</Typography>
      </div>

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          sx={{ mt: 3, mb: 2 }}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className="submit"
        >
          Sign in
        </Button>

        <Link to="/register">Don't have an account?</Link>
      </form>
    </>
  );
};

export default Login;
