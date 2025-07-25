import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getFirestore, doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDim9k5CHfNythq6ORypN_RfwyLNMuxVLs",
    authDomain: "sign-2fd98.firebaseapp.com",
    projectId: "sign-2fd98",
    storageBucket: "sign-2fd98.appspot.com",
    messagingSenderId: "548682903618",
    appId: "1:548682903618:web:0f0ca286f902c7fbacfddb"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Automatically sign in the admin
  signInWithEmailAndPassword(auth, "jeesammy31@gmail.com", "20082008")
    .then((userCredential) => {
      console.log("✅ Admin signed in:", userCredential.user.email);
      document.getElementById("statusMsg").textContent = "✅ Admin signed in";
      document.getElementById("statusMsg").style.color = "green";
    })
    .catch((error) => {
      console.error("❌ Admin sign-in failed:", error);
      document.getElementById("statusMsg").textContent = "❌ Admin login failed";
      document.getElementById("statusMsg").style.color = "red";
    });

  // Function to update user balance
  window.addBalance = async function () {
    const uid = document.getElementById("uidInput").value.trim();
    const amount = parseFloat(document.getElementById("amountInput").value.trim());
    const statusMsg = document.getElementById("statusMsg");

    if (!uid || isNaN(amount)) {
      statusMsg.textContent = "⚠ Please enter a valid UID and amount.";
      statusMsg.style.color = "red";
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        statusMsg.textContent = "❌ User not found!";
        statusMsg.style.color = "red";
        return;
      }

      const currentBalance = userSnap.data().balance || 0;
      const newBalance = currentBalance + amount;

      // Update user balance
      await updateDoc(userRef, {
        balance: newBalance
      });

      // Save transaction log
      await addDoc(collection(db, "transactions"), {
        uid: uid,
        amount: amount,
        type: "credit",
        timestamp: serverTimestamp()
      });

      statusMsg.textContent = `✅ ₦${amount} added. New balance: ₦${newBalance.toLocaleString()}`;
      statusMsg.style.color = "green";
    } catch (error) {
      console.error("Error:", error);
      statusMsg.textContent = "❌ Failed to update balance.";
      statusMsg.style.color = "red";
    }
  };