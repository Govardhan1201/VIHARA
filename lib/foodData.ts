export interface Dish {
  name: string;
  description: string;
  category: 'tribal' | 'coastal' | 'street-food' | 'vegetarian' | 'non-vegetarian' | 'dessert' | 'beverage' | 'traditional';
  flavour: string;
  bestTime?: string;
  localArea?: string;
  emoji: string;
  culturalNote?: string;
}

export const destinationFood: Record<string, Dish[]> = {
  'Araku': [
    { name: 'Bamboo Chicken', description: 'Tender chicken slow-cooked inside fresh bamboo over open tribal fire, smoky and deeply aromatic', category: 'tribal', flavour: 'Smoky · Spicy', bestTime: 'Lunch', localArea: 'Araku Valley', emoji: '🎋', culturalNote: 'A tribal heritage dish native to the Kondh community' },
    { name: 'Tribal Coffee', description: 'Earthy, full-bodied coffee from shade-grown Araku beans — one of India\'s finest micro-lot coffees', category: 'beverage', flavour: 'Bold · Earthy', bestTime: 'Morning', localArea: 'Araku Coffee Estate', emoji: '☕', culturalNote: 'Grown by tribal cooperatives at 900m altitude' },
    { name: 'Millet Roti with Chutney', description: 'Rustic flatbread made from local finger millet served with red chilli and tamarind chutneys', category: 'tribal', flavour: 'Nutty · Traditional', bestTime: 'Breakfast', localArea: 'Village homestays', emoji: '🫓' },
    { name: 'Gondi Pulihora', description: 'Tribal-style tamarind rice with forest herbs and peanuts, a unique tribal variation of the Andhra classic', category: 'vegetarian', flavour: 'Tangy · Herby', bestTime: 'Lunch', emoji: '🍚' },
    { name: 'Wild Mushroom Curry', description: 'Seasonal forest mushrooms cooked in tribal spice blends — only available post-monsoon', category: 'tribal', flavour: 'Earthy · Mild', bestTime: 'Monsoon season', localArea: 'Forest edge villages', emoji: '🍄' },
  ],

  'Vizag': [
    { name: 'Punugulu', description: 'Crispy golden batter balls made from fermented rice-lentil batter, best eaten hot off the kadai with coconut chutney', category: 'street-food', flavour: 'Crispy · Mild', bestTime: 'Evening snack', localArea: 'RK Beach promenade', emoji: '🟡' },
    { name: 'Royyala Vepudu', description: 'Bold and fiery tiger prawn fry with curry leaves and coastal spice blend — a Vizag staple', category: 'coastal', flavour: 'Spicy · Umami', bestTime: 'Lunch', localArea: 'Fishing harbour area', emoji: '🦐' },
    { name: 'Pesarattu', description: 'Crisp whole green moong crepes served with ginger chutney and upma filling — a local breakfast ritual', category: 'vegetarian', flavour: 'Light · Savoury', bestTime: 'Breakfast', localArea: 'Any local tiffin centre', emoji: '🥙' },
    { name: 'Gongura Mamsam', description: `Lamb slow-cooked with tangy sorrel leaves — the signature flavour of Andhra's coastal interior`, category: 'traditional', flavour: 'Tangy · Rich', bestTime: 'Sunday lunch', emoji: '🍖' },
    { name: 'Seafood Thali', description: 'A rotating platter of local fish curry, prawn fry, crab, and rice — what the sea offers that day', category: 'coastal', flavour: 'Briny · Spicy', bestTime: 'Lunch', localArea: 'Near Fishing Harbour', emoji: '🦀' },
    { name: 'Bobbatlu', description: 'Sweet lentil-stuffed flatbread made during festivals — soft, ghee-drizzled, and richly traditional', category: 'dessert', flavour: 'Sweet · Ghee-rich', bestTime: 'Festivals', emoji: '🥮' },
  ],

  'Goa': [
    { name: 'Fish Curry Rice', description: 'The soul of Goa — red coconut-based fish curry served over steamed Goan red rice, a daily staple', category: 'coastal', flavour: 'Tangy · Coconutty', bestTime: 'Lunch', localArea: 'Any village restaurant', emoji: '🐟' },
    { name: 'Bebinca', description: 'A 16-layer traditional Goan dessert made with coconut milk and ghee — requires patience and skill to make', category: 'dessert', flavour: 'Sweet · Rich', bestTime: 'Festivals · Christmas', emoji: '🎂', culturalNote: 'Portuguese-Goan heritage dessert, over 400 years old' },
    { name: 'Xacuti Chicken', description: 'A complex, slow-cooked curry with roasted coconut, poppy seeds, and 20+ spices — fiery and deep', category: 'traditional', flavour: 'Spicy · Complex', bestTime: 'Dinner', emoji: '🍛' },
    { name: 'Goan Sausage Choriz', description: 'Tangy, smoky pork sausages cured with toddy vinegar and red chilli — sold at village markets', category: 'traditional', flavour: 'Smoky · Tangy', localArea: 'Mapusa market', emoji: '🌭' },
    { name: 'Prawn Balchão', description: 'A sharp, vinegary prawn pickle-style preparation — a Portuguese-Goan fusion that packs a punch', category: 'coastal', flavour: 'Sour · Very Spicy', emoji: '🍤' },
    { name: 'Solkadhi', description: 'A cooling pink drink made from kokum and coconut milk — the perfect digestive after a heavy coastal meal', category: 'beverage', flavour: 'Sour · Cooling', emoji: '🥤', culturalNote: 'Served chilled as a digestive in most Goan homes' },
  ],

  'Rajasthan': [
    { name: 'Dal Baati Churma', description: 'Baked wheat balls dipped in ghee with five-lentil dal and crumbled sweet churma — the royal desert feast', category: 'traditional', flavour: 'Rich · Earthy', bestTime: 'Lunch', emoji: '🫙', culturalNote: 'A centuries-old warrior-era dish designed to survive the desert heat' },
    { name: 'Laal Maas', description: 'Fierce Rajasthani mutton curry cooked with Mathania red chillies — not for the faint of palate', category: 'traditional', flavour: 'Very Spicy · Rich', bestTime: 'Dinner', localArea: 'Old city dhabas', emoji: '🍲' },
    { name: 'Ghewar', description: 'A disc-shaped honeycomb sweet soaked in saffron syrup and topped with cream — made for monsoon season', category: 'dessert', flavour: 'Sweet · Floral', bestTime: 'Monsoon', localArea: 'Old bazaars', emoji: '🍯' },
    { name: 'Ker Sangri', description: 'Desert berry and dried bean stir-fry — a sustainable dish born from Rajasthan\'s scarce vegetation', category: 'vegetarian', flavour: 'Tangy · Earthy', emoji: '🌵', culturalNote: 'A dish that thrived when nothing else would grow in the desert' },
    { name: 'Pyaaz Kachori', description: 'Flaky deep-fried pastry stuffed with spiced onion and lentil — the breakfast king of Jaipur and beyond', category: 'street-food', flavour: 'Savoury · Spicy', bestTime: 'Morning', localArea: 'Any old bazaar', emoji: '🥟' },
  ],

  'Hampi': [
    { name: 'Jolada Rotti', description: 'Jowar-based flatbread — the daily staple of north Karnataka, eaten with any curry or chutney', category: 'vegetarian', flavour: 'Nutty · Traditional', bestTime: 'Any meal', emoji: '🫓' },
    { name: 'Bisi Bele Bath', description: 'A rich, spiced lentil-rice dish cooked with ghee and a special masala blend — warming and deeply satisfying', category: 'traditional', flavour: 'Spicy · Hearty', bestTime: 'Lunch', emoji: '🍲' },
    { name: 'Holige', description: 'Sweet lentil or coconut-filled flatbread smeared in ghee — a Karnataka festival staple eaten warm off the tawa', category: 'dessert', flavour: 'Sweet · Buttery', bestTime: 'Festivals', emoji: '🥮' },
    { name: 'Sajje Rotti', description: 'Pearl millet flatbread eaten with spiced brinjal curry — rustic, nourishing, timeless', category: 'traditional', flavour: 'Earthy · Mild', emoji: '🌾' },
  ],

  'Munnar': [
    { name: 'Kerala Sadhya', description: 'A banana-leaf feast of 24+ dishes served during festivals — a complete world of flavours in one sitting', category: 'vegetarian', flavour: 'Varied · Traditional', bestTime: 'Festival days', emoji: '🍌', culturalNote: 'Served only on banana leaves — the leaf itself is part of the experience' },
    { name: 'Puttu and Kadala Curry', description: 'Steamed rice cylinders with spiced black chickpea curry — Kerala\'s most beloved breakfast', category: 'traditional', flavour: 'Earthy · Mild', bestTime: 'Breakfast', emoji: '🫘' },
    { name: 'Karimeen Pollichathu', description: 'Pearl spot fish marinated in spices, wrapped in banana leaf and grilled — a backwater specialty', category: 'coastal', flavour: 'Smoky · Spicy', bestTime: 'Lunch', emoji: '🐠' },
    { name: 'Tea Estate Chai', description: 'Fresh single-estate chai brewed with Munnar leaves at altitude — nothing tastes quite like it at 1600m', category: 'beverage', flavour: 'Earthy · Delicate', bestTime: 'Morning mist hours', localArea: 'Plantation viewpoints', emoji: '🍵' },
  ],

  'Andaman': [
    { name: 'Grilled Lobster', description: 'Fresh lobster grilled with local spices over coconut husk — impossibly fresh, simply cooked', category: 'coastal', flavour: 'Sweet · Briny', bestTime: 'Dinner', localArea: 'Havelock beach shacks', emoji: '🦞' },
    { name: 'Red Snapper Curry', description: 'Island-style fish curry cooked in coconut milk with a touch of Andaman spices and raw mango', category: 'coastal', flavour: 'Mild · Coconutty', bestTime: 'Lunch', emoji: '🐡' },
    { name: 'Coconut Prawn', description: 'Prawns tossed in fresh coconut paste with minimal spice — letting the sea ingredients speak', category: 'coastal', flavour: 'Sweet · Light', emoji: '🥥' },
  ],
};

export const getAllDestinations = (): string[] => Object.keys(destinationFood);

export const getDishesByDestination = (dest: string): Dish[] =>
  destinationFood[dest] || [];

export const getDishesByCategory = (category: Dish['category']): { dest: string; dish: Dish }[] => {
  const result: { dest: string; dish: Dish }[] = [];
  Object.entries(destinationFood).forEach(([dest, dishes]) => {
    dishes.filter(d => d.category === category).forEach(dish => result.push({ dest, dish }));
  });
  return result;
};
