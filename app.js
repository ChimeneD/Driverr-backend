const express = require('express');
const dotenv = require('dotenv');
const ThingSpeakClient = require('thingspeakclient');

dotenv.config();

const client = new ThingSpeakClient({
  //server: `${process.env.THING_SPEAK_SERVER}`,
  useTimeoutMode: false,
  updateTimeout: 20000,
});

client.attachChannel(
  1788967,
  { writeKey: process.env.WRITE_KEY, readKey: process.env.READ_KEY },
  (error, res) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log(res);
    }
  },
);

const app = express();
//app.use(express.static(path.join(__dirname, './public')));
const port = process.env.PORT;

app.get('/', (req, res) => {
  client.updateChannel(1788967, { field1: 1, field2: 2 }, function (err, resp) {
    if (!err && resp > 0) {
      console.log('update successfully. Entry number was: ' + resp);
    } else {
      console.log(err.message);
    }
  });
  res.send('Server Running');
});

app.listen(`${port}`, () => {
  console.log(`🚀 server started on  http://localhost:${port}`);
});
