let comicData;
let comicChapters = [];

// ==========================
// GLOBAL VARIABLES
// ==========================

let volumeAscending = true;
let chapterAscending = true;

// ==========================
// Main page 
// ==========================

// Load the comic database
fetch("data/comic.json")
    .then(response => response.json())
    .then(data => {

        comicData = data;

        // Comic name
        document.getElementById("name").textContent =
            data.comic.name;

        // Comic cover rotation

        const cover = document.getElementById("cover");

        // Make a copy of the cover list
        let coverOrder = [...data.comic.cover];

        // Shuffle the covers
        coverOrder.sort(() => Math.random() - 0.5);

        let currentCover = 0;

        cover.src = coverOrder[currentCover];

        setInterval(() => {

            currentCover++;

            // Shuffle again after showing all covers
            if (currentCover >= coverOrder.length) {

                coverOrder.sort(() => Math.random() - 0.5);

                currentCover = 0;
            }

            cover.src = coverOrder[currentCover];

        }, 10000);


        


// Recent Chapters

const recentChapters =
    document.getElementById("recentChapters");

const latestChapters =
    [...data.chapters]
        .filter(chapter => chapter.v_id && chapter.date)
        .sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        )
        .slice(0, 3);

latestChapters.forEach(chapter => {

    const chapterElement =
        document.createElement("div");

    chapterElement.classList.add("recentChapter");

    // Find the volume this chapter belongs to
    const volume = data.volumes.find(
        volume => volume.id == chapter.v_id
    );

    // Get the type (Comic or Written)
    const type = volume?.Type || "Comic";

    chapterElement.innerHTML = `
    <a href="reader.html?chapter=${chapter.chapter_id}">
        <h3>${chapter.tittle}</h3>
        <p>${chapter.date}</p>
        <span class="chapterType ${type.toLowerCase()}">${type}</span>
    </a>
`;

    recentChapters.appendChild(chapterElement);

});

    }) // Closes .then(data => { ... })
    .catch(error => {
        console.error("Error loading comic data:", error);
    });

// ==========================
// VOLUME SELECTOR
// ==========================

