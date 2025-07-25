// Firebase Config
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
    let currentUser;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        const uid = user.uid;
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, {
            balance: 0,
            tasks: {}
          });
        } else {
          const data = docSnap.data().tasks || {};
          document.querySelectorAll('.reward').forEach(reward => {
            const id = reward.dataset.id;
            const claimBtn = reward.querySelector('.claim-btn');
            if (data[id]) claimBtn.disabled = true;
          });
        }
      } else {
        alert("You must be logged in to claim rewards.");
        window.location.href = "login.html";
      }
    });

    // Open external link and enable claim
    window.joinNow = (btn, url) => {
      window.open(url, "_blank");
      const claimBtn = btn.parentElement.querySelector('.claim-btn');
      claimBtn.disabled = false;
    };

    // Claim reward
    window.claimReward = async (btn, rewardId) => {
      if (!currentUser) return alert("Login first");
      const uid = currentUser.uid;
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      let data = userSnap.data();
      if (data.tasks && data.tasks[rewardId]) {
        alert("Already claimed.");
        return;
      }

      const newBalance = (data.balance || 0) + 30;
      await updateDoc(userRef, {
        balance: newBalance,
        [`tasks.${rewardId}`]: true
      });

      alert("₦30 claimed successfully!");
      btn.disabled = true;
    };