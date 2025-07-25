import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const container = document.getElementById("transactions");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const q = query(
    collection(db, "transactions"),
    where("uid", "==", user.uid),
    orderBy("timestamp", "desc")
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    container.innerHTML = "<p>No transactions yet.</p>";
  } else {
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "txn " + data.type;
      div.innerHTML = `
        <h4>${data.type === "credit" ? "+" : "-"}₦${data.amount}</h4>
        <p>${data.description || ""}</p>
        <small>${data.timestamp?.toDate().toLocaleString()}</small>
      `;
      container.appendChild(div);
    });
  }
});