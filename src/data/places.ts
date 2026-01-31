export type PlaceCategory =
  | 'Fire Lands'
  | 'Ice & Sky'
  | 'Ancient Water'
  | 'Stone Dragons'
  | 'Hidden & Mythic';

export type Place = {
  id: string;
  category: PlaceCategory;
  title: string;
  coords: string;
  description: string;
  image: any;
};

export const PLACES: Place[] = [
  {
    id: 'fire_uluru',
    category: 'Fire Lands',
    title: 'Uluru (Ayers Rock), Australia',
    coords: '-25.3444, 131.0369',
    image: require('../assets/fire_uluru.png'),
    description:
      'Uluru is a massive sandstone monolith rising from the heart of central Australia. Its surface shifts through deep reds and warm oranges as the sun moves, making dawn and sunset feel especially intense and alive. The rock holds profound cultural meaning for the Anangu people, and the silence around it amplifies the sense of scale and presence. Sparse desert plains and open sky frame Uluru like a natural monument of heat, time, and memory.',
  },
  {
    id: 'fire_kings_canyon',
    category: 'Fire Lands',
    title: 'Kings Canyon, Australia',
    coords: '-24.2540, 131.5545',
    image: require('../assets/fire_kings_canyon.png'),
    description:
      'Kings Canyon is carved into towering red walls that drop dramatically into a rugged desert corridor. Layers of rock look like frozen waves of heated stone, shaped slowly by erosion over millions of years. The Rim Walk reveals sharp light, long shadows, and wide panoramas that glow in warm tones. Inside the canyon, hidden pockets of greenery and shaded creeks create striking contrast—life and coolness tucked inside a landscape that feels sun-baked and powerful.',
  },
  {
    id: 'fire_karlu_karlu',
    category: 'Fire Lands',
    title: 'Karlu Karlu (Devils Marbles), Australia',
    coords: '-20.5796, 134.2547',
    image: require('../assets/fire_karlu_karlu.png'),
    description:
      'Karlu Karlu is a field of gigantic rounded boulders scattered across the Northern Territory plains. Their rich red-brown color seems to deepen under the sun, as if the stone is storing heat throughout the day. Cracks and balanced shapes give the place a sense of slow movement—like the landscape is breathing. The open horizon and minimal vegetation make every boulder feel monumental, turning the site into a quiet, grounded space with a strong natural energy.',
  },
  {
    id: 'fire_simpson_desert',
    category: 'Fire Lands',
    title: 'Simpson Desert, Australia',
    coords: '-25.0000, 137.0000',
    image: require('../assets/fire_simpson_desert.png'),
    description:
      'Simpson Desert stretches across central Australia with long parallel dunes that glow in shades of red and copper. The landscape feels endless—wide, dry, and exposed—where the lack of shade intensifies the sensation of heat and distance. Wind reshapes dune edges, changing the texture and patterns from day to day, while the light makes the sand appear almost burning at midday. It’s a place for silence and scale, where the horizon becomes the main feature and time slows down.',
  },

  {
    id: 'ice_peyto_lake',
    category: 'Ice & Sky',
    title: 'Peyto Lake, Canada',
    coords: '51.7175, -116.5521',
    image: require('../assets/ice_peyto_lake.png'),
    description:
      'Peyto Lake is famous for its vivid turquoise color, created by fine glacial rock flour suspended in the water. Set high in the Canadian Rockies, the lake feels crisp and open, surrounded by peaks and sweeping alpine air. From viewpoints above, its shape becomes clearly readable, like a bright fragment of sky placed into the mountains. Wind, cool temperatures, and wide horizons make the scene feel clean and expansive—where water and atmosphere blend into one calm composition.',
  },
  {
    id: 'ice_athabasca_glacier',
    category: 'Ice & Sky',
    title: 'Athabasca Glacier, Canada',
    coords: '52.1830, -117.2527',
    image: require('../assets/ice_athabasca_glacier.png'),
    description:
      'Athabasca Glacier is one of the most accessible glaciers in North America, letting you step close to a living river of ice. Its surface is marked by cracks, blue-white layers, and scattered stones carried by slow movement. The cold here feels physical and immediate, while the surrounding peaks add a sense of grandeur and weight. Standing near the glacier makes time feel different—nature working patiently, reshaping itself in quiet, powerful motion.',
  },
  {
    id: 'ice_columbia_icefield',
    category: 'Ice & Sky',
    title: 'Columbia Icefield, Canada',
    coords: '52.1500, -117.2000',
    image: require('../assets/ice_columbia_icefield.png'),
    description:
      'The Columbia Icefield is a vast glacial plateau that feeds several major glaciers across the Canadian Rockies. The terrain is open, pale, and almost minimal—ice, rock, and sky in strong contrast. Light reflects sharply from the surface, creating bright highlights against darker mountain ridges. The scale feels enormous and quiet, like a threshold where the earth becomes colder, cleaner, and closer to the sky.',
  },
  {
    id: 'ice_mount_assiniboine',
    category: 'Ice & Sky',
    title: 'Mount Assiniboine, Canada',
    coords: '50.8722, -115.6536',
    image: require('../assets/ice_mount_assiniboine.png'),
    description:
      'Mount Assiniboine is often called the “Matterhorn of Canada” for its sharp pyramidal silhouette rising above alpine lakes and meadows. The mountain creates a strong vertical focus in the landscape, drawing the eye upward into crisp air and clean light. Because the area is remote, the surroundings feel undisturbed and quiet, with a sense of natural purity. It’s a place defined by clarity—height, space, and the calm structure of the mountains.',
  },
  {
    id: 'ice_nahanni_park',
    category: 'Ice & Sky',
    title: 'Nahanni National Park, Canada',
    coords: '61.5000, -125.0000',
    image: require('../assets/ice_nahanni_park.png'),
    description:
      'Nahanni National Park is a vast, remote wilderness of canyons, rivers, and waterfalls set in rugged northern terrain. Cool air and misty valleys shape the atmosphere, while cliffs and winding waterways create dramatic geometry. Much of the region feels untouched, reinforcing the sense of distance and isolation. The landscapes carry a quiet intensity—sharp forms, muted tones, and a steady, focused calm that stays with you long after you leave.',
  },

  {
    id: 'water_twelve_apostles',
    category: 'Ancient Water',
    title: 'Twelve Apostles, Australia',
    coords: '-38.6650, 143.1040',
    image: require('../assets/water_twelve_apostles.png'),
    description:
      'The Twelve Apostles are limestone stacks rising from the Southern Ocean along Australia’s Great Ocean Road. Wind and waves have shaped the coastline for centuries, cutting cliffs into isolated pillars that stand against constant motion. The scene feels both massive and fragile—rock that looks permanent, yet is slowly changing. Weather transforms the mood quickly, from bright and open to dark and dramatic, while the sound of the ocean reinforces the sense of time and erosion.',
  },
  {
    id: 'water_lake_hillier',
    category: 'Ancient Water',
    title: 'Lake Hillier, Australia',
    coords: '-34.0953, 123.2020',
    image: require('../assets/water_lake_hillier.png'),
    description:
      'Lake Hillier is a rare natural wonder known for its intense pink color, which remains vivid even when the water is separated from the lake. Surrounded by forest and edged by pale sand, the lake sits like a bright, unexpected stain in the landscape. Nearby ocean blues and green vegetation heighten the contrast, making the colors feel almost unreal. The place is calm and contained, like a quiet anomaly formed entirely by nature’s chemistry and time.',
  },
  {
    id: 'water_ningaloo_reef',
    category: 'Ancient Water',
    title: 'Ningaloo Reef, Australia',
    coords: '-22.7000, 113.6500',
    image: require('../assets/water_ningaloo_reef.png'),
    description:
      'Ningaloo Reef is a coastal coral reef in Western Australia where clear water and marine life are remarkably close to shore. The reef’s shallow sections create bright, layered blues, making the coastline feel transparent and alive. Corals, fish, and larger ocean visitors form a complex ecosystem that has developed over long periods. The experience here is gentle and immersive—calm water, natural rhythm, and a sense of ancient life continuing just beneath the surface.',
  },
  {
    id: 'water_horizontal_falls',
    category: 'Ancient Water',
    title: 'Horizontal Falls, Australia',
    coords: '-16.3833, 123.7500',
    image: require('../assets/water_horizontal_falls.png'),
    description:
      'Horizontal Falls are created when powerful tides force water through narrow gaps between rocky cliffs. Instead of a vertical drop, the current surges sideways, forming fast-moving rapids that look like a waterfall turned on its side. The surrounding stone channels amplify the energy, showing how ocean forces can reshape a coastline through pressure and speed. It’s a place that feels dynamic and raw—water and rock locked into constant interaction.',
  },
  {
    id: 'water_blue_lake',
    category: 'Ancient Water',
    title: 'Blue Lake, Australia',
    coords: '-37.8300, 140.7800',
    image: require('../assets/water_blue_lake.png'),
    description:
      'Blue Lake sits inside the crater of an extinct volcano near Mount Gambier and is known for its intense seasonal color shift. At certain times of year the water becomes a deep, saturated blue, while in other seasons it turns a cooler, softer tone. The lake’s shape feels clean and geometric, framed by green slopes that make the color stand out even more. The atmosphere is calm and enclosed—like a natural basin holding quiet depth and changing light.',
  },

  {
    id: 'stone_hoodoos',
    category: 'Stone Dragons',
    title: 'Hoodoos of Drumheller, Canada',
    coords: '51.4667, -112.7167',
    image: require('../assets/stone_hoodoos_drumheller.png'),
    description:
      'The Hoodoos of Drumheller are slender stone pillars formed by erosion, shaped over long periods by wind, rain, and temperature changes. Their silhouettes look delicate, yet they can stand for centuries under the right conditions. The surrounding badlands are dry and open, emphasizing the sculptural texture of the rock. This landscape feels like a natural gallery—quiet, sunlit, and slightly otherworldly in its layered colors and unusual forms.',
  },
  {
    id: 'stone_hopewell_rocks',
    category: 'Stone Dragons',
    title: 'Hopewell Rocks, Canada',
    coords: '45.8167, -64.5667',
    image: require('../assets/stone_hopewell_rocks.png'),
    description:
      'Hopewell Rocks rise along the Bay of Fundy, where the world’s highest tides dramatically reshape the coastline every day. At low tide, you can walk on the ocean floor and see the bases of the formations; at high tide, the same rocks become island-like shapes surrounded by water. The constant change makes the place feel alive and rhythmic. It’s a clear example of slow geological time meeting daily motion—water carving stone again and again.',
  },
  {
    id: 'stone_gros_morne',
    category: 'Stone Dragons',
    title: 'Gros Morne Tablelands, Canada',
    coords: '49.6500, -57.7500',
    image: require('../assets/stone_gros_morne_tablelands.png'),
    description:
      'The Gros Morne Tablelands reveal a rare landscape where rocks from the Earth’s mantle are exposed at the surface. The terrain looks harsh and sparse, with minimal vegetation and broad, open slopes that feel almost planetary. Colors shift between pale gray, rusty red, and muted brown, depending on light and moisture. Walking here feels like stepping into geology itself—raw, quiet, and shaped by deep time rather than surface life.',
  },
  {
    id: 'stone_sleeping_giant',
    category: 'Stone Dragons',
    title: 'Sleeping Giant Provincial Park, Canada',
    coords: '48.3700, -88.7800',
    image: require('../assets/stone_sleeping_giant.png'),
    description:
      'Sleeping Giant Provincial Park is named for a long ridge that resembles the outline of a reclining figure along Lake Superior. The cliffs rise strongly above the water, creating a dramatic contrast between stone and open sky. Trails lead to wide viewpoints where the lake feels endless, and the wind adds a sense of scale. The landscape combines stability and openness—solid rock forms paired with vast air and water.',
  },
  {
    id: 'stone_stonehammer',
    category: 'Stone Dragons',
    title: 'Stonehammer Geopark, Canada',
    coords: '45.2667, -66.0667',
    image: require('../assets/stone_stonehammer_geopark.png'),
    description:
      'Stonehammer Geopark brings together multiple geological zones, revealing layers of earth history across coastlines, forests, and rocky outcrops. The area contains traces of tectonic movement and ancient formations that span hundreds of millions of years. Cliffs, shorelines, and inland trails create varied textures and viewpoints. The overall feeling is structured and grounded—like walking through a living timeline where stone, water, and landscape tell the story.',
  },

  {
    id: 'mythic_blue_mountains',
    category: 'Hidden & Mythic',
    title: 'Blue Mountains, Australia',
    coords: '-33.7000, 150.3000',
    image: require('../assets/mythic_blue_mountains.png'),
    description:
      'The Blue Mountains are known for a soft blue haze that forms above eucalyptus forests, created by fine oil droplets and light. Deep valleys, cliffs, and layered ridgelines build a landscape that changes constantly with mist and sun. Viewpoints reveal long distances, while shaded trails move through quiet forest pockets. The atmosphere feels reflective and cinematic—like the scenery is always shifting between clarity and mystery.',
  },
  {
    id: 'mythic_daintree',
    category: 'Hidden & Mythic',
    title: 'Daintree Rainforest, Australia',
    coords: '-16.1700, 145.4200',
    image: require('../assets/mythic_daintree_rainforest.png'),
    description:
      'Daintree Rainforest is one of the oldest tropical forests on Earth, dense with layered greenery, humidity, and slow-moving rivers. The environment feels rich and alive—vines, broad leaves, and hidden sounds creating a complex natural structure. Light filters through the canopy in fragments, making the forest feel deep and sheltered. It’s a place where climate, terrain, and vegetation connect tightly, giving a strong sense of ancient continuity.',
  },
  {
    id: 'mythic_haida_gwaii',
    category: 'Hidden & Mythic',
    title: 'Haida Gwaii, Canada',
    coords: '53.0000, -132.0000',
    image: require('../assets/mythic_haida_gwaii.png'),
    description:
      'Haida Gwaii is a remote archipelago where ocean, forest, and coastline form a quiet, integrated world. The landscapes feel calm and spacious, with long beaches, dense trees, and changing coastal weather. Remoteness adds a sense of stillness, as if the islands are slightly separated from everyday time. Nature here feels balanced and complete—wind, water, and land shaping a steady atmosphere of isolation and clarity.',
  },
  {
    id: 'mythic_spirit_island',
    category: 'Hidden & Mythic',
    title: 'Spirit Island, Canada',
    coords: '52.6522, -117.5356',
    image: require('../assets/mythic_spirit_island.png'),
    description:
      'Spirit Island sits on Maligne Lake, a small forested shape surrounded by glacial water and mountain walls. Reflections, mist, and symmetry create a scene that feels quiet and carefully composed. The lake’s surface is often calm, turning the landscape into a mirror that slows everything down. Because access is limited, the place holds a protected, almost ceremonial feeling—an image of balance, distance, and stillness.',
  },
  {
    id: 'mythic_cape_breton',
    category: 'Hidden & Mythic',
    title: 'Cape Breton Highlands, Canada',
    coords: '46.7500, -60.5000',
    image: require('../assets/mythic_cape_breton_highlands.png'),
    description:
      'Cape Breton Highlands combine mountain ridges with dramatic ocean coastline, where roads trace cliffs and open viewpoints appear around curves. The meeting of sea wind and high terrain creates a strong sense of openness, with changing light and weather adding constant variation. In some seasons the landscape feels bright and expansive; in others, mist and clouds make it quieter and more intimate. It’s a place defined by movement—of air, water, and elevation.',
  },
];
