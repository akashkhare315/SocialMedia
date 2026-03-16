const user = "test" + Date.now();

async function testApi() {
  // Register
  const regResp = await fetch("http://127.0.0.1:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: "testtest" })
  });
  const regJson = await regResp.json();
  console.log("Register:", regJson);

  // Login
  const loginResp = await fetch("http://127.0.0.1:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: "testtest" })
  });
  
  const loginJson = await loginResp.json();
  console.log("Login:", loginJson);

  // Get cookie
  const cookieHeader = loginResp.headers.get("set-cookie");
  const token = cookieHeader ? cookieHeader.split(";")[0] : null;

  // Create Post
  const postResp = await fetch("http://127.0.0.1:3000/api/posts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": token || ""
    },
    body: JSON.stringify({ text: "Hello World 123 from " + user })
  });
  console.log("Create Post:", await postResp.json());

  // Get All Posts
  const allPostsResp = await fetch("http://127.0.0.1:3000/api/posts", {
    method: "GET"
  });
  console.log("All Posts length:", (await allPostsResp.json()).posts.length);
}
testApi().catch(console.error);
