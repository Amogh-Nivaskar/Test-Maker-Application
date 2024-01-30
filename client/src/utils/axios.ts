import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "http://localhost:8000",
  //   headers: { "X-Custom-Header": "foobar" },
});

export default AxiosClient;
