const postList = document.querySelector('.post-list');
const addPostForm = document.querySelector('.add-post-form');
const addPostBtn = document.querySelector('#add-post-btn');
let titleFieldValue = document.querySelector('#title');
let bodyFieldValue = document.querySelector('#body');
const url = 'http://localhost:3000/posts';
let output = '';

function renderPosts(posts) {
   posts.map(post => {
      output += `
      <div class="card col-md-6" data-id=${post.id}>
         <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.content}</p>
            <a href="#" class="card-link" id="edit-post-btn">Edit</a>
            <a href="#" class="card-link" id="delete-post-btn">Delete</a>
         </div>
      </div>
      `;
      })

   postList.innerHTML = output;
}


window.addEventListener('load', () => {
   fetch(url)
   .then(res => res.json())
   .then(data => renderPosts(data))
})


addPostForm.addEventListener('submit', (e) => {
   e.preventDefault();

   if(titleFieldValue.value && bodyFieldValue.value){
      fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            title: titleFieldValue.value,
            content: bodyFieldValue.value
         })
      })
      .then(res => res.json())
      .then(data => {
         const dataArr = [];
         dataArr.push(data);
         renderPosts(dataArr)
      })

      setTimeout(() => {
         addPostForm.reset();
      }, 2000);
   }
});


postList.addEventListener('click', (e) => {
   e.preventDefault();

   let delBtnPressed = e.target.id == 'delete-post-btn';
   let editBtnPressed = e.target.id == 'edit-post-btn';

   let id = e.target.parentElement.parentElement.dataset.id;

   if(delBtnPressed) {
      fetch(`${url}/${id}`, {
         method: 'DELETE'
      })
      .then(res => res.json())
      .then(() => location.reload())
   }

   if(editBtnPressed) {
      console.log(e.target)
      let parent = e.target.parentElement;
      let title = parent.querySelector('.card-title').textContent;
      let body = parent.querySelector('.card-text').textContent; 

      titleFieldValue.value = title;
      bodyFieldValue.value = body;
   }

   addPostBtn.addEventListener('click', (e) => {
      e.preventDefault();

      fetch(`${url}/${id}`, {
         method: 'PATCH', 
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            title: titleFieldValue.value,
            content: bodyFieldValue.value
         })
      })
      .then(res => res.json())
      .then(() => location.reload())
   })
});


