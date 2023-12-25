const mongoose = require('mongoose');
const CodeBlock = require('./models/CodeBlocks');
const MONGODB_URI = process.env.MONGODB_URI ||'mongodb+srv://admin:f0fARecactXZxc9t@cluster0.yzvertb.mongodb.net/CODEBLOCK';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// run this script to load the database
const codeBlocks = [
    {
              title: 'Log a Message to the Console',
              code: '',
              question:'Uses console.log() to print the string "Hello, World!" to the console.',
              solution: 'console.log("Hello, World!");',
              isMentor:true,
              connections:0,
            },
            {
              title: 'Ternary Operator for a Simple Condition',
              code: '',
              question:'Assigns a message to result based on the value of the isTrue variable using the ternary operator.',
              solution: 'let result = isTrue ? "true!" : "false!";',
              isMentor:true,
              connections:0,
            },
            {
              title: 'Array Manipulation ',
              code: '',
              question:'Adds the number 4 to the end of the numbers array using push method.<br>let numbers = [1, 2, 3];',
              solution: 'numbers.push(4);',
              isMentor:true,
              connections:0,
            },
            {
              title: 'Anonymous Arrow Function',
              code: '',
              question:'Defines a function square that takes a parameter x and returns its square using the arrow function syntax.',
              solution: 'let square = x => x * x;',
              isMentor:true,
              connections:0,
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