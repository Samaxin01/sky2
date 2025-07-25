import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getFirestore, doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

  window.addBalance = async function () {
    const uid = document.getElementById("uidInput").value.trim();
    const amount = parseFloat(document.getElementById("amountInput").value.trim());
    const statusMsg = document.getElementById("statusMsg");

    if (!uid || isNaN(amount)) {
      statusMsg.textContent = "⚠ Please enter a valid UID and amount.";
      statusMsg.className = "status error";
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        statusMsg.textContent = "❌ User not found!";
        statusMsg.className = "status error";
        return;
      }

      const currentBalance = userSnap.data().balance || 0;
      const newBalance = currentBalance + amount;

      await updateDoc(userRef, {
        balance: newBalance
      });

      await addDoc(collection(db, "transactions"), {
        uid: uid,
        amount: amount,
        type: "credit",
        timestamp: serverTimestamp()
      });

      statusMsg.innerHTML = `✅ ₦${amount.toLocaleString()} added successfully.<br>New Balance: ₦${newBalance.toLocaleString()}`;
      statusMsg.className = "status success";
    } catch (error) {
      console.error("Error:", error);
      statusMsg.textContent = "❌ Failed to update balance.";
      statusMsg.className = "status error";
    }
  };