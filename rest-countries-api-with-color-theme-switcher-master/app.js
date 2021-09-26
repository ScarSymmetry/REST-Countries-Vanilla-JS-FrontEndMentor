import "regenerator-runtime/runtime";
import {
	commaSeparated,
	getDetailedFetch,
	openModal,
	modalContainer,
	modal,
} from "./helpers";

const container = document.querySelector(".container");
const input = document.querySelector(".search-field");
const select = document.querySelector(".drop-list");
const title = document.querySelector(".title");
const themeToggler = document.querySelector(".toggler");
const togglerText = document.querySelector(".toggler__mode");
const backButton = document.querySelector(".back-button");
const loader = document.querySelector(".loader");

let searchLetter = "";

const countriesData = fetch("https://restcountries.com/v2/all")
	.then((response) => response.json())
	.then((data) => data);

(async () => {
	try {
		renderCountry(await countriesData);
		loader.style.display = "none";
	} catch (e) {
		alert(e.message);
	}
})();

const searchFilter = async () => {
	const raw = await countriesData;

	const filtered = raw.filter((data) =>
		data.name.toLowerCase().includes(searchLetter.toLowerCase())
	);

	renderCountry(filtered);
};

const selectRegion = async (region) => {
	const selectRegion = await countriesData;
	const region = selectRegion.filter((data) => data.continent === continent);
	container.innerHTML = "";
	renderCountry(region);
};

async function handleCountryClick(countryCode) {
	const countryData = await getDetailedFetch(countryCode);
	const allCountries = await countriesData;
	modal.style.display = "flex";
	openModal(countryData, allCountries);
}

function renderCountry(data) {
	data.forEach((data) => {
		const countryCard = document.createElement("div");
		countryCard.classList.add("container__card");

		countryCard.innerHTML = `
		<div class="country-card" data-code=${data.alpha3Code}>
		<div class="country-card__wrapper">
		<img src=${data.flags[0]} alt="flag" class="country-card__flag">
		</div>
		 
			
            <div class="country-card__info">
                <h3 class="name">${data.name}</h3>
                <p class="population">Population:<span>${commaSeparated(
									data.population
								)}</span></p>
                <p class="region">Region:<span>${data.region}</span></p>
                <p class="capital">Capital:<span>${data.capital}</span></p>
		</div>
		`;

		container.appendChild(countryCard);
	});
}

themeToggler.addEventListener("click", () => {
	document.body.classList.toggle("light");
	document.body.classList.contains("light")
		? (togglerText.textContent = "Dark Mode")
		: (togglerText.textContent = "Light Mode");
});

document.addEventListener("click", (e) => {
	if (e.target.className === "country-card__flag") {
		const testshit = e.target.parentElement.parentElement.dataset.code;
		document.body.classList.add("lock");
		handleCountryClick(testshit);
	}
});

modalContainer.addEventListener("click", (e) => {
	const countryCode = e.target.dataset.code;
	if (e.target.classList.contains("border-button")) {
		handleCountryClick(countryCode);
	}
});

title.addEventListener("click", () => {
	document.location.href = "/";
});

select.addEventListener("change", (e) => {
	input.value = "";
	const region = e.target.value;

	selectRegion(region);
});

input.addEventListener("input", (e) => {
	select.value = "";

	searchLetter = e.target.value;
	const validate = /^[a-zA-Z]+$/;
	if (e.target.value.match(validate)) {
		container.innerHTML = "";
		searchFilter();
	}
});

backButton.addEventListener("click", (e) => {
	modal.style.display = "none";
	document.body.classList.remove("lock");
});
