console.log('Hello World!');

// client side JS because of document
const form = document.querySelector('form'); // querySelector or any element grabber works
// hide/show loading.gif on submit
const loadingElement = document.querySelector('.loading');
// app dab element
const dabsElement = document.querySelector('.dabs');
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/dabs' : 'https://dabber-api.now.sh/dabs';

loadingElement.style.display = 'none';

listAllDabs();

// prevents data from going anywhere
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // method to get input boxes
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    // data structure for a tweet
    const dab = {
        name,
        content
    };

    console.log(dab);
    // submit hides forms and displays loading
    form.style.display = 'none';
    loadingElement.style.display = '';

    // server sends json and client receives JSON
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(dab),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
      .then(createdDab => {
        //   console.log(createdDab);
          // clear the form
          form.reset();
          // hide form after successful submit
          setTimeout(() => {
            form.style.display = '';
          },30000);
          listAllDabs();
        //   loadingElement.style.display = 'none';
      })
});

// Show loading while querying database
function listAllDabs() {
    dabsElement.innerHTML = '';
    // get request for data from API URL
    fetch(API_URL)
        .then(response => response.json())
        .then(dabs => {
            console.log(dabs);
            dabs.reverse();
            // get each dab and add to the page
            dabs.forEach(dab => {
                const div = document.createElement('div');
                
                const header = document.createElement('h3');
                header.textContent = dab.name;
                
                const contents = document.createElement('p');
                contents.textContent = dab.content;
                
                const date = document.createElement('small');
                date.textContent = new Date(dab.created);
                
                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                dabsElement.appendChild(div);
            });
            loadingElement.style.display = 'none';
        });
}