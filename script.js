let comicData;
let comicChapters = [];

let chapterAscending = true;

// Load the comic database
fetch("data/comic.json")
    .then(response => response.json())
    .then(data => {

        comicData = data;

        // Comic cover
        document.getElementById("cover").src =
            data.comic.cover;

        // Comic name
        document.getElementById("name").textContent =
            data.comic.name;


        // Description
        document.getElementById("description").textContent =
            data.comic.description;

   

        // Status
        document.getElementById("status").textContent =
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

            data.volumes.forEach(volume =>

            {

                // Create volume card
                const volumeCard = document.createElement("div");

                volumeCard.classList.add("volumeCard");

                // Cover container
                const coverContainer = document.createElement("div");

                coverContainer.classList.add("coverContainer");

                // Volume cover
                const cover = document.createElement("img");

                cover.src = volume.cover;

                cover.alt = "cover " + volume.id;


                // Volume title
                const title = document.createElement("h2");

                title.textContent =
                   
                    volume.title;

                // Chapter number
                const chapterNumber = document.createElement("span");

                chapterNumber.textContent = volume.total_chapters;

                // Put number on cover
                coverContainer.appendChild(cover);
                coverContainer.appendChild(chapterNumber);


                // Select button
                const button = document.createElement("button");

                button.textContent = " Select Volume";


                // When clicked
                button.onclick = function () {

                    window.location.href =
                        "chapters.html?volume=" +
                        volume.id;

                };


                // Add everything to card
                volumeCard.appendChild(coverContainer);

                volumeCard.appendChild(title);

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



// ==========================
// CHAPTER SELECTOR
// ==========================



function loadChapters() {

    const chapterList =
        document.getElementById("chapterList");



    // If we're not on chapters.html
    if (!chapterList) {
        return;
    }


    // Get volume ID from URL
    const urlParams =
        new URLSearchParams(window.location.search);


    const volumeId =
        urlParams.get("volume");


    console.log("Selected volume:", volumeId);


    // If no volume was selected
    if (!volumeId) {

        chapterList.textContent =
            "No volume selected.";

        return;

    }


    fetch("data/comic.json")

        .then(response => response.json())

        .then(data => {

            // Find the selected volume
            const volume =
                data.volumes.find(
                    volume => volume.id == volumeId
                );


            // If volume doesn't exist
            if (!volume) {

                chapterList.textContent =
                    "Volume not found.";

                return;

            }


            // Show volume cover
            document.getElementById("volumeCover").src =
                volume.cover;


            // Show volume title
            document.getElementById("volumeTitle").textContent =
               
                volume.title;


            // Find chapters belonging to this volume
            comicChapters =
                data.chapters.filter(
                    chapter => chapter.v_id == volumeId
                );


            // Show number of chapters
            document.getElementById("chapterTotal").textContent =
                comicChapters.length +
                " chapters";


            // Display chapters
            displayChapters();

        })

        .catch(error => {

            console.error(
                "Error loading chapters:",
                error
            );

            chapterList.textContent =
                "Could not load chapters.";

        });

}


// ==========================
// SORT CHAPTERS
// ==========================

function sortChapters() {

    chapterAscending =
        !chapterAscending;


    const sortButton =
        document.getElementById("sortButton");


    if (chapterAscending) {

        sortButton.textContent =
            "Chapter 1 → Last";

    } else {

        sortButton.textContent =
            "Last → Chapter 1";

    }


    displayChapters();

}


// ==========================
// DISPLAY CHAPTERS
// ==========================

function displayChapters() {

    const chapterList =
        document.getElementById("chapterList");


    chapterList.innerHTML = "";


    // Copy chapters
    let chapters =
        [...comicChapters];


    // Sort by chapter number
    chapters.sort(
        (a, b) =>
            Number(a.chapter_number) -
            Number(b.chapter_number)
    );


    // Reverse if needed
    if (!chapterAscending) {

        chapters.reverse();

    }


    // Create each chapter
    chapters.forEach(chapter => {

        // Main card
        const chapterCard =
            document.createElement("div");

        chapterCard.classList.add(
            "chapterCard"
        );


        // Top row
        const topRow =
            document.createElement("div");

        topRow.classList.add("chapterTopRow");


        // Left side
        const leftSide =
            document.createElement("div");


        // Chapter number
        const number =
            document.createElement("h2");

        number.textContent =
            "Chapter " +
            chapter.chapter_number;


        // Chapter title
        const title =
            document.createElement("h3");

        title.textContent =
            chapter.tittle;


        // Date
        const date =
            document.createElement("p");

        date.textContent =
            chapter.date;

        // writer
        const writer =
            document.createElement("p");

        writer.textContent =
            "Writer: " +
            chapter.writer;


        // Right side
        const rightSide =
            document.createElement("div");

        rightSide.classList.add("chapterRightSide");


        // Number of pages
        const pages =
            document.createElement("span");

        pages.textContent =
            chapter.number_of_pages +
            " pages";


        // Reader button
        const button =
            document.createElement("button");

        button.textContent =
            "Read Chapter";


        button.onclick = function () {

            window.location.href =
                "reader.html?chapter=" +
                chapter.chapter_id;

        };


        // Build left side
        leftSide.appendChild(number);
        leftSide.appendChild(title);
        leftSide.appendChild(date);
        leftSide.appendChild(writer);


        // Build right side
        rightSide.appendChild(pages);
        rightSide.appendChild(button);


        // Build card
        topRow.appendChild(leftSide);
        topRow.appendChild(rightSide);

        chapterCard.appendChild(topRow);


        // Add card
        chapterList.appendChild(chapterCard);

    });

}

// ==========================
// COMIC READER
// ==========================

let currentChapter = null;

let currentPage = 0;


// Load reader
function loadReader() {

    const comicPage =
        document.getElementById("comicPage");


    // If we're not on reader.html
    if (!comicPage) {
        return;
    }


    // Get chapter ID from URL
    const urlParams =
        new URLSearchParams(window.location.search);


    const chapterId =
        urlParams.get("chapter");


    // If no chapter was selected
    if (!chapterId) {

        document.getElementById("readerTitle").textContent =
            "No chapter selected.";

        return;

    }


    console.log(
        "Selected chapter:",
        chapterId
    );


    // Load database
    fetch("data/comic.json")

        .then(response => response.json())

        .then(data => {

            // Find chapter
            currentChapter =
                data.chapters.find(
                    chapter =>
                        chapter.chapter_id == chapterId
                );


            // Chapter doesn't exist
            if (!currentChapter) {

                document.getElementById("readerTitle").textContent =
                    "Chapter not found.";

                return;

            }


            // Show chapter title
            document.getElementById("readerTitle").textContent =
                "Chapter " +
                currentChapter.chapter_number +
                ": " +
                currentChapter.tittle;


            // Start at page 1
            currentPage = 0;


            // Show page
            showPage();

        })

        .catch(error => {

            console.error(
                "Error loading reader:",
                error
            );

        });

}

// ==========================
// GET PAGE PATH
// ==========================

function getPagePath(chapter, pageNumber) {

    return "images/volume" +
        chapter.v_id +
        "/chapter" +
        chapter.chapter_number +
        "/page (" +
        pageNumber +
        ").png";
}


// ==========================
// SHOW CURRENT PAGE
// ==========================

function showPage() {

    // Make sure a chapter exists
    if (!currentChapter) {
        return;
    }

    const comicPage =
        document.getElementById("comicPage");

    const pageNumber =
        document.getElementById("pageNumber");

    const totalPages =
        Number(currentChapter.number_of_pages);


    // Make sure the page exists
    if (currentPage < 0 || currentPage >= totalPages) {
        return;
    }


    // Create the page path automatically
    const pagePath =
        getPagePath(
            currentChapter,
            currentPage + 1
        );


    // Show image
    comicPage.src = pagePath;


    // Show page number
    pageNumber.textContent =
        "Page " +
        (currentPage + 1) +
        " / " +
        totalPages;
}


// ==========================
// NEXT PAGE
// ==========================

function nextPage() {

    if (!currentChapter) {
        return;
    }

    const totalPages =
        Number(currentChapter.number_of_pages);


    if (currentPage < totalPages - 1) {

        currentPage++;

        showPage();
    }
}



// ==========================
// PREVIOUS PAGE
// ==========================

function previousPage() {

    if (!currentChapter) {
        return;
    }


    if (currentPage > 0) {

        currentPage--;

        showPage();
    }
}


// ==========================
// BACK TO CHAPTERS
// ==========================

function goToChapters() {

    if (!currentChapter) {

        window.location.href =
            "chapters.html";

        return;

    }


    window.location.href =
        "chapters.html?volume=" +
        currentChapter.v_id;

}

// ==========================
// NEXT CHAPTER
// ==========================

function nextChapter() {

    if (!currentChapter) {
        return;
    }


    // Load database
    fetch("data/comic.json")

        .then(response => response.json())

        .then(data => {

            // Find chapters from the same volume
            const volumeChapters =
                data.chapters.filter(
                    chapter =>
                        chapter.v_id == currentChapter.v_id
                );


            // Find current chapter's position
            const currentIndex =
                volumeChapters.findIndex(
                    chapter =>
                        chapter.chapter_id ==
                        currentChapter.chapter_id
                );


            // Find next chapter
            const nextChapter =
                volumeChapters[currentIndex + 1];


            // No next chapter
            if (!nextChapter) {

                const button =
                    document.getElementById(
                        "nextChapterButton"
                    );


                button.textContent =
                    "No More Chapters";


                button.disabled = true;


                return;

            }


            // Go to next chapter
            window.location.href =
                "reader.html?chapter=" +
                nextChapter.chapter_id;

        });

}

// ==========================
// PREVIOUS CHAPTER
// ==========================

function previousChapter() {

    if (!currentChapter) {
        return;
    }


    // Load database
    fetch("data/comic.json")

        .then(response => response.json())

        .then(data => {

            // Find chapters from the same volume
            const volumeChapters =
                data.chapters.filter(
                    chapter =>
                        chapter.v_id == currentChapter.v_id
                );


            // Find current chapter position
            const currentIndex =
                volumeChapters.findIndex(
                    chapter =>
                        chapter.chapter_id ==
                        currentChapter.chapter_id
                );


            // Find previous chapter
            const previousChapter =
                volumeChapters[currentIndex - 1];


            // No previous chapter
            if (!previousChapter) {

                const button =
                    document.getElementById(
                        "previousChapterButton"
                    );


                button.textContent =
                    "No Previous Chapter";


                button.disabled = true;


                return;

            }


            // Go to previous chapter
            window.location.href =
                "reader.html?chapter=" +
                previousChapter.chapter_id;

        });

}

// Run reader
loadReader();

// ==========================
// Make buttons to travel to html
// ==========================

// Start reading
function startReading() {

    window.location.href = "reader.html";

}



// Go to volume selector
function goToVolumes() {
    console.log("✅ goToVolumes() worked!");
    window.location.href = "volumes.html";

}


// Go back to Index
function goToIndex() {

    window.location.href = "index.html";

}

// Go to About
function goToAbout() {

    window.location.href = "about.html";
}


// Run the volume loader
loadVolumes();
loadChapters();



// SHOW CURRENT PAGE