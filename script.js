const form = document.querySelector(".search-form");
const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const emptyMessage = document.getElementById("emptyMessage");
const resultCount = document.getElementById("resultCount");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const query = input.value.trim();

    if (query === "") {
        return;
    }

    results.innerHTML = "";
    emptyMessage.style.display = "none";
    resultCount.textContent = "Searching...";

    const url =
        "https://commons.wikimedia.org/w/api.php" +
        "?action=query" +
        "&generator=search" +
        "&gsrsearch=" + encodeURIComponent(query) +
        "&gsrnamespace=6" +
        "&gsrlimit=20" +
        "&prop=imageinfo" +
        "&iiprop=url" +
        "&iiurlwidth=500" +
        "&format=json" +
        "&origin=*";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        if (!data.query || !data.query.pages) {
            resultCount.textContent = "Showing 0 results";
            emptyMessage.style.display = "block";
            emptyMessage.textContent = "No results found";
            return;
        }

        const pages = Object.values(data.query.pages);

        pages.forEach(function (page) {
            const imageUrl = page.imageinfo?.[0]?.thumburl ||
                             page.imageinfo?.[0]?.url;

            if (!imageUrl) {
                return;
            }

            const card = document.createElement("article");
            card.className = "image-card";

            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = page.title.replace("File:", "");

            const caption = document.createElement("p");
            caption.textContent = page.title.replace("File:", "");

            card.appendChild(image);
            card.appendChild(caption);

            results.appendChild(card);
        });

        resultCount.textContent = "Showing " + pages.length + " results";

    } catch (error) {
        resultCount.textContent = "Unable to load results";
    }
});


const quickButtons = document.querySelectorAll(".quick-search button");

quickButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        input.value = button.textContent;
        form.requestSubmit();
    });
});