import https from "https";
export const getRecentSubs = (callback) => {
  let queryBody = JSON.stringify({
    query: `query getRecentSubmissionList($username: String!) {
    recentSubmissionList(username: $username) {
      runtime
      title
      timestamp
      statusDisplay
      lang
      id
    }
  }`,
    variables: { username: "Zakpak0" },
  });
  let options = {
    hostname: "leetcode.com",
    method: "POST",
    port: 443,
    path: "/graphql",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": queryBody.length,
      "User-Agent": "Node",
    },
  };

  let req = https.request(options, (res) => {
    let body = "";
    res.on("data", (data) => {
      body += data;
    });
    res.on("error", (error) => {
      console.log(error);
    });
    res.on("close", (join) => {
      body = JSON.parse(body);
      let answeredQuestions = [];
      body.data.recentSubmissionList.map((question) => {
        if (question.statusDisplay == "Accepted") {
          answeredQuestions.push(question);
        }
      })
      let fullSet = []
      let i = 0
      answeredQuestions.map((question) => {
        let { title } = question
        title = title.toString().toLowerCase().replaceAll(" ", "-")
        let queryBody = JSON.stringify({
          query: `query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                questionId
                title
                translatedTitle
                codeDefinition
                content
                translatedContent
                difficulty
                likes
                dislikes
                similarQuestions
                topicTags {
                    name
                    slug
                    translatedName
                    __typename
                }
                codeSnippets {
                    lang
                    langSlug
                    code
                    __typename
                }
                stats
                hints
                exampleTestcases
                sampleTestCase
                metaData
                enableRunCode
            }
        }`,
          variables: { titleSlug: `${title}` },
        });
        let options = {
          hostname: "leetcode.com",
          method: "POST",
          port: 443,
          path: "/graphql",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": queryBody.length,
            "User-Agent": "Node",
          },
        };

        let req = https.request(options, (res) => {
          let body = "";
          res.on("data", (data) => {
            body += data;
          });
          res.on("error", (error) => {
            console.log(error);
          });
          res.on("close", (join) => {
            body = JSON.parse(body);
            question.difficulty = body.data.question.difficulty
            fullSet.push(question), i++
            if (i == answeredQuestions.length) {
              callback(fullSet)
            }
          })
        })
        req.write(queryBody);
        req.end();
      })
    })
  })
  req.write(queryBody);
  req.end();

};
