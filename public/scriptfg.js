// Purpose: Frontend script for handling forgot password functionality.
document.addEventListener("DOMContentLoaded", function () {
  let container = document.getElementById("container");
  const msgbox = document.querySelector(".messagebox");
  const msghead = document.querySelector(".messagebox-header-head");
  const msgtext = document.querySelector("#messagebox-text");

  document.getElementById("forg-pass").addEventListener("click", function () {
    document.querySelector(".takeemail").classList.remove("hidden");
    container.classList.add("op_3");
  });

  document
    .querySelector(".takeemail-content")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const forgemail = formData.get("forgemail");

      const askEmail = async () => {
        await fetch("/forgpass", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Server error");
            }
            return response.text();
          })
          .then(async (data) => {
            if (data === "Email is present") {
              document.querySelector(".takeemail").classList.add("hidden");
              document.querySelector("#forgemail").value = "";
              await sendResetToken();
            } else {
              alert("Email not found");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
      askEmail();

      const sendResetToken = async () => {
        const formData = new FormData(this);
        formData.append("email", forgemail);
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

          await fetch("/request-reset-password", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              if (!response.ok) {
                msgbox.classList.remove("hidden");
                msghead.innerText = "Error";
                throw new Error("Server error");
              }
              return response.text();
            })
            .then((data) => {
              msgbox.classList.remove("hidden");
              if(data === "Password reset email sent successfully."){
                document.querySelector("#forgemail").value = "";
                msghead.innerText = "Success";
                msgtext.innerText = data;
                container.classList.remove("op_3");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
   
      };
    });
    document.querySelector("#closeemailbox").addEventListener("click", function () {
      document.querySelector(".takeemail").classList.add("hidden");
      container.classList.remove("op_3");
    });
});
