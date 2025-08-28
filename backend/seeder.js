// C:\Users\Rushabh\Desktop\SR TEST\backend\seeder.js
// Description: The script to populate your database with all the game modes.
// If you have already run this successfully, you do not need to run it again.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CrisisScenario = require('./models/CrisisScenario');

dotenv.config();

const scenarios = [
  {
    title: 'Single Player',
    description: 'Tackle rising AI challenges on your own. Your choices are all that matter.',
    mode: 'Single-Player Strategy',
    context: 'A mid-level manager facing a sudden and unexpected project failure that threatens a major client relationship. The situation requires immediate damage control, team motivation, and strategic communication with stakeholders.'
  },
  {
    title: 'Multiplayer',
    description: 'Team up or face off against others to solve a tough business problem.',
    mode: 'Multiplayer Challenge',
    context: 'A publicly-traded company experiencing a major data breach. Players must handle the technical response, public relations, legal liabilities, and internal communication, with their decisions impacting the company stock price.'
  },
  {
    title: 'AI vs Human',
    description: 'Solve a crisis, then see how your plan stacks up against the best one, chosen by the AI.',
    mode: 'AI vs. Human Battle',
    context: 'A supply chain disruption for a global manufacturing company. The player must make decisions on logistics, sourcing, and production, while the AI calculates the most financially and ethically optimal path in parallel.'
  },
  {
    title: 'Real World Crisis',
    description: 'Step into history and handle a real-world crisis, like a pandemic or a market crash.',
    mode: 'Real-World Simulation',
    context: 'The early days of a novel global pandemic. Players must make decisions regarding public health advisories, economic support packages, and international travel restrictions based on limited and evolving information.'
  },
  {
    title: 'Policy & Governance',
    description: 'Shape the future. Your decisions as a leader will be projected to show their social and economic impact.',
    mode: 'Policy & Governance',
    context: 'A regional government facing a severe drought. Players must decide on water rationing policies, agricultural subsidies, and long-term infrastructure investments, with the AI simulating the effects on public approval, economic stability, and environmental recovery.'
  },
  {
    title: 'Crisis Olympics',
    description: 'Race against players worldwide in a live, intense crisis challenge.',
    mode: 'Crisis Olympics',
    context: 'A geopolitical crisis triggered by a sudden resource scarcity. Players represent different nations and must negotiate, form alliances, or take decisive action under a strict time limit.'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');
    await CrisisScenario.deleteMany({});
    console.log('Existing scenarios cleared.');
    await CrisisScenario.insertMany(scenarios);
    console.log('Database seeded successfully with all game modes!');
  } catch (err) {
    console.error(`Error seeding database: ${err.message}`);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

if (require.main === module) {
    seedDB();
}

//C:\Users\Rushabh\Desktop\SR TEST\backend\seeder.js