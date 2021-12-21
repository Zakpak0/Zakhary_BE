import http from "http";
import url from "url";
import {CTjson, CThtml, AC, RC, SendResponse} from "./lib/helpers.js"
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
    try {
      if (
        request.method === "GET" &&
        parsedUrl.pathname === "/confirmappointment"
      ) {
        const { id, event } = parsedUrl.query;
        verifyId(id, (callback) => {
          if (callback) {
            CThtml
            RC(200)
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
        CTjson
        AC
        RC(201)
        SendResponse(listEvents, ["events"])
      }
      if (request.method === "GET" && parsedUrl.pathname === "/github") {
        CTjson
        AC
        RC(201)
        SendResponse(mapGithubData, ["Repo_Data", "Repo_Count_Data", "Contributions_Data"])
      }
      if (request.method === "GET" && parsedUrl.pathname === "/pluralsight") {
        CTjson
        AC
        RC(201)
        SendResponse(mapPluralsightData, ["courseData", "learningData", "badgeData", "activityData"])
      }
      if (request.method === "GET" && parsedUrl.pathname === "/leetcode") {
        CTjson
        AC
        RC(201)
        SendResponse(mapLeetcodeData, ["Recent_Subs"])
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
    } catch (e) {
      console.log("Sever returned an error:", e)
    }
  });

  server.listen(PORT, console.log(`API is now running on port ${PORT}`));
};
init();
