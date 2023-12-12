document.addEventListener("DOMContentLoaded", function () {
  // Получаем все кнопки с классом "enroll-btn"
  var enrollButtons = document.querySelectorAll(".enroll-btn");

  enrollButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Получаем taskName из атрибута data-taskname
      var taskName = button.getAttribute("data-taskname");

      // Выполняем POST-запрос
      fetch("/cabinet/addCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskName: taskName }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.redirect) {
            // Перенаправляем пользователя на указанный URL
            window.location.href = data.redirect;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
});
