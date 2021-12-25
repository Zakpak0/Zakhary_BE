import { getSubmissionShots } from "./index.js";

export const mapSubmissionShots = async (callback) => {
    await getSubmissionShots((shots) => {
        callback(shots)
    })
}