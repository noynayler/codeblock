const express = require('express');
const serverless=require('serverless-http');
const router= express.Router();
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const CodeBlock = require('./models/CodeBlocks');
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
const MONGODB_URI = process.env.MONGODB_URI ||'mongodb+srv://admin:f0fARecactXZxc9t@cluster0.yzvertb.mongodb.net/CODEBLOCK';



module.exports.handler=serverless;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});



const corsOptions = {
  origin: ['http://localhost:3000', URL],
};

    
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.get('/get-code-block-titles', async (req, res) => {
  try {
    // Fetch code block titles from MongoDB
    // Connect to MongoDB
    
    const titles = await CodeBlock.find({}, { title: 1, _id: 0 }); 
    res.json(titles.map(codeBlock => codeBlock.title));
  } catch (error) {
    console.error('Error fetching code block titles:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
  
});


//return the codeblock details 
app.get('/get-code-block-details', async (req, res) => {
  try {
    
    const title = req.query.title;
    const codeBlock = await CodeBlock.findOne({ title });
    res.json(codeBlock);


  } catch (error) {
    console.error('Error fetching code block details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});


// count the connections to codeblock
app.post('/increment-connections', async (req, res) => {
  try {
    const { codeBlockId } = req.query;

    const result = await CodeBlock.updateOne(
      { _id: codeBlockId },
      { $inc: { connections: 1 } }
    );

    console.log('Increment Connections Result:', result);

    if (result.nModified === 0) {
      return res.status(404).json({ success: false, message: 'Document not found or already updated' });
    }

    res.json({ success: true, message: 'Connections incremented successfully', result });
  } catch (error) {
    console.error('Error incrementing connections:', error);
    res.status(500).json({ success: false, message: 'Error incrementing connections', error: error.message });
  }
});

app.post('/decrement-connections', async (req, res) => {
  try {
    const { codeBlockId } = req.query;

    const result = await CodeBlock.updateOne(
      { _id: codeBlockId },
      { $inc: { connections: -1 } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ success: false, message: 'Document not found or connections not updated' });
    }

    res.json({ success: true, message: 'Connections decremented successfully', result });
  } catch (error) {
    console.error('Error decrementing connections:', error);
    res.status(500).json({ success: false, message: 'Error decrementing connections', error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for code changes from clients
  socket.on('code-change', (data) => {
      // Broadcast the code change to all connected sockets
      io.emit('code-change', data);
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});


// Render code block page
app.get('/code-block', (req, res) => {
  res.sendFile(__dirname + '/public/code-block.html');
});

// Render lobby page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});