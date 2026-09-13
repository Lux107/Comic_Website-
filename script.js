let comicData;

fetch("data/comic.json")
    .then(response => response.json())
    .then(data => {

        comicData = data;

        document.getElementById("comicName").textContent =
            data.comic.name;

        document.getElementById("comicCover").src =
            data.comic.cover;

        document.getElementById("comicDescription").textContent =
            data.comic.description;

        document.getElementById("comicStatus").textContent =
            data.comic.status;

        document.getElementById("chapterCount").textContent =
            data.comic.chapters;

        document.getElementById("lastUpdated").textContent =
            data.comic.lastUpdated;

        const tagsContainer =
            document.getElementById("comicTags");

        data.comic.tags.forEach(tag => {

            const tagElement = document.createElement("span");

            tagElement.textContent = tag;

            tagsContainer.appendChild(tagElement);

        });

    })
    .catch(error => {

        console.error("Error loading comic data:", error);

    });


function startReading() {

    window.location.href = "reader.html";

}


function goToChapters() {

    window.location.href = "chapters.html";

}


function goToAbout() {

    window.location.href = "about.html";

}