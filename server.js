const http = require("http");
const fs = require("fs");

function requestHandler(req, res) {
    if (req.method === "GET") {
        if (req.url === "/") {
            res.setHeader("Content-Type", "text/plain");
            res.writeHead(200);
            res.write("Hello this is a nodejs server");
            res.end();
        }

        if (req.url === "/frontend") {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            const stream = fs.createReadStream(`${__dirname}/index.html`);
            stream.pipe(res); // Piping the read stream to the response stream
        }

        if (req.url.startsWith("/file/")) {
            const file_name = req.url.split("/file/")[1];
            const file_extension = file_name.split('.')[1];

            let content_type;
            if (['png', 'jpeg', 'jpg'].includes(file_extension)) {
                content_type = `image/${file_extension}`;
            }
            else if (['mp4'].includes(file_extension)) {
                content_type = `video/${file_extension}`;
            }
            else content_type = "application/octet-stream";

            const stream = fs.createReadStream(`${__dirname}/${file_name}`);

            res.setHeader("Content-Type", content_type)
            res.writeHead(200);
            stream.pipe(res);
        }
    }

    if (req.method === "POST") {
        if (req.url === "/upload") {
            const file_extension = req.headers['content-type'].split('/')[1];
            const file_name = `file.${file_extension}`;

            const stream = fs.createWriteStream(`${__dirname}/${file_name}`);

            req.pipe(stream); // Piping the request stream to file stream

            // When file is saved successfully, it emits an event "finish" 
            stream.on("finish", () => {
                res.setHeader("Content-Type", "text/plain");
                res.writeHead(201);
                res.write("ok");
                res.end();
            });
        }
    }
}

const server = http.createServer(requestHandler);

server.listen(8000, () => {
    console.log("Server is running...");
})