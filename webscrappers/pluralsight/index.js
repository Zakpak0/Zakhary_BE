import https from "https";
const getPluralsightInfo = {
  currentlyLearning: (callback) =>
    https.get(
      "https://app.pluralsight.com/profile/data/currentlylearning/83b81959-5219-4864-a1f6-00bfa47c976f",
      (response) => {
        let body = "";
        response.on("data", (data) => {
          body += data;
        });
        response.on("close", (join) => {
          body = JSON.parse(body);
          return callback(body);
        });
      }
    ),
  badges: (callback) =>
    https.get(
      "https://app.pluralsight.com/profile/data/badges/83b81959-5219-4864-a1f6-00bfa47c976f",
      (response) => {
        let body = "";
        response.on("data", (data) => {
          body += data;
        });
        response.on("close", (join) => {
          body = JSON.parse(body);
          return callback(body);
        });
      }
    ),
  completedCoures: (callback) =>
    https.get(
      "https://app.pluralsight.com/profile/data/completedcourses/83b81959-5219-4864-a1f6-00bfa47c976f",
      (response) => {
        let body = "";
        response.on("data", (data) => {
          body += data;
        });
        response.on("close", (join) => {
          body = JSON.parse(body);
          return callback(body);
        });
      }
    ),
  activityInsigts: (callback) =>
    https.get(
      "https://app.pluralsight.com/profile/data/activityinsights/83b81959-5219-4864-a1f6-00bfa47c976f",
      (response) => {
        let body = "";
        response.on("data", (data) => {
          body += data;
        });
        response.on("close", (join) => {
          body = JSON.parse(body);
          return callback(body);
        });
      }
    ),
};

export const {
  currentlyLearning,
  completedCoures,
  badges,
  activityInsigts,
} = getPluralsightInfo;
