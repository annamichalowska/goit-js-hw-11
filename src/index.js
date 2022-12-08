import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
//import SimpleLightbox from 'simplelightbox';

const searchBtn = document.querySelector('button[search-btn]');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('input');
const imgList = document.querySelector('.gallery-box');
const gallery = document.querySelector('.gallery');
const API_KEY = '31934367-658e9fff939a1c4d22479e433';
let words = '';
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);

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
  const response = await axios
    .get(`${baseUrl}/?key=${API_KEY}&q=${words}&image_type=photo`)
    .then(response => response.data);
  return response;
  //const words = await Promise.all(arrayOfPromises);
  //return words;
}

function onSearchForm(event) {
  event.preventDefault();
  window.scrollTo({ top: 0 });
  //page = 1;
  words = e.currentTarget.searchQuery.value.trim();
  imgList.innerHTML = '';
  //loadMoreBtn.classList.add('is-hidden');

  if (words === '') {
    alert('wpisz jakieś słowo!');
    return;
  }

  searchImg(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        console.log('nie znaleźliśmy takich obrazków');
      } else {
        renderImgListItems(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        console.log(`znaleźliśmy ${data} obrazków`);

        //    if (data.totalHits > perPage) {
        //      loadMoreBtn.classList.remove('is-hidden');
        //    }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function renderImgListItems(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__link" href="${largeImageURL}">
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>
</a>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  //imgList.innerHTML = markup;
}

function onSearchForm(e) {
  e.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  //loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    alert('wpisz jakieś słowo!');
    return;
  }

  searchImg(query, page, perPage)
    .then(data => {
      if (data.length === 0) {
        console.log('nie znaleźliśmy takich obrazków');
      } else {
        renderImgListItems(data.hits);
        //simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        console.log(`znaleźliśmy ${data} obrazków`);
        //alertImagesFound(data);

        // if (data.totalHits > perPage) {
        //   loadMoreBtn.classList.remove('is-hidden');
        // }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}
