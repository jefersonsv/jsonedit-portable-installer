const download = require('download');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const url = 'https://dl.min.io/client/mc/release/windows-amd64/mc.exe';
const dest = path.join(os.homedir(), 'mc.exe');
const globalPath = path.join(process.env.APPDATA, 'npm', 'mc.exe');

async function installMc() {
    console.log('Downloading MinIO client...');
    await download(url, os.homedir(), { filename: 'mc.exe' });

    console.log('Moving mc.exe to global npm folder...');
    await fs.move(dest, globalPath, { overwrite: true });

    console.log('MinIO client installed globally as mc.');
    console.log('You can now use `mc` from the command line.');
}

installMc().catch(err => console.error(err));
