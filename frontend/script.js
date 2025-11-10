document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("movieInput");
  const btn = document.getElementById("recommendBtn");
  const recommendations = document.getElementById("recommendations");
  const navLinks = document.querySelectorAll(".nav ul li a");

  // 🎬 Navbar active animation
  // Highlight active nav link dynamically and retain it after page load
  const currentPage = window.location.pathname.split("/").pop();
  navLinks.forEach(link => {
    const hrefPage = link.getAttribute("href").split("/").pop();
    if (hrefPage === currentPage) {
      link.classList.add("active");
    }

    // Also handle click effect (for single-page feel)
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // 🎞 Recommendation fetch from FastAPI backend
  if (btn) {
    btn.addEventListener("click", async () => {
      const movieName = input.value.trim();
      if (!movieName) {
        alert("Please enter a movie name!");
        return;
      }

      recommendations.innerHTML =
        '<p style="color:#aaa;text-align:center;">Loading recommendations...</p>';

      try {
        const res = await fetch("http://127.0.0.1:8000/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movie_name: movieName })
        });

        if (!res.ok) throw new Error("Backend error");
        const data = await res.json();

        if (!data.recommended_movies || data.recommended_movies.length === 0) {
          recommendations.innerHTML =
            '<p style="color:#E50914;text-align:center;">No movies found. Try another name!</p>';
          return;
        }

        recommendations.innerHTML = "";

        data.recommended_movies.forEach(movie => {
          const poster =
            movie.poster && movie.poster !== "N/A"
              ? movie.poster
              : "https://via.placeholder.com/300x450/000000/FFFFFF?text=No+Poster";

          const movieCard = document.createElement("div");
          movieCard.classList.add("movie-card");
          movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
          `;

          recommendations.appendChild(movieCard);
        });
      } catch (error) {
        console.error(error);
        recommendations.innerHTML =
          '<p style="color:#E50914;text-align:center;">Error fetching movies. Try again later.</p>';
      }
    });
  }
});
