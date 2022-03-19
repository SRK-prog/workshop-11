const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index", {
    msg: "",
  });
});

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("uploadedFile");

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      if (req.file === undefined) {
        res.render("index", {
          msg: "Select any file to upload",
        });
      } else {
        res.render("index", {
          msg: "File Uploaded",
        });
      }
    }
  });
});

app.get("/files", (req, res) => {
  fs.readdir("public/uploads", (err, files) => {
    res.render("images", {
      Files: files,
    });
  });
});

app.post("/delete/:file", (req, res) => {
  deletefile = "public/uploads/" + req.params.file;
  fs.unlink(deletefile, (err) => {
    if (err) {
      return err;
    }
    fs.readdir("public/uploads", (err, files) => {
      res.render("images", {
        Files: files,
      });
    });
  });
});

app.post("/rename/:file", (req, res) => {
  Name = req.body.rename;
  fileName = req.params.file;
  ext = /^.+\.([^.]+)$/.exec(fileName);
  extension = ext[1];
  fileDirectory = "public/uploads/";
  newName = Name + "." + extension;
  fs.rename(fileDirectory + fileName, fileDirectory + newName, (err) => {
    if (err) {
      console.log(err);
    }
    fs.readdir("public/uploads", (err, files) => {
      res.render("images", {
        Files: files,
      });
    });
  });
});

app.listen(5000, () => console.log("server running"));
