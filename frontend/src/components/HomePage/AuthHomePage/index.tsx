import { Button } from "@chakra-ui/button";
import InputForm from "../../../ReusableComponents/InputForm";
import React from "react";
import { SERVER_URL } from "../../../Constants/Constants";
import "./index.css";
import axios from "axios";

const AuthHomePage = () => {
  return (
    <React.Fragment>
      <div className="main-container">
        <div className="main-card">
          <div className="card-header">Welcome</div>
          <LoginComponent />
          <hr />
          <RegisterComponent />
        </div>
      </div>
    </React.Fragment>
  );
};

export default AuthHomePage;

const LoginComponent = () => {
  const Login = async (e: any) => {
    e.preventDefault();

    const userData = {
      email: e.target.email.value.trim(),
      password: e.target.password.value.trim(),
    };

    const { data } = await axios.post(`${SERVER_URL}user/login/`, userData);
    if (data.Email && data.Email == userData.email && data.token != undefined) {
      login(data.Username, data.Email, data.token);
      window.location.reload();
    }
    e.target.email.value = "";
    e.target.password.value = "";
  };

  return (
    <React.Fragment>
      <form onSubmit={(e) => Login(e)}>
        <div style={{ width: "25vw" }}>
          {LoginFormParameters.map(({ key, name, type, placeholder }) => {
            return (
              <InputForm
                key={key}
                name={name}
                type={type}
                placeholder={placeholder}
              />
            );
          })}
        </div>
        <div className="button-container-auth">
          <div style={{ width: "15vw", textAlign: "center" }}>
            <Button
              type="submit"
              _hover={{ backgroundColor: "red.100" }}
              backgroundColor="red.300"
              className="button-style"
            >
              Login
            </Button>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

const RegisterComponent = () => {
  const ClearFields = (e: any) => {
    e.target.name.value = "";
    e.target.email.value = "";
    e.target.password.value = "";
    e.target.confirm_password.value = "";
  };
  const Register = async (e: any) => {
    e.preventDefault();
    if (e.target.password.value !== e.target.confirm_password.value) {
      ClearFields(e);
      return;
    }

    const userData = {
      username: e.target.name.value.trim(),
      email: e.target.email.value.trim(),
      password: e.target.password.value.trim(),
    };

    const { data } = await axios.post(`${SERVER_URL}user/signup/`, userData);
    if (data.Email && data.Email == userData.email && data.token != undefined) {
      login(data.Username, data.Email, data.token);
      window.location.reload();
      return;
    }
    ClearFields(e);
  };

  return (
    <React.Fragment>
      <form
        onSubmit={(e) => {
          Register(e);
        }}
      >
        <div style={{ width: "25vw", marginTop: "3vh" }}>
          {RegisterFormParameters.map(({ key, name, type, placeholder }) => {
            return (
              <InputForm
                key={key}
                name={name}
                type={type}
                placeholder={placeholder}
              />
            );
          })}
        </div>
        <div className="button-container-auth">
          <div style={{ width: "15vw", textAlign: "center" }}>
            <Button
              type="submit"
              backgroundColor="red.200"
              _hover={{ backgroundColor: "red.400" }}
              className="button-style"
            >
              Register
            </Button>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

const RegisterFormParameters = [
  {
    key: 1,
    name: "name",
    type: "text",
    placeholder: "Name",
  },
  {
    key: 2,
    name: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    key: 3,
    name: "password",
    type: "password",
    placeholder: "Add Password",
  },
  {
    key: 4,
    name: "confirm_password",
    type: "password",
    placeholder: "Confirm Password",
  },
];

const LoginFormParameters = [
  {
    key: 1,
    name: "email",
    type: "email",
    placeholder: "Email",
  },
  {
    key: 2,
    name: "password",
    type: "password",
    placeholder: "Password",
  },
];

const login = (Username: string, Email: string, token: string) => {
  localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("username", Username);
  localStorage.setItem("email", Email);
};
