// Exemplo mínimo (use módulo e organize em arquivos separados conforme o app cresce)
const form = document.getElementById('search-form');
const statusEl = document.getElementById('status');
const weatherEl = document.getElementById('weather');

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const city = form.city.value.trim();
  if (!city) return;
  statusEl.textContent = 'Buscando...';
  weatherEl.innerHTML = '';

  try {
    // 1) Geocoding: obter lat/lon a partir do nome da cidade
    // Você pode usar um serviço gratuito como o Nominatim ou a própria Open-Meteo Geocoding
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoJson = await geo.json();
    if (!geoJson.results || geoJson.results.length === 0) {
      statusEl.textContent = 'Cidade não encontrada.';
      return;
    }
    const { latitude, longitude, name, country } = geoJson.results[0];

    // 2) Chamada à Open-Meteo (exemplo: temperatura atual)
    const weatherResp = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
    );
    const weatherJson = await weatherResp.json();

    // 3) Renderizar
    statusEl.textContent = '';
    const cw = weatherJson.current_weather;
    weatherEl.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p>Temperatura: ${cw.temperature} °C</p>
      <p>Vento: ${cw.windspeed} km/h (direção ${cw.winddirection}°)</p>
      <p>Tempo: código ${cw.weathercode}</p>
    `;
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Erro ao buscar dados. Verifique sua conexão.';
  }
});