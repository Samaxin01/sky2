 const firebaseConfig = {
      apiKey: "AIzaSyDim9k5CHfNythq6ORypN_RfwyLNMuxVLs",
      authDomain: "sign-2fd98.firebaseapp.com",
      projectId: "sign-2fd98",
      storageBucket: "sign-2fd98.appspot.com",
      messagingSenderId: "548682903618",
      appId: "1:548682903618:web:0f0ca286f902c7fbacfddb"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    auth.onAuthStateChanged(user => {
      if (!user) {
        alert("Please log in to comment.");
        location.href = "login.html";
      }
    });

    function postComment() {
      const message = document.getElementById("commentInput").value.trim();
      const user = auth.currentUser;

      if (message && user) {
        db.collection("comments").add({
          email: user.email,
          message,
          timestamp: new Date()
        }).then(() => {
          document.getElementById("commentInput").value = "";
        });
      }
    }

    db.collection("comments").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      const commentSection = document.getElementById("comments");
      commentSection.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "comment";
        div.innerHTML = `
          <div class="email">${data.email}</div>
          <div>${data.message}</div>
          <div class="timestamp">${new Date(data.timestamp.toDate()).toLocaleString()}</div>
        `;
        commentSection.appendChild(div);
      });
    });