const fs = require("fs");
const { deployedUrlsJsonPath, prCommentMdPath } = require("./const");

const { appUrl } = JSON.parse(
    fs.readFileSync(deployedUrlsJsonPath).toString("utf-8")
);

const comment = `
#### Deployed
- [App](${appUrl})
`;

fs.writeFileSync(prCommentMdPath, comment);
