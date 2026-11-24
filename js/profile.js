import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileBio = document.getElementById("profileBio");
const profileMessage = document.getElementById("profileMessage");

const profileAvatar = document.getElementById("profileAvatar");
const profileDisplayName = document.getElementById("profileDisplayName");
const profileDisplayEmail = document.getElementById("profileDisplayEmail");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");

const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let savedName = "";
let savedBio = "";

function showMessage(message, type = "success") {
    profileMessage.textContent = message;
    profileMessage.className = `profile-message ${type}`;
}

function updateProfileDisplay(name, email) {
    const displayName = name || "User";
    const initial = displayName.charAt(0).toUpperCase();

    profileDisplayName.textContent = displayName;
    profileDisplayEmail.textContent = email || "";

    userName.textContent = displayName;
    userEmail.textContent = email || "";

    profileAvatar.textContent = initial;
    userAvatar.textContent = initial;
}

async function loadProfile(user) {
    const defaultName = user.displayName || "";

    profileName.value = defaultName;
    profileEmail.value = user.email || "";

    updateProfileDisplay(defaultName, user.email);

    try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnapshot = await getDoc(profileRef);

        let name = defaultName;
        let bio = "";

        if (profileSnapshot.exists()) {
            const data = profileSnapshot.data();

            name = data.displayName || defaultName;
            bio = data.bio || "";
        }

        profileName.value = name;
        profileBio.value = bio;

        savedName = name;
        savedBio = bio;

        updateProfileDisplay(name, user.email);
    } catch (error) {
        console.error("Profile loading error:", error);
        showMessage(
            "Could not load saved profile details. Check your Firestore setup.",
            "error"
        );
    }
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;
    await loadProfile(user);
});

profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentUser) return;

    const name = profileName.value.trim();
    const bio = profileBio.value.trim();

    if (!name) {
        showMessage("Please enter your name.", "error");
        return;
    }

    const saveBtn = profileForm.querySelector('button[type="submit"]');

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {
        await updateProfile(currentUser, {
            displayName: name
        });

        await setDoc(
            doc(db, "users", currentUser.uid),
            {
                displayName: name,
                email: currentUser.email,
                bio: bio,
                updatedAt: serverTimestamp()
            },
            { merge: true }
        );

        savedName = name;
        savedBio = bio;

        updateProfileDisplay(name, currentUser.email);

        showMessage("Profile updated successfully!", "success");
    } catch (error) {
        console.error("Profile saving error:", error);
        showMessage(
            "Unable to save profile. Check your Firestore database and security rules.",
            "error"
        );
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Changes";
    }
});

profileForm.addEventListener("reset", () => {
    setTimeout(() => {
        profileName.value = savedName;
        profileBio.value = savedBio;
    }, 0);
});

logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout error:", error);
        alert("Unable to log out. Please try again.");
    }
});
