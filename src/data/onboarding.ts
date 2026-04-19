import { OnboardingSlide } from '../types';

export const onboardingData: OnboardingSlide[] = [
  {
    id: 'ob_1',
    tag: 'HEY, TRAVELER!',
    title: 'Welcome to Boulder\nExplorer',
    message: "Hey! I'm Alex, your personal Boulder city guide. I'm here to help you discover the magic of one of America's most extraordinary cities.",
    image: require('../assets/onboard_1.png'),
  },
  {
    id: 'ob_2',
    tag: 'EXPLORE BOULDER',
    title: 'Discover 5 Unique\nWorlds',
    message: 'Explore Boulder through five incredible lenses — Mountains, Promenade, Taste, Science, and Peace. Every category reveals a different side of this amazing city.',
    image: require('../assets/onboard_2.png'),
  },
  {
    id: 'ob_3',
    tag: 'YOUR COLLECTION',
    title: 'Save &\nNavigate',
    message: 'Found a spot you love? Save it instantly, then open our interactive map to find your way there. Your personal Boulder collection grows with every visit.',
    image: require('../assets/onboard_3.png'),
  },
  {
    id: 'ob_4',
    tag: 'STORIES & FACTS',
    title: 'Read, Learn & Be\nAmazed',
    message: 'Dive into our travel blog, discover fascinating facts about Boulder in three categories, and test your city knowledge with our timed quiz challenge.',
    image: require('../assets/onboard_4.png'),
  },
  {
    id: 'ob_5',
    tag: 'READY TO GO!',
    title: 'Boulder Awaits You,\nExplorer',
    message: "Everything is ready for your adventure. As your guide, I'll make sure you experience the very best of Boulder, Colorado. Let's go!",
    image: require('../assets/onboard_5.png'),
  },
];