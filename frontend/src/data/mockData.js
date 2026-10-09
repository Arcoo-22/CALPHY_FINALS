export const topics = [
  { id: 'temperature', name: 'Temperature scales', detail: '°C · °F · K' },
  { id: 'conduction', name: 'Conduction', detail: 'solids' },
  { id: 'convection', name: 'Convection', detail: 'fluids' },
  { id: 'radiation', name: 'Radiation', detail: 'infrared' },
  { id: 'particles', name: 'Particle motion', detail: 'kinetic model' },
  { id: 'specific-heat', name: 'Specific heat', detail: 'Q = mcΔT' },
  { id: 'phase-change', name: 'Changes of state', detail: 'Q = mL' },
  { id: 'gas-laws', name: 'Gas laws', detail: 'pV = nRT' },
];

export const lessons = [
  {
    id: 'temperature-scales', moduleId: 'temperature-scales', title: 'Temperature Scales', topic: 'temperature', duration: '8 min', level: 'Foundations',
    summary: 'Compare Celsius, Fahrenheit, and Kelvin, and convert between common temperature scales.',
    objectives: ['Distinguish temperature from thermal energy.', 'Convert Celsius to Kelvin using K = °C + 273.15.', 'Read and compare temperatures on different scales.'],
    explanation: 'Temperature describes the thermal state of a system. On the Kelvin scale, 0 K is absolute zero. A change of 1 kelvin has the same size as a change of 1 degree Celsius; the scales differ by an offset.',
    formula: 'T(K) = T(°C) + 273.15', example: 'A room is at 20°C. What is this temperature in kelvins?', solution: 'T = 20 + 273.15 = 293.15 K.', diagram: '20°C  ── add 273.15 ──▶  293.15 K',
    quiz: { prompt: 'What is 25°C in kelvins?', choices: ['248.15 K', '273.15 K', '298.15 K'], answer: 2 },
    keywords: ['celsius', 'fahrenheit', 'kelvin', 'temperature conversion', 'absolute zero'],
  },
  {
    id: 'heat-vs-temperature', moduleId: 'temperature-scales', title: 'Heat and Temperature', topic: 'temperature', duration: '6 min', level: 'Foundations',
    summary: 'Learn how temperature differs from energy transferred as heat.',
    objectives: ['Describe heat as energy transfer due to a temperature difference.', 'Explain what temperature tells us about particle motion.', 'Use thermal energy and temperature as distinct ideas.'],
    explanation: 'Heat is energy transferred between objects because of a temperature difference. Temperature is a property that relates to the average random kinetic energy of particles in a substance. An object does not contain “heat”; it has internal energy.',
    formula: 'Energy transfer as heat: Q (joules, J)', example: 'A warm mug cools on a desk. Which way does energy transfer?', solution: 'Energy transfers from the warmer mug to the cooler surroundings until they approach thermal equilibrium.', diagram: 'Warm object ── energy transfer Q ──▶ cooler surroundings',
    quiz: { prompt: 'What does “heat” describe in physics?', choices: ['Energy stored in every object', 'Energy transferred due to a temperature difference', 'The average speed of all particles'], answer: 1 },
    keywords: ['heat', 'thermal energy', 'internal energy', 'temperature', 'kinetic energy'],
  },
  {
    id: 'conduction', moduleId: 'heat-transfer', title: 'Conduction', topic: 'conduction', duration: '7 min', level: 'Foundations',
    summary: 'Follow energy transfer through particle interactions in solids.',
    objectives: ['Describe conduction in terms of particle interactions.', 'Compare conductors and insulators.', 'Recognize the role of mobile electrons in metals.'],
    explanation: 'In conduction, neighboring particles transfer energy through interactions without bulk movement of the material. In metals, mobile electrons also carry energy, which helps explain why many metals conduct heat effectively.',
    formula: 'Thermal energy flows from higher temperature to lower temperature.', example: 'One end of a metal spoon is placed in hot water. Why does the handle warm?', solution: 'Particles and mobile electrons near the hot end transfer energy through the metal toward the cooler handle.', diagram: 'hot end  ●→●→●→●  cool end',
    quiz: { prompt: 'Which process transfers energy through a solid without bulk movement?', choices: ['Conduction', 'Convection', 'Evaporation'], answer: 0 },
    keywords: ['conduction', 'conductors', 'insulators', 'metal', 'energy transfer'],
  },
  {
    id: 'convection-radiation', moduleId: 'heat-transfer', title: 'Convection and Radiation', topic: 'convection', duration: '9 min', level: 'Foundations',
    summary: 'Compare energy transfer by moving fluids and electromagnetic waves.',
    objectives: ['Explain convection as bulk motion in a fluid.', 'Describe thermal radiation as electromagnetic waves.', 'Compare whether a medium is required.'],
    explanation: 'Convection transfers energy through bulk movement of a fluid. Heating can make a region expand and become less dense, so it rises while cooler, denser fluid moves in. Thermal radiation is electromagnetic radiation, mostly infrared for everyday temperatures, and it can travel through a vacuum.',
    formula: 'Convection: bulk fluid motion · Radiation: electromagnetic waves', example: 'How can energy from the Sun reach Earth through space?', solution: 'By electromagnetic radiation, which does not require a material medium.', diagram: 'fluid circulation ↻   |   warm surface  ~~~ infrared ~~~▶ surroundings',
    quiz: { prompt: 'Which heat-transfer process can travel through a vacuum?', choices: ['Conduction', 'Convection', 'Radiation'], answer: 2 },
    keywords: ['convection', 'radiation', 'infrared', 'fluid', 'vacuum'],
  },
  {
    id: 'specific-heat', moduleId: 'specific-heat', title: 'Specific Heat Capacity', topic: 'specific-heat', duration: '10 min', level: 'Core',
    summary: 'Calculate the energy needed to change a material’s temperature.',
    objectives: ['Define specific heat capacity.', 'Use Q = mcΔT.', 'Track units for energy, mass, and temperature change.'],
    explanation: 'Specific heat capacity c is the energy required to raise the temperature of 1 kg of a substance by 1 K (or 1°C). For a temperature change without a change of state, the energy transferred is Q = mcΔT.',
    formula: 'Q = mcΔT', example: 'How much energy raises 0.50 kg of water by 10°C? Use c = 4200 J kg⁻¹ °C⁻¹.', solution: 'Q = 0.50 × 4200 × 10 = 21,000 J = 21 kJ.', diagram: 'energy Q → [ mass m ] → temperature change ΔT',
    quiz: { prompt: 'What does c represent in Q = mcΔT?', choices: ['The object’s final temperature', 'Specific heat capacity of the material', 'The mass in kilograms'], answer: 1 },
    keywords: ['specific heat capacity', 'calorimetry', 'Q = mcΔT', 'joules', 'energy'],
  },
  {
    id: 'calorimetry', moduleId: 'specific-heat', title: 'Calorimetry', topic: 'specific-heat', duration: '8 min', level: 'Core',
    summary: 'Use measured temperature changes to estimate energy transfer.',
    objectives: ['Measure mass and temperature change.', 'Apply Q = mcΔT.', 'Identify sources of experimental energy loss.'],
    explanation: 'Calorimetry estimates energy transfer by measuring a known mass and its temperature change. In an ideal calculation, Q = mcΔT. Real experiments may transfer energy to the container and surroundings, so insulation and careful measurements improve the estimate.',
    formula: 'Q = mcΔT', example: 'Why wrap a heated metal block in insulation during a specific heat experiment?', solution: 'Insulation reduces energy transfer to the surroundings, making the measured energy change closer to the energy supplied to the block.', diagram: 'heater → insulated block → thermometer',
    quiz: { prompt: 'What does insulation help reduce in a calorimetry experiment?', choices: ['Mass of the sample', 'Energy transfer to surroundings', 'Specific heat capacity'], answer: 1 },
    keywords: ['calorimetry', 'specific heat capacity', 'insulation', 'experiment'],
  },
  {
    id: 'changes-of-state', moduleId: 'changes-of-state', title: 'Changes of State', topic: 'phase-change', duration: '8 min', level: 'Core',
    summary: 'Understand why temperature can stay constant while a substance changes state.',
    objectives: ['Name melting, freezing, boiling, and condensing.', 'Explain a flat region on a heating curve.', 'Distinguish temperature change from internal-energy change.'],
    explanation: 'During a change of state of a pure substance at constant pressure, energy can be transferred while the temperature remains constant. The energy changes the arrangement and separation of particles rather than increasing their average kinetic energy.',
    formula: 'During a phase change: energy transfer continues while temperature is constant.', example: 'Ice at its melting point is heated. Why may its temperature remain steady while it melts?', solution: 'The transferred energy changes the state by separating particles in the solid structure; it does not raise their average kinetic energy during the transition.', diagram: 'temperature ↑ | ____ warming ____ | flat: melting | ____ warming ____',
    quiz: { prompt: 'During melting at constant pressure, what happens to the temperature of pure ice-water?', choices: ['It rises continuously', 'It stays constant while melting occurs', 'It falls to 0 K'], answer: 1 },
    keywords: ['changes of state', 'melting', 'boiling', 'freezing', 'heating curve'],
  },
  {
    id: 'latent-heat', moduleId: 'changes-of-state', title: 'Specific Latent Heat', topic: 'phase-change', duration: '9 min', level: 'Core',
    summary: 'Calculate energy transferred during a change of state.',
    objectives: ['Define specific latent heat.', 'Use Q = mL.', 'Keep mass and latent-heat units consistent.'],
    explanation: 'Specific latent heat L is the energy required per kilogram to change state without changing temperature. The relationship Q = mL applies to a specified change of state, such as melting or vaporization.',
    formula: 'Q = mL', example: 'How much energy melts 0.20 kg of ice? Use Lf = 334,000 J kg⁻¹.', solution: 'Q = 0.20 × 334,000 = 66,800 J = 66.8 kJ.', diagram: 'energy Q → [ mass m ] → change of state at constant temperature',
    quiz: { prompt: 'Which equation is used for energy during a change of state?', choices: ['Q = mcΔT', 'Q = mL', 'v = fλ'], answer: 1 },
    keywords: ['latent heat', 'Q = mL', 'melting', 'vaporization', 'phase change'],
  },
  {
    id: 'gas-laws', moduleId: 'gas-laws', title: 'Gas Laws and Temperature', topic: 'gas-laws', duration: '9 min', level: 'Extension',
    summary: 'Relate gas pressure and volume to absolute temperature.',
    objectives: ['Use kelvin for gas-temperature relationships.', 'State how particle motion relates to temperature.', 'Recognize the conditions for simple gas-law models.'],
    explanation: 'For a fixed amount of ideal gas, pressure, volume, and absolute temperature are related. A common form is pV = nRT. Temperature must be in kelvins. The ideal-gas model assumes particles have negligible volume and no intermolecular forces except during collisions.',
    formula: 'pV = nRT  (T in kelvins)', example: 'Why must temperature be converted to kelvins before using pV = nRT?', solution: 'The ideal gas equation uses absolute temperature measured from absolute zero, so the Celsius scale’s offset cannot be used directly.', diagram: 'higher T → faster average particle motion → pressure or volume response',
    quiz: { prompt: 'Which temperature unit is required in pV = nRT?', choices: ['Celsius', 'Kelvin', 'Fahrenheit'], answer: 1 },
    keywords: ['gas laws', 'pV = nRT', 'kelvin', 'pressure', 'volume', 'particles'],
  },
];

