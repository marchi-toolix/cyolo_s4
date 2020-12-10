import { User } from "./types";
import axios from "axios";

export const LoginUser = (data: User) => {
  fetch("http://localhost:8080/v1/login", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
};

export const UploadFile = (formData: FormData) => {
  return axios.put("http://localhost:8080/v1/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Auth: true,
    },
    withCredentials: true,
  });
};

export const GetFiles = () => {
  return axios.get("http://localhost:8080/v1/files", {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

export const GetFile = (fileId: string) => {
  return axios.get(`http://localhost:8080/v1/files/${fileId}`, {
    headers: {
      Auth: true,
    },
    withCredentials: true,
  });
};

export const GetAllUsers = () => {
  return axios.get(`http://localhost:8080/v1/users`, {
    headers: {
      Auth: true,
    },
    withCredentials: true,
  });
};

export const Share = (fileId: string) => {
  return axios.post(`http://localhost:8080/v1/Share`, {
    headers: {
      Auth: true,
    },
    withCredentials: true,
  });
};

export const DeleteFile = (fileId: string) => {
  console.log(fileId);
  
  return axios.delete(`http://localhost:8080/v1/files/${fileId}`, {
    headers: {
      Auth: true,
    },
    withCredentials: true,
  });
};


