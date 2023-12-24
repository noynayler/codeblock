const smileyImagePath = 'smiley.png';
const isMentor = window.location.href.includes('readonly=true');


document.addEventListener('DOMContentLoaded', function () 
{
    const codeBlockTitleDiv = document.getElementById('codeblockTitle');
    const codeBlockQuestionDiv = document.getElementById('codeblockQuestion');
    const editorDiv = document.getElementById('editor');
    const resultMessageDiv = document.getElementById('resultMessage');

    // Extract code block title from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const codeBlockTitle = urlParams.get('title');

    const socket = io('http://localhost:3000', { query: { title: codeBlockTitle } });

  // Fetch code block details from the server
  fetch(`/get-code-block-details?title=${encodeURIComponent(codeBlockTitle)}`)
    .then(response => response.json())
    .then(codeBlock => {
      // Populate code block details on the page
      codeBlockTitleDiv.textContent = codeBlock.title;
      codeBlockQuestionDiv.textContent = codeBlock.question;

      //CodeMirror editor
      const editor = CodeMirror(editorDiv, {
        value: codeBlock.code,
        mode: 'javascript',
        lineNumbers: true,
        theme: 'material-darker',
        readOnly:isMentor ,
      });

      // compare with result while typing 

      if(!isMentor)
      {
        editor.on('keyup', function () {
            // Retrieve the code from the editor
            const code = editor.getValue();
    
            // Check if the code is identical to the solution in the provided code block
            if (code === codeBlock.solution) {
              // Display a success message
              resultMessageDiv.innerHTML = 'Well Done!<br><br><img src="' + smileyImagePath + '" id="smileyImage" style="width: 50px; height: 50px;">';
            } else {
              // Display an error message 
              resultMessageDiv.innerText = 'Oops! Try again.';
            }
            // Emit code changes to the server
            socket.emit('code-change', { title: codeBlock.title, code });
          });
      }
    
    })
    .catch(error => console.error('Error fetching code block details:', error));
   
 

  // Listen for code changes from the editor and broadcast to all connected clients
    socket.on('code-change', (data) => {
  // Update the CodeMirror editor with the received code change
        editor.value=data.code;
    });

  });


