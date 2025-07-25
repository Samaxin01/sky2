
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

  const withdrawForm = document.getElementById('withdrawForm');
  const status = document.getElementById('status');
  const balanceEl = document.getElementById('balance');

  let currentUser = null;
  let userBalance = 0;

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      const doc = await db.collection('users').doc(user.uid).get();
      if (doc.exists) {
        userBalance = doc.data().balance || 0;
        balanceEl.textContent = '₦' + userBalance;
      }
    } else {
      alert("You must be signed in.");
      window.location.href = 'login.html';
    }
  });

  withdrawForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Processing...';

    const amount = parseInt(document.getElementById('amount').value);
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const withdrawalName = document.getElementById('withdrawalName').value.trim();

    if (!amount || !accountNumber || !withdrawalName) {
      status.textContent = 'Please fill in all fields.';
      return;
    }

    if (userBalance < amount) {
      status.textContent = 'Insufficient balance.';
      return;
    }

    try {
      // Save withdrawal request
      await db.collection('withdrawals').add({
        uid: currentUser.uid,
        email: currentUser.email,
        amount: amount,
        accountNumber: accountNumber,
        withdrawalName: withdrawalName,
        timestamp: new Date()
      });

      // Deduct balance
      await db.collection('users').doc(currentUser.uid).update({
        balance: firebase.firestore.FieldValue.increment(-amount)
      });

      status.textContent = 'Withdrawal request submitted successfully!';
      withdrawForm.reset();
    } catch (error) {
      console.error(error);
      status.textContent = 'Something went wrong. Try again.';
    }
  });