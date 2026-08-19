/* =====================================================================
   data.js — the single source of truth for the map.
   Everything here is derived from docs/historical-reference.md.
   Coordinates are real WGS84 (lat, lng) so GPS lands correctly.
   ===================================================================== */

/* Geographic rectangle the illustrated map covers.
   Chosen to include St Peter's (W), San Giovanni/Termini (E),
   Spanish Steps/Mausoleum of Augustus (N), Baths of Caracalla/Pyramid (S). */
const MAP_BOUNDS = { west: 12.446, east: 12.514, south: 41.870, north: 41.912 };

/* Artwork viewBox. Aspect ~matches the real-world km ratio of the bounds
   so circles stay circular when Leaflet stretches the SVG over the bounds. */
const VB = { w: 1206, h: 1000 };

/* Linear projection lng/lat -> artwork viewBox coordinates.
   Shared by the art layer and (implicitly, via Leaflet) the markers,
   so drawn buildings and clickable markers coincide. */
function project(lng, lat) {
  return {
    x: ((lng - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * VB.w,
    y: ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * VB.h,
  };
}

/* The 9 eras = the slider stops. Each occupies an equal slice of the slider
   (so the monument-rich early centuries get room to breathe). `start`/`end`
   are numeric years (negative = BC) used to show a headline year. */
const ERAS = [
  { i: 1, name: "The Kings",        sub: "Archaic Rome",        start: -753, end: -509, pop: "~30,000",   blurb: "Iron-age huts crown the Palatine while the Forum marsh is drained. Rome is a cluster of villages ruled by kings." },
  { i: 2, name: "Early Republic",   sub: "509–270 BC",          start: -509, end: -270, pop: "~150,000",  blurb: "The Servian Wall rings the seven hills. The first great temples rise and the Forum becomes the heart of a young Republic." },
  { i: 3, name: "The Republic",     sub: "270–44 BC",           start: -270, end: -44,  pop: "~500,000",  blurb: "Conquest brings riches. Basilicas, aqueducts and Pompey's theatre crowd the city; Caesar begins the imperial fora." },
  { i: 4, name: "Augustus",         sub: "44 BC–AD 14",         start: -44,  end: 14,   pop: "~900,000",  blurb: "Augustus 'found Rome brick and left it marble' — the Mausoleum, the Ara Pacis and a monumental Campus Martius." },
  { i: 5, name: "The Empire",       sub: "AD 14–192",           start: 14,   end: 192,  pop: "~1,000,000", blurb: "Rome at its zenith: the Colosseum, the Pantheon's dome, Trajan's Forum and Column, and vast imperial baths." },
  { i: 6, name: "Late Empire",      sub: "AD 192–410",          start: 192,  end: 410,  pop: "declining",  blurb: "The Aurelian Walls throw a huge ring around the whole city. Giant baths, triumphal arches — and the first great churches." },
  { i: 7, name: "Medieval",         sub: "410–1400",            start: 410,  end: 1400, pop: "~30,000",    blurb: "A million-strong metropolis collapses to a town amid ruins. Sheep graze the Forum; life huddles in the Tiber bend." },
  { i: 8, name: "Renaissance",      sub: "1400–1750",           start: 1400, end: 1750, pop: "~150,000",   blurb: "Popes rebuild in splendour: New St Peter's, Bernini's piazzas and colonnade, and the great Baroque fountains." },
  { i: 9, name: "Modern",           sub: "1750–today",          start: 1750, end: 2025, pop: "~2,700,000", blurb: "Capital of a united Italy. The Vittoriano, grand avenues cut through the fora, and a city sprawling far beyond every ancient wall." },
];

/* status — can you see it today?
     "standing" = substantially intact / iconic building you can visit
     "ruin"     = visitable ruins or significant remains
     "gone"     = vanished, demolished or only buried foundations (history only)  */
const MONUMENTS = [
  // --- Era 1: Archaic / Regal ---
  { id: "palatine",   name: "Palatine Settlement",        type: "village", lat: 41.8890, lng: 12.4870, era: 1, status: "ruin",     date: "8th c. BC", blurb: "The legendary founding hill of Romulus — iron-age huts that grew into the heart of Rome. Today a hilltop archaeological park.", wiki: "https://en.wikipedia.org/wiki/Palatine_Hill" },
  { id: "jupiter",    name: "Temple of Jupiter O.M.",     type: "temple",  lat: 41.8925, lng: 12.4823, era: 1, status: "gone",     date: "dedicated 509 BC", blurb: "The great temple crowning the Capitoline, symbolic centre of the Roman state. Only fragments survive in the Capitoline Museums.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Jupiter_Optimus_Maximus" },
  { id: "regia",      name: "Regia & Comitium",           type: "temple",  lat: 41.8925, lng: 12.4860, era: 1, status: "ruin",     date: "7th c. BC", blurb: "Home of the kings and the earliest assembly place — the seed of the Roman Forum, whose low foundations you can still trace.", wiki: "https://en.wikipedia.org/wiki/Regia" },

  // --- Era 2: Early Republic ---
  { id: "saturn",     name: "Temple of Saturn",           type: "temple",  lat: 41.8925, lng: 12.4844, era: 2, status: "ruin",     date: "497 BC", blurb: "The state treasury; eight tall columns of its later rebuild still stand at the edge of the Forum.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Saturn" },
  { id: "castor",     name: "Temple of Castor & Pollux",  type: "temple",  lat: 41.8916, lng: 12.4857, era: 2, status: "ruin",     date: "484 BC", blurb: "Dedicated to the divine twins after a battlefield vision; three graceful columns survive in the Forum.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Castor_and_Pollux" },
  { id: "circus",     name: "Circus Maximus",             type: "circus",  lat: 41.8859, lng: 12.4854, era: 2, status: "ruin",     date: "6th c. BC origins", blurb: "Rome's colossal chariot-racing track. Its shape survives today as a vast public park you can walk.", wiki: "https://en.wikipedia.org/wiki/Circus_Maximus" },
  { id: "aesculap",   name: "Temple of Aesculapius",      type: "temple",  lat: 41.8898, lng: 12.4785, era: 2, status: "gone",     date: "291 BC", blurb: "The healing temple that gave Tiber Island its identity; the church of San Bartolomeo now stands on the spot.", wiki: "https://en.wikipedia.org/wiki/Tiber_Island" },

  // --- Era 3: Mid–Late Republic ---
  { id: "pompey",     name: "Theatre of Pompey",          type: "theatre", lat: 41.8955, lng: 12.4720, era: 3, status: "gone",     date: "55 BC", blurb: "Rome's first permanent stone theatre; in its hall Caesar fell. Only its curve, fossilised in the streets, remains above ground.", wiki: "https://en.wikipedia.org/wiki/Theatre_of_Pompey" },
  { id: "caesarforum",name: "Forum of Caesar",            type: "temple",  lat: 41.8944, lng: 12.4846, era: 3, status: "ruin",     date: "46 BC", blurb: "The first of the imperial fora, with its Temple of Venus Genetrix — visitable columns and pavement remain.", wiki: "https://en.wikipedia.org/wiki/Forum_of_Caesar" },
  { id: "curia",      name: "Curia Julia",                type: "hall",    lat: 41.8930, lng: 12.4855, era: 3, status: "standing", date: "begun 44 BC", blurb: "The Senate House begun by Julius Caesar — remarkably intact, because it served for centuries as a church.", wiki: "https://en.wikipedia.org/wiki/Curia_Julia" },
  { id: "tabularium", name: "Tabularium",                 type: "hall",    lat: 41.8930, lng: 12.4839, era: 3, status: "standing", date: "78 BC", blurb: "The state archive built against the Capitoline; its arches still underpin Rome's city hall, which you can visit.", wiki: "https://en.wikipedia.org/wiki/Tabularium" },

  // --- Era 4: Augustan ---
  { id: "augmaus",    name: "Mausoleum of Augustus",      type: "tomb",    lat: 41.9061, lng: 12.4763, era: 4, status: "ruin",     date: "28 BC", blurb: "A vast circular dynastic tomb on the Campus Martius, recently restored and reopened to visitors.", wiki: "https://en.wikipedia.org/wiki/Mausoleum_of_Augustus" },
  { id: "marcellus",  name: "Theatre of Marcellus",       type: "theatre", lat: 41.8919, lng: 12.4797, era: 4, status: "standing", date: "13 BC", blurb: "A great arcaded theatre — later a fortress, then a palace, and still lived in above its ancient arches.", wiki: "https://en.wikipedia.org/wiki/Theatre_of_Marcellus" },
  { id: "arapacis",   name: "Ara Pacis",                  type: "temple",  lat: 41.9057, lng: 12.4753, era: 4, status: "standing", date: "13–9 BC", blurb: "The exquisitely carved Altar of Augustan Peace, reassembled and displayed in a riverside museum.", wiki: "https://en.wikipedia.org/wiki/Ara_Pacis" },
  { id: "augforum",   name: "Forum of Augustus",          type: "temple",  lat: 41.8940, lng: 12.4859, era: 4, status: "ruin",     date: "2 BC", blurb: "Dominated by the Temple of Mars Ultor, vowed by Augustus to avenge Caesar; towering wall and column stumps survive.", wiki: "https://en.wikipedia.org/wiki/Forum_of_Augustus" },
  { id: "cestius",    name: "Pyramid of Cestius",         type: "pyramid", lat: 41.8760, lng: 12.4809, era: 4, status: "standing", date: "c. 12 BC", blurb: "An Egyptian-style tomb-pyramid, beautifully preserved after being built into the Aurelian Walls.", wiki: "https://en.wikipedia.org/wiki/Pyramid_of_Cestius" },

  // --- Era 5: Imperial peak ---
  { id: "colosseum",  name: "Colosseum",                  type: "amphi",   lat: 41.8902, lng: 12.4922, era: 5, status: "standing", date: "AD 72–80", blurb: "The Flavian Amphitheatre, seating some 50,000 for gladiatorial games — Rome's enduring icon and most-visited site.", wiki: "https://en.wikipedia.org/wiki/Colosseum" },
  { id: "archtitus",  name: "Arch of Titus",              type: "arch",    lat: 41.8905, lng: 12.4884, era: 5, status: "standing", date: "AD 81", blurb: "Triumphal arch on the Via Sacra celebrating the sack of Jerusalem; still spanning the road into the Forum.", wiki: "https://en.wikipedia.org/wiki/Arch_of_Titus" },
  { id: "trajanbaths",name: "Baths of Trajan",            type: "baths",   lat: 41.8917, lng: 12.4955, era: 5, status: "ruin",     date: "AD 109", blurb: "A giant public bathing complex on the Oppian Hill; brick ruins survive in a park above Nero's buried palace.", wiki: "https://en.wikipedia.org/wiki/Baths_of_Trajan" },
  { id: "pantheon",   name: "Pantheon",                   type: "dome", sprite: "pantheon", lat: 41.8986, lng: 12.4769, era: 5, status: "standing", date: "c. AD 113–125", blurb: "Hadrian's temple to all the gods, its coffered dome the best-preserved building of ancient Rome — free to enter.", wiki: "https://en.wikipedia.org/wiki/Pantheon,_Rome" },
  { id: "trajancol",  name: "Trajan's Forum & Column",    type: "column",  lat: 41.8956, lng: 12.4847, era: 5, status: "standing", date: "AD 112–113", blurb: "The column still stands intact, spiralling with the story of the Dacian wars, amid the ruins of the grandest forum.", wiki: "https://en.wikipedia.org/wiki/Trajan%27s_Forum" },
  { id: "trajanmkt",  name: "Trajan's Market",            type: "hall",    lat: 41.8963, lng: 12.4869, era: 5, status: "ruin",     date: "c. AD 110", blurb: "A remarkably preserved multi-level complex of halls and shops, now the Museum of the Imperial Fora.", wiki: "https://en.wikipedia.org/wiki/Trajan%27s_Market" },
  { id: "venusroma",  name: "Temple of Venus and Roma",   type: "temple",  lat: 41.8906, lng: 12.4877, era: 5, status: "ruin",     date: "AD 135", blurb: "The largest temple in Rome, designed by Hadrian himself; its brick apses survive beside the Colosseum.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Venus_and_Roma" },
  { id: "hadrianmaus",name: "Mausoleum of Hadrian",       type: "castle",  lat: 41.9031, lng: 12.4663, era: 5, status: "standing", date: "AD 139", blurb: "Hadrian's colossal tomb across the Tiber — still standing as the fortress-museum of Castel Sant'Angelo.", wiki: "https://en.wikipedia.org/wiki/Castel_Sant%27Angelo" },

  // --- Era 6: Late Antiquity ---
  { id: "caracalla",  name: "Baths of Caracalla",         type: "baths",   lat: 41.8790, lng: 12.4924, era: 6, status: "ruin",     date: "AD 212–216", blurb: "A pleasure-palace of bathing for 1,600 at a time; its towering ruined vaults are among Rome's most spectacular.", wiki: "https://en.wikipedia.org/wiki/Baths_of_Caracalla" },
  { id: "diocletian", name: "Baths of Diocletian",        type: "baths",   lat: 41.9030, lng: 12.4980, era: 6, status: "ruin",     date: "AD 298–306", blurb: "The largest baths Rome ever built; part was turned by Michelangelo into a church you can visit.", wiki: "https://en.wikipedia.org/wiki/Baths_of_Diocletian" },
  { id: "maxentius",  name: "Basilica of Maxentius",      type: "hall",    lat: 41.8919, lng: 12.4880, era: 6, status: "ruin",     date: "AD 308–312", blurb: "The last and greatest of the Forum's vaulted basilicas; three colossal coffered arches still soar.", wiki: "https://en.wikipedia.org/wiki/Basilica_of_Maxentius" },
  { id: "archconst",  name: "Arch of Constantine",        type: "arch",    lat: 41.8898, lng: 12.4913, era: 6, status: "standing", date: "AD 315", blurb: "The largest surviving Roman triumphal arch, standing complete beside the Colosseum.", wiki: "https://en.wikipedia.org/wiki/Arch_of_Constantine" },
  { id: "oldstpeter", name: "Old St Peter's Basilica",    type: "basilica",lat: 41.9022, lng: 12.4539, era: 6, out: 8, status: "gone", date: "c. AD 319", blurb: "Constantine's basilica over the tomb of St Peter — demolished in the 16th century to build the church that stands today.", wiki: "https://en.wikipedia.org/wiki/Old_St._Peter%27s_Basilica" },
  { id: "smaggiore",  name: "Santa Maria Maggiore",       type: "basilica",lat: 41.8976, lng: 12.4986, era: 6, status: "standing", date: "AD 432", blurb: "One of Rome's four great papal basilicas, still active on the Esquiline with its glittering early mosaics.", wiki: "https://en.wikipedia.org/wiki/Santa_Maria_Maggiore" },

  // --- Era 7: Medieval ---
  { id: "milizie",    name: "Torre delle Milizie",        type: "tower",   lat: 41.8960, lng: 12.4864, era: 7, status: "standing", date: "13th c.", blurb: "A leaning brick tower, surviving landmark of the fortified medieval city that grew amid the ruins.", wiki: "https://en.wikipedia.org/wiki/Torre_delle_Milizie" },

  // --- Era 8: Renaissance & Baroque ---
  { id: "newstpeter", name: "St Peter's Basilica",        type: "dome", sprite: "stpeters", lat: 41.9022, lng: 12.4539, era: 8, status: "standing", date: "1506–1626", blurb: "Bramante, Michelangelo and Bernini's masterpiece — the dome that defines Rome's skyline, open to visitors.", wiki: "https://en.wikipedia.org/wiki/St._Peter%27s_Basilica" },
  { id: "stpetersq",  name: "St Peter's Square",          type: "colonnade",lat: 41.9019, lng: 12.4569, era: 8, status: "standing", date: "1656–1667", blurb: "Bernini's vast elliptical colonnade, reaching out like welcoming arms before the basilica.", wiki: "https://en.wikipedia.org/wiki/St._Peter%27s_Square" },
  { id: "campidoglio",name: "Piazza del Campidoglio",     type: "hall",    lat: 41.8934, lng: 12.4828, era: 8, status: "standing", date: "1536+", blurb: "Michelangelo's harmonious redesign of the ancient Capitoline summit, framed by the Capitoline Museums.", wiki: "https://en.wikipedia.org/wiki/Piazza_del_Campidoglio" },
  { id: "navona",     name: "Piazza Navona",              type: "fountain",lat: 41.8992, lng: 12.4731, era: 8, status: "standing", date: "1651", blurb: "Bernini's Fountain of the Four Rivers, on the outline of Domitian's ancient stadium — a living Baroque piazza.", wiki: "https://en.wikipedia.org/wiki/Piazza_Navona" },
  { id: "spanish",    name: "Spanish Steps",              type: "steps",   lat: 41.9060, lng: 12.4823, era: 8, status: "standing", date: "1723–1725", blurb: "A theatrical Baroque cascade of steps rising to Trinità dei Monti, still one of Rome's great meeting places.", wiki: "https://en.wikipedia.org/wiki/Spanish_Steps" },
  { id: "trevi",      name: "Trevi Fountain",             type: "fountain",lat: 41.9009, lng: 12.4833, era: 8, status: "standing", date: "1732–1762", blurb: "Salvi's late-Baroque theatre of water where Oceanus rides his shell chariot — toss a coin to return to Rome.", wiki: "https://en.wikipedia.org/wiki/Trevi_Fountain" },

  // --- Era 9: Modern ---
  { id: "vittoriano", name: "Vittoriano",                 type: "wedding", lat: 41.8946, lng: 12.4833, era: 9, status: "standing", date: "1885–1911", blurb: "The blazing-white monument to Victor Emmanuel II and a united Italy, with a panoramic terrace open to visitors.", wiki: "https://en.wikipedia.org/wiki/Victor_Emmanuel_II_National_Monument" },
  { id: "termini",    name: "Roma Termini",              type: "hall",    lat: 41.9010, lng: 12.5020, era: 9, status: "standing", date: "1867 / 1950", blurb: "The great railway station, gateway to the modern capital.", wiki: "https://en.wikipedia.org/wiki/Roma_Termini_railway_station" },

  // ===================================================================
  // Christianity, the Vatican & the Roman Church
  // ===================================================================
  { id: "circusnero",  name: "Circus of Nero",             type: "circus",  lat: 41.9016, lng: 12.4558, era: 5, out: 6, status: "gone",     date: "c. AD 40–64", blurb: "Nero's chariot circus on the Vatican fields. Tradition holds that St Peter was martyred here in AD 64 — and the great basilica later rose directly over his grave.", wiki: "https://en.wikipedia.org/wiki/Circus_of_Nero" },
  { id: "vaticanobelisk", name: "Vatican Obelisk",         type: "obelisk", lat: 41.9022, lng: 12.4573, era: 5, status: "standing", date: "AD 37 (from Egypt)", blurb: "Brought from Egypt by Caligula for his circus, it witnessed St Peter's death and stood for 1,500 years — then was dragged to the centre of St Peter's Square in 1586.", wiki: "https://en.wikipedia.org/wiki/Vatican_Obelisk" },
  { id: "mamertine",   name: "Mamertine Prison",           type: "hall",    lat: 41.8934, lng: 12.4844, era: 2, status: "standing", date: "7th c. BC", blurb: "Rome's grim state prison beside the Forum; Christian tradition says St Peter and St Paul were held here before their deaths.", wiki: "https://en.wikipedia.org/wiki/Mamertine_Prison" },
  { id: "santamariatrastevere", name: "Santa Maria in Trastevere", type: "church", lat: 41.8896, lng: 12.4696, era: 6, status: "standing", date: "c. AD 350 / rebuilt 1140s", blurb: "Among the very first churches in Rome and the beating heart of the Trastevere quarter, glowing with golden medieval mosaics.", wiki: "https://en.wikipedia.org/wiki/Santa_Maria_in_Trastevere" },
  { id: "sanclemente", name: "Basilica of San Clemente",   type: "church",  lat: 41.8894, lng: 12.4977, era: 6, status: "standing", date: "4th c. / rebuilt 1123", blurb: "A church atop a 4th-century church, atop a Roman house and a temple of Mithras — 2,000 years of Rome stacked in one spot you can descend through.", wiki: "https://en.wikipedia.org/wiki/San_Clemente_al_Laterano" },
  { id: "sanpietrovincoli", name: "San Pietro in Vincoli", type: "church", lat: 41.8938, lng: 12.4933, era: 6, status: "standing", date: "AD 432–440", blurb: "Built to enshrine the chains of St Peter; today crowds come for Michelangelo's fearsome marble Moses.", wiki: "https://en.wikipedia.org/wiki/San_Pietro_in_Vincoli" },
  { id: "santasabina", name: "Santa Sabina",               type: "church",  lat: 41.8843, lng: 12.4794, era: 6, status: "standing", date: "AD 422–432", blurb: "The purest and most serene of Rome's surviving early-Christian basilicas, high on the Aventine.", wiki: "https://en.wikipedia.org/wiki/Santa_Sabina" },
  { id: "lateran",     name: "San Giovanni in Laterano",   type: "church",  lat: 41.8858, lng: 12.5057, era: 6, status: "standing", date: "AD 324", blurb: "The cathedral of Rome and mother church of all the world's Catholics — Constantine's first great basilica, and the popes' own church.", wiki: "https://en.wikipedia.org/wiki/Archbasilica_of_Saint_John_Lateran" },
  { id: "lateranpalace", name: "Lateran Palace",           type: "hall",    lat: 41.8862, lng: 12.5041, era: 6, status: "standing", date: "4th c.", blurb: "The seat and home of the popes for a thousand years, until they left for Avignon in 1309.", wiki: "https://en.wikipedia.org/wiki/Lateran_Palace" },
  { id: "santamariacosmedin", name: "Santa Maria in Cosmedin", type: "church", lat: 41.8880, lng: 12.4816, era: 7, status: "standing", date: "8th c.", blurb: "A lovely medieval church whose portico shelters the Bocca della Verità — the 'Mouth of Truth'.", wiki: "https://en.wikipedia.org/wiki/Santa_Maria_in_Cosmedin" },
  { id: "minerva",     name: "Santa Maria sopra Minerva",  type: "church",  lat: 41.8983, lng: 12.4779, era: 7, status: "standing", date: "1280s", blurb: "Rome's only Gothic church, raised over a temple of Minerva; Bernini's marble elephant carries an obelisk in the square outside.", wiki: "https://en.wikipedia.org/wiki/Santa_Maria_sopra_Minerva" },
  { id: "trinitamonti", name: "Trinità dei Monti",         type: "church",  lat: 41.9061, lng: 12.4809, era: 8, status: "standing", date: "1502–1585", blurb: "The twin-towered church crowning the Spanish Steps.", wiki: "https://en.wikipedia.org/wiki/Trinit%C3%A0_dei_Monti" },
  { id: "ilgesu",      name: "Church of the Gesù",         type: "church",  lat: 41.8958, lng: 12.4794, era: 8, status: "standing", date: "1568–1584", blurb: "The mother church of the Jesuits and the template for Baroque churches across the world.", wiki: "https://en.wikipedia.org/wiki/Church_of_the_Ges%C3%B9" },
  { id: "sistine",     name: "Sistine Chapel",             type: "hall",    lat: 41.9029, lng: 12.4545, era: 8, status: "standing", date: "1473–1481", blurb: "The pope's own chapel, its ceiling and altar wall transfigured by Michelangelo — and still where popes are elected.", wiki: "https://en.wikipedia.org/wiki/Sistine_Chapel" },
  { id: "vaticanmuseums", name: "Vatican Palace & Museums", type: "hall",   lat: 41.9065, lng: 12.4536, era: 8, status: "standing", date: "1506+", blurb: "The papal palaces and courtyards beside St Peter's, grown into one of the greatest museums on earth.", wiki: "https://en.wikipedia.org/wiki/Vatican_Museums" },
  { id: "pontesantangelo", name: "Ponte Sant'Angelo",      type: "bridge",  lat: 41.9017, lng: 12.4665, era: 5, status: "standing", date: "AD 134", blurb: "Hadrian's bridge to his tomb, later lined with Bernini's angels — the pilgrims' road to St Peter's.", wiki: "https://en.wikipedia.org/wiki/Ponte_Sant%27Angelo" },

  // ===================================================================
  // More of ancient, medieval & Renaissance Rome
  // ===================================================================
  { id: "vesta",       name: "Temple of Vesta",            type: "temple",  lat: 41.8917, lng: 12.4862, era: 2, status: "ruin",     date: "archaic; rebuilt AD 191", blurb: "The round shrine where the Vestal Virgins tended Rome's sacred flame, kept perpetually alight for the life of the city.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Vesta" },
  { id: "argentina",   name: "Largo di Torre Argentina",   type: "temple",  lat: 41.8955, lng: 12.4768, era: 3, status: "ruin",     date: "4th–2nd c. BC", blurb: "Four of Rome's oldest temples in a sunken square — beside the hall where Julius Caesar was assassinated in 44 BC.", wiki: "https://en.wikipedia.org/wiki/Largo_di_Torre_Argentina" },
  { id: "porticooctavia", name: "Portico of Octavia",      type: "colonnade",lat: 41.8920, lng: 12.4779, era: 4, status: "ruin",     date: "27 BC", blurb: "A grand colonnade by Augustus; in later centuries its ruins framed Rome's fish market and the edge of the Jewish quarter.", wiki: "https://en.wikipedia.org/wiki/Porticus_Octaviae" },
  { id: "domusaurea",  name: "Domus Aurea",                type: "hall",    lat: 41.8910, lng: 12.4955, era: 5, status: "ruin",     date: "AD 64–68", blurb: "Nero's fabulous 'Golden House', its frescoed halls later buried beneath Trajan's baths and rediscovered as painted grottoes.", wiki: "https://en.wikipedia.org/wiki/Domus_Aurea" },
  { id: "ludusmagnus", name: "Ludus Magnus",               type: "hall",    lat: 41.8896, lng: 12.4936, era: 5, status: "ruin",     date: "AD 80s", blurb: "The largest gladiatorial training school, joined to the Colosseum by its own tunnel.", wiki: "https://en.wikipedia.org/wiki/Ludus_Magnus" },
  { id: "hadriantemple", name: "Temple of Hadrian",        type: "temple",  lat: 41.8996, lng: 12.4794, era: 5, status: "standing", date: "AD 145", blurb: "Eleven great columns of Hadrian's temple, embedded in a later palace at Piazza di Pietra.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Hadrian" },
  { id: "marcuscolumn", name: "Column of Marcus Aurelius", type: "column",  lat: 41.9008, lng: 12.4796, era: 5, status: "standing", date: "AD 180–193", blurb: "A spiralling victory column, twin to Trajan's, still towering over Piazza Colonna.", wiki: "https://en.wikipedia.org/wiki/Column_of_Marcus_Aurelius" },
  { id: "archseptimius", name: "Arch of Septimius Severus", type: "arch",   lat: 41.8928, lng: 12.4846, era: 6, status: "standing", date: "AD 203", blurb: "A richly carved triple arch at the head of the Forum, celebrating victories over Parthia.", wiki: "https://en.wikipedia.org/wiki/Arch_of_Septimius_Severus" },
  { id: "pontesisto",  name: "Ponte Sisto",                type: "bridge",  lat: 41.8919, lng: 12.4707, era: 8, status: "standing", date: "1479", blurb: "The first new bridge across the Tiber since antiquity, built for the Jubilee of 1475.", wiki: "https://en.wikipedia.org/wiki/Ponte_Sisto" },
  { id: "farnese",     name: "Palazzo Farnese",            type: "hall",    lat: 41.8954, lng: 12.4712, era: 8, status: "standing", date: "1541", blurb: "The grandest Renaissance palace in Rome, finished in part by Michelangelo; today the French embassy.", wiki: "https://en.wikipedia.org/wiki/Palazzo_Farnese" },
  { id: "ghetto",      name: "The Roman Ghetto",           type: "hall",    lat: 41.8925, lng: 12.4776, era: 8, status: "standing", date: "1555", blurb: "The walled Jewish quarter decreed in 1555 by the Tiber — one of the oldest ghettos in the world.", wiki: "https://en.wikipedia.org/wiki/Roman_Ghetto" },

  // ===================================================================
  // Gods, cults & other religions
  // ===================================================================
  { id: "cybele",      name: "Temple of Cybele (Magna Mater)", type: "temple", lat: 41.8896, lng: 12.4864, era: 3, status: "ruin", date: "204–191 BC", blurb: "Home of the Great Mother, an ecstatic cult imported from Asia Minor — one of Rome's first 'foreign' gods, on the Palatine.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Cybele_(Palatine)" },
  { id: "portunus",    name: "Temple of Portunus",             type: "temple", lat: 41.8890, lng: 12.4809, era: 3, status: "standing", date: "c. 120–80 BC", blurb: "A jewel-like temple to the god of harbours by the old river port — beautifully preserved after centuries as a church.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Portunus" },
  { id: "herculesvictor", name: "Temple of Hercules Victor",   type: "temple", lat: 41.8884, lng: 12.4814, era: 3, status: "standing", date: "c. 120 BC", blurb: "Rome's oldest surviving marble building, a graceful round temple ringed with columns in the Forum Boarium.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Hercules_Victor" },
  { id: "apollososianus", name: "Temple of Apollo Sosianus",   type: "temple", lat: 41.8922, lng: 12.4791, era: 4, status: "ruin", date: "34–20 BC", blurb: "Three elegant columns beside the Theatre of Marcellus, from a temple to Apollo, god of light and healing.", wiki: "https://en.wikipedia.org/wiki/Temple_of_Apollo_Sosianus" },
  { id: "iseum",       name: "Temple of Isis (Iseum Campense)", type: "temple", lat: 41.8981, lng: 12.4788, era: 5, status: "gone", date: "43 BC / reb. AD 80", blurb: "A lavish sanctuary to the Egyptian goddess Isis, whose mystery cult swept the empire; its looted obelisks still dot Rome's squares.", wiki: "https://en.wikipedia.org/wiki/Iseum_Campense" },
  { id: "synagogue",   name: "Great Synagogue of Rome",        type: "dome",   lat: 41.8917, lng: 12.4781, era: 9, status: "standing", date: "1901–1904", blurb: "The temple of Europe's oldest Jewish community, raised beside the former Ghetto with its distinctive square aluminium dome.", wiki: "https://en.wikipedia.org/wiki/Great_Synagogue_of_Rome" },

  // ===================================================================
  // Great statues
  // ===================================================================
  { id: "marcusstatue", name: "Statue of Marcus Aurelius",     type: "statue", lat: 41.8931, lng: 12.4826, era: 5, status: "standing", date: "c. AD 175", blurb: "The only bronze equestrian statue to survive whole from antiquity — spared because it was mistaken for Constantine — now on the Capitoline.", wiki: "https://en.wikipedia.org/wiki/Equestrian_Statue_of_Marcus_Aurelius" },
  { id: "colossusnero", name: "Colossus of Nero",              type: "statue", lat: 41.8905, lng: 12.4907, era: 5, out: 7, status: "gone", date: "AD 60s", blurb: "A 30-metre bronze giant of the Sun beside the amphitheatre — and the reason we still call it the 'Colosseum'.", wiki: "https://en.wikipedia.org/wiki/Colossus_of_Nero" },

  // ===================================================================
  // Great museums
  // ===================================================================
  { id: "capitolinemuseums", name: "Capitoline Museums",       type: "hall",   lat: 41.8933, lng: 12.4831, era: 8, status: "standing", date: "1471 / opened 1734", blurb: "The oldest public museums in the world, on Michelangelo's square — home to the bronze she-wolf and the original Marcus Aurelius.", wiki: "https://en.wikipedia.org/wiki/Capitoline_Museums" },
  { id: "doriapamphilj", name: "Galleria Doria Pamphilj",      type: "hall",   lat: 41.8981, lng: 12.4820, era: 8, status: "standing", date: "1651+", blurb: "A dazzling private picture gallery still owned by a Roman princely family, with Velázquez's portrait of Innocent X.", wiki: "https://en.wikipedia.org/wiki/Galleria_Doria_Pamphilj" },
  { id: "palazzomassimo", name: "National Roman Museum",       type: "hall",   lat: 41.9013, lng: 12.4985, era: 9, status: "standing", date: "1889 / 1998", blurb: "One of the world's great collections of ancient art — frescoes, mosaics and marbles — in Palazzo Massimo by Termini.", wiki: "https://en.wikipedia.org/wiki/Palazzo_Massimo_alle_Terme" },

  // ===================================================================
  // Aqueducts, gates & the catacombs
  // ===================================================================
  { id: "aquaappia",   name: "Aqua Appia",                 type: "aqueduct", lat: 41.8846, lng: 12.4866, era: 2, status: "gone",     date: "312 BC", blurb: "Rome's very first aqueduct — almost entirely underground, quietly bringing spring water into the growing city.", wiki: "https://en.wikipedia.org/wiki/Aqua_Appia" },
  { id: "aquamarcia",  name: "Aqua Marcia",                type: "aqueduct", lat: 41.8955, lng: 12.4884, era: 3, status: "ruin",     date: "144 BC", blurb: "The longest Republican aqueduct, its cool mountain water prized above all others; arches of it still stride across the countryside.", wiki: "https://en.wikipedia.org/wiki/Aqua_Marcia" },
  { id: "aquavirgo",   name: "Aqua Virgo",                 type: "aqueduct", lat: 41.9006, lng: 12.4805, era: 4, status: "standing", date: "19 BC", blurb: "Agrippa's aqueduct — the only one still flowing from antiquity, and the very water that pours from the Trevi Fountain today.", wiki: "https://en.wikipedia.org/wiki/Aqua_Virgo" },
  { id: "aquaclaudia", name: "Aqua Claudia",               type: "aqueduct", lat: 41.8878, lng: 12.4962, era: 5, status: "ruin",     date: "AD 38–52", blurb: "The grandest aqueduct, striding into Rome on towering arches; a branch even climbed to the emperors' palace on the Palatine.", wiki: "https://en.wikipedia.org/wiki/Aqua_Claudia" },
  { id: "portamaggiore", name: "Porta Maggiore",           type: "gate",     lat: 41.8916, lng: 12.5147, era: 5, status: "standing", date: "AD 52", blurb: "A monumental double gateway of travertine where the Aqua Claudia and Anio Novus crossed the roads — later swallowed into the Aurelian Walls.", wiki: "https://en.wikipedia.org/wiki/Porta_Maggiore" },
  { id: "portasansebastiano", name: "Porta San Sebastiano", type: "gate",   lat: 41.8762, lng: 12.5013, era: 6, status: "standing", date: "AD 275 / reb. 401", blurb: "The largest and best-preserved gate of the Aurelian Walls, where the Appian Way — and the pilgrims' road to the catacombs — leaves the city.", wiki: "https://en.wikipedia.org/wiki/Porta_San_Sebastiano" },
  { id: "catacombs",   name: "Catacombs of the Appian Way", type: "catacomb", lat: 41.8712, lng: 12.5052, era: 6, status: "ruin", gmap: "41.8586,12.5108", date: "2nd–4th c. AD", blurb: "Beyond the walls, miles of Christian burial galleries — San Callisto, San Sebastiano and Domitilla — honeycomb the ground along the Via Appia about 2 km south. Many of the earliest popes were laid to rest here. (Directions lead to San Callisto.)", wiki: "https://en.wikipedia.org/wiki/Catacombs_of_Rome" },

  // ===================================================================
  // Further sites — Forum interior, obelisks, palaces & Baroque churches
  // ===================================================================
  { id: "basaemilia", name: "Basilica Aemilia",           type: "hall",    lat: 41.8929, lng: 12.4859, era: 3, status: "ruin", date: "179 BC", blurb: "A great civic basilica on the Forum's north side; Pliny ranked it among the most beautiful buildings in the world.", wiki: "https://en.wikipedia.org/wiki/Basilica_Aemilia" },
  { id: "rostra",      name: "The Rostra",                 type: "hall",    lat: 41.8926, lng: 12.4843, era: 3, status: "ruin", date: "reb. 44 BC", blurb: "The speakers' platform of the Forum, faced with the bronze rams (rostra) of captured warships — where Rome's orators held the crowd.", wiki: "https://en.wikipedia.org/wiki/Rostra" },
  { id: "aracoeli",    name: "Santa Maria in Aracoeli",    type: "church",  lat: 41.8940, lng: 12.4827, era: 7, status: "standing", date: "1250s", blurb: "Perched on the Capitoline atop a steep flight of 124 marble steps, on the site where a Sibyl foretold Christ to Augustus.", wiki: "https://en.wikipedia.org/wiki/Santa_Maria_in_Aracoeli" },
  { id: "phocas",      name: "Column of Phocas",           type: "column",  lat: 41.8924, lng: 12.4851, era: 6, status: "standing", date: "AD 608", blurb: "The last monument ever raised in the Roman Forum — a lone fluted column honouring a Byzantine emperor.", wiki: "https://en.wikipedia.org/wiki/Column_of_Phocas" },
  { id: "palazzovenezia", name: "Palazzo Venezia",         type: "hall",    lat: 41.8961, lng: 12.4808, era: 8, status: "standing", date: "1455", blurb: "Rome's first great Renaissance palace; centuries later Mussolini harangued crowds from its balcony.", wiki: "https://en.wikipedia.org/wiki/Palazzo_Venezia" },
  { id: "quirinal",    name: "Quirinal Palace",            type: "hall",    lat: 41.8998, lng: 12.4870, era: 8, status: "standing", date: "1583+", blurb: "Papal summer palace, then royal, now home to the President of Italy — one of the largest palaces in the world.", wiki: "https://en.wikipedia.org/wiki/Quirinal_Palace" },
  { id: "sanluigi",    name: "San Luigi dei Francesi",     type: "church",  lat: 41.8991, lng: 12.4745, era: 8, status: "standing", date: "1589", blurb: "The French national church, home to three of Caravaggio's greatest canvases — the calling of St Matthew among them.", wiki: "https://en.wikipedia.org/wiki/San_Luigi_dei_Francesi" },
  { id: "santandrea",  name: "Sant'Andrea al Quirinale",   type: "church",  lat: 41.9008, lng: 12.4885, era: 8, status: "standing", date: "1670", blurb: "Bernini's jewel-box oval church on the Quirinal, which he considered his most perfect work.", wiki: "https://en.wikipedia.org/wiki/Sant%27Andrea_al_Quirinale" },
  { id: "popolo",      name: "Piazza del Popolo",          type: "obelisk", lat: 41.9109, lng: 12.4763, era: 8, status: "standing", date: "obelisk from 10 BC", blurb: "The grand oval gateway square of northern Rome, centred on a 3,000-year-old Egyptian obelisk brought by Augustus.", wiki: "https://en.wikipedia.org/wiki/Piazza_del_Popolo" },
  { id: "lateranobelisk", name: "Lateran Obelisk",         type: "obelisk", lat: 41.8867, lng: 12.5050, era: 8, status: "standing", date: "raised 1588", blurb: "The tallest ancient Egyptian obelisk standing anywhere — carved for Karnak, re-erected before St John Lateran.", wiki: "https://en.wikipedia.org/wiki/Lateran_Obelisk" },
  { id: "repubblica",  name: "Piazza della Repubblica",    type: "fountain",lat: 41.9026, lng: 12.4958, era: 9, status: "standing", date: "1888 / 1901", blurb: "A grand modern hemicycle beside the Baths of Diocletian, with the exuberant (once-scandalous) Fountain of the Naiads.", wiki: "https://en.wikipedia.org/wiki/Piazza_della_Repubblica,_Rome" },

  // ===================================================================
  // Parks & green spaces — quiet green walks away from the crowds
  // ===================================================================
  { id: "villaborghese", name: "Villa Borghese",          type: "park", r: 90, lat: 41.9105, lng: 12.4855, era: 8, status: "standing", date: "from 1605", blurb: "Rome's grand green heart — shady avenues, a boating lake and gardens laid out for Cardinal Borghese. The city's favourite escape from the crowds.", wiki: "https://en.wikipedia.org/wiki/Villa_Borghese_gardens" },
  { id: "farnesegardens", name: "Farnese Gardens",        type: "park", r: 28, lat: 41.8899, lng: 12.4858, era: 8, status: "standing", date: "1550s", blurb: "One of Europe's first botanical gardens, terraced quietly over the ruins of the emperors' palace on the Palatine.", wiki: "https://en.wikipedia.org/wiki/Farnese_Gardens" },
  { id: "villacelimontana", name: "Villa Celimontana",    type: "park", r: 42, lat: 41.8846, lng: 12.4931, era: 8, status: "standing", date: "16th c.", blurb: "A leafy, little-visited park on the Caelian Hill — palms, lawns and an Egyptian obelisk, blissfully calm.", wiki: "https://en.wikipedia.org/wiki/Villa_Celimontana" },
  { id: "orangegarden", name: "Orange Garden (Parco Savello)", type: "park", r: 24, lat: 41.8843, lng: 12.4796, era: 9, status: "standing", date: "1932", blurb: "A serene walled garden of orange trees on the Aventine, framing one of the most beautiful views over Rome.", wiki: "https://en.wikipedia.org/wiki/Giardino_degli_Aranci" },
  { id: "botanical", name: "Botanical Garden",            type: "park", r: 30, lat: 41.8916, lng: 12.4626, era: 9, status: "standing", date: "1883", blurb: "Twelve hectares of green climbing the Janiculum slope in Trastevere — palms, bamboo and quiet paths.", wiki: "https://en.wikipedia.org/wiki/Botanical_Garden_of_Rome" },
  { id: "janiculum", name: "Janiculum Terrace",           type: "park", r: 44, lat: 41.8930, lng: 12.4636, era: 9, status: "standing", date: "19th c.", blurb: "The pine-shaded ridge above Trastevere, with the finest panorama of Rome and a daily noon cannon.", wiki: "https://en.wikipedia.org/wiki/Janiculum" },
  { id: "colleoppio", name: "Colle Oppio Park",           type: "park", r: 40, lat: 41.8912, lng: 12.4952, era: 9, status: "standing", date: "1928", blurb: "A green terrace of umbrella pines above the Colosseum, laid out over the buried halls of Nero's Golden House.", wiki: "https://en.wikipedia.org/wiki/Oppian_Hill" },
];

/* District & landmark labels — non-interactive text on the map for orientation.
   `era` = era index the name fades in (0 = always shown). */
const LABELS = [
  { text: "VATICAN",        lat: 41.9042, lng: 12.4548, era: 6, size: 15 },
  { text: "Campus Martius", lat: 41.9010, lng: 12.4738, era: 3, size: 12 },
  { text: "The Forum",      lat: 41.8919, lng: 12.4852, era: 2, size: 12 },
  { text: "Palatine",       lat: 41.8884, lng: 12.4884, era: 1, size: 11 },
  { text: "Capitoline",     lat: 41.8936, lng: 12.4820, era: 1, size: 11 },
  { text: "Aventine",       lat: 41.8834, lng: 12.4808, era: 2, size: 11 },
  { text: "Esquiline",      lat: 41.8968, lng: 12.4968, era: 2, size: 11 },
  { text: "Trastevere",     lat: 41.8858, lng: 12.4632, era: 5, size: 12 },
  { text: "Via Appia",      lat: 41.8748, lng: 12.5035, era: 3, size: 11, rotate: -30 },
  { text: "Tiber",          lat: 41.8826, lng: 12.4757, era: 0, size: 12, rotate: 68 },
];

/* Exposed for other modules (plain globals — no bundler needed). */
window.ROME = { MAP_BOUNDS, VB, project, ERAS, MONUMENTS, LABELS };
