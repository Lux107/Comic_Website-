let comicData;


// Load the comic database
fetch("data/comic.json")
    .then(response => response.json())
    .then(data => {

        comicData = data;

        // Comic name
        document.getElementById("comicName").textContent =
            data.comic.name;

        // Comic cover
        document.getElementById("cover").src =
            data.comic.cover;

        // Description
        document.getElementById("comicDescription").textContent =
            data.comic.description;

        // Status
        document.getElementById("comicStatus").textContent =
            data.comic.status;

        // Last updated
        document.getElementById("lastUpdated").textContent =
            data.comic.lastUpdated;

        // Tags
        const tagsContainer =
            document.getElementById("comicTags");


        data.comic.tags.forEach(tag => {

            const tagElement =
                document.createElement("span");

            tagElement.textContent = tag;

            tagsContainer.appendChild(tagElement);
        });

    })
    .catch(error => {
        console.error("Error loading comic data:", error);
    });



// Start reading
function startReading() {

    window.location.href = "reader.html";

}



// Go to volume selector
function goToVolumes() {
    console.log("✅ goToVolumes() worked!");
    window.location.href = "volumes.html";

}



// Go to About
function goToAbout() {

    window.location.href = "about.html";

}

// ==========================
// VOLUME SELECTOR
// ==========================

function loadVolumes() {

    const volumeList = document.getElementById("volumeList");

    if (!volumeList) {
        return;
    }

    fetch("data/comic.json")
        .then(response => response.json())
        .then(data => {

            volumeList.innerHTML = "";

            data.volumes.forEach(volume => {

                // Create volume card
                const volumeCard = document.createElement("div");

                volumeCard.classList.add("volumeCard");


                // Volume cover
                const cover = document.createElement("img");

                cover.src = volume.cover;

                cover.alt = "Volume " + volume.id;


                // Volume title
                const title = document.createElement("h2");

                title.textContent =
                    "Volume " +
                    volume.id +
                    ": " +
                    volume.title;


                // Chapter count
                const total_chapters = document.createElement("p");

                chapterCount.textContent =
                    volume.total_chapters +
                    " chapters";


                // Select button
                const button = document.createElement("button");

                button.textContent = "Select Volume";


                // When clicked
                button.onclick = function () {

                    window.location.href =
                        "chapters.html?volume=" +
                        volume.id;

                };


                // Add everything to card
                volumeCard.appendChild(cover);

                volumeCard.appendChild(title);

                volumeCard.appendChild(total_chapters);

                volumeCard.appendChild(button);


                // Add card to page
                volumeList.appendChild(volumeCard);

            });

        })

        .catch(error => {

            console.error(
                "Error loading volumes:",
                error
            );

            volumeList.textContent =
                "Could not load volumes.";

        });

}


// Go back to Index
function goToIndex() {

    window.location.href = "index.html";

}


// Run the volume loader
loadVolumes();

