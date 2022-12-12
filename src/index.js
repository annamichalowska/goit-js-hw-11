import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchBtn = document.querySelector('button[search-btn]');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('input');
const imgList = document.querySelector('.gallery-box');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '31934367-658e9fff939a1c4d22479e433';

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
let pageNumber = 1;

async function searchImg(word, page) {
  const baseUrl = 'https://pixabay.com/api/';
  const response = await axios
    .get(
      `${baseUrl}/?key=${API_KEY}&q=${word}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then(response => response.data);
  return response;
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
      }) => `<a class="gallery__link" href="${largeImageURL}">
    <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info__item"><span>Likes</span><br>${likes}</p>
        <p class="info__item"><span>Views</span><br>${views}</p>
        <p class="info__item"><span>Comments</span><br>${comments}</p>
        <p class="info__item"><span>Downloads</span><br>${downloads}</p>
      </div>
    </div>
  </a>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

loadMoreBtn.style.display = 'none';

searchBtn.addEventListener('click', event => {
  event.preventDefault();
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreBtn.style.display = 'none';
  const wordTrimed = searchInput.value.trim();
  if (wordTrimed !== '') {
    searchImg(wordTrimed, pageNumber).then(wordFound => {
      if (wordFound.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImgListItems(wordFound.hits);
        Notify.success(`Hooray! We found ${wordFound.totalHits} images.`);
        loadMoreBtn.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    });
  } else {
    Notify.failure('The search engine is empty!');
  }
});

loadMoreBtn.addEventListener('click', () => {
  pageNumber++;
  const wordTrimed = searchInput.value.trim();
  loadMoreBtn.style.display = 'none';
  searchImg(wordTrimed, pageNumber).then(wordFound => {
    if (wordFound.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImgListItems(wordFound.hits);
      Notify.success(`Hooray! We found ${wordFound.totalHits} images.`);
      loadMoreBtn.style.display = 'block';
    }
  });
});
