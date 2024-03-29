import React, { useState } from "react";
import * as Components from "./Component";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

function App() {
  const [signIn, toggle] = useState(true);
  const [user, setUser] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [SubmitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const getUserData = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = user;

    if (email === "" || password === "") {
      setErrorMessage("Please enter a valid email");
      return;
    }

    setErrorMessage("");
    const name = email.split("@")[0];

    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        setSubmitButtonDisabled(false);

        await updateProfile(res.user, { displayName: name });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setSubmitButtonDisabled(false);
        setErrorMessage(err.message);
      });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = user;

    if (email === "" || password === "") {
      setErrorMessage("Please enter a valid email");
      return;
    }

    setErrorMessage("");

    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        setSubmitButtonDisabled(false);

        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setSubmitButtonDisabled(false);
        setErrorMessage(err.message);
      });
  };

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form onSubmit={handleSignUpSubmit}>
          <Components.Title>Create Account</Components.Title>
          <Components.Input
            type="email"
            placeholder="Email"
            name="email"
            onChange={getUserData}
          />
          <Components.Input
            type="password"
            placeholder="Password"
            name="password"
            onChange={getUserData}
            required
          />
          <Components.Text>{errorMessage}</Components.Text>
          <Components.Button type="submit" disabled={SubmitButtonDisabled}>
            Sign Up
          </Components.Button>
          <Components.Button>Google</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn}>
        <Components.Form onSubmit={handleSignInSubmit}>
          <Components.Title>Sign in</Components.Title>
          <Components.Input
            type="email"
            placeholder="Email"
            name="email"
            onChange={getUserData}
          />
          <Components.Input
            type="password"
            placeholder="Password"
            name="password"
            onChange={getUserData}
            required
          />
          <Components.Text>{errorMessage}</Components.Text>
          <Components.Anchor href="#">Forgot your password?</Components.Anchor>
          <Components.Button type="submit" disabled={SubmitButtonDisabled}>
            Sign In
          </Components.Button>
          <Components.Button>Google</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter Your personal details and start journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Sign Up
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default App;
