import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

// PITCHCRAFT AI - DASHBOARD

document.addEventListener("DOMContentLoaded", () => {

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userAvatar = document.getElementById("userAvatar");
    const logoutBtn = document.getElementById("logoutBtn");

    // CHECK LOGIN STATUS
    onAuthStateChanged(auth, (user) => {

        if (user) {

            // DISPLAY USER INFORMATION
            const name = user.displayName || "User";

            userName.textContent = name;
            userEmail.textContent = user.email || "";
            userAvatar.textContent = name.charAt(0).toUpperCase();

            console.log("Dashboard loaded for:", user.email);

        } else {

            // REDIRECT IF USER IS NOT LOGGED IN
            window.location.href = "login.html";

        }

    });

    // LOGOUT
    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            const confirmLogout = confirm("Are you sure you want to logout?");

            if (!confirmLogout) return;

            try {

                await signOut(auth);

                window.location.href = "login.html";

            } catch (error) {

                console.error("Logout Error:", error);

                alert("Unable to logout. Please try again.");

            }

        });

    }

});
