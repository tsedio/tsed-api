import template from "./project.json";
export default {
  baseUrl: "/projects",
  jwt: {
    secret: process.env.FORMIO_JWT_SECRET || "--- change me now ---",
    expireTime: 240
  },
  root: {
    email: process.env.FORMIO_ROOM_EMAIL || "admin@tsed.io",
    password: process.env.FORMIO_ROOM_PASSWORD || "admin@tsed.io"
  },
  template
};
