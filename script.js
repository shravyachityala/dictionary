// main.js
const wrapper = document.querySelector(".wrapper"),
    searchInput = wrapper.querySelector("input"),
    volume = wrapper.querySelector(".word i"),
    infoText = wrapper.querySelector(".info-text"),
    synonymsContainer = wrapper.querySelector(".synonyms .list"),
    removeIcon = wrapper.querySelector(".search span");

let audio;

function fetchApi(word) {
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`) 
        .then(response => response.json())
        .then(result => data(result, word))
        .catch(() => {
            infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please try another word.`;
        });
}

function data(result, word) {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please try another word.`;
    } else {
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0];
        let phonetics = result[0].phonetics[0] || {};

        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = `${result[0].meanings[0].partOfSpeech} /${phonetics.text || ""}/`;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example || "No example available.";

        audio = phonetics.audio ? new Audio(phonetics.audio) : null;

        if (definitions.synonyms && definitions.synonyms.length > 0) {
            synonymsContainer.innerHTML = "";
            definitions.synonyms.slice(0, 5).forEach(syn => {
                let tag = `<span onclick="search('${syn}')">${syn}</span>`;
                synonymsContainer.insertAdjacentHTML("beforeend", tag);
            });
        } else {
            synonymsContainer.innerHTML = "<span>No synonyms available</span>";
        }
    }
}

function search(word) {
    fetchApi(word);
    searchInput.value = word;
}

searchInput.addEventListener("keyup", e => {
    let word = e.target.value.trim();
    if (e.key === "Enter" && word) {
        search(word);
    }
});

volume.addEventListener("click", () => {
    if (audio) {
        volume.style.color = "#4D59FB";
        audio.play();
        setTimeout(() => {
            volume.style.color = "#999";
        }, 800);
    }
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
