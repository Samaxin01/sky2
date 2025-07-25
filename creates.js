import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const form = document.getElementById("createForm");
const statusMsg = document.getElementById("statusMsg");
const priceField = document.getElementById("price");
const submitBtn = document.getElementById("submitBtn");

let userRef = null;
let userData = null;

// Price Map
const priceMap = {
  "Whatsapp Connecting Task": 10000,
  "Whatsapp Group Join Task": 4000,
  "Whatsapp Channel Join Task": 5100,
  "Tiktok Follow Task": 7500,
  "Instagram Follow Task": 9100,
  "Facebook Follow Task": 5300
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      statusMsg.textContent = "User data not found.";
      form.style.display = "none";
      return;
    }
    userData = snap.data();
    document.getElementById("userUid").value = user.uid;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("currentBalance").value = userData.balance;
  } else {
    alert("Please login first.");
    window.location.href = "login.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "";
  const taskType = document.getElementById("taskType").value;
  const price = priceMap[taskType];
  priceField.value = price;

  if (!taskType) {
    statusMsg.textContent = "Please select a task type.";
    statusMsg.style.color = "red";
    return;
  }

  if (userData.balance < price) {
    statusMsg.textContent = "❌ Insufficient balance.";
    statusMsg.style.color = "red";
    return;
  }

  // Deduct balance
  try {
    await updateDoc(userRef, {
      balance: userData.balance - price
    });

    statusMsg.textContent = "✅ Task submitted successfully!";
    statusMsg.style.color = "green";
    submitBtn.disabled = true;
    form.submit(); // Submit to formsubmit.co
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "❌ Failed to process task.";
    statusMsg.style.color = "red";
  }
});