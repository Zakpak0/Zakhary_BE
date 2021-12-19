import http from "http";
import url from "url";
import { verifyId } from "./googleapis/gmail/service.js";
import { listEvents } from "./googleapis/googlecalendar/index.js";
import { mapGithubData } from "./webscrappers/github/service.js";
import { mapLeetcodeData } from "./webscrappers/leetcode/service.js";
import { mapPluralsightData } from "./webscrappers/pluralsight/service.js";
import { useGoogleCalendarService } from "./googleapis/googlecalendar/service.js";
const init = async () => {
  const server = http.createServer();
  const PORT = 3200;
  server.on("request", (request, response) => {
    const parsedUrl = url.parse(request.url, true);
    console.log(request.method);
    console.log(parsedUrl.pathname);
    if (
      request.method === "GET" &&
      parsedUrl.pathname === "/confirmappointment"
    ) {
      const { id, event } = parsedUrl.query;
      verifyId(id, (callback) => {
        if (callback) {
          response.setHeader("Content-Type", "text/html", "charset=utf-8");
          response.statusCode = 201;
          response.write(`
                        <html>
                        <h1>Thanks for Confirming your Appointment</h1>
                        <html>`);
          response.end();
          createEvent(event, (response) => {
            return console.log(response);
          });
        }
      });
    }
    if (request.method === "GET" && parsedUrl.pathname === "/listevents") {
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.statusCode = 201;
      listEvents((callback) => {
        response.write(callback);
        response.end();
      });
    }
    if (request.method === "GET" && parsedUrl.pathname === "/github") {
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.statusCode = 201;
      let responseData = [];
      let timeout = setTimeout(() => {
        response.write(JSON.stringify(responseData));
        response.end();
      }, 10000);
      mapGithubData(
        (repo) => {
          responseData.push({ Repo_Data: repo });
          if (responseData.length == 3) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        },
        (repoCount) => {
          responseData.push({ Repo_Count_Data: repoCount });
          if (responseData.length == 3) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        },
        (contributions) => {
          responseData.push({ Contributions_Data: contributions });
          if (responseData.length == 3) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        }
      );
    }
    if (request.method === "GET" && parsedUrl.pathname === "/pluralsight") {
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.statusCode = 201;
      let responseData = [];
      let timeout = setTimeout(() => {
        response.write(JSON.stringify(responseData));
        response.end();
      }, 10000);
      mapPluralsightData(
        (courseData) => {
          responseData.push({ Course_Data: courseData });
          if (responseData.length == 4) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        },
        (learningData) => {
          responseData.push({ Learning_Data: learningData });
          if (responseData.length == 4) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        },
        (badgeData) => {
          responseData.push({ Badge_Data: badgeData });
          if (responseData.length == 4) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        },
        (activityData) => {
          responseData.push({ Activity_Data: activityData });
          if (responseData.length == 4) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        }
      );
    }
    if (request.method === "GET" && parsedUrl.pathname === "/leetcode") {
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.statusCode = 201;
      let responseData = [];
      let timeout = setTimeout(() => {
        response.write(JSON.stringify(responseData));
        response.end();
      }, 10000);
      mapLeetcodeData((recentSubs) => {
        responseData.push({ Recent_Subs: recentSubs });
        if (responseData.length == 1) {
          clearTimeout(timeout);
          response.write(JSON.stringify(responseData));
          response.end();
        }
      });
    }
    if (
      request.method === "POST" &&
      parsedUrl.pathname === "/makeappointment"
    ) {
      console.log(request.headers);
      useGoogleCalendarService(body, (callback) => {
        console.log(callback);
      });
    }
  });

  server.listen(PORT, console.log(`API is now running on port ${PORT}`));
};
init();
