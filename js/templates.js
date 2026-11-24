import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

// PITCHCRAFT AI - TEMPLATES

document.addEventListener("DOMContentLoaded", () => {

    // CHECK USER LOGIN
    onAuthStateChanged(auth, (user) => {

        if (!user) {
            window.location.href = "login.html";
        }

    });

    // LOGOUT
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {

            if (!confirm("Are you sure you want to logout?")) return;

            try {
                await signOut(auth);
                window.location.href = "login.html";

            } catch (error) {
                console.error("Logout Error:", error);
                alert("Unable to logout. Please try again.");
            }

        });
    }

    // TEMPLATE SEARCH AND FILTER
    const searchInput = document.getElementById("templateSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const templateCards = document.querySelectorAll(".template-card");
    const noTemplates = document.getElementById("noTemplates");

    function filterTemplates() {

        const searchValue = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

        let visibleCount = 0;

        templateCards.forEach((card) => {

            const title = card.querySelector("h3").textContent.toLowerCase();
            const category = card.dataset.category;

            const matchesSearch = title.includes(searchValue);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }

        });

        noTemplates.hidden = visibleCount !== 0;
    }

    searchInput.addEventListener("input", filterTemplates);
    categoryFilter.addEventListener("change", filterTemplates);

    // CREATE YOUR OWN
    const createOwnBtn = document.getElementById("createOwnBtn");

    createOwnBtn.addEventListener("click", () => {

        sessionStorage.setItem("selectedTemplate", "Create Your Own");

        alert("Blank presentation selected! The presentation editor is coming next.");

    });

    // USE READY-MADE TEMPLATE
    const useTemplateButtons = document.querySelectorAll(".use-template-btn");

    useTemplateButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const templateName = button.dataset.template;

            sessionStorage.setItem("selectedTemplate", templateName);

            alert(templateName + " selected! The presentation editor is coming next.");

        });

    });

});
