import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(getCountry, DEBOUNCE_DELAY));

function getCountry(evt) {
  evt.preventDefault;
  const countryName = evt.target.value.trim();

  if (!countryName) {
    list.innerHTML = '';
    info.innerHTML = '';
  }
  {
    fetchCountries(countryName)
      .then(countries => {
        if (countries.length > 10) {
          Notify.info('Too many matches found. Please enter a more specific name.');
          info.innerHTML = '';
        } else if (countries.length >= 2 && countries.length <= 10) {
          info.innerHTML = '';
          list.innerHTML = getCountriesFlag(countries);
        } else {
          list.innerHTML = '';
          info.innerHTML = getCountriesInfo(countries);
          console.log(countries);
        }
      })
      .catch(error => Notify.failure('Oops, there is no country with that name'));
  }
}

function getCountriesFlag(countries) {
  const markup = countries
    .map(countriesFlag => {
      return `<li class="desc">
        <img src="${countriesFlag.flags.svg}" alt="${countriesFlag.name}"> 
        <p>${countriesFlag.name.common}</p>       
        </li>`;
    })
    .join('');
  return markup;
}

function getCountriesInfo(countries) {
  const markup = countries
    .map(countrie => {
      return `<span class="title"><img src="${countrie.flags.svg}" alt="${countrie.name} "> 
            <p class="name"><strong>${countrie.name.common}</strong></p></span>
            <p class="official"><b>Official name:</b> ${countrie.name.official}</p>
            <p class="capital"><b>Capital:</b> ${countrie.capital}</p>
            <p class="population"><b>Population:</b> ${countrie.population}</p>             
            <p class="languages"><b>Languages:</b> ${Object.values(countrie.languages)}</p>`;
    })
    .join('');
  return markup;
}
