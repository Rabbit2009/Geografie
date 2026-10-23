let circles = {
  "Atlas_1": { x: 147, y: 119 },
  "Atlas_2": { x: 260, y: 88 },
  "Hochland_Aethiopien": { x: 566, y: 314 },
  "Namib_1": { x: 322, y: 617 },
  "Namib_2": { x: 342, y: 676 },
  "Kongobecken": { x: 414, y: 462 },
  "Kanarische_Inseln": { x: 68, y: 127 },
  "Madagaskar": { x: 633, y: 623 },
  "Somali_Halbinsel": { x: 658, y: 337 },
  "Kilimandscharo": { x: 538, y: 478 },
  "Nil_1": { x: 492, y: 170 },
  "Nil_2": { x: 506, y: 297 },
  "Nil_3": { x: 503, y: 396 },
  "Niger_1": { x: 174, y: 263 },
  "Niger_2": { x: 258, y: 350 },
  "Kongo": { x: 412, y: 404 },
  "Sambesi_1": { x: 420, y: 576 },
  "Sambesi_2": { x: 480, y: 576 },
  "Tanganyikasee": { x: 501, y: 486 },
  "Malawisee": { x: 538, y: 548 },
  "Tschadsee": { x: 310, y: 280 },
  "Nasserstausee": { x: 476, y: 198 },
  "Mittelmeer": { x: 368, y: 86 },
  "Atlantik_1": { x: 58, y: 59 },
  "Atlantik_2": { x: 176, y: 594 },
  "Rotes_Meer": { x: 550, y: 222 },
  "Golf_von_Aden": { x: 641, y: 306 },
  "Indischer_Ozean_1": { x: 580, y: 735 },
  "Indischer_Ozean_2": { x: 684, y: 406 },
  "Suezkanal": { x: 512, y: 131 },
  "Strasse_von_Gibraltar": { x: 143, y: 71 },
  "Kalahari": { x: 409, y: 647 },
  "Oranje": { x: 425, y: 708 },
  "Sansibar": { x: 600, y: 490 },
  "Victoriasee": { x: 512, y: 456 },
  "Sahara": { x: 328, y: 205 }
};

const koordinatenDateien = {
    Topografie: "koordinaten.json",
    Laender: "länder.json",
    Staedte: "städte.json"
};

const koordinatenReferenzBreiten = {
    Topografie: 650,
    Laender: 650,
    Staedte: 650
};

const quizDaten = {
    Topografie: {
        fragen: [
            ["Atlas", "Atlas_1", "Atlas_2"],
            ["Hochland von Äthiopien", "Hochland_Aethiopien"],
            ["Namib", "Namib_1", "Namib_2"],
            ["Kongobecken", "Kongobecken"],
            ["Kanarische Inseln", "Kanarische_Inseln"],
            ["Madagaskar", "Madagaskar"],
            ["Somali-Halbinsel", "Somali_Halbinsel"],
            ["Kilimandscharo", "Kilimandscharo"],
            ["Nil", "Nil_1", "Nil_2", "Nil_3"],
            ["Niger", "Niger_1", "Niger_2"],
            ["Kongo", "Kongo"],
            ["Sambesi", "Sambesi_1", "Sambesi_2"],
            ["Tanganyikasee", "Tanganyikasee"],
            ["Malawisee", "Malawisee"],
            ["Tschadsee", "Tschadsee"],
            ["Nasserstausee", "Nasserstausee"],
            ["Mittelmeer", "Mittelmeer"],
            ["Atlantik", "Atlantik_1", "Atlantik_2"],
            ["Rotes Meer", "Rotes_Meer"],
            ["Golf von Aden", "Golf_von_Aden"],
            ["Indischer Ozean", "Indischer_Ozean_1", "Indischer_Ozean_2"],
            ["Suezkanal", "Suezkanal"],
            ["Straße von Gibraltar", "Strasse_von_Gibraltar"],
            ["Kalahari", "Kalahari"],
            ["Oranje", "Oranje"],
            ["Sansibar", "Sansibar"],
            ["Victoriasee", "Victoriasee"],
            ["Sahara", "Sahara"]
        ],
        checklist: "checkliste"
    },
    Laender: {
        begriffe: ["Südsudan", "Nigeria", "Algerien", "Senegal", "Tunesien", "Kamerun", "Sudan", "Mali", "Kenia", "Namibia", "Angola", "Südafrika", "Libyen", "Somalia", "Tansania", "Demokratische Republik Kongo", "Marokko", "Ägypten", "Äthiopien", "Eritrea"],
        checklist: "checkliste"
    },
    Staedte: {
        begriffe: ["Algier", "Alexandria", "Addis Abeba", "Casablanca", "Daressalam", "Dakar", "Durban", "Johannesburg", "Kapstadt", "Kinshasa", "Kairo", "Lagos", "Nairobi", "Pretoria"],
        checklist: "checkliste"
    }
};