export const modules = [
  { id: 'temperature-scales', title: 'Temperature Scales', subtitle: 'Celsius, Fahrenheit, and Kelvin', description: 'Read and convert temperatures, then separate temperature from energy transfer.', topic: 'temperature', lessonIds: ['temperature-scales', 'heat-vs-temperature'] },
  { id: 'heat-transfer', title: 'Heat Transfer', subtitle: 'Conduction, convection, and radiation', description: 'See how thermal energy moves through solids, fluids, and electromagnetic waves.', topic: 'conduction', lessonIds: ['conduction', 'convection-radiation'] },
  { id: 'specific-heat', title: 'Specific Heat Capacity', subtitle: 'Energy and temperature change', description: 'Use Q = mcΔT and simple calorimetry examples.', topic: 'specific-heat', lessonIds: ['specific-heat', 'calorimetry'] },
  { id: 'changes-of-state', title: 'Changes of State', subtitle: 'Latent heat and heating curves', description: 'Understand phase changes and use Q = mL.', topic: 'phase-change', lessonIds: ['changes-of-state', 'latent-heat'] },
  { id: 'gas-laws', title: 'Gas Laws', subtitle: 'Pressure, volume, and kelvin', description: 'Connect particle motion with ideal-gas behavior.', topic: 'gas-laws', lessonIds: ['gas-laws'] },
];

export const profile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.test',
  year: 'Year 11',
  streak: 12,
  goal: 'Understand heat and temperature',
};

export const notifications = [
  { id: 'n1', title: 'Continue your temperature lesson', message: 'Your Celsius and Kelvin lesson is ready to pick up.', date: 'Today', read: false },
  { id: 'n2', title: 'New practice activity', message: 'Try the specific heat capacity example with water.', date: 'Yesterday', read: false },
  { id: 'n3', title: 'Streak milestone', message: 'You have studied for 12 days in a row.', date: '2 days ago', read: true },
];

export const achievements = [
  { id: 'first-lesson', title: 'First steps', description: 'Complete your first lesson', icon: 'flag' },
  { id: 'heat-explorer', title: 'Heat explorer', description: 'Study all three heat-transfer methods', icon: 'device_thermostat' },
  { id: 'steady-streak', title: 'Steady streak', description: 'Build a 7-day learning streak', icon: 'local_fire_department' },
];
