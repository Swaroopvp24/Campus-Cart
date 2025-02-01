document.addEventListener("DOMContentLoaded", function () {
  let container = document.getElementById("container");

  toggle = () => {
    container.classList.toggle("sign-in");
    container.classList.toggle("sign-up");
  };

  setTimeout(() => {
    container.classList.add("sign-in");
  }, 200);

  function togglePasswordVisibility(inputId, toggleIconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleIconId);

    // Check if the password is currently visible or hidden
    if (passwordInput.type === "password") {
      passwordInput.type = "text"; // Show password
      toggleIcon.classList.replace("bx-show", "bx-hide"); // Change to 'hide' icon
    } else {
      passwordInput.type = "password"; // Hide password
      toggleIcon.classList.replace("bx-hide", "bx-show"); // Change to 'show' icon
    }
  }

  // Add event listeners to the toggle icons
  document
    .getElementById("toggle-passwordsignup")
    .addEventListener("click", function () {
      togglePasswordVisibility("passwordsignup", "toggle-passwordsignup");
    });

  document
    .getElementById("toggle-confpass")
    .addEventListener("click", function () {
      togglePasswordVisibility("confpass", "toggle-confpass");
    });

  document
    .getElementById("toggle-password")
    .addEventListener("click", function () {
      togglePasswordVisibility("password", "toggle-password");
    });

  const msgbox = document.querySelector(".messagebox");
  const msghead = document.querySelector(".messagebox-header-head");
  const msgtext = document.querySelector("#messagebox-text");

  document
    .getElementById("signupform")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      //   for (let [key, value] of formData.entries()) {
      // 	console.log(`${key}: ${value}`);
      //   }
      const formData = new FormData(this);

      if (formData.get("passwordsignup") !== formData.get("confpass")) {
        msgbox.classList.remove("hidden");
        msghead.innerText = "Error";
        msgtext.innerText = "Passwords do not match";
        container.classList.add("op_3");
        return;
      }

      console.log("Passwords match");

      const sendSignup = async () => {

        //   Send a POST request to the backend with form data
        await fetch("/clicksignup", {
          method: "POST",
          body: formData, // Send the form data
        })
          .then((response) => {
            if (!response.ok) {
              msgbox.classList.remove("hidden");
              msghead.innerText = "Error";
              msgtext.innerText = "Server error";
              container.classList.add("op_3");
              throw new Error("Server error");
            }
            return response.text(); // Expecting a plain text response
          })
          .then((data) => {
            if (data === "Added succesfully") {
              document.getElementById("usernamesignup").value = "";
              document.getElementById("email").value = "";
              document.getElementById("passwordsignup").value = "";
              document.getElementById("confpass").value = "";
              msghead.innerText = "Success";
            }else{
            msghead.innerText = "Message";
            }
            msgbox.classList.remove("hidden");
            msgtext.innerText = data;
            container.classList.add("op_3");
            // console.log(data);
          })
          .catch((error) => {
            msgbox.classList.remove("hidden");
            msghead.innerText = "Error";
            msgtext.innerText = `An error occurred: ${error}`;
            container.classList.add("op_3");
            // console.error("Error:", error);
          });
      };
      sendSignup();
    });

  // document
  //   .getElementById("signinform")
  //   .addEventListener("submit", function (event) {
  //     event.preventDefault();

  //     const formData = new FormData(this);

  //     // for (let [key, value] of formData.entries()) {
  //     //   console.log(`${key}: ${value}`);
  //     // }
  //     const sendlogin = async () => {
  //       await fetch("/clicksignin", {
  //         method: "POST",
  //         body: formData, // Send the form data
  //       })
  //         .then((response) => {
  //           if (!response.ok) {
  //             msgbox.classList.remove("hidden");
  //             msghead.innerText = "Error";
  //             msgtext.innerText = "Server error";
  //             container.classList.add("op_3");
  //             throw new Error("Server error");
  //           }
  //           return response.text(); // Expecting a plain text response
  //         })
  //         .then((data) => {
  //           msgbox.classList.remove("hidden");
  //           if (data === "Login successful") {
  //             document.getElementById("username").value = "";
  //             document.getElementById("password").value = "";
  //             msghead.innerText = "Success";
  //           }else{
  //           msghead.innerText = "Message";
  //           }
  //           msgtext.innerText = data;
  //           container.classList.add("op_3");
  //           // console.log(data);
  //         })
  //         .catch((error) => {
  //           msgbox.classList.remove("hidden");
  //           msghead.innerText = "Error";
  //           msgtext.innerText = `An error occurred: ${error}`;
  //           container.classList.add("op_3");
  //           // console.error("Error:", error);
  //         });
  //     };
  //     sendlogin();
  //   });

  document
  .getElementById("signinform")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    const sendlogin = async () => {
      await fetch("/clicksignin", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json()) // Expecting JSON response
        .then((data) => {
          if (data.success) {
            window.location.href = data.redirectUrl; // Redirect to the specified URL
          } else {
            msgbox.classList.remove("hidden");
            msghead.innerText = "Message";
            msgtext.innerText = data.message;
            container.classList.add("op_3");
          }
        })
        .catch((error) => {
          msgbox.classList.remove("hidden");
          msghead.innerText = "Error";
          msgtext.innerText = `An error occurred: ${error}`;
          container.classList.add("op_3");
        });
    };
    sendlogin();
  });


  document.querySelector("#close-button").addEventListener("click", () => {
    msgbox.classList.add("hidden");
    msghead.innerText = "";
    msgtext.innerText = ``;
    container.classList.remove("op_3");
  });
});
