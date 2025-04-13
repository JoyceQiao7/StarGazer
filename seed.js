const mongoose = require('mongoose');
require('dotenv').config();
const StarInfo = require('./models/StarInfo');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stargazer_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const starData = [
  {
    name: 'Andromeda Galaxy',
    type: 'galaxy',
    description: 'The Andromeda Galaxy is a spiral galaxy approximately 2.5 million light-years from Earth. It is the nearest major galaxy to the Milky Way and was often referred to as the Great Andromeda Nebula in older texts.',
    basicFacts: {
      distance: '2.5 million light-years',
      size: '220,000 light-years across',
      age: '10 billion years',
      constellation: 'Andromeda'
    },
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/1200px-Andromeda_Galaxy_%28with_h-alpha%29.jpg'
  },
  {
    name: 'Sirius',
    type: 'star',
    description: 'Sirius is the brightest star in the night sky. Its name is derived from the Greek word for "glowing" or "scorching". With a visual apparent magnitude of −1.46, it is almost twice as bright as Canopus, the next brightest star.',
    basicFacts: {
      distance: '8.6 light-years',
      size: '1.7 times the radius of the Sun',
      age: '230 million years',
      constellation: 'Canis Major'
    },
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Sirius_A_and_B_Hubble_photo.jpg'
  },
  {
    name: 'Orion Nebula',
    type: 'nebula',
    description: 'The Orion Nebula is a diffuse nebula situated in the Milky Way, being south of Orion\'s Belt in the constellation of Orion. It is one of the brightest nebulae, and is visible to the naked eye in the night sky.',
    basicFacts: {
      distance: '1,344 light-years',
      size: '24 light-years across',
      age: 'Less than 2 million years',
      constellation: 'Orion'
    },
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/1200px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg'
  },
  {
    name: 'Sagittarius A*',
    type: 'other',
    description: 'Sagittarius A* is a supermassive black hole at the center of the Milky Way galaxy. It has a mass of about 4 million times that of the Sun.',
    basicFacts: {
      distance: '26,000 light-years',
      size: 'Event horizon diameter of about 44 million km',
      age: 'Billions of years',
      constellation: 'Sagittarius'
    },
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/First_Image_of_Sagittarius_A%2A.jpg'
  },
  {
    name: 'Betelgeuse',
    type: 'star',
    description: 'Betelgeuse is a red supergiant star in the constellation Orion. It is one of the largest and most luminous observable stars. If Betelgeuse were at the center of our Solar System, its surface would extend past the orbit of Jupiter.',
    basicFacts: {
      distance: '642.5 light-years',
      size: '887 times the radius of the Sun',
      age: '10 million years',
      constellation: 'Orion'
    },
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Betelgeuse_captured_by_ALMA.jpg/1200px-Betelgeuse_captured_by_ALMA.jpg'
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await StarInfo.deleteMany({});
    console.log('Cleared existing star data');

    // Insert new data
    const inserted = await StarInfo.insertMany(starData);
    console.log(`Seeded ${inserted.length} stars into database`);

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
}

seedDatabase(); 