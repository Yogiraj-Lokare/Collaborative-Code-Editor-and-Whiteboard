import axios from "axios";

export const logout = () => {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  window.location.reload();
};

export const SetTokenHeader = () => {
  let token = localStorage.getItem("token");
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
