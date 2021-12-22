import https from "https";
import fs from "fs";
const getAuth = (authorizedCall) => {
  fs.readFile(".env.json", (err, data) => {
    authorizedCall(JSON.parse(data));
  });
};
const getGithubInfo = {
  getRepos: (callback) => {
    const authorizedCall = (accessToken) => {
      let options = {
        hostname: "api.github.com",
        method: "GET",
        port: 443,
        path: "/users/Zakpak0/repos",
        headers: {
          "User-Agent": "Node",
          Authorization: `Bearer ${accessToken.GITHUB_TOKEN}`,
        },
      };

      https.get(options, (res) => {
        let body = "";
        res.on("data", (res) => {
          body += res;
        });
        res.on("close", (res) => {
          let parsedBody = JSON.parse(body);
          let mappedBody = parsedBody.map((repo) => {
            let { html_url, full_name, language, description } = repo;
            return (body = {
              html_url,
              full_name,
              language,
              description,
            });
          });
          callback(mappedBody);
        });
      });
    };
    getAuth(authorizedCall);
  },
  getRepoCount: (callback) => {
    const authorizedCall = (accessToken) => {
      let options = {
        hostname: "api.github.com",
        method: "GET",
        port: 443,
        path: "/users/Zakpak0",
        headers: {
          "User-Agent": "Node",
          Authorization: `Bearer ${accessToken.GITHUB_TOKEN}`,
        },
      };

      https.get(options, (res) => {
        let body = "";
        res.on("data", (res) => {
          body += res;
        });
        res.on("close", (res) => {
          body = JSON.parse(body);
          let { public_repos, total_private_repos, html_url } = body;
          callback({ public_repos, total_private_repos, html_url });
        });
      });
    };
    getAuth(authorizedCall);
  },
  getContributions: (callback) => {
    const authorizedCall = (accessToken) => {
      let queryBody = JSON.stringify({
        query: `query {
        user(login: "Zakpak0") {
          name
          contributionsCollection {
            contributionCalendar {
              colors
              totalContributions
              weeks {
                contributionDays {
                  color
                  contributionCount
                  date
                  weekday
                }
                firstDay
              }
            }
          }
        }
      }`,
      });

      let options = {
        hostname: "api.github.com",
        method: "POST",
        port: 443,
        path: "/graphql",
        headers: {
          "User-Agent": "Node",
          Authorization: `Bearer ${accessToken.GITHUB_TOKEN}`,
        },
      };

      let req = https.request(options, (res) => {
        let body = "";
        res.on("data", (res) => {
          body += res;
        });
        res.on("close", (res) => {
          let parsedBody = JSON.parse(body);
          let contributions =
            parsedBody.data.user.contributionsCollection.contributionCalendar;
          callback(contributions);
        });
      });

      req.write(queryBody);
      req.end();
    };
    getAuth(authorizedCall);
  },
};
export const { getRepos, getRepoCount, getContributions } = getGithubInfo;
