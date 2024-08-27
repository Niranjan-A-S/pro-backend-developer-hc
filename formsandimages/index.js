const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const app = express();

cloudinary.config({
  cloud_name: 'denq3oyye',
  api_key: '533768652128115',
  api_secret: '<API_KEY>'
});

app.set("view engine", "ejs");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/myget", (req, res) => {
  res.send(req.query);
});

app.post("/mypost", async (req, res) => {

  let result;
  let imageArray = [];

  if (req.files) {
    try {
      let file = req.files.samplefile;
      result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
      });
    } catch (error) {
      console.log(error);
    }

    imageArray.push({
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  }

  // ### use case for single image
  // let file = req.files.samplefile;
  // result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: "users",
  // });

  details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    result,
    imageArray,
  };

  res.send(details);
});

// just to render the forms
app.get("/mygetform", (req, res) => {
  res.render("getform");
});
app.get("/mypostform", (req, res) => {
  res.render("postform");
});

app.listen(4000, () => console.log(`Server is runnning at port 4000`));