function loadVolumes() {

    const volumeList =
        document.getElementById("volumeList");

    if (!volumeList) {
        return;
    }

    fetch("data/comic.json")
        .then(response => response.json())
        .then(data => {

            volumeList.innerHTML = "";

            data.volumes
                .sort((a, b) => {

                    if (volumeAscending) {

                        return Number(a.id) - Number(b.id);

                    } else {

                        return Number(b.id) - Number(a.id);

                    }
                })
                .forEach(volume => {

                // Create volume card
                    const volumeCard =
                        document.createElement("div");

                    volumeCard.classList.add("volumeCard");
                    // Make finished volume grey
                    if (volume.finished === true) {

                        volumeCard.classList.add("finished");

                    }


                // Cover container
                    const coverContainer =
                        document.createElement("div");

                coverContainer.classList.add("coverContainer");

                // Volume cover
                    const cover =
                        document.createElement("img");

                cover.src = volume.cover;

                cover.alt = "cover " + volume.id;


                // Volume title
                    const title =
                        document.createElement("h2");

                title.textContent =
                   
                    volume.title;

                // Chapter number
                    const chapterNumber =
                        document.createElement("span");

                chapterNumber.textContent = volume.total_chapters;

                // Put number on cover
                coverContainer.appendChild(cover);
                coverContainer.appendChild(chapterNumber);


                // Select button
                    const button =
                        document.createElement("button");

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
                    // Finished status
                    if (volume.finished === true) {

                        const finishedText =
                            document.createElement("p");

                        finishedText.textContent =
                            "Finished";

                        finishedText.classList.add(
                            "finishedText"
                        );

                        volumeCard.appendChild(
                            finishedText
                        );

                    }
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
// SORT VOLUMES
// ==========================

function sortVolumes() {

    volumeAscending =
        !volumeAscending;


    const sortButton =
        document.getElementById("sortButton");


    if (volumeAscending) {

        sortButton.textContent =
            "Volume 1 → Last";

    } else {

        sortButton.textContent =
            "Last → Volume 1";

    }


    loadVolumes();

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
let currentVolume = null;
let currentPage = 0;
let writtenPages = [];



// Load reader
function loadReader() {

    const comicPage = document.getElementById("comicPage");

    if (!comicPage) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const chapterId = urlParams.get("chapter");

    if (!chapterId) {
        document.getElementById("readerTitle").textContent =
            "No chapter selected.";
        return;
    }

    fetch("data/comic.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load comic.json");
            }
            return response.json();
        })
        .then(data => {

            // Find chapter
            currentChapter = data.chapters.find(
                chapter => chapter.chapter_id == chapterId
            );

            if (!currentChapter) {
                document.getElementById("readerTitle").textContent =
                    "Chapter not found.";
                return;
            }

            // Find the volume belonging to this chapter
            currentVolume = data.volumes.find(
                volume => volume.id == currentChapter.v_id
            );

            if (!currentVolume) {
                document.getElementById("readerTitle").textContent =
                    "Volume not found.";
                return;
            }

            document.getElementById("readerTitle").textContent =
                "Chapter " +
                currentChapter.chapter_number +
                ": " +
                currentChapter.tittle;

            currentPage = 0;

            // Choose the reader using the volume Type
            if (currentVolume.Type.toLowerCase() === "written") {
                loadWrittenStory();
            } else {
                showPage();
            }

        })
        .catch(error => {
            console.error("Error loading reader:", error);
            document.getElementById("readerTitle").textContent =
                "Could not load chapter.";
        });
}
// ==========================
// GET COMIC PAGE PATH
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
// LOAD WRITTEN STORY
// ==========================

function loadWrittenStory() {

    const comicPage = document.getElementById("comicPage");
    const writtenPage = document.getElementById("writtenPage");

    comicPage.style.display = "none";
    writtenPage.style.display = "block";

    // One TXT file per chapter
    const textPath =
        "stories/volume" +
        currentChapter.v_id +
        "/chapter" +
        currentChapter.chapter_number +
        ".txt";

    fetch(textPath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not load " + textPath);
            }
            return response.text();
        })
        .then(text => {

            // Split the story into readable pages
            writtenPages = paginateText(text, 1800);

            if (writtenPages.length === 0) {
                writtenPages = ["This story is empty."];
            }

            currentPage = 0;
            showPage();

        })
        .catch(error => {
            console.error("Error loading story:", error);
            writtenPage.textContent =
                "Could not load this story. Check the TXT file path.";
            document.getElementById("pageNumber").textContent = "";
        });
}

// ==========================
// DIVIDE TEXT INTO PAGES
// ==========================

function paginateText(text, maxChars) {

    const paragraphs = text.trim().split(/\n\s*\n/);
    const pages = [];
    let page = "";

    paragraphs.forEach(paragraph => {

        paragraph = paragraph.trim();

        if (!paragraph) {
            return;
        }

        // Split extra-long paragraphs at word boundaries
        const words = paragraph.split(/\s+/);
        let part = "";

        words.forEach(word => {

            if (part && (part.length + word.length + 1 > maxChars)) {

                // Add the completed part to the current page
                if (page && page.length + part.length + 2 > maxChars) {
                    pages.push(page);
                    page = "";
                }

                page += (page ? "\n\n" : "") + part;
                pages.push(page);
                page = "";
                part = word;

            } else {
                part += (part ? " " : "") + word;
            }

        });

        if (part) {

            if (page && page.length + part.length + 2 > maxChars) {
                pages.push(page);
                page = "";
            }

            page += (page ? "\n\n" : "") + part;
        }

    });

    if (page) {
        pages.push(page);
    }

    return pages;
}



// ==========================
// SHOW CURRENT PAGE
// ==========================

function showPage() {

    if (!currentChapter || !currentVolume) {
        return;
    }

    const comicPage = document.getElementById("comicPage");
    const writtenPage = document.getElementById("writtenPage");
    const pageNumber = document.getElementById("pageNumber");

    // WRITTEN STORY
    if (currentVolume.Type.toLowerCase() === "written") {

        const totalPages = writtenPages.length;

        if (currentPage < 0 || currentPage >= totalPages) {
            return;
        }

        comicPage.style.display = "none";
        writtenPage.style.display = "block";

        // textContent safely displays the story as text
        writtenPage.textContent = writtenPages[currentPage];

        pageNumber.textContent =
            "Page " + (currentPage + 1) + " / " + totalPages;

        return;
    }

    // COMIC
    const totalPages = Number(currentChapter.number_of_pages);

    if (currentPage < 0 || currentPage >= totalPages) {
        return;
    }

    writtenPage.style.display = "none";
    comicPage.style.display = "block";

    comicPage.src = getPagePath(currentChapter, currentPage + 1);

    pageNumber.textContent =
        "Page " + (currentPage + 1) + " / " + totalPages;
}

// ==========================
// GET TOTAL PAGES
// ==========================

function getTotalPages() {

    if (currentVolume.Type.toLowerCase() === "written") {
        return writtenPages.length;
    }

    return Number(currentChapter.number_of_pages);
}

// ==========================
// NEXT PAGE
// ==========================

function nextPage() {

    if (!currentChapter || !currentVolume) {
        return;
    }

    const totalPages = getTotalPages();

    if (currentPage < totalPages - 1) {
        currentPage++;
        showPage();
    }
}


// ==========================
// PREVIOUS PAGE
// ==========================

function previousPage() {

    if (!currentChapter || !currentVolume) {
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



