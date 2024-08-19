const download = require("download");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const AdmZip = require("adm-zip");
const { execSync } = require("child_process");

const url = "https://tomeko.net/software/JSONedit/bin/JSONedit_0_9_42.zip";
const tempPath = path.join(os.tmpdir(), "JSONedit");
const zippedFilename = path.join(tempPath, "JSONedit_0_9_42.zip");
const unzippedPath = path.join(tempPath, "JSONedit_0_9_42");

function getGlobalPath() {
  const userAgent = process.env.npm_config_user_agent;
  console.log("user agent: " + userAgent);

  if (userAgent) {
    if (userAgent.includes("pnpm")) {
      return execSync("pnpm root -g").toString().trim();
    } else if (userAgent.includes("yarn")) {
      return execSync("yarn global dir").toString().trim();
    } else if (userAgent.includes("bun")) {
      return execSync("bun pm path").toString().trim();
    } else if (userAgent.includes("deno")) {
      const infoJson = execSync("deno info --json").toString().trim();
      const info = JSON.parse(infoJson);
      return info?.config?.cache?.global;
    } else {
      return path.join(process.env.APPDATA, "npm");
    }
  } else {
    return path.join(process.env.APPDATA, "npm");
  }
}

async function start() {
  const globalPath = getGlobalPath();

  fs.mkdirSync(tempPath, { recursive: true });
  fs.mkdirSync(globalPath, { recursive: true });

  if (!fs.existsSync(zippedFilename)) {
    console.log("Downloading JSONEdit 0.9.42");
    await download(url, tempPath, { filename: "JSONedit_0_9_42.zip" });
  }

  console.log("Unzipping");
  const zip = new AdmZip(zippedFilename);
  zip.extractAllTo(tempPath, true);

  console.log("Moving the files to global npm folder...");

  // Move all files from the source directory to the destination directory
  fs.readdir(unzippedPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const sourcePath = path.join(unzippedPath, file);
      const destPath = path.join(globalPath, file);

      // Move the file
      fs.move(sourcePath, destPath, { overwrite: true }, (err) => {
        if (err) throw err;
        console.log(`Moved: ${file}`);
      });
    });
  });

  console.log("JSONEdit installed globally");
  console.log("You can now use `jsonedit` from the command line.");
}

start().catch((err) => console.error(err));
