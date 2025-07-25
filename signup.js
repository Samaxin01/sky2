import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, updateDoc, collection, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const status = document.getElementById("status");

  if (!email || !password || !confirmPassword) {
    status.textContent = "Please fill all fields.";
    status.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    status.textContent = "Passwords do not match.";
    status.style.color = "red";
    return;
  }

  status.textContent = "Processing...";
  status.style.color = "#08a88a";

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get referral code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCodeFromUrl = urlParams.get("ref");

    let referredBy = null;

    // Look up the referrer in Firestore
    if (referralCodeFromUrl) {
      const q = query(collection(db, "users"), where("referralCode", "==", referralCodeFromUrl));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const referrerDoc = querySnapshot.docs[0];
        const referrerRef = referrerDoc.ref;
        referredBy = referrerDoc.id;

        const referrerData = referrerDoc.data();
        const updatedBalance = (referrerData.balance || 0) + 40;
        const updatedReferrals = (referrerData.referrals || 0) + 1;

        // Update referrer
        await updateDoc(referrerRef, {
          balance: updatedBalance,
          referrals: updatedReferrals
        });
      }
    }

    const referralCode = user.uid.slice(0, 8);

    // Save new user
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      balance: 0,
      referrals: 0,
      tasks: 0,
      videos: 0,
      clicks: 0,
      createdAt: serverTimestamp(),
      referralCode: referralCode,
      referredBy: referredBy || null
    });

    status.textContent = "Signup successful! Redirecting...";
    status.style.color = "green";
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  } catch (error) {
    console.error(error);
    status.textContent = error.message.replace("Firebase:", "").trim();
    status.style.color = "red";
  }
});