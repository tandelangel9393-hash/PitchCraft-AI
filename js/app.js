console.log("PitchCraft JavaScript is loading!");
/* =====================================
   PITCHCRAFT AI - ADVANCED SLIDE EDITOR
===================================== */

let currentSlides = [];
let currentSlideIndex = 0;
let currentTheme = "purple";
let currentAlignment = "center";
let currentTitleSize = "large";
let currentFont = "Arial";
let currentLayout = "centered";
let currentBackground = "";
let currentTextColor = "";
let currentPresentationName = "Untitled Presentation";

const slideThemes = {
    purple: {
        background: "linear-gradient(135deg, #f1e8ff, #dfd0ff)",
        color: "#35205f"
    },
    ocean: {
        background: "linear-gradient(135deg, #e0f7ff, #b8dfff)",
        color: "#123d63"
    },
    sunset: {
        background: "linear-gradient(135deg, #fff0df, #ffc5c5)",
        color: "#743b3b"
    },
    pink: {
        background: "linear-gradient(135deg, #ffe5f1, #f4c6e6)",
        color: "#702b58"
    },
    dark: {
        background: "linear-gradient(135deg, #17152d, #39305c)",
        color: "#ffffff"
    },
    nature: {
        background: "linear-gradient(135deg, #e3f5e8, #bce5ce)",
        color: "#20533a"
    },
    minimal: {
        background: "#ffffff",
        color: "#252238"
    }
};

function showEditor(templateName = "Create Your Own") {
    currentSlides = [{
        title: templateName === "Create Your Own"
            ? "Your Presentation Title"
            : templateName,
        subtitle: "Add a short and meaningful subtitle",
        content: "Start writing your presentation content here.",
        image: ""
    }];

    currentSlideIndex = 0;
    currentTheme = "purple";
    currentAlignment = "center";
    currentTitleSize = "large";
    currentFont = "Arial";
    currentLayout = "centered";
    currentBackground = "";
    currentTextColor = "";
    currentPresentationName = templateName === "Create Your Own"
        ? "Untitled Presentation"
        : templateName;

    renderEditor();
}

function escapeEditorText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function getSlideDesign() {
    const theme = slideThemes[currentTheme] || slideThemes.purple;

    return {
        background: currentBackground || theme.background,
        color: currentTextColor || theme.color
    };
}

