const express = require("express");
const app = express();
const port = 5500;

app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server ${err}`);
  }

  console.log(`Server is up and running on port : ${port}`);
});
