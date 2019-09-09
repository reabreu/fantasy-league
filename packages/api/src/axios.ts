import axios from "axios";
import { keys } from "./keys";

export const pandaScoreAxios = axios.create({
  baseURL: keys.pandaScoreURL,
  headers: {
    authorization: `Bearer ${keys.pandaScoreKEY}`
  }
});
