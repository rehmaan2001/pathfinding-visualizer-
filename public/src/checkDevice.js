function checkMobile() {
  if (window.innerWidth < 1018) return true;
  return false;
}

if (checkMobile()) {
  alert("Please use desktop for optimum view");
}
