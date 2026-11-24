import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

console.log("PitchCraft Authentication Loaded!");

document.addEventListener("DOMContentLoaded", () => {

    // SIGNUP
    const signupForm = document.getElementById("signupForm");
    const signupMessage = document.getElementById("signupMessage");

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            console.log("Signup form submitted!");

            const name = document.getElementById("fullName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const terms = document.getElementById("agreeTerms").checked;

            if (!name || !email || !password || !confirmPassword) {
                signupMessage.textContent = "Please fill in all fields.";
                return;
            }

            if (password.length < 6) {
                signupMessage.textContent = "Password must be at least 6 characters.";
                return;
            }

            if (password !== confirmPassword) {
                signupMessage.textContent = "Passwords do not match.";
                return;
            }

            if (!terms) {
                signupMessage.textContent = "Please accept the Terms & Conditions.";
                return;
            }

            const button = signupForm.querySelector('button[type="submit"]');
            button.disabled = true;
            button.textContent = "Creating Account...";

            try {
                const result = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                await updateProfile(result.user, {
                    displayName: name
                });

                signupMessage.textContent = "Account created successfully!";
                signupMessage.style.color = "green";

                console.log("Signup successful:", result.user.uid);

                signupForm.reset();

            } catch (error) {
                console.error("Signup Error:", error.code, error.message);

                signupMessage.textContent =
                    error.code + ": " + error.message;

                signupMessage.style.color = "red";

            } finally {
                button.disabled = false;
                button.textContent = "Create Account";
            }
        });
    }

    // LOGIN
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    if (loginForm) {
        const passwordInput = document.getElementById("password");
        const togglePassword = document.getElementById("togglePassword");

        if (togglePassword && passwordInput) {
            togglePassword.addEventListener("click", () => {
                passwordInput.type =
                    passwordInput.type === "password" ? "text" : "password";

                togglePassword.textContent =
                    passwordInput.type === "password" ? "Show" : "Hide";
            });
        }

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            try {
                const email = document.getElementById("email").value.trim();
                const password = passwordInput.value;

                await signInWithEmailAndPassword(auth, email, password);

                loginMessage.textContent = "Login successful!";
                loginMessage.style.color = "green";

                setTimeout(() => {
    window.location.href = "dashboard.html";
}, 700);

            } catch (error) {
                console.error("Login Error:", error.code, error.message);

                loginMessage.textContent =
                    error.code + ": " + error.message;

                loginMessage.style.color = "red";
            }
        });
    }

});
