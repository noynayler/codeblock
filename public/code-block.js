const smileyImagePath = 'smiley.png';

const isMentor=true;
document.addEventListener('DOMContentLoaded', function () 
{
    const codeBlockTitleDiv = document.getElementById('codeblockTitle');
    const codeBlockQuestionDiv = document.getElementById('codeblockQuestion');
    const userDiv=document.getElementById('user');
    const editorDiv = document.getElementById('editor');
    const resultMessageDiv = document.getElementById('resultMessage');

    // Extract code block title from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const codeBlockTitle = urlParams.get('title');


    const socket = io(window.location.origin);
    socket.on('connect', () => {
    console.log('Connected to Socket.io');
    });


  
  // Fetch code block details from the server
  fetch(`/get-code-block-details?title=${encodeURIComponent(codeBlockTitle)}`)
    .then(response => response.json())
    .then(codeBlock => 
    {
      // Populate code block details on the page
      const codeblock=codeBlock
      codeBlockTitleDiv.textContent = codeBlock.title;
      codeBlockQuestionDiv.textContent = codeBlock.question;

      const isMentor=(codeBlock.connections==0);
      console.log(isMentor);
      console.log(codeBlock);
   
      // Show the connection role
      if(isMentor){
        userDiv.textContent="You are connected as Mentor"
      }
      else{
        userDiv.textContent="You are connected as Student"
      }

      //CodeMirror editor
       const editor = CodeMirror(editorDiv, {
        value: '',
        mode: 'javascript',
        lineNumbers: true,
        theme: 'material-darker',
        readOnly:isMentor ,
      });

      
      
    socket.on('code-change', (data) => {
      // Update the CodeMirror editor with the received code
      if (data.code !== editor.getValue()) {
          editor.setValue(data.code);
      }
  });

  if (!isMentor) {
      editor.on('change', (instance, changeObj) => {
          // Retrieve the code from the editor
          const code = instance.getValue();

          // Emit code changes to the server
          socket.emit('code-change', { code });
      });
  }

      // compare with result while student typing

      if(!isMentor)
      {
        editor.on('keyup', function () 
        {
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

  

      

      fetch(`/increment-connections?codeBlockId=${encodeURIComponent(codeblock._id)}`, {
        method: 'POST',
      });
 
     
      // Decrease connections when leaving the code block
      window.addEventListener('beforeunload', async () => {
        await fetch(`/decrement-connections?codeBlockId=${encodeURIComponent(codeblock._id)}`, {
          method: 'POST',
        });
      });
    })
    .catch(error => console.error('Error fetching code block details:', error));
   
});
