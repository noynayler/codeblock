const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const CodeBlock = require('./models/CodeBlocks');
const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = socketIO(server);
const MONGODB_URI = 'mongodb+srv://admin:f0fARecactXZxc9t@cluster0.yzvertb.mongodb.net/CODEBLOCK';

let isFirstConnection=true;


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


const codeBlocks = [
  {
            title: 'Log a Message to the Console',
            code: '',
            question:'Uses console.log() to print the string "Hello, World!" to the console.',
            solution: 'console.log("Hello, World!");',
          },
          {
            title: 'Ternary Operator for a Simple Condition',
            code: '',
            question:'Assigns a message to result based on the value of the isTrue variable using the ternary operator.',
            solution: 'let result = isTrue ? "true!" : "false!";',
          },
          {
            title: 'Array Manipulation ',
            code: '',
            question:'Adds the number 4 to the end of the numbers array using push method.<br>let numbers = [1, 2, 3];',
            solution: 'numbers.push(4);',
          },
          {
            title: 'Anonymous Arrow Function',
            code: '',
            question:'Defines a function square that takes a parameter x and returns its square using the arrow function syntax.',
            solution: 'let square = x => x * x;',
          },
    ];

    async function addCodeBlocks() {
      try {
        // Clear existing code blocks
        await CodeBlock.deleteMany({});
        // Add new code blocks
        const addedCodeBlocks = await CodeBlock.create(codeBlocks);
        console.log('Code blocks added successfully:', addedCodeBlocks);
      } catch (error) {
        console.error('Error adding code blocks:', error);
      } 
      }
    
    
    addCodeBlocks();


app.use(cors({
      origin: 'https://codeblocks-xcfp.vercel.app',
    }));
app.use(express.static('public'));

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

app.get('/get-code-block-details', async (req, res) => {
  try {
    
    const title = req.query.title;
    const codeBlock = await CodeBlock.findOne({ title });

    // Check if the mentor is not already set
    if (!codeBlock.mentor) {
      // Assign the mentor role to the first connection
      codeBlock.mentor = true;
      // Save the updated code block to MongoDB
      await codeBlock.save();
    }

    res.json(codeBlock);
  } catch (error) {
    console.error('Error fetching code block details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
});

// Handle socket connections
io.on('connection', (socket) => {
  if (isFirstConnection) {
    // The first connected session is the mentor, set it as read-only
    socket.emit('role', 'mentor');
    isFirstConnection = false;
  } else {
    // Additional sessions are students
    socket.emit('role', 'student');
  }


});

app.get('/get-mentor-status', (req, res) => {
  res.json({ isFirstConnection });
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
