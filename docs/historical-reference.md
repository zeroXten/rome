# Historical Rome — Source-of-Truth Reference

This document is the **factual backbone** for the interactive map. Dates, coordinates,
and era assignments here are authoritative; the artwork and code must conform to this,
not the other way around. Standard: *evocative but broadly accurate* — dates are correct
at a broad level, positions are real (usable for GPS), footprints are impressionistic.

All coordinates are **WGS84 (lat, lng)** — the same system a phone's GPS returns — so
every feature can be placed on a real coordinate grid and the "you are here" dot lands
correctly. Coordinates are to the monument's approximate center.

---

## 1. Era model (the slider stops)

The slider runs left→right across 9 anchored eras. Dragging cross-fades between the two
adjacent eras. Once a monument is built it normally persists in all later eras (some
survive only as **ruins** — noted per entry).

| # | Era | Span | Slider label | City character | Est. population |
|---|-----|------|--------------|----------------|-----------------|
| 1 | Archaic / Regal Rome | 753–509 BC | "The Kings" | Iron-age huts on the Palatine; Forum valley being drained; first shrines | a few thousand → ~30k |
| 2 | Early Republic | 509–270 BC | "Early Republic" | Servian Wall, first temples, Forum paved, Circus valley in use | ~30k–150k |
| 3 | Mid–Late Republic | 270–44 BC | "The Republic" | Basilicas, aqueducts, Theatre of Pompey, dense Campus Martius edges | ~150k–500k+ |
| 4 | Augustan Rome | 44 BC–AD 14 | "Augustus" | "Found brick, left marble" — Mausoleum, Ara Pacis, imperial fora begin | ~800k–1M |
| 5 | Imperial Rome | AD 14–192 | "The Empire" | Peak: Colosseum, Pantheon, Trajan's Forum, imperial baths | ~1M (peak) |
| 6 | Late Antiquity | AD 192–410 | "Late Empire" | Aurelian Walls enclose the city; Baths of Caracalla/Diocletian; first churches | ~1M → declining |
| 7 | Medieval Rome | 410–1400 | "Medieval" | Collapse to a village amid ruins (the *disabitato*); fortresses; papal town by the Tiber bend | ~30k (nadir) |
| 8 | Renaissance & Baroque | 1400–1750 | "Renaissance" | Papal rebuilding: New St Peter's, piazzas, fountains, straightened streets | ~50k–150k |
| 9 | Modern Rome | 1750–present | "Modern" | Capital of Italy (1871); Vittoriano, Via dei Fori Imperiali, sprawl beyond the walls | 150k → ~2.7M |

