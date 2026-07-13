export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("wealth-theme");
    if (stored === "light") document.documentElement.classList.add("light");
  } catch (e) {}
})();
`;