let aktuelleFrage = 0;
let punkte = 0;
let falscheVersuche = 0;
let richtigePunkte = [];
let aktuelleKategorie = "Topografie";
let fragen = quizDaten[aktuelleKategorie].fragen;
let ladeVorgang = 0;
let antwortPause = false;

function frageEintraege(kategorie = aktuelleKategorie) {
    const daten = quizDaten[kategorie];
    if (daten.fragen) return daten.fragen;
    return daten.begriffe.map((name, index) => [name, `${kategorie === "Laender" ? "Land" : "Stadt"}_${index + 1}`]);
}

function ladeKategorie(kategorie) {
    const dieserLadevorgang = ++ladeVorgang;
    aktuelleKategorie = kategorie;
    aktuelleFrage = 0;
    punkte = 0;
    falscheVersuche = 0;
    antwortPause = false;
    entferneRichtigePunkte();
    document.querySelectorAll(".abdruck").forEach((marker) => marker.remove());

    fragen = frageEintraege(kategorie);
    fragen.sort(() => Math.random() - 0.5);

    document.getElementById("punkte").textContent = punkte;
    document.getElementById("meldung").textContent = "";
    document.getElementById("checkliste").replaceChildren();

    fetch(koordinatenDateien[kategorie])
        .then((response) => {
            if (!response.ok) throw new Error(`Datei nicht gefunden: ${koordinatenDateien[kategorie]}`);
            return response.json();
        })
        .then((koordinaten) => {
            if (dieserLadevorgang !== ladeVorgang) return;
            circles = koordinaten;
            zeichneCheckliste();
            zeigeFrage();
        })
        .catch((error) => {
            if (dieserLadevorgang !== ladeVorgang) return;
            document.getElementById("frage").textContent =
                `Koordinaten konnten nicht geladen werden: ${koordinatenDateien[kategorie]}`;
            console.error(error);
        });

    document.querySelectorAll("#kategorieButtons button").forEach((button) => {
        button.classList.toggle("aktiv", button.dataset.kategorie === kategorie);
    });
}

function zeichneCheckliste() {
    const liste = document.getElementById("checkliste");
    liste.replaceChildren();

    fragen.forEach((frage) => {
        const li = document.createElement("li");
        li.id = checklistId(frage[0]);
        li.textContent = `⬜ ${frage[0]}`;
        liste.appendChild(li);
    });
}

function checklistId(begriff) {
    return "item_" + begriff
        .replaceAll(" ", "_")
        .replaceAll("ä", "ae")
        .replaceAll("ö", "oe")
        .replaceAll("ü", "ue")
        .replaceAll("ß", "ss");
}

function zeigeFrage() {

  if (aktuelleFrage >= fragen.length) {

    document.getElementById("frage").textContent =
      `🎉 Fertig! ${punkte}/${fragen.length}`;

    return;
  }

  document.getElementById("frage").textContent =
    fragen[aktuelleFrage][0];
}


