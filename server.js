const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();

app.use(fileUpload());

//upload endpoint

app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file Uploaded" });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
      //500 is server error
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

port=5000;
app.listen(port, () => {
  console.log(`Server started on ${port}....`);
});
