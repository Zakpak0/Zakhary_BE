import fs from "fs";
import readline from "readline";
import { google, GoogleApis } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://mail.google.com/",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
const getGoogleServiceWithAuth = (service) => {
  fs.readFile("zakharyoliver.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), service);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    console.log(credentials);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
};
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export const createEvent = (event, callback) => {
  const service = (auth) => {
    let {
      summary = "Text event",
      location = "Remote",
      description = "A test for the google calendar API",
      start = {
        dateTime: "2021-11-20T09:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      end = {
        dateTime: "2021-11-21T17:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      recurrence,
      attendees = [],
      reminders = {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    } = event;
    google.calendar({ version: "v3", auth }).events.insert(
      {
        calendarId: "primary",
        resource: {
          summary,
          location,
          description,
          start,
          end,
          recurrence,
          attendees,
          reminders,
        },
      },
      (err, res) => {
        if (err) return console.log(err);
        if (res) return callback(res);
      }
    );
  };
  getGoogleServiceWithAuth(service);
};

export const listEvents = (callbackData) => {
  const service = (auth) => {
    const calendar = google.calendar({ version: "v3", auth });
    const callCalendar = (calendarId, callback) => {
      calendar.events.list(
        {
          calendarId: calendarId,
          timeMin: new Date(),
          singleEvents: true,
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          if (res) {
            console.log(res);
            let {
              data: { items },
            } = res;
            if (!items.length) {
              callback("No upcoming events");
            } else {
              let dates = items.map((appointment) => {
                let start = {
                  date: {
                    day: new Date(appointment.start.dateTime).getDate(),
                    month: new Date(appointment.start.dateTime).getMonth() + 1,
                    year: new Date(appointment.start.dateTime).getFullYear(),
                    date: `${new Date(appointment.start.dateTime).getMonth() +
                      1}/${new Date(
                      appointment.start.dateTime
                    ).getDate()}/${new Date(
                      appointment.start.dateTime
                    ).getFullYear()}`,
                  },
                  time: new Date(appointment.start.dateTime)
                    .toLocaleTimeString()
                    .split(" ")[0],
                };
                let end = {
                  date: {
                    day: new Date(appointment.end.dateTime).getDate(),
                    month: new Date(appointment.end.dateTime).getMonth() + 1,
                    year: new Date(appointment.end.dateTime).getFullYear(),
                    date: `${new Date(appointment.end.dateTime).getMonth() +
                      1}/${new Date(
                      appointment.end.dateTime
                    ).getDate()}/${new Date(
                      appointment.end.dateTime
                    ).getFullYear()}`,
                  },
                  time: new Date(appointment.end.dateTime)
                    .toLocaleTimeString()
                    .split(" ")[0],
                };
                return {
                  start,
                  end,
                };
              });
              callback(dates);
            }
          } else {
            console.log("No upcoming events found.");
          }
        }
      );
    };
    let bothItems = [];
    let i = 0;
    callCalendar("ZakharyOliver808@gmail.com", (callback) => {
      if (callback == "No upcoming events") {
        i++;
        if (i == 2) {
          callbackData(JSON.stringify(bothItems));
        }
      } else {
        for (let items of callback) {
          bothItems.push(items);
        }
        i++;
        if (i == 2) {
          callbackData(JSON.stringify(bothItems));
        }
      }
    });
    callCalendar("primary", (callback) => {
      if (callback == "No upcoming events") {
        i++;
        if (i == 2) {
          callbackData(JSON.stringify(bothItems));
        }
      } else {
        for (let items of callback) {
          bothItems.push(items);
        }
        i++;
        if (i == 2) {
          callbackData(JSON.stringify(bothItems));
        }
      }
    });
  };
  getGoogleServiceWithAuth(service);
};
