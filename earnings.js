import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
    const earningsList = document.getElementById("earningsList");

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const earningsRef = collection(db, "users", user.uid, "earnings");
        const earningsQuery = query(earningsRef, orderBy("timestamp", "desc"));
        const earningsSnap = await getDocs(earningsQuery);

        if (earningsSnap.empty) {
          earningsList.innerHTML = "<p style='text-align:center;color:#666;'>Loading....</p>";
          return;
        }

        earningsSnap.forEach(doc => {
          const data = doc.data();
          const amount = data.amount || 0;
          const date = data.timestamp?.toDate().toLocaleString() || "No date";

          const item = document.createElement("div");
          item.className = "earning-item";
          item.innerHTML = `
            <div class="amount">+ ₦${amount}</div>
            <div class="date">Added on ${date}</div>
          `;
          earningsList.appendChild(item);
        });
      } else {
        earningsList.innerHTML = "<p style='text-align:center;color:red;'>Please login to view earnings.</p>";
      }
    });