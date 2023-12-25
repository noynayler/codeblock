

document.addEventListener('DOMContentLoaded', function () {
  const codeBlockList = document.getElementById('codeBlockList');

  // Fetch code block titles from the server
  fetch('/get-code-block-titles')
    .then(response => response.json())
    .then(titles => {
      // Populate code block list
      titles.forEach((title) => {
        const listItem = document.createElement('li');
        listItem.textContent = title;
        listItem.addEventListener('click', async () => {
          try {
            // // Fetch code block details based on the title
            // const response = await fetch(`/get-code-block-details?title=${encodeURIComponent(title)}`);
            // const codeBlock = await response.json();

            // if (codeBlock.connections == 1) {
            //   // Send a request to update isMentor to false if connections == 1
            //   fetch('/update-is-mentor', {
            //     method: 'POST',
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ title: title }),
            //   })
            //     .then(response => response.json())
            //     .then(data => {
            //       console.log(data); // Handle the server response
            //     })
            //     .catch(error => {
            //       console.error('Error updating isMentor:', error);
            //     });
            // }
            
            

            // Redirect to codeblock page
            window.location.href = `code-block.html?title=${encodeURIComponent(title)}`;
          } catch (error) {
            // Handle error fetching code block details
            console.error('Error handling code block details:', error);
          }
        });

        // Append the list item to the unordered list
        codeBlockList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error fetching code block titles:', error));
});
