const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 8080;
app.use(express.static(publicPath));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
let i = 0;
app.post('/img' , (req, res) => {
    i++;
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
      fs.appendFileSync(path.join(__dirname, `./img/result-${i}.png`), base64Data, 'base64');
})
app.listen(port);