const download = require("download");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const AdmZip = require("adm-zip");

const url = "https://tomeko.net/software/JSONedit/bin/JSONedit_0_9_42.zip";
const tempPath = path.join(os.tmpdir(), "JSONedit");
const zippedFilename = path.join(tempPath, "JSONedit_0_9_42.zip");
const unzippedPath = path.join(tempPath, "JSONedit_0_9_42");

const npmGlobalPath = path.join(process.env.APPDATA, "npm");

async function installMc() {
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
      const destPath = path.join(npmGlobalPath, file);

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

installMc().catch((err) => console.error(err));
