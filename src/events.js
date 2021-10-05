export const createEvent = (title, body) => {
  const toast = document.getElementById("toast");
  toast.classList.add("show");

  const header = document.getElementById("toast-title");
  header.innerHTML = title;

  const content = document.getElementById("toast-content");
  content.innerHTML = body;
  setTimeout(() => toast.classList.remove("show"), 5000);
};
