document.addEventListener('DOMContentLoaded', function () {
  const codeBlockList = document.getElementById('codeBlockList');

// fetch if is mentor or student
  fetch('/get-mentor-status')
    .then(response => response.json())
    .then(data => {
      const { isFirstConnection } = data;

  // Fetch code block titles from the server
  fetch('/get-code-block-titles')
  .then(response => response.json())
  .then(titles => {
    // Populate code block list
    titles.forEach((title) => {
      const listItem = document.createElement('li');
      listItem.textContent = title;
      listItem.addEventListener('click', () => {
        // Append readonly parameter based on mentor status
        const readonlyParam = isFirstConnection ? '&readonly=true' : '';
        // Redirect to the code block page 
        window.location.href = `code-block.html?title=${encodeURIComponent(title)}${readonlyParam}`;
      });
      codeBlockList.appendChild(listItem);
    });
  })
  .catch(error => console.error('Error fetching code block titles:', error));

})
.catch(error => console.error('Error fetching mentor status:', error));
});
