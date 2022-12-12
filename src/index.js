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
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');
const API_KEY = '31934367-658e9fff939a1c4d22479e433';
let words = '';
let simpleLightBox;
const perPage = 40;
let page = 1;
let query = '';

///searchForm.addEventListener('submit', onSearchForm);

// searchBtn.addEventListener('click', async () => {
//   try {
//     const words = await searchImg();
//     renderImgListItems(words);
//   } catch (error) {
//     console.log(error.message);
//   }
// });

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
  console.log(images, 'images');
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

//nowy sposób, jak coś to wykasuje
loadMoreBtn.style.display = 'none';

let pageNumber = 1;

searchBtn.addEventListener('click', e => {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = searchInput.value.trim();
  if (trimmedValue !== '') {
    searchImg(trimmedValue, pageNumber).then(foundData => {
      if (foundData.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImgListItems(foundData.hits);
        Notify.success(`Hooray! We found ${foundData.totalHits} images.`);
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
  const trimmedValue = searchInput.value.trim();
  loadMoreBtn.style.display = 'none';
  searchImg(trimmedValue, pageNumber).then(foundData => {
    if (foundData.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImgListItems(foundData.hits);
      Notify.success(`Hooray! We found ${foundData.totalHits} images.`);
      loadMoreBtn.style.display = 'block';
    }
  });
});

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  loadMoreBtn.style.display = 'none';
}

//dotąd nowy sposób

// function onSearchForm(e) {
//   e.preventDefault();
//   window.scrollTo({ top: 0 });
//   page = 1;
//   query = e.currentTarget.searchQuery.value.trim();
//   gallery.innerHTML = '';
//   loadMoreBtn.classList.add('is-hidden');

//   if (query === '') {
//     Notify.failure('What would you search?');
//     return;
//   }

//   searchImg(query, page, perPage)
//     .then(data => {
//       if (data.length === 0) {
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       } else {
//         renderImgListItems(data.hits);
//         simpleLightBox = new SimpleLightbox('.gallery a').refresh();
//         Notify.info(`Hooray! We found ${data.hits} images.`);

//         if (data.totalHits > perPage) {
//           loadMoreBtn.classList.remove('is-hidden');
//         }
//       }
//     })
//     .catch(error => console.log(error))
//     .finally(() => {
//       searchForm.reset();
//     });
// }

// function onLoadMore() {
//   page += 1;
//   simpleLightBox.destroy();

//   searchImg(query, page, perPage)
//     .then(data => {
//       renderImgListItems(data.hits);
//       simpleLightBox = new SimpleLightbox('.gallery a').refresh();

//       const pagesTotal = Math.ceil(data.totalHits / perPage);

//       if (page > pagesTotal) {
//         loadMoreBtn.classList.add('is-hidden');
//         Notiflix.Notify.failure(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//     })
//     .catch(error => console.log(error));
// }
