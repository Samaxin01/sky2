import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDim9k5CHfNythq6ORypN_RfwyLNMuxVLs",
  authDomain: "sign-2fd98.firebaseapp.com",
  projectId: "sign-2fd98",
  storageBucket: "sign-2fd98.appspot.com",
  messagingSenderId: "548682903618",
  appId: "1:548682903618:web:0f0ca286f902c7fbacfddb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("email").textContent = user.email;
      document.getElementById("balance").textContent = "₦" + (data.balance || 0).toLocaleString();
      document.getElementById("clicks").textContent = data.clicks || 0;
      document.getElementById("referrals").textContent = data.referrals || 0;
      document.getElementById("videos").textContent = data.videos || 0;
      document.getElementById("tasks").textContent = data.tasks || 0;
      document.getElementById("created").textContent = data.createdAt
        ? data.createdAt.toDate().toDateString()
        : "N/A";
      document.getElementById("refLink").textContent = `https://hustlepay.vercel.app/signup.html?ref=${data.referralCode || "N/A"}`;
    } else {
      alert("No user data found.");
    }
  } else {
    window.location.href = "login.html";
  }
});

// Logout
document.getElementById("logoutBtn").onclick = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// Get references to DOM elements
        const popupContainer = document.getElementById('popupContainer');
        const closePopupButton = document.getElementById('closePopupButton');
        const okButton = document.getElementById('okButton'); // Get the 'Got it!' button

        /**
         * Shows the pop-up message with a fade-in and slide-down animation.
         */
        function showPopup() {
            // Add 'active' class to trigger fade-in and slide-down
            popupContainer.classList.add('active');
            // Remove 'hide' class if it was previously added
            popupContainer.classList.remove('hide');
        }

        /**
         * Hides the pop-up message with a fade-out and slide-up animation.
         * The 'hide' class is added first to trigger the animation,
         * then after a delay (matching CSS transition duration), the 'active'
         * class is removed and visibility is set to hidden.
         */
        function hidePopup() {
            // Add 'hide' class to trigger fade-out and slide-up animation
            popupContainer.classList.add('hide');

            // After the animation completes, remove 'active' and 'hide' classes
            // to fully hide the element and reset its state.
            // The delay should match the CSS transition duration (0.3s).
            setTimeout(() => {
                popupContainer.classList.remove('active');
                popupContainer.classList.remove('hide');
            }, 300); // 300ms matches the CSS transition duration
        }

        // Add event listener to the close button inside the pop-up
        closePopupButton.addEventListener('click', hidePopup);

        // Add event listener to the 'Got it!' button inside the pop-up
        okButton.addEventListener('click', hidePopup);

        // Optional: Close pop-up when clicking outside the content area
        popupContainer.addEventListener('click', (event) => {
            // If the click target is the container itself (not a child of popup-content)
            if (event.target === popupContainer) {
                hidePopup();
            }
        });

        // Automatically show the pop-up after 3 seconds when the page loads
        window.onload = function() {
            setTimeout(showPopup, 3000); // 3000 milliseconds = 3 seconds
        };


// Copy referral link
document.getElementById("copyBtn").addEventListener("click", () => {
  const link = document.getElementById("refLink").textContent;
  navigator.clipboard.writeText(link);
  alert("Referral link copied!");
});