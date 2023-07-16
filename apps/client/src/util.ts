export const extractContent = (html: string) => {
  const span = document.createElement('span');
  span.innerHTML = html;
  return span.textContent || span.innerText;
};
