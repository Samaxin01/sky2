 // Firebase config
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import {
      getAuth,
      reauthenticateWithCredential,
      EmailAuthProvider,
      updatePassword,
      onAuthStateChanged,
    } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDim9k5CHfNythq6ORypN_RfwyLNMuxVLs",
      authDomain: "sign-2fd98.firebaseapp.com",
      projectId: "sign-2fd98",
      storageBucket: "sign-2fd98.appspot.com",
      messagingSenderId: "548682903618",
      appId: "1:548682903618:web:0f0ca286f902c7fbacfddb"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    let currentUser;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user;
      } else {
        window.location.href = "login.html";
      }
    });

    window.changePassword = async function () {
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const messageDiv = document.getElementById("message");

      if (!currentPassword || !newPassword || !confirmPassword) {
        messageDiv.textContent = "Please fill all fields.";
        messageDiv.style.color = "red";
        return;
      }

      if (newPassword !== confirmPassword) {
        messageDiv.textContent = "New passwords do not match.";
        messageDiv.style.color = "red";
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
        messageDiv.textContent = "✅ Password changed successfully!";
        messageDiv.style.color = "green";

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } catch (error) {
        console.error("Error:", error);
        messageDiv.textContent = "❌ " + error.message;
        messageDiv.style.color = "red";
      }
    };
  