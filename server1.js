const express = require('express');
const app = express();
const fs = require('fs');

require('dotenv').config()


app.get('/', (req, res) => {
    res.json('Hello World');
});

app.get('/frontend', (req, res) => {
    const readstream = fs.createReadStream("./frontend/index.html")
    readstream.pipe(res);
});


app.get('/file', (req, res) => {
    const readstream = fs.createReadStream('./README.md');
    const writeStream = fs.createWriteStream('./output.txt')
    let i = 0;
    readstream.on('data', (chunk) => {
        console.log('data is read', chunk);
        // chunk is buffer or binary data
        // console.log('data is read in other form', chunk.toString("base64"));
        // data:text/html;base64,VGhpcyBpcyBzaW1wbGUgdHJhbnNmZXIgZmlsZQp0aGlzIGlzIGFuIGV4YW1wbGUgZmlsZQ==
        if (i == 0) writeStream.write(chunk);
        i++;
    });
    readstream.on("end", () => {
        console.log("completed");
    })
    readstream.pipe(res);
});

app.post('/upload', (req, res) => {
    const writeStream = fs.createWriteStream('./upload.txt')
    // const writeStream = fs.createWriteStream('./upload.png')
    let i = 0, chunkedimage;
    req.on('data', (chunk) => {
        console.log("Recieved chunk", chunk);
        if (i == 0) { chunkedimage = chunk.toString("base64"); }
        i++;
    })
    req.pipe(writeStream);
    req.on("end", () => {
        // res.send(`data:image/png;base64,${chunkedimage}`);
    })

    res.send("okk...")
})

app.post("/video/upload", (req, res) => {
    const writeStream = fs.createWriteStream("./uploadedvideo.mp4");
    req.on("data", (chunk) => {
        writeStream.write(chunk)
    })
    res.send("done...")
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});