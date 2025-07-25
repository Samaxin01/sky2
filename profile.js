import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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
const storage = getStorage(app);

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userBalance = document.getElementById("userBalance");
const profilePic = document.getElementById("profilePic");
const fileInput = document.getElementById("fileInput");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userName.textContent = user.displayName || "User";
    userEmail.textContent = user.email;

    // Load Firestore data
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      userBalance.textContent = "Balance: ₦" + (data.balance || 0);
      if (data.profilePicture) {
        profilePic.src = data.profilePicture;
      }
    }



  } else {
    alert("Please login.");
    window.location.href = "login.html";
  }
});

logoutBtn.onclick = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};