import axios from "axios";

export const api = axios.create({
  baseURL: "https://provadev.xlab.digital/api/v1",
});

export const apiClients = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});
