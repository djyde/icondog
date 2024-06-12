import axios from "axios";
import { ENDPOINT } from "./constants";

export const iconify = axios.create({
  baseURL: ENDPOINT
})