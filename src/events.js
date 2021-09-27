export const clickHandler = (e) => {
  e.preventDefault();
  console.log(e.changedTouches[0]);
};
