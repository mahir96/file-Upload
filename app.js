const express = require("express");
const multer = require("multer");
const exphbs = require("express-handlebars");
const path = require("path");

// set storage
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// init upload
const upload = multer({
  storage: storage,

  fileFilter: function(req, file, cb) {
    checkFiletype(file, cb);
  }
}).single("myimg");

// Checkfile type
function checkFiletype(file, cb) {
  // allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // check for ext
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  // check mimtype
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: images only");
  }
}

// app init
const app = express();

// express-handlebar middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// public folder
app.use(express.static("./public"));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      res.render("index", {
        err: console.log("file is to large cant be uploaded")
      });
    } else {
      if (req.file == undefined) {
        res.render("index");
      } else {
        res.render("index", {
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
