const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const tourRouter = require('./routes/tournament');
const chatRouter = require('./routes/chat');
const reclamRouter = require('./routes/reclamation');
const liveRouter = require('./routes/live');
const connectDB = require('./config/connect');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./models/user');
const app = express();
const server = http.createServer(app);

const { saveMessageToDatabase } = require('./middleware/chatMiddeware');
const { default: axios } = require('axios');
// Middleware
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  },
});
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// socket io
io.on('connection', (socket) => {
  // console.log('New client connected');
  socket.on("join_room", (data) => {
    socket.join(data.room);
  });
  socket.on("send_message", (data) => {
    console.log(data);
    console.log(data.message);
    console.log(data.sender);
    console.log("the room is",data.room);
    //  const user = User.findById(data.sender).populate('user');
    //  console.log("the sender is this person",user);
    socket.to(data.room).emit("receive_message", data);
    console.log("the room is",data.room);
    const result = saveMessageToDatabase(data.room, data.message, data.sender)
    console.log(result)
  });
});
// Routes
app.use('/user', userRouter);
app.use('/tournament', tourRouter);
app.use('/reclamation', reclamRouter);
app.use('/live', liveRouter);
app.use('/chat', chatRouter);
app.use('/games', async (req,res) => {
  const clientId = '2b20enpdnmnhwbor0t9lwq4pkuavg3';
  const clientSecret = 'magctl9dhe7m4c2f1q7nvvffhtkrch';
  axios.post('https://id.twitch.tv/oauth2/token', {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  })
    .then(async response => {
      const token = response.data.access_token;
      console.log('hello world ',token)

      const test = await axios.get('https://api.twitch.tv/helix/games/top', {
        headers: {
          'Client-ID': '2b20enpdnmnhwbor0t9lwq4pkuavg3',
          Authorization: `Bearer ${token}`
        },
        params: {
          first: 50 // le nombre de jeux à récupérer (maximum 100)
        }
      }).then(data => {return data} )
      res.status(200).send(test.data)
    })
    
  })
// Serve static files
app.use('/uploads', express.static('uploads'));
// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});