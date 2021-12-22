import { listEvents, createEvent } from "./index.js";
import appointmentConfirmationEmail from "../gmail/service.js";
import readline from "readline";

export const useGoogleCalendarServiceRl = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    `What Would you like to do?:
  List Events
  Create Event
> `,
    (answer) => {
      console.log(answer.trim().toLowerCase());
      if (answer.trim().toLowerCase() == "list events") {
        listEvents((response) => {
          return console.log(response), rl.close();
        });
      } else if (answer.trim().toLowerCase() == "create event") {
        let event = {
          summary: "undefined",
          location: "undefined",
          description: "undefined",
          start: { dateTime: "undefined" },
          end: { dateTime: "undefined" },
          recurrence: "undefined",
          attendees: "undefined",
          reminders: "undefined",
        };
        rl.question(`Summary > `, (response) => {
          event.summary = response;
          rl.question(`Location > `, (response) => {
            event.location = response;
            rl.question(`Description > `, (response) => {
              event.description = response;
              rl.question(
                `Start Date & Time 
  (Month Date, Year Hour:Minutes:Seconds)
> `,
                (response) => {
                  event.start.dateTime = new Date(`${response}`);
                  console.log(event.start.dateTime);
                  rl.question(
                    `End Date & Time 
  (Month Date, Year Hour:Minutes:Seconds)
> `,
                    (response) => {
                      event.end.dateTime = new Date(`${response}`);
                      rl.question("Email Address?", (response) => {
                        event.attendees = response;
                        console.log(event);
                        rl.question(
                          `Confirm? 
    (Yes or No)
  > `,
                          (response) => {
                            if (response.trim().toLowerCase() == "yes") {
                              rl.close();
                              appointmentConfirmationEmail(callback, email);
                              console.log(
                                "Appointment confirmed, creating event:"
                              );
                            } else {
                              return console.log("Cancelled");
                            }
                          }
                        );
                      });
                    }
                  );
                }
              );
            });
          });
        });
      }
    }
  );
};
export const useGoogleCalendarService = (body, reponse) => {
  appointmentConfirmationEmail(email, body, (callback) => {
    reponse(callback);
  });
};
