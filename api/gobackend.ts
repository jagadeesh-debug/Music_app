import axios from "axios";
const goBackendApi = axios.create({
  baseURL: "http://localhost:8000",
});
export default goBackendApi;