function karteKlick(event) {
    if (aktuelleFrage >= fragen.length || antwortPause) return;
    
    const pageX = event.pageX;
    const pageY = event.pageY;

  const img =
      document.getElementById("map");

  const rect =
      img.getBoundingClientRect();

    const skalierung = img.clientWidth / koordinatenReferenzBreiten[aktuelleKategorie];
  const x =
          (event.clientX - rect.left) / skalierung;

  const y =
          (event.clientY - rect.top) / skalierung;

  const richtigeKreise =
      fragen[aktuelleFrage].slice(1);

  let getroffen = false;

  richtigeKreise.forEach(id => {

      const kreis = circles[id];
      if (!kreis) return;

      const dx = x - kreis.x;
      const dy = y - kreis.y;

      const entfernung =
          Math.sqrt(dx*dx + dy*dy);

      if(entfernung <= 25
      ){
          getroffen = true;
      }
  });

  if(getroffen){
        falscheVersuche = 0;
        entferneRichtigePunkte();
    abdruck(pageX, pageY, "richtig");
    const begriff = fragen[aktuelleFrage][0];

    const id = "item_" + begriff
        .replaceAll(" ", "_")
        .replaceAll("ä", "ae")
        .replaceAll("ö", "oe")
        .replaceAll("ü", "ue")
        .replaceAll("ß", "ss");

    const checklistenEintrag = document.getElementById(id);
    if (checklistenEintrag) checklistenEintrag.textContent = "✅ " + begriff;

    document.getElementById("meldung")
        .innerHTML = "✅ Richtig";

    punkte++;

    document.getElementById("punkte")
        .textContent = punkte;

    aktuelleFrage++;

    setTimeout(() => {

        document.getElementById("meldung")
            .innerHTML = "";

        zeigeFrage();

    }, 700);

  } else {
    abdruck(pageX, pageY, "falsch");
    document.getElementById("meldung")
      .innerHTML = "❌ Falsch";

        falscheVersuche++;

        if (falscheVersuche >= 3) {
            const begriff = fragen[aktuelleFrage][0];
            const checklistenEintrag = document.getElementById(checklistId(begriff));
            if (checklistenEintrag) checklistenEintrag.textContent = "❌ " + begriff;

            document.getElementById("meldung").textContent = "❌ Drei Fehlversuche";
            aktuelleFrage++;
            falscheVersuche = 0;
            antwortPause = true;

            setTimeout(() => {
                entferneRichtigePunkte();
                document.getElementById("meldung").textContent = "";
                antwortPause = false;
                zeigeFrage();
            }, 700);
            return;
        }

        if (falscheVersuche >= 2) {
            zeigeRichtigePunkte(richtigeKreise);
        }

  }

  document.getElementById("punkte")
      .textContent = punkte;
}

document.querySelectorAll("#kategorieButtons button").forEach(button => {
    button.addEventListener("click", () => ladeKategorie(button.dataset.kategorie));
});

ladeKategorie("Topografie");

document.addEventListener("mousemove", e => {

    const dot =
        document.getElementById("cursorDot");

    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
});

function abdruck(x, y, klasse){

    const marker =
        document.createElement("div");

    marker.className =
        "abdruck " + klasse;

    marker.style.left = x + "px";
    marker.style.top = y + "px";

    document.body.appendChild(marker);

    marker.animate(
    [
        {opacity:1, transform:"translate(-50%,-50%) scale(1)"},
        {opacity:0.2, transform:"translate(-50%,-50%) scale(1.5)"}
    ],
    {
        duration:1000,
        fill:"forwards"
    });
}

function zeigeRichtigePunkte(ids) {
    if (richtigePunkte.length > 0) return;

    const img = document.getElementById("map");
    const rect = img.getBoundingClientRect();
    const skalierung = img.clientWidth / koordinatenReferenzBreiten[aktuelleKategorie];

    ids.forEach(id => {
        const koordinaten = circles[id];
        if (!koordinaten) return;
        const punkt = document.createElement("div");

        punkt.className = "richtigerPunkt";
        punkt.style.left = `${rect.left + koordinaten.x * skalierung}px`;
        punkt.style.top = `${rect.top + koordinaten.y * skalierung}px`;
        document.body.appendChild(punkt);
        richtigePunkte.push(punkt);
    });
}

function entferneRichtigePunkte() {
    richtigePunkte.forEach(punkt => punkt.remove());
    richtigePunkte = [];
}