function renderEditor() {
    const slide = currentSlides[currentSlideIndex];
    const design = getSlideDesign();

    app.innerHTML = `
        <div class="editor-layout">

            <header class="editor-header">
                <a href="#" class="logo"
                   onclick="showDashboard(); return false;">
                    PitchCraft <span>AI</span>
                </a>

                <div class="editor-name-area">
                    <input
                        class="presentation-name"
                        id="presentationName"
                        value="${escapeEditorText(currentPresentationName)}"
                        placeholder="Presentation name"
                        onchange="currentPresentationName = this.value"
                    >
                    <small>Presentation workspace</small>
                </div>

                <div class="editor-header-actions">
                    <button class="editor-back-btn" onclick="showTemplates()">
                        ← Templates
                    </button>
                    <button class="editor-save-btn" onclick="savePresentation()">
                        ▣ Save Draft
                    </button>
                </div>
            </header>

            <div class="editor-workspace">

                <!-- SLIDE PANEL -->
                <aside class="slide-panel">
                    <div class="slide-panel-heading">
                        <div>
                            <h3>Your Slides</h3>
                            <p>${currentSlides.length} slides</p>
                        </div>
                        <button onclick="addSlide()">＋ Add</button>
                    </div>

                    <div class="slide-list">
                        ${currentSlides.map((item, index) => `
                            <div class="slide-thumbnail
                                ${index === currentSlideIndex ? "selected" : ""}"
                                onclick="selectSlide(${index})">

                                <span>SLIDE ${index + 1}</span>
                                <h4>${escapeEditorText(item.title || "Untitled Slide")}</h4>
                                <p>${escapeEditorText(item.subtitle || "")}</p>

                                <div class="slide-thumbnail-actions">
                                    <button title="Duplicate"
                                        onclick="event.stopPropagation(); duplicateSlide(${index})">⧉</button>
                                    <button title="Delete"
                                        onclick="event.stopPropagation(); deleteSlide(${index})">×</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>

                    <button class="add-slide-large" onclick="addSlide()">
                        ＋ Add New Slide
                    </button>
                </aside>

                <!-- MAIN EDITOR -->
                <main class="editor-main">

                    <div class="editor-toolbar">
                        <div class="slide-navigation">
                            <button onclick="previousSlide()" title="Previous slide">←</button>
                            <span>Slide ${currentSlideIndex + 1} of ${currentSlides.length}</span>
                            <button onclick="nextSlide()" title="Next slide">→</button>
                        </div>

                        <button class="preview-button" onclick="showPreview()">
                            ▶ Preview Presentation
                        </button>
                    </div>

                    <div class="slide-canvas slide-layout-${currentLayout}"
                         id="slideCanvas"
                         style="background:${design.background}; color:${design.color}; text-align:${currentAlignment}; font-family:${currentFont};">

                        <div class="slide-canvas-content">

                            <textarea
                                class="slide-title-input size-${currentTitleSize}"
                                placeholder="Enter your slide title..."
                                oninput="updateSlideField('title', this.value)"
                            >${escapeEditorText(slide.title)}</textarea>

                            <textarea
                                class="slide-subtitle-input"
                                placeholder="Add a subtitle..."
                                oninput="updateSlideField('subtitle', this.value)"
                            >${escapeEditorText(slide.subtitle || "")}</textarea>

                            <textarea
                                class="slide-content-input"
                                placeholder="Write your slide content here..."
                                oninput="updateSlideField('content', this.value)"
                            >${escapeEditorText(slide.content)}</textarea>

                            ${slide.image ? `
                                <img class="slide-uploaded-image"
                                     src="${slide.image}"
                                     alt="Uploaded slide image">
                            ` : ""}
                        </div>
                    </div>

                    <div class="editor-footer">
                        <span>✦ PitchCraft AI Editor</span>
                        <span>Slide ${currentSlideIndex + 1}</span>
                    </div>
                </main>

                <!-- DESIGN PANEL -->
                <aside class="design-panel">
                    <div class="design-panel-title">
                        <h3>Design Studio</h3>
                        <p>Make your slide beautiful</p>
                    </div>

                    <div class="design-group">
                        <label>Slide Theme</label>

                        <div class="theme-options">
                            <button class="theme-option purple-theme ${currentTheme === "purple" ? "chosen" : ""}"
                                title="Purple" onclick="changeTheme('purple')"></button>
                            <button class="theme-option blue-theme ${currentTheme === "ocean" ? "chosen" : ""}"
                                title="Ocean" onclick="changeTheme('ocean')"></button>
                            <button class="theme-option sunset-theme ${currentTheme === "sunset" ? "chosen" : ""}"
                                title="Sunset" onclick="changeTheme('sunset')"></button>
                            <button class="theme-option pink-theme ${currentTheme === "pink" ? "chosen" : ""}"
                                title="Pink" onclick="changeTheme('pink')"></button>
                            <button class="theme-option dark-theme ${currentTheme === "dark" ? "chosen" : ""}"
                                title="Midnight" onclick="changeTheme('dark')"></button>
                            <button class="theme-option nature-theme ${currentTheme === "nature" ? "chosen" : ""}"
                                title="Nature" onclick="changeTheme('nature')"></button>
                            <button class="theme-option minimal-theme ${currentTheme === "minimal" ? "chosen" : ""}"
                                title="Minimal" onclick="changeTheme('minimal')"></button>
                        </div>
                        <p class="design-hint">Choose a theme to change your slide design.</p>
                    </div>

                    <div class="design-group">
                        <label>Slide Layout</label>
                        <select onchange="changeLayout(this.value)">
                            <option value="centered" ${currentLayout === "centered" ? "selected" : ""}>Centered</option>
                            <option value="left" ${currentLayout === "left" ? "selected" : ""}>Left Aligned</option>
                            <option value="title-top" ${currentLayout === "title-top" ? "selected" : ""}>Title at Top</option>
                        </select>
                    </div>

                    <div class="design-group">
                        <label>Text Alignment</label>
                        <div class="alignment-options">
                            <button class="${currentAlignment === "left" ? "active" : ""}"
                                onclick="changeAlignment('left')">☰</button>
                            <button class="${currentAlignment === "center" ? "active" : ""}"
                                onclick="changeAlignment('center')">☷</button>
                            <button class="${currentAlignment === "right" ? "active" : ""}"
                                onclick="changeAlignment('right')">☰</button>
                        </div>
                    </div>

                    <div class="design-group">
                        <label>Title Size</label>
                        <select onchange="changeTitleSize(this.value)">
                            <option value="small" ${currentTitleSize === "small" ? "selected" : ""}>Small</option>
                            <option value="medium" ${currentTitleSize === "medium" ? "selected" : ""}>Medium</option>
                            <option value="large" ${currentTitleSize === "large" ? "selected" : ""}>Large</option>
                            <option value="extra-large" ${currentTitleSize === "extra-large" ? "selected" : ""}>Extra Large</option>
                        </select>
                    </div>

                    <div class="design-group">
                        <label>Font Family</label>
                        <select onchange="changeFont(this.value)">
                            <option value="Arial" ${currentFont === "Arial" ? "selected" : ""}>Arial</option>
                            <option value="Inter" ${currentFont === "Inter" ? "selected" : ""}>Inter</option>
                            <option value="Georgia" ${currentFont === "Georgia" ? "selected" : ""}>Georgia</option>
                            <option value="Verdana" ${currentFont === "Verdana" ? "selected" : ""}>Verdana</option>
                            <option value="Trebuchet MS" ${currentFont === "Trebuchet MS" ? "selected" : ""}>Trebuchet MS</option>
                        </select>
                    </div>

                    <div class="design-group">
                        <label>Custom Background</label>
                        <input type="color" value="${currentBackground || "#f1e8ff"}"
                            onchange="changeBackground(this.value)">
                    </div>

                    <div class="design-group">
                        <label>Custom Text Color</label>
                        <input type="color" value="${currentTextColor || "#35205f"}"
                            onchange="changeTextColor(this.value)">
                    </div>

                    <div class="design-group">
                        <label>Upload Slide Image</label>
                        <input type="file" accept="image/*"
                            onchange="uploadSlideImage(event)">
                        <button class="remove-image-btn" onclick="removeSlideImage()">
                            Remove Image
                        </button>
                    </div>

                    <div class="design-group">
                        <button class="reset-design-btn" onclick="resetSlideDesign()">
                            ↺ Reset Design
                        </button>
                    </div>
                </aside>

            </div>
        </div>
    `;
}

function updateSlideField(field, value) {
    currentSlides[currentSlideIndex][field] = value;

    if (field === "title") {
        const thumbnail = document.querySelectorAll(".slide-thumbnail h4")[currentSlideIndex];
        if (thumbnail) {
            thumbnail.textContent = value || "Untitled Slide";
        }
    }

    if (field === "subtitle") {
        const thumbnail = document.querySelectorAll(".slide-thumbnail p")[currentSlideIndex];
        if (thumbnail) {
            thumbnail.textContent = value;
        }
    }
}

function selectSlide(index) {
    if (index < 0 || index >= currentSlides.length) return;
    currentSlideIndex = index;
    renderEditor();
}

function addSlide() {
    currentSlides.push({
        title: "New Slide",
        subtitle: "Add your subtitle",
        content: "Add your content here.",
        image: ""
    });

    currentSlideIndex = currentSlides.length - 1;
    renderEditor();
}

function duplicateSlide(index) {
    const copy = JSON.parse(JSON.stringify(currentSlides[index]));
    currentSlides.splice(index + 1, 0, copy);
    currentSlideIndex = index + 1;
    renderEditor();
}

function deleteSlide(index) {
    if (currentSlides.length === 1) {
        alert("Your presentation must have at least one slide.");
        return;
    }

    if (!confirm("Are you sure you want to delete this slide?")) return;

    currentSlides.splice(index, 1);
    currentSlideIndex = Math.min(index, currentSlides.length - 1);
    renderEditor();
}

function previousSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderEditor();
    }
}

function nextSlide() {
    if (currentSlideIndex < currentSlides.length - 1) {
        currentSlideIndex++;
        renderEditor();
    }
}

function changeTheme(theme) {
    currentTheme = theme;
    currentBackground = "";
    currentTextColor = "";
    renderEditor();
}

function changeAlignment(alignment) {
    currentAlignment = alignment;
    renderEditor();
}

function changeTitleSize(size) {
    currentTitleSize = size;
    renderEditor();
}

function changeFont(font) {
    currentFont = font;
    renderEditor();
}

function changeLayout(layout) {
    currentLayout = layout;
    renderEditor();
}

function changeBackground(color) {
    currentBackground = color;
    renderEditor();
}

function changeTextColor(color) {
    currentTextColor = color;
    renderEditor();
}

function resetSlideDesign() {
    currentTheme = "purple";
    currentAlignment = "center";
    currentTitleSize = "large";
    currentFont = "Arial";
    currentLayout = "centered";
    currentBackground = "";
    currentTextColor = "";
    renderEditor();
}

function uploadSlideImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image.");
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2 MB.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        currentSlides[currentSlideIndex].image = e.target.result;
        renderEditor();
    };

    reader.readAsDataURL(file);
}

function removeSlideImage() {
    currentSlides[currentSlideIndex].image = "";
    renderEditor();
}

function savePresentation() {
    const nameInput = document.getElementById("presentationName");
    currentPresentationName = nameInput
        ? nameInput.value.trim()
        : currentPresentationName.trim();

    if (!currentPresentationName) {
        alert("Please enter a presentation name.");
        return;
    }

    const presentations = JSON.parse(
        localStorage.getItem("pitchcraftPresentations") || "[]"
    );

    let presentationId = window.currentPresentationId;

    const presentation = {
        id: presentationId || Date.now(),
        name: currentPresentationName,
        slides: currentSlides,
        design: {
            theme: currentTheme,
            alignment: currentAlignment,
            titleSize: currentTitleSize,
            font: currentFont,
            layout: currentLayout,
            background: currentBackground,
            textColor: currentTextColor
        },
        updatedAt: new Date().toISOString()
    };

    if (presentationId) {
        const existingIndex = presentations.findIndex(item => item.id === presentationId);

        if (existingIndex !== -1) {
            presentations[existingIndex] = presentation;
        } else {
            presentations.push(presentation);
        }
    } else {
        presentations.push(presentation);
        window.currentPresentationId = presentation.id;
    }

    try {
        localStorage.setItem(
            "pitchcraftPresentations",
            JSON.stringify(presentations)
        );
        alert("Your presentation has been saved successfully!");
    } catch (error) {
        alert("Unable to save. Try removing large images from your slides.");
    }
}

function showPreview() {
    renderPreview();
}

function renderPreview() {
    const slide = currentSlides[currentSlideIndex];
    const design = getSlideDesign();

    app.innerHTML = `
        <section class="presentation-preview-page">

            <header class="preview-header">
                <h3>PitchCraft <span>AI</span> Preview</h3>
                <button onclick="renderEditor()">← Back to Editor</button>
            </header>

            <main class="preview-stage">
                <div class="preview-slide slide-layout-${currentLayout}"
                    style="background:${design.background}; color:${design.color}; text-align:${currentAlignment}; font-family:${currentFont};">

                    <h1 class="size-${currentTitleSize}">
                        ${escapeEditorText(slide.title)}
                    </h1>

                    <h2 class="preview-subtitle">
                        ${escapeEditorText(slide.subtitle || "")}
                    </h2>

                    <p>
                        ${escapeEditorText(slide.content).replace(/\n/g, "<br>")}
                    </p>

                    ${slide.image ? `
                        <img src="${slide.image}" alt="Slide image">
                    ` : ""}
                </div>
            </main>

            <footer class="preview-navigation">
                <button onclick="previousPreview()">← Previous</button>
                <span>Slide ${currentSlideIndex + 1} of ${currentSlides.length}</span>
                <button onclick="nextPreview()">Next →</button>
            </footer>
        </section>
    `;
}

function previousPreview() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderPreview();
    }
}

function nextPreview() {
    if (currentSlideIndex < currentSlides.length - 1) {
        currentSlideIndex++;
        renderPreview();
    }
}
console.log("PitchCraft JavaScript finished loading!");
showHome();