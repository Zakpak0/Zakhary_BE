import {
  completedCoures,
  currentlyLearning,
  badges,
  activityInsigts,
} from "./index.js";

export const mapPluralsightData = (
  courseData,
  learningData,
  badgeData,
  activityData
) => {
  if (courseData) completedCoures((callback) => {
    let courseAnaylitcs = [];
    callback.map((course) => {
      let { level, authors, title, timeCompleted, slug } = course;
      let { displayName } = authors[0];
      return courseAnaylitcs.push({
        level,
        displayName,
        title,
        timeCompleted,
        slug
      });
    });
    courseData(courseAnaylitcs);
  });
  if (learningData) currentlyLearning((callback) => {
    let courseAnaylitcs = [];
    callback.map((course) => {
      let { level, authors, title, percentComplete, courseName } = course;
      let { displayName } = authors[0];
      return courseAnaylitcs.push({
        level,
        displayName,
        title,
        percentComplete,
        courseName
      });
    });
    learningData(courseAnaylitcs);
  });
  if (badgeData) badges((callback) => {
    let courseAnaylitcs = [];
    callback.map((course) => {
      let { name, iconUrl, description, dateAchieved } = course;
      return courseAnaylitcs.push({
        name,
        iconUrl,
        description,
        dateAchieved,
      });
    });
    badgeData(courseAnaylitcs);
  });
  if (activityData) activityInsigts((callback) => {
    let courseAnalytics = { hoursViewed: {}, subjectViews: [] };
    let { viewTime, subjectViews } = callback;
    let hoursViewed = `${Math.floor(
      Object.values(viewTime).reduce((a, b) => {
        return a + b;
      }, 0) /
      60 /
      60
    )}h ${Math.floor(
      Object.values(viewTime).reduce((a, b) => {
        return a + b;
      }, 0) / 60
    ) % 60}m`;
    courseAnalytics.hoursViewed = hoursViewed;
    Object.entries(subjectViews).map((entry) => {
      let [courseName, timeWatched] = entry;
      let hours = Math.floor(timeWatched / 60 / 60);
      let minutes = Math.floor((timeWatched / 60) % 60);
      courseAnalytics.subjectViews[courseName] = `${hours}h ${minutes}m`;
    });
    activityData(courseAnalytics);
  });
};
