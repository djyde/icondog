import { app } from "electron";
import path from "node:path";

export const iconSetPath = path.join(app.getPath('userData'), 'icons')
