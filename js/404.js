async function loadRepos() {
  const repoList = document.getElementById("repo-list");

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
    const repos = await res.json();

    // Filter only Bluetube-related repositories
    const bluetubeRepos = repos.filter(repo =>
      repo.name.toLowerCase().includes("bluetube")
    );

    if (bluetubeRepos.length === 0) {
      repoList.innerHTML = "<li>No Bluetube repositories found.</li>";
      return;
    }

    bluetubeRepos.forEach(repo => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p style="color:#aaa;font-size:0.9rem;">${repo.description || "No description"}</p>
      `;
      repoList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch repos:", err);
    repoList.innerHTML = "<li>Error loading repositories.</li>";
  }
}

loadRepos(); // ✅ Runs automatically when the 404 page loads
