import { sendEmail } from "./index.js";

const createRandomID = Math.floor(Math.random(400 * 15));

const appointmentConfirmationEmail = (email, body, callback) => {
  if (email.length) {
    sendEmail(html, email, body, (response) => {
      callback(response);
    });
  }
  let html = `
  <div>
      <h1>Click Here to Confirm</h1>
      ${body}
      <button>
      <a
      href="http://192.168.1.14:3200/confirmappointment?id=${createRandomID}"
      >
      Yes
      <a/>
      </button> <button>No</button>
    </div>`;
};

export const verifyId = (id, callback) => {
  if (id == createRandomID) {
    callback(true);
  } else {
    callback(false);
  }
};

export default appointmentConfirmationEmail;
