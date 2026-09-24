// Base de datos de combinaciones de elementos
const elementData = {
  "Calor+Frío": {
    name: "Explosión (Blast)",
    icon: "💥",
    color: "var(--c-blast)",
    desc: "Cada impacto añade cargas. Al llegar a 10 acumulaciones o cuando el enemigo muere, genera una violenta detonación en área de 5m con el 100% del daño acumulado.",
    idealAgainst: "Grupos compactos de enemigos, Grineer ligeros y maquinaria.",
    moddingTip: "Excelente en armas con alta cadencia o escopetas para detonar múltiples explosiones en cadena."
  },
  "Calor+Electricidad": {
    name: "Radiación",
    icon: "☢️",
    color: "var(--c-radiation)",
    desc: "Vuelve locos a los enemigos: activa el fuego amigo, haciendo que se ataquen entre ellos y aumentando hasta un +550% el daño que se hacen mutuamente.",
    idealAgainst: "Alloy Armor (Bombarderos Grineer, Eidolons, Jefes y Murmur/Susurro).",
    moddingTip: "Imprescindible contra jefes como Liches de Kuva, Hermanas de Parvos y Arcontes."
  },
  "Calor+Toxina": {
    name: "Gas",
    icon: "☁️",
    color: "var(--c-gas)",
    desc: "Crea una nube tóxica de hasta 6 metros de radio que hace daño persistente por segundo a todos los que entren en su área durante 6 segundos.",
    idealAgainst: "Hordas de Infestados y enemigos agrupados en pasillos estrechos.",
    moddingTip: "Combina de forma increíble con habilidades de atracción como Magnetize (Mag) o Vortex (Vauban)."
  },
  "Frío+Electricidad": {
    name: "Magnético",
    icon: "🧲",
    color: "var(--c-magnetic)",
    desc: "Aumenta el daño infligido a Escudos y Sobreguardia (Overguard) hasta un +325%. Al destruir un escudo, desata una onda de choque eléctrica que daña a enemigos cercanos.",
    idealAgainst: "Facción Corpus entera y Unidades Eximus con Sobreguardia azul.",
    moddingTip: "La mejor respuesta moderna contra unidades Eximus difíciles en Steel Path."
  },
  "Frío+Toxina": {
    name: "Viral",
    icon: "🦠",
    color: "var(--c-viral)",
    desc: "Multiplica directamente todo el daño que reciba la barra de salud del enemigo: +100% en la 1ra acumulación, escalando hasta un brutal +325% con 10 marcas.",
    idealAgainst: "Cualquier enemigo con vida biológica (Grineer, Corpus sin escudo, Infestados).",
    moddingTip: "La combinación reina del juego junto con el daño de Corte (Viral + Slash)."
  },
  "Electricidad+Toxina": {
    name: "Corrosivo",
    icon: "🧪",
    color: "var(--c-corrosive)",
    desc: "Disuelve de manera permanente la armadura enemiga: reduce un 26% de armadura al primer disparo y hasta un 80% con 10 marcas.",
    idealAgainst: "Ferrite Armor (Artilleras pesadas Grineer, Infestados Antiguos y Acorazados).",
    moddingTip: "Úsalo con mods de Proyección Corrosiva para conseguir el 100% de eliminación de armadura (Armor Strip)."
  }
};

let selectedElements = [];

// Función para alternar elementos en el combinador
function toggleElement(el) {
  const index = selectedElements.indexOf(el);
  if (index > -1) {
    selectedElements.splice(index, 1);
  } else {
    selectedElements.push(el);
    if (selectedElements.length > 2) {
      selectedElements.shift(); // Conserva solo los dos últimos seleccionados
    }
  }
  updateCombinerUI();
}

function updateCombinerUI() {
  // Actualizar botones activos
  const buttons = document.querySelectorAll('#elementButtons .element-btn');
  buttons.forEach(btn => {
    const elName = btn.getAttribute('data-el');
    if (selectedElements.includes(elName)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const resultBox = document.getElementById('combinerResult');

  if (selectedElements.length === 0) {
    resultBox.innerHTML = '<p class="combiner-empty">Selecciona dos elementos de la lista superior para combinarlos.</p>';
    return;
  }

  if (selectedElements.length === 1) {
    resultBox.innerHTML = `<p class="combiner-empty">Has seleccionado <strong>${selectedElements[0]}</strong>. Elige un segundo elemento para crear una combinación.</p>`;
    return;
  }

  // Orden canónico
  const order = ["Calor", "Frío", "Electricidad", "Toxina"];
  const key = order.filter(x => selectedElements.includes(x)).join('+');
  const combo = elementData[key];

  if (combo) {
    resultBox.innerHTML = `
      <div class="combiner-card">
        <div class="combo-formula">
          <span>${selectedElements[0]}</span>
          <span>+</span>
          <span>${selectedElements[1]}</span>
          <span>=</span>
          <span class="combo-name" style="color: ${combo.color}">${combo.icon} ${combo.name}</span>
        </div>
        <div class="combo-details">
          <div class="combo-box">
            <h5>Efecto de Estado</h5>
            <p>${combo.desc}</p>
          </div>
          <div class="combo-box">
            <h5>Mejor contra</h5>
            <p>${combo.idealAgainst}</p>
          </div>
          <div class="combo-box">
            <h5>Consejo Táctico</h5>
            <p>${combo.moddingTip}</p>
          </div>
        </div>
      </div>
    `;
  }
}

// Selección de panel por Facción
function selectFaction(factionId, ev) {
  document.querySelectorAll('.faction-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.faction-panel').forEach(panel => panel.classList.remove('active'));

  if (ev && ev.currentTarget) {
    ev.currentTarget.classList.add('active');
  }
  const targetPanel = document.getElementById('panel-' + factionId);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
}

// Filtrar tarjetas dentro de secciones por categoría
function filterCards(category, sectionId, ev) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const buttons = section.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (ev && ev.target) {
    ev.target.classList.add('active');
  }

  const cards = section.querySelectorAll('.card[data-category]');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Búsqueda en tiempo real
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const allCards = document.querySelectorAll('.card');

      allCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});
