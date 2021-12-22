import React from "react";
import ReactDOM from "react-dom";
import Homepage from "./templates/Homepage.jsx";
import ReactDOMServer from "react-dom/server.js"
import http from "http";
import url, { fileURLToPath } from "url";
import fs from "fs"
import path from "path"
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
    /**
  response.setHeader("Content-Type", "application/json")
  @abstract CTjson
  */
    const CTjson = response.setHeader("Content-Type", "application/json");

    /** 
    response.setHeader("Content-Type", "text/html", "charset=utf-8") 
    @abstract CThtml 
    */
    const CThtml = response.setHeader("Content-Type", "text/html", "charset=utf-8")


    /** 
    const AC = response.setHeader("Access-Control-Allow-Origin", "*")
    @abstract AC 
    */
    const AC = response.setHeader("Access-Control-Allow-Origin", "*")



    /**
    @function 
    const RC = (code) => response.statusCode = code;
    @description
    Sets a status code response
    @param code
    The status code to return
    */
    const RC = (code) => response.statusCode = code;


    /**
    @function
    const SendResponse = (Function, DataPoints = [], response) => {
      let responseData = [];
      let timeout = setTimeout(() => {
        response.write(JSON.stringify(responseData));
        response.end();
      }, 10000);
      let Args = DataPoints.map((point) => {
        return (pointVar) => {
          let Object = `${point}: ${pointVar}`
          responseData.push({ Object });
          if (responseData.length == DataPoints.length) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        }
      })
      Function(...Args)
    }
    @description
    Calls a backend service that retrieves data from a 3rd party
    @param Function
    The backend service function to call
    @param DataPoints
    An array of Data Point arguments accepted by the back end services
    */
    const SendResponse = (Function, DataPoints = []) => {
      let responseData = [];
      let timeout = setTimeout(() => {
        response.write(JSON.stringify(responseData));
        response.end();
      }, 10000);
      let Args = DataPoints.map((point) => {
        return (pointVar) => {
          let data = Object.create({})
          data[`${point}`] = pointVar
          responseData.push(data);
          if (responseData.length == DataPoints.length) {
            clearTimeout(timeout);
            response.write(JSON.stringify(responseData));
            response.end();
          }
        }
      })
      Function(...Args)
    }
    const HTMLResponse = (file) => {
      let payload = ReactDOMServer.renderToString(file)
      response.write(payload)
      response.end()
    }
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
            response.write()
            response.end();
            createEvent(event, (response) => {
              return console.log(response);
            });
          }
        });
      }
      else if (request.method === "GET" && parsedUrl.pathname === "/listevents") {
        CTjson
        AC
        RC(201)
        SendResponse(listEvents, ["events"])
      }
      else if (request.method === "GET" && parsedUrl.pathname === "/github") {
        CTjson
        AC
        RC(201)
        SendResponse(mapGithubData, ["Repo_Data", "Repo_Count_Data", "Contributions_Data"])
      }
      else if (request.method === "GET" && parsedUrl.pathname === "/pluralsight") {
        CTjson
        AC
        RC(201)
        SendResponse(mapPluralsightData, ["courseData", "learningData", "badgeData", "activityData"])
      }
      else if (request.method === "GET" && parsedUrl.pathname === "/leetcode") {
        CTjson
        AC
        RC(201)
        SendResponse(mapLeetcodeData, ["Recent_Subs"])
      }
      else if (
        request.method === "POST" &&
        parsedUrl.pathname === "/makeappointment"
      ) {
        console.log(request.headers);
        useGoogleCalendarService(body, (callback) => {
          console.log(callback);
        });
      }
      else {
        HTMLResponse(<Homepage />)
      }
    } catch (e) {
      console.log("Sever returned an error:", e)
      response.write(`
                        <html>
                        <h1>Sorry there was an error processing your request</h1>
                        <html>`);
      response.end();
    }
  });

  server.listen(PORT, console.log(`API is now running on port ${PORT}`));
};
init();
