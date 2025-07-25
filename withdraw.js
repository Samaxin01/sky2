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

const form = document.getElementById("withdrawForm");
const submitBtn = document.getElementById("submitBtn");
const statusMsg = document.getElementById("statusMsg");

const bankBtn = document.getElementById("bankBtn");
const airtimeBtn = document.getElementById("airtimeBtn");
const bankFields = document.getElementById("bankFields");
const airtimeFields = document.getElementById("airtimeFields");

bankBtn.onclick = () => {
  bankFields.style.display = "block";
  airtimeFields.style.display = "none";
  bankBtn.classList.add("active");
  airtimeBtn.classList.remove("active");
};
airtimeBtn.onclick = () => {
  bankFields.style.display = "none";
  airtimeFields.style.display = "block";
  bankBtn.classList.remove("active");
  airtimeBtn.classList.add("active");
};

let userRef = null;
let userData = null;

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
    document.getElementById("userBalance").value = userData.balance;
  } else {
    alert("Please login.");
    window.location.href = "login.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  let amount = 0;

  if (bankFields.style.display !== "none") {
    amount = parseInt(document.getElementById("amount").value);
  } else {
    amount = parseInt(document.getElementById("airtimeAmount").value);
  }

  if (userData.referrals < 2) {
    statusMsg.textContent = "❌ You need at least 2 referrals to withdraw.";
    statusMsg.style.color = "red";
    submitBtn.disabled = false;
    submitBtn.textContent = "Request Withdrawal";
    return;
  }

  if (userData.balance < amount) {
    statusMsg.textContent = "❌ Insufficient balance.";
    statusMsg.style.color = "red";
    submitBtn.disabled = false;
    submitBtn.textContent = "Request Withdrawal";
    return;
  }

  try {
    await updateDoc(userRef, {
      balance: userData.balance - amount
    });

    statusMsg.textContent = "✅ Withdrawal request sent!";
    statusMsg.style.color = "green";
    form.submit();
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "❌ Failed to process withdrawal.";
    statusMsg.style.color = "red";
    submitBtn.disabled = false;
    submitBtn.textContent = "Request Withdrawal";
  }
});