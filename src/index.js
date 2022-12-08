import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchBtn = document.querySelector('button[search-btn]');
const searchInput = document.querySelector('input');
const imgList = document.querySelector('.gallery-box');
const API_KEY = '31934367-658e9fff939a1c4d22479e433';

searchBtn.addEventListener('click', async () => {
  try {
    const words = await searchImg();
    renderImgListItems(words);
  } catch (error) {
    console.log(error.message);
  }
});

async function searchImg(words) {
  const baseUrl = 'https://pixabay.com/api/';
  //const imageIds = [1, 2, 3, 4, 5];

  //const arrayOfPromises = imageIds.map(async imageId => {
  const response = await fetch(
    `${baseUrl}/?key={API_KEY}&q=${words}&image_type=photo`
  );
  return response;
  //const words = await Promise.all(arrayOfPromises);
  //return words;
}

function renderImgListItems(words) {
  const markup = words
    .map(word => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = word;
      return `<div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${word.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${word.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${word.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${word.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  imgList.innerHTML = markup;
}

// async function seachImg() {
//   const baseUrl = `https://pixabay.com/api/?key={api_key}&q=${words}&image_type=photo`;
//   const data = await Response.json();
//   return data.hits;
// }

// function loadImagesToGallery() {
//   searchImg.then(imgObj => {
//     console.log(`async and await >>`, imgObj);
//   });
// }
// loadImagesToGallery();
