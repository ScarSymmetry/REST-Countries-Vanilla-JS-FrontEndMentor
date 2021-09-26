export const modalContainer = document.querySelector(".modal__container");
export const modal = document.querySelector(".modal");

export async function getDetailedFetch(countryCode) {
	try {
		const detailedFetch = await fetch(
			`https://restcountries.eu/v3/alpha/${countryCode}?fields=name;nativeName;population;region;subregion;capital;topLevelDomain;currencies;languages;borders;flag`
		);
		const jsonCountry = await detailedFetch.json();

		return jsonCountry;
	} catch (err) {
		alert(err.message);
	}
}

export function commaSeparated(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function openModal(countryData, allCountriesData) {
	const {
		name,
		nativeName,
		population,
		region,
		subregion,
		capital,
		topLevelDomain,
		currencies,
		languages,
		borders,
		flag,
	} = countryData;

	const renderBorders = allCountriesData
		.filter((country) => borders.includes(country.alpha3Code))
		.map((border) => {
			return `<button class="border-button" data-code=${border.alpha3Code}>${border.name}</button>`;
		})
		.join(" ");

	modalContainer.innerHTML = `
	

	<div class="modal-imagebox">
	<img src=${flag} alt="" class="modal__image">
	</div>
	  
	      <div class="modal-data">
        <div class="modal-textleft">

            <h2 class="modal__country">${name}</h2>

            <p class="modal__native">Native Name: <span>${nativeName}</span></p>
            <p class="modal__population">Population:<span> ${commaSeparated(
							population
						)}</span></p>
            <p class="modal__region">Region: <span>${region}</span></p>
            <p class="modal__subregion">Sub Region: <span>${subregion}</span></p>
            <p class="modal__capital">Capital: <span>${capital}</span></p>
        </div>

        <div class="modal-textright">
            <p class="modal__domain">Top Level Domain:<span> ${topLevelDomain}</span></p>
            <p class="modal__currencies">Currencies: <span>${currencies.map(
							(currency) => currency.code
						)}</span></p>
            <p class="modal__languages">Languages: <span>${languages.map(
							(language) => language.name
						)}</span></p>

            <div class="borders">Borders:${
							borders.length > 0 ? renderBorders : "This country is lonely AF"
						}</div>
        </div>
    </div>
			
              
				
	`;

	modal.appendChild(modalContainer);
}
