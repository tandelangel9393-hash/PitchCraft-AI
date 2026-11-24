import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    // AUTHENTICATION
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userAvatar = document.getElementById("userAvatar");
    const logoutBtn = document.getElementById("logoutBtn");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const name = user.displayName || "User";

            userName.textContent = name;
            userEmail.textContent = user.email || "";
            userAvatar.textContent = name.charAt(0).toUpperCase();
        } else {
            window.location.href = "login.html";
        }
    });

    logoutBtn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to logout?")) return;

        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            alert("Unable to logout. Please try again.");
            console.error(error);
        }
    });

    // EDITOR ELEMENTS
    const slidesList = document.getElementById("slidesList");
    const slideCanvas = document.getElementById("slideCanvas");
    const slideHeading = document.getElementById("slideHeading");
    const slideSubtitle = document.getElementById("slideSubtitle");

    const addSlideBtn = document.getElementById("addSlideBtn");
    const saveBtn = document.getElementById("saveBtn");
    const presentBtn = document.getElementById("presentBtn");

    const presentationTitle = document.getElementById("presentationTitle");
    const saveStatus = document.getElementById("saveStatus");

    const slideBackground = document.getElementById("slideBackground");
    const headingColor = document.getElementById("headingColor");
    const fontSize = document.getElementById("fontSize");
    const textAlign = document.getElementById("textAlign");
    const subtitleText = document.getElementById("subtitleText");

    const applyChangesBtn = document.getElementById("applyChangesBtn");
    const currentSlideNumber = document.getElementById("currentSlideNumber");

    // SLIDE DATA
    let slides = [
        {
            heading: "Presentation Title",
            subtitle: "Add your subtitle here",
            background: "#ffffff",
            headingColor: "#24213b",
            fontSize: "40",
            alignment: "center"
        }
    ];

    let currentSlide = 0;

    const STORAGE_KEY = "pitchcraft_editor_presentation";

    // UPDATE CURRENT SLIDE DATA
    function updateCurrentSlide() {
        slides[currentSlide].heading = slideHeading.innerText;
        slides[currentSlide].subtitle = slideSubtitle.innerText;
    }

    // RENDER SLIDE
    function renderSlide() {
        const slide = slides[currentSlide];

        slideHeading.innerText = slide.heading;
        slideSubtitle.innerText = slide.subtitle;

        slideCanvas.style.backgroundColor = slide.background;
        slideHeading.style.color = slide.headingColor;
        slideHeading.style.fontSize = slide.fontSize + "px";

        slideContentAlignment();

        slideBackground.value = slide.background;
        headingColor.value = slide.headingColor;
        fontSize.value = slide.fontSize;
        textAlign.value = slide.alignment;
        subtitleText.value = slide.subtitle;

        currentSlideNumber.textContent =
            `Slide ${currentSlide + 1} of ${slides.length}`;

        renderThumbnails();
    }

    function slideContentAlignment() {
        document.getElementById("slideContent").style.textAlign =
            slides[currentSlide].alignment;
    }

    // RENDER SLIDE THUMBNAILS
    function renderThumbnails() {
        slidesList.innerHTML = "";

        slides.forEach((slide, index) => {
            const thumbnail = document.createElement("div");

            thumbnail.className =
                "slide-thumbnail" +
                (index === currentSlide ? " active" : "");

            const number = document.createElement("span");
            number.className = "slide-number";
            number.textContent = index + 1;

            const preview = document.createElement("div");
            preview.className = "thumbnail-preview";
            preview.style.backgroundColor = slide.background;

            const heading = document.createElement("h4");
            heading.textContent = slide.heading || "Untitled";
            heading.style.color = slide.headingColor;

            const subtitle = document.createElement("p");
            subtitle.textContent = slide.subtitle;

            preview.append(heading, subtitle);
            thumbnail.append(number, preview);

            thumbnail.addEventListener("click", () => {
                updateCurrentSlide();
                currentSlide = index;
                renderSlide();
            });

            slidesList.appendChild(thumbnail);
        });
    }

    // ADD NEW SLIDE
    addSlideBtn.addEventListener("click", () => {
        updateCurrentSlide();

        slides.push({
            heading: "New Slide",
            subtitle: "Add your content here",
            background: "#ffffff",
            headingColor: "#24213b",
            fontSize: "40",
            alignment: "center"
        });

        currentSlide = slides.length - 1;
        renderSlide();

        saveStatus.textContent = "Unsaved changes";
    });

    // APPLY SLIDE CHANGES
    applyChangesBtn.addEventListener("click", () => {
        updateCurrentSlide();

        slides[currentSlide].background = slideBackground.value;
        slides[currentSlide].headingColor = headingColor.value;
        slides[currentSlide].fontSize = fontSize.value;
        slides[currentSlide].alignment = textAlign.value;
        slides[currentSlide].subtitle = subtitleText.value;

        renderSlide();

        saveStatus.textContent = "Changes applied";
    });

    // TRACK DIRECT TEXT EDITING
    slideHeading.addEventListener("input", () => {
        slides[currentSlide].heading = slideHeading.innerText;
        renderThumbnails();
        saveStatus.textContent = "Unsaved changes";
    });

    slideSubtitle.addEventListener("input", () => {
        slides[currentSlide].subtitle = slideSubtitle.innerText;
        subtitleText.value = slideSubtitle.innerText;
        renderThumbnails();
        saveStatus.textContent = "Unsaved changes";
    });

    // SAVE PRESENTATION
    saveBtn.addEventListener("click", () => {
        updateCurrentSlide();

        const presentation = {
            title: presentationTitle.value,
            slides: slides
        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(presentation)
        );

        saveStatus.textContent = "Saved successfully!";
    });

    // RESTORE SAVED PRESENTATION
    const savedPresentation = localStorage.getItem(STORAGE_KEY);

    if (savedPresentation) {
        try {
            const savedData = JSON.parse(savedPresentation);

            if (Array.isArray(savedData.slides) && savedData.slides.length > 0) {
                slides = savedData.slides;
                presentationTitle.value =
                    savedData.title || "Untitled Presentation";
            }
        } catch (error) {
            console.error("Unable to load saved presentation:", error);
        }
    }

    // PRESENTATION MODE
    presentBtn.addEventListener("click", async () => {
        updateCurrentSlide();

        slideCanvas.style.position = "fixed";
        slideCanvas.style.inset = "0";
        slideCanvas.style.width = "100vw";
        slideCanvas.style.height = "100vh";
        slideCanvas.style.maxWidth = "none";
        slideCanvas.style.aspectRatio = "auto";
        slideCanvas.style.zIndex = "9999";
        slideCanvas.style.borderRadius = "0";

        try {
            await slideCanvas.requestFullscreen();
        } catch (error) {
            console.error("Fullscreen unavailable:", error);
        }

        document.addEventListener("fullscreenchange", function restoreCanvas() {
            if (!document.fullscreenElement) {
                slideCanvas.removeAttribute("style");
                renderSlide();
                document.removeEventListener(
                    "fullscreenchange",
                    restoreCanvas
                );
            }
        });
    });

    // PRESENTATION TITLE
    presentationTitle.addEventListener("input", () => {
        saveStatus.textContent = "Unsaved changes";
    });

    // INITIAL RENDER
    renderSlide();

    console.log("PitchCraft Editor Loaded Successfully!");
});
