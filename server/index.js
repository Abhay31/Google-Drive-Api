const express = require("express");
const { google } = require("googleapis");
const multer = require("multer");


const path = require("path");
const cors = require("cors");

const fs = require("fs");

require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, callback) {
    const extension = file.originalname.split(".").pop();
    callback(null, `${file.fieldname}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

app.use(cors());

app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "key.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });


    const drive = google.drive({
      version: "v3",
      auth,
    });

    const uploadedFiles = [];

    // Use req.files instead of files
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const response = await drive.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimeType,
          parents: [process.env.FILES],
        },
        media: {
          body: fs.createReadStream(file.path),
        },
      });
      uploadedFiles.push(response.data);
    }

    res.json({ files: uploadedFiles });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error uploading files");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
