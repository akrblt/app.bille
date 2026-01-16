import http from "./httpClient";

export default {
  subscribe: (shiftId) =>
    http.post("/set-user-to-shift-insert", { shiftId }),

  unsubscribe: (shiftId) =>
    http.post("/set-user-to-shift-delete", { shiftId }),
};
