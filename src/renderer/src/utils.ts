import axios from "axios";
import { ENDPOINT } from "./constants.js";

export const iconify = axios.create({
  baseURL: ENDPOINT
})