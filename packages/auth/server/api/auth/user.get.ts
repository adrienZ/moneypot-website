export default defineEventHandler(async event => {
  const token = getCookie(event, "bearer");

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const user = await response.json();

  return {
    user
  }
})