Population references: [Demography of the Roman Empire](https://en.wikipedia.org/wiki/Demography_of_the_Roman_Empire),
[History of Rome](https://en.wikipedia.org/wiki/History_of_Rome).

---

## 2. The permanent stage (present in every era)

These define the geography the city grows on; drawn in all eras (styled per period).

| Feature | Approx. coords | Notes | Ref |
|---------|----------------|-------|-----|
| River Tiber | flows ~N→S through 41.90, 12.47 | The bend around the Campus Martius is the anchor of the whole map | [wiki](https://en.wikipedia.org/wiki/Tiber) |
| Tiber Island | 41.8901, 12.4780 | Crossing point since earliest Rome; Temple of Aesculapius 291 BC | [wiki](https://en.wikipedia.org/wiki/Tiber_Island) |
| Palatine Hill | 41.8894, 12.4875 | Legendary founding site (Romulus); later imperial palaces | [wiki](https://en.wikipedia.org/wiki/Palatine_Hill) |
| Capitoline Hill | 41.8931, 12.4828 | Citadel + Temple of Jupiter; civic/religious summit | [wiki](https://en.wikipedia.org/wiki/Capitoline_Hill) |
| Aventine, Caelian, Esquiline, Viminal, Quirinal | around 41.88–41.90, 12.48–12.50 | The rest of the Seven Hills | [wiki](https://en.wikipedia.org/wiki/Seven_hills_of_Rome) |
| Campus Martius | 41.900, 12.475 | Flood plain in the Tiber bend; fills with monuments over time | [wiki](https://en.wikipedia.org/wiki/Campus_Martius) |

---

## 3. Monument catalogue

Each entry: **first era it appears** (`Era`), build date, coordinates, one-line note, and a
reference link. Sorted roughly by era of first appearance.

### Era 1 — Archaic / Regal (753–509 BC)

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Roma Quadrata (Palatine huts) | 41.8890, 12.4870 | 8th c. BC | Iron-age village; "Hut of Romulus" | [wiki](https://en.wikipedia.org/wiki/Palatine_Hill) |
| Cloaca Maxima (great drain) | 41.8905, 12.4820 | c. 600 BC | Drained the Forum marsh — enabled the city center | [wiki](https://en.wikipedia.org/wiki/Cloaca_Maxima) |
| Regia | 41.8922, 12.4864 | 7th c. BC | Residence of the kings, later Pontifex Maximus | [wiki](https://en.wikipedia.org/wiki/Regia) |
| Comitium | 41.8929, 12.4849 | late 7th c. BC | Earliest political assembly space | [wiki](https://en.wikipedia.org/wiki/Comitium) |
| Temple of Jupiter Optimus Maximus | 41.8925, 12.4823 | dedicated 509 BC | Great Capitoline temple; symbol of the state | [wiki](https://en.wikipedia.org/wiki/Temple_of_Jupiter_Optimus_Maximus) |

### Era 2 — Early Republic (509–270 BC)

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Servian Wall | ring ~ 41.90/12.49 (Porta at 41.9010,12.5015) | early 4th c. BC | 11 km circuit, ~246 ha; rebuilt after Gallic sack (390 BC) | [wiki](https://en.wikipedia.org/wiki/Servian_Wall) |
| Temple of Saturn | 41.8925, 12.4844 | 497 BC | State treasury; 8 columns still stand | [wiki](https://en.wikipedia.org/wiki/Temple_of_Saturn) |
| Temple of Castor and Pollux | 41.8916, 12.4857 | 484 BC | Three surviving columns in the Forum | [wiki](https://en.wikipedia.org/wiki/Temple_of_Castor_and_Pollux) |
| Circus Maximus | 41.8859, 12.4854 | 6th c. BC origins | Chariot-racing valley between Palatine & Aventine | [wiki](https://en.wikipedia.org/wiki/Circus_Maximus) |
| Aqua Appia (first aqueduct) | terminus ~41.888, 12.482 | 312 BC | Rome's first aqueduct (mostly underground) | [wiki](https://en.wikipedia.org/wiki/Aqua_Appia) |
| Temple of Aesculapius (Tiber Island) | 41.8898, 12.4785 | 291 BC | Healing temple that gave the island its identity | [wiki](https://en.wikipedia.org/wiki/Tiber_Island) |

### Era 3 — Mid–Late Republic (270–44 BC)

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Basilica Aemilia | 41.8929, 12.4859 | 179 BC | Early basilica on the Forum's north side | [wiki](https://en.wikipedia.org/wiki/Basilica_Aemilia) |
| Aqua Marcia | arrives E at ~41.891, 12.503 | 144 BC | Long aqueduct feeding the growing city | [wiki](https://en.wikipedia.org/wiki/Aqua_Marcia) |
| Tabularium | 41.8930, 12.4839 | 78 BC | State-records hall against the Capitoline; still stands | [wiki](https://en.wikipedia.org/wiki/Tabularium) |
| Theatre of Pompey | 41.8955, 12.4720 | 55 BC | Rome's first permanent stone theatre; Caesar died in its Curia | [wiki](https://en.wikipedia.org/wiki/Theatre_of_Pompey) |
| Forum of Caesar | 41.8944, 12.4846 | 46 BC | First of the imperial fora; Temple of Venus Genetrix | [wiki](https://en.wikipedia.org/wiki/Forum_of_Caesar) |
| Curia Julia (Senate House) | 41.8930, 12.4855 | begun 44 BC | The Senate house we still see today | [wiki](https://en.wikipedia.org/wiki/Curia_Julia) |

### Era 4 — Augustan (44 BC–AD 14)

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Mausoleum of Augustus | 41.9061, 12.4763 | 28 BC | Vast circular dynastic tomb on the Campus Martius | [wiki](https://en.wikipedia.org/wiki/Mausoleum_of_Augustus) |
| Theatre of Marcellus | 41.8919, 12.4797 | 13 BC | Colosseum-like theatre; still standing (later a palace) | [wiki](https://en.wikipedia.org/wiki/Theatre_of_Marcellus) |
| Ara Pacis | 41.9057, 12.4753 | 13–9 BC | Altar of Augustan Peace | [wiki](https://en.wikipedia.org/wiki/Ara_Pacis) |
| Forum of Augustus + Temple of Mars Ultor | 41.8940, 12.4859 | 2 BC | Second imperial forum | [wiki](https://en.wikipedia.org/wiki/Forum_of_Augustus) |
| Pantheon (Agrippa's original) | 41.8986, 12.4769 | 27–25 BC | First Pantheon; burned, later rebuilt by Hadrian | [wiki](https://en.wikipedia.org/wiki/Pantheon,_Rome) |
| Pyramid of Cestius | 41.8760, 12.4809 | c. 12 BC | Tomb pyramid, later embedded in the Aurelian Walls | [wiki](https://en.wikipedia.org/wiki/Pyramid_of_Cestius) |

### Era 5 — Imperial peak (AD 14–192)

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Colosseum (Flavian Amphitheatre) | 41.8902, 12.4922 | AD 72–80 | The icon; ~50,000 spectators | [wiki](https://en.wikipedia.org/wiki/Colosseum) |
| Arch of Titus | 41.8905, 12.4884 | AD 81 | Triumphal arch on the Via Sacra | [wiki](https://en.wikipedia.org/wiki/Arch_of_Titus) |
| Baths of Trajan | 41.8917, 12.4955 | AD 109 | Huge public baths on the Oppian | [wiki](https://en.wikipedia.org/wiki/Baths_of_Trajan) |
| Pantheon (Hadrian's rebuild) | 41.8986, 12.4769 | c. AD 113–125 | The domed building standing today | [wiki](https://en.wikipedia.org/wiki/Pantheon,_Rome) |
| Forum of Trajan + Trajan's Column | 41.8956, 12.4847 | AD 112–113 | Grandest imperial forum; column dedicated 113 | [wiki](https://en.wikipedia.org/wiki/Trajan%27s_Forum) |
| Trajan's Market | 41.8963, 12.4869 | c. AD 110 | Multi-level complex, "world's first mall" | [wiki](https://en.wikipedia.org/wiki/Trajan%27s_Market) |
| Temple of Venus and Roma | 41.8906, 12.4877 | AD 135 | Largest temple in Rome, by Hadrian | [wiki](https://en.wikipedia.org/wiki/Temple_of_Venus_and_Roma) |
| Mausoleum of Hadrian (Castel Sant'Angelo) | 41.9031, 12.4663 | AD 139 | Emperor's tomb; later papal fortress | [wiki](https://en.wikipedia.org/wiki/Castel_Sant%27Angelo) |

### Era 6 — Late Antiquity (AD 192–410)

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Baths of Caracalla | 41.8790, 12.4924 | AD 212–216 | Colossal bathing complex, ~1,600 bathers | [wiki](https://en.wikipedia.org/wiki/Baths_of_Caracalla) |
| Aurelian Walls | ~19 km ring; Porta San Sebastiano 41.8760, 12.5010 | AD 271–275 | Enclosed ~1,400 ha incl. all seven hills + Trastevere | [wiki](https://en.wikipedia.org/wiki/Aurelian_Walls) |
| Baths of Diocletian | 41.9030, 12.4980 | AD 298–306 | Largest baths ever built in Rome | [wiki](https://en.wikipedia.org/wiki/Baths_of_Diocletian) |
| Basilica of Maxentius | 41.8919, 12.4880 | AD 308–312 | Vast vaulted hall in the Forum | [wiki](https://en.wikipedia.org/wiki/Basilica_of_Maxentius) |
| Arch of Constantine | 41.8898, 12.4913 | AD 315 | Triumphal arch beside the Colosseum | [wiki](https://en.wikipedia.org/wiki/Arch_of_Constantine) |
| Old St Peter's Basilica | 41.9022, 12.4539 | c. AD 319–360 | Constantine's basilica over St Peter's tomb (replaced 16th c.) | [wiki](https://en.wikipedia.org/wiki/Old_St._Peter%27s_Basilica) |
| Santa Maria Maggiore | 41.8976, 12.4986 | AD 432 | Major early basilica on the Esquiline | [wiki](https://en.wikipedia.org/wiki/Santa_Maria_Maggiore) |

### Era 7 — Medieval (410–1400)

City shrinks into the Tiber bend; ancient monuments survive as **ruins** and are reused.

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Castel Sant'Angelo (as fortress) | 41.9031, 12.4663 | from ~5th c. | Hadrian's tomb becomes the papal stronghold | [wiki](https://en.wikipedia.org/wiki/Castel_Sant%27Angelo) |
| Leonine Wall (Vatican) | ~41.903, 12.457 | AD 852 | Wall enclosing the Vatican after Saracen raids | [wiki](https://en.wikipedia.org/wiki/Leonine_City) |
| Torre delle Milizie | 41.8960, 12.4864 | 13th c. | Landmark medieval tower by Trajan's forum | [wiki](https://en.wikipedia.org/wiki/Torre_delle_Milizie) |
| *Disabitato* | Campus Martius / old center | 6th–14th c. | Fields and ruins where a million once lived | [wiki](https://en.wikipedia.org/wiki/History_of_Rome#Middle_Ages) |

### Era 8 — Renaissance & Baroque (1400–1750)

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Ponte Sisto | 41.8919, 12.4707 | 1479 | First new Tiber bridge since antiquity | [wiki](https://en.wikipedia.org/wiki/Ponte_Sisto) |
| New St Peter's Basilica | 41.9022, 12.4539 | 1506–1626 | Bramante→Michelangelo→Bernini; the dome that defines the skyline | [wiki](https://en.wikipedia.org/wiki/St._Peter%27s_Basilica) |
| Piazza del Campidoglio | 41.8934, 12.4828 | 1536+ | Michelangelo's redesign of the Capitoline | [wiki](https://en.wikipedia.org/wiki/Piazza_del_Campidoglio) |
| Piazza Navona (Four Rivers Fountain) | 41.8992, 12.4731 | 1651 | Bernini's fountain on the old stadium of Domitian | [wiki](https://en.wikipedia.org/wiki/Piazza_Navona) |
| St Peter's Square colonnade | 41.9019, 12.4569 | 1656–1667 | Bernini's embracing colonnade | [wiki](https://en.wikipedia.org/wiki/St._Peter%27s_Square) |
| Spanish Steps | 41.9060, 12.4823 | 1723–1725 | Baroque staircase to Trinità dei Monti | [wiki](https://en.wikipedia.org/wiki/Spanish_Steps) |
| Trevi Fountain | 41.9009, 12.4833 | 1732–1762 | Salvi's late-Baroque masterpiece | [wiki](https://en.wikipedia.org/wiki/Trevi_Fountain) |

### Era 9 — Modern (1750–present)

| Monument | Coords | Date | Note | Ref |
|----------|--------|------|------|-----|
| Vittoriano (Altare della Patria) | 41.8946, 12.4833 | 1885–1911 | Monument to unified Italy at Piazza Venezia | [wiki](https://en.wikipedia.org/wiki/Victor_Emmanuel_II_National_Monument) |
| Via dei Fori Imperiali | 41.8934, 12.4864 | 1932 | Mussolini's avenue cut across the imperial fora | [wiki](https://en.wikipedia.org/wiki/Via_dei_Fori_Imperiali) |
| Termini Station | 41.9010, 12.5020 | 1867 / rebuilt 1950 | Main railway station | [wiki](https://en.wikipedia.org/wiki/Roma_Termini_railway_station) |
| Modern sprawl / EUR | beyond the Aurelian Walls | 20th c. | City grows far past every ancient boundary | [wiki](https://en.wikipedia.org/wiki/EUR,_Rome) |

---

## 4. City-growth story (what visibly changes across the slider)

- **The walls tell the growth story most clearly:** no wall → Servian Wall (Era 2, small ~246 ha ring) → Aurelian Walls (Era 6, ~1,400 ha ring around all seven hills + Trastevere) → walls become irrelevant as the modern city (Era 9) spills far beyond them.
- **Campus Martius** starts as empty flood plain (Era 1–3), fills with Augustan monuments (Era 4), becomes the dense medieval/Renaissance core (Eras 7–8).
- **The Forum** rises (Eras 1–5), then becomes ruins and pasture — the "Campo Vaccino," cow field — in Eras 6–8, then an excavated archaeological park in Era 9.
- **Center of gravity shifts** from the Forum/Palatine (antiquity) to the Vatican/Tiber bend (medieval–Baroque papal city) and back to a unified civic center at Piazza Venezia (modern).
- **Population** is the emotional throughline: ~1M at peak (Era 5) → ~30k medieval nadir (Era 7) → ~2.7M today.

---

## 4b. Expansion — Christianity, the Vatican & the Roman Church

Added to make the rise of the Church a visible thread. Christian tradition (e.g. the
exact site of martyrdoms) is presented as tradition, not settled fact.

| Monument | Coords | Era / date | Status | Ref |
|----------|--------|-----------|--------|-----|
| Circus of Nero (Vatican) | 41.9016, 12.4558 | 5 · c. AD 40–64 (gone by 6) | gone | [wiki](https://en.wikipedia.org/wiki/Circus_of_Nero) |
| Vatican Obelisk | 41.9022, 12.4573 | 5 · AD 37; moved 1586 | standing | [wiki](https://en.wikipedia.org/wiki/Vatican_Obelisk) |
| Mamertine Prison | 41.8934, 12.4844 | 2 · 7th c. BC | standing | [wiki](https://en.wikipedia.org/wiki/Mamertine_Prison) |
| Santa Maria in Trastevere | 41.8896, 12.4696 | 6 · c. 350 / reb. 1140s | standing | [wiki](https://en.wikipedia.org/wiki/Santa_Maria_in_Trastevere) |
| Basilica of San Clemente | 41.8894, 12.4977 | 6 · 4th c. / reb. 1123 | standing | [wiki](https://en.wikipedia.org/wiki/San_Clemente_al_Laterano) |
| San Pietro in Vincoli | 41.8938, 12.4933 | 6 · AD 432–440 | standing | [wiki](https://en.wikipedia.org/wiki/San_Pietro_in_Vincoli) |
| Santa Sabina | 41.8843, 12.4794 | 6 · AD 422–432 | standing | [wiki](https://en.wikipedia.org/wiki/Santa_Sabina) |
| San Giovanni in Laterano (cathedral of Rome) | 41.8858, 12.5057 | 6 · AD 324 | standing | [wiki](https://en.wikipedia.org/wiki/Archbasilica_of_Saint_John_Lateran) |
| Lateran Palace | 41.8862, 12.5041 | 6 · 4th c. | standing | [wiki](https://en.wikipedia.org/wiki/Lateran_Palace) |
| Santa Maria in Cosmedin | 41.8880, 12.4816 | 7 · 8th c. | standing | [wiki](https://en.wikipedia.org/wiki/Santa_Maria_in_Cosmedin) |
| Santa Maria sopra Minerva | 41.8983, 12.4779 | 7 · 1280s | standing | [wiki](https://en.wikipedia.org/wiki/Santa_Maria_sopra_Minerva) |
| Trinità dei Monti | 41.9061, 12.4809 | 8 · 1502–1585 | standing | [wiki](https://en.wikipedia.org/wiki/Trinit%C3%A0_dei_Monti) |
| Church of the Gesù | 41.8958, 12.4794 | 8 · 1568–1584 | standing | [wiki](https://en.wikipedia.org/wiki/Church_of_the_Ges%C3%B9) |
| Sistine Chapel | 41.9029, 12.4545 | 8 · 1473–1481 | standing | [wiki](https://en.wikipedia.org/wiki/Sistine_Chapel) |
| Vatican Palace & Museums | 41.9065, 12.4536 | 8 · 1506+ | standing | [wiki](https://en.wikipedia.org/wiki/Vatican_Museums) |
| Ponte Sant'Angelo | 41.9017, 12.4665 | 5 · AD 134 | standing | [wiki](https://en.wikipedia.org/wiki/Ponte_Sant%27Angelo) |

## 4c. Expansion — more of ancient, medieval & Renaissance Rome

| Monument | Coords | Era / date | Status | Ref |
|----------|--------|-----------|--------|-----|
| Temple of Vesta | 41.8917, 12.4862 | 2 · archaic / reb. AD 191 | ruin | [wiki](https://en.wikipedia.org/wiki/Temple_of_Vesta) |
| Largo di Torre Argentina | 41.8955, 12.4768 | 3 · 4th–2nd c. BC | ruin | [wiki](https://en.wikipedia.org/wiki/Largo_di_Torre_Argentina) |
| Portico of Octavia | 41.8920, 12.4779 | 4 · 27 BC | ruin | [wiki](https://en.wikipedia.org/wiki/Porticus_Octaviae) |
| Domus Aurea (Nero's Golden House) | 41.8910, 12.4955 | 5 · AD 64–68 | ruin | [wiki](https://en.wikipedia.org/wiki/Domus_Aurea) |
| Ludus Magnus | 41.8896, 12.4936 | 5 · AD 80s | ruin | [wiki](https://en.wikipedia.org/wiki/Ludus_Magnus) |
| Temple of Hadrian | 41.8996, 12.4794 | 5 · AD 145 | standing | [wiki](https://en.wikipedia.org/wiki/Temple_of_Hadrian) |
| Column of Marcus Aurelius | 41.9008, 12.4796 | 5 · AD 180–193 | standing | [wiki](https://en.wikipedia.org/wiki/Column_of_Marcus_Aurelius) |
| Arch of Septimius Severus | 41.8928, 12.4846 | 6 · AD 203 | standing | [wiki](https://en.wikipedia.org/wiki/Arch_of_Septimius_Severus) |
| Ponte Sisto | 41.8919, 12.4707 | 8 · 1479 | standing | [wiki](https://en.wikipedia.org/wiki/Ponte_Sisto) |
| Palazzo Farnese | 41.8954, 12.4712 | 8 · 1541 | standing | [wiki](https://en.wikipedia.org/wiki/Palazzo_Farnese) |
| The Roman Ghetto | 41.8925, 12.4776 | 8 · 1555 | standing | [wiki](https://en.wikipedia.org/wiki/Roman_Ghetto) |

**Map labels** (district orientation, non-monument): Vatican, Campus Martius, The Forum,
Palatine, Capitoline, Aventine, Esquiline, Trastevere, Tiber.

## 4d. Expansion — gods, cults, statues & museums

| Item | Coords | Era / date | Status | Ref |
|------|--------|-----------|--------|-----|
| Temple of Cybele (Magna Mater) | 41.8896, 12.4864 | 3 · 204–191 BC | ruin | [wiki](https://en.wikipedia.org/wiki/Temple_of_Cybele_(Palatine)) |
| Temple of Portunus | 41.8890, 12.4809 | 3 · c. 120–80 BC | standing | [wiki](https://en.wikipedia.org/wiki/Temple_of_Portunus) |
| Temple of Hercules Victor | 41.8884, 12.4814 | 3 · c. 120 BC | standing | [wiki](https://en.wikipedia.org/wiki/Temple_of_Hercules_Victor) |
| Temple of Apollo Sosianus | 41.8922, 12.4791 | 4 · 34–20 BC | ruin | [wiki](https://en.wikipedia.org/wiki/Temple_of_Apollo_Sosianus) |
| Temple of Isis (Iseum Campense) | 41.8981, 12.4788 | 5 · 43 BC / reb. AD 80 | gone | [wiki](https://en.wikipedia.org/wiki/Iseum_Campense) |
| Great Synagogue of Rome | 41.8917, 12.4781 | 9 · 1901–1904 | standing | [wiki](https://en.wikipedia.org/wiki/Great_Synagogue_of_Rome) |
| Statue of Marcus Aurelius (equestrian) | 41.8931, 12.4826 | 5 · c. AD 175 | standing | [wiki](https://en.wikipedia.org/wiki/Equestrian_Statue_of_Marcus_Aurelius) |
| Colossus of Nero | 41.8905, 12.4907 | 5 · AD 60s (gone by 7) | gone | [wiki](https://en.wikipedia.org/wiki/Colossus_of_Nero) |
| Capitoline Museums | 41.8933, 12.4831 | 8 · 1471 / 1734 | standing | [wiki](https://en.wikipedia.org/wiki/Capitoline_Museums) |
| Galleria Doria Pamphilj | 41.8981, 12.4820 | 8 · 1651+ | standing | [wiki](https://en.wikipedia.org/wiki/Galleria_Doria_Pamphilj) |
| National Roman Museum (Palazzo Massimo) | 41.9013, 12.4985 | 9 · 1889 / 1998 | standing | [wiki](https://en.wikipedia.org/wiki/Palazzo_Massimo_alle_Terme) |

Each monument popup also links to **Google Maps directions** (`maps/dir/?api=1&destination=lat,lng`)
so a visitor can navigate straight to the spot.

## 4e. Expansion — aqueducts, gates & the catacombs

Aqueducts are also drawn as faint arched **lines** on the base map, growing era by era.

| Item | Coords | Era / date | Status | Ref |
|------|--------|-----------|--------|-----|
| Aqua Appia (first aqueduct) | 41.8846, 12.4866 | 2 · 312 BC | gone | [wiki](https://en.wikipedia.org/wiki/Aqua_Appia) |
| Aqua Marcia | 41.8955, 12.4884 | 3 · 144 BC | ruin | [wiki](https://en.wikipedia.org/wiki/Aqua_Marcia) |
| Aqua Virgo (still feeds the Trevi) | 41.9006, 12.4805 | 4 · 19 BC | standing | [wiki](https://en.wikipedia.org/wiki/Aqua_Virgo) |
| Aqua Claudia | 41.8878, 12.4962 | 5 · AD 38–52 | ruin | [wiki](https://en.wikipedia.org/wiki/Aqua_Claudia) |
| Porta Maggiore (aqueduct gate) | 41.8916, 12.5147 | 5 · AD 52 | standing | [wiki](https://en.wikipedia.org/wiki/Porta_Maggiore) |
| Porta San Sebastiano (Appian gate) | 41.8762, 12.5013 | 6 · AD 275 / 401 | standing | [wiki](https://en.wikipedia.org/wiki/Porta_San_Sebastiano) |
| Catacombs of the Appian Way | 41.8712, 12.5052 *(marker at the south edge; real catacombs ≈ 41.8586, 12.5108, ~2 km south, beyond the map)* | 6 · 2nd–4th c. | ruin | [wiki](https://en.wikipedia.org/wiki/Catacombs_of_Rome) |

> The catacombs lie ~2 km south of the Aurelian Walls, off the drawn frame. The marker sits
> at the map's southern edge by the Appian gate; its **Directions** link points to the real
> Catacombs of San Callisto so navigation still works.

## 5. Primary reference sources

- History of Rome — https://en.wikipedia.org/wiki/History_of_Rome
- Ancient Rome — https://en.wikipedia.org/wiki/Ancient_Rome
- Servian Wall — https://en.wikipedia.org/wiki/Servian_Wall
- Aurelian Walls — https://en.wikipedia.org/wiki/Aurelian_Walls
- Roman Forum — https://en.wikipedia.org/wiki/Roman_Forum · https://www.worldhistory.org/Roman_Forum/
- Campus Martius — https://en.wikipedia.org/wiki/Campus_Martius
- Demography of the Roman Empire — https://en.wikipedia.org/wiki/Demography_of_the_Roman_Empire
- Seven hills of Rome — https://en.wikipedia.org/wiki/Seven_hills_of_Rome
- Ancient Rome Live (walls) — https://ancientromelive.org/walls-of-rome/

Per-monument references are linked inline in the tables above.

> **Accuracy caveats:** Coordinates are approximate centers, adequate for placing a GPS dot
> near the right monument but not survey-grade. Some structures were rebuilt multiple times
> (Pantheon, Curia); the catalogue lists the date most relevant to when it visibly appears on
> the map. Founding-era (Era 1) features are semi-legendary and dated loosely by convention.
