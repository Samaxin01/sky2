 window.onload = function() {
    setTimeout(() => {
      document.getElementById("popup").style.display = "flex";
    }, 2000);
  };

  function closePopup() {
    document.getElementById("popup").style.display = "none";
  }

  function joinNow() {
    // Redirect to signup page
    window.location.href = "https://whatsapp.com/channel/0029Vb6e6hfCHDysaroNsw3j"; // Change this to your desired page
  }
