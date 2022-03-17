const { execSync } = require("child_process");
const fs = require("fs");
const { deployedUrlsJsonPath } = require("./const");

const { GITHUB_RUN_ID, FIREBASE_TOKEN } = process.env;

try {
    const output = execSync(
        `npm run deploy:channel:firebase -- --only client ${GITHUB_RUN_ID} --expires 7d --token ${FIREBASE_TOKEN} --project default`
    ).toString();

    const [appUrl] = output
        .match(/hosting:channel.*https:\/\/(.*).app/g)
        .map((value) => {
            return value.match(/https:\/\/(.*).app/)[0];
        });

    fs.writeFileSync(
        deployedUrlsJsonPath,
        JSON.stringify({
            appUrl,
        })
    );

    console.log(output);
} catch (error) {
    console.log(`----- ERROR: ${error.status} ----- `);
    console.log(
        error.message,
        error.stderr?.toString(),
        error.stdout?.toString()
    );
    console.log(`-------------------------------------------`);

    process.exit(1);
}
