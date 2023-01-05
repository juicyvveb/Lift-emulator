export const saveLocalStorage = function (key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export const getLocalStorage = function (key) {
  return JSON.parse(localStorage.getItem(key));
}