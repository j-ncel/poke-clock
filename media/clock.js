function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, '0');

  document.getElementById('digitalClock').textContent = `${formattedHours}:${minutes} ${ampm}`;
}


function setPokemonImage() {
  const img = document.getElementById('pokemonImage');
  const clock = document.querySelector('.clock-container');
  const id = Math.floor(Math.random() * 898) + 1;

  img.style.display = 'none';
  clock.style.display = 'block';

  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      const imageUrl = data.sprites.other["official-artwork"].front_default;
      if (imageUrl) {
        img.src = imageUrl;
        img.alt = data.name;
        img.onload = () => {
          img.style.display = 'block';
          clock.style.display = 'block';
        };
      } else {
        img.style.display = 'none';
      }
    })
    .catch(err => {
      console.error("Failed to fetch Pokémon image", err);
      img.style.display = 'none';
      clock.style.display = 'block';
    });
}

setPokemonImage();
updateClock();
setInterval(updateClock, 1000);

document.getElementById('pokemonImage').addEventListener('click', setPokemonImage);
