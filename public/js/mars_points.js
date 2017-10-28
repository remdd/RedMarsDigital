//  Points of interest to display on the globe
var points = [
    {
        name: 'Airy-0 crater',
        description: 'This crater defines the prime meridian, or line of zero longitude, on Mars.\n\nIt was named after the Astronomer Royal Sir George Biddell Airy, whose telescope at Greenwich observatory in London came to define the prime meridian on Earth.',
        type: 'geography',
        img: 'point_Airy0.jpg',
        caption: 'Airy-0 crater, as seen by the Mars Global Surveyor orbiter in 2001.',
        lat: -5.1,
        long: 0
    },
    {
        name: 'Olympus Mons',
        description: 'The tallest mountain in the solar system, standing nearly 14 miles above its surroundings.',
        type: 'geography',
        img: 'point_Olympus.jpg',
        caption: "Olympus Mons, as seen by Viking 1 in 1978.\n\nThe outer 'scarp' ringing the volcano is about 340 miles in diameter.",
        lat: 18.4,
        long: 226.5
    },
    {
        name: 'Isidis Planitia',
        description: "A vast plain in one of Mars' three particularly evident ancient 'impact basins', formed around 4 billion years ago in a collision with a large (probably about 30 miles in diameter) asteroid or comet.",
        type: 'geography',
        img: 'point_Isidis.jpg',
        caption: "Detail of a southern area within Isidis Planitia, thought to potentially indicate an ancient shoreline from Mars' watery past.",
        lat: 12.9,
        long: 87
    },
    {
        name: 'Hellas Planitia',
        description: 'Hellas basin is thought to be the largest known visible impact crater in the Solar System, with a diameter of around 1,400 miles.',
        type: 'geography',
        img: 'point_Hellas.jpg',
        caption: "The floor of Hellas crater is about 5.6 miles deep, with an atmospheric pressure more than twice that at the Martian datum (the equivalent of 'sea level').",
        lat: -42.4,
        long: 70.5
    },
    {
        name: 'North polar cap',
        description: "Mars' northern ice cap is largely formed of water ice.\n\nIn winter, this becomes covered by a layer of carbon dioxide frozen from the Martian atmosphere, which then sublimes back to a gas in the higher temperatures of the Martian summer.",
        type: 'geography',
        img: 'point_NorthCap.jpg',
        caption: "Mars' North pole in summer, at near-minimum ice levels.\n\nThe permanent ice cap shown here is around 620 miles in diameter.",
        lat: 90,
        long: 0
    },
    {
        name: 'South polar cap',
        description: "Mars' permanent south polar ice cap is considerably smaller than that at the north pole.\n\nDue to Mars' relatively eccentric (ie more oval than circular) oribt around the sun, winters in the southern hemisphere are however longer and colder than those in the north.",
        type: 'geography',
        img: 'point_SouthCap.jpg',
        caption: "Surface features known as 'Spiders', in Mars' far South.\n\nThese distinctive patterns form as dust is deposited by frozen carbon dioxide subliming back to a gas, whilst trapped under ice.",
        lat: -90,
        long: 0
    },
    {
        name: 'Valles Marineris',
        description: "This gigantic canyon system stretches for around 2,500 miles, dwarfing the 277 mile-long Grand Canyon on Earth.\n\nIt was discovered by (and takes its name from) NASA's Mariner 9 orbiter, which reached Mars in 1971 and became the first spacecraft to oribt a planet other than the Earth.",
        type: 'geography',
        img: 'point_Valles.jpg',
        caption: 'Recurring slope lineae in Valles Marineris.\n\nThese stripy features are believed to result from seasonal flows of liquid saltwater at warmer times of the Martian year.',
        lat: -9.9,
        long: 287
    },
    {
        name: 'Tharsis Montes',
        description: "The Tharsis Montes are a chain of three large shield volcanoes named (from southwest to northeast) Arsia Mons, Pavonis Mons and Ascraeus Mons.\n\nEach of these would utterly dwarf even the tallest mountains on Earth.",
        type: 'geography',
        img: 'point_Pavonis.jpg',
        caption: 'The summit caldera of Pavonis Mons.\n\nThe central crater is about 28 miles across and 2.8 miles deep.',
        lat: 1.3,
        long: 247.2
    },
    {
        name: 'Beagle 2',
        description: 'Landing site of the British spacecraft that failed to operate after landing, on Christmas Day 2003.\n\nIts fate was unknown at the time, until spotted by the Mars Reconnaissance Orbiter in late 2014.',
        type: 'mission',
        img: 'point_Beagle2.jpg',
        caption: 'On its rediscovery more than a decade after failing to communicate from the Martian surface, it was revealed that Beagle 2 had come agonizingly close to success - achieving a soft landing and a partial deployment to its operating configuration.',
        lat: 11.31,
        long: 90.25
    },
    {
        name: 'Viking 1',
        description: "NASA's Viking 1 mission included both an orbiter and a lander component.\n\nThe lander was the first vehicle to succesfully achieve a soft landing on Mars and complete its objectives, touching down here on July 20, 1976.",
        type: 'mission',
        img: 'point_Viking1.jpg',
        caption: 'The Viking 1 orbiter, which continued to return images until 1980.\n\nAfter the end of its mission it was left in a decaying orbit and may by now have crashed onto the planet, though it is thought more likely that this is yet to happen.',
        lat: 22.27,
        long: 312.05
    },
    {
        name: 'Mars 2',
        description: "The Soviet Union's Mars 2 probe was the first man-made object to reach the surface of Mars, on November 27 1971.\n\nUnfortunately the descent module's parachute failed to deploy and it is assumed to have been destroyed on impact.",
        type: 'mission',
        img: 'point_Mars2.jpg',
        caption: "A model of the Mars 2 lander in Moscow's Memorial Museum of Cosmonautics.\n\nThe orbiter component of the mission, on which the lander was mounted in transit, operated successfully - and remains in orbit today.",
        lat: -45,
        long: 47
    },
    {
        name: 'Mars 3',
        description: "Running from 1960 to 1973, the Soviet Mars programme suffered a very high failure rate - but their Mars 3 probe can claim mankind's first (and to date Russia's only) successful soft landing on Mars.\n\nUnforunately however it failed after just 14.5 seconds, having returned just one partial image.",
        type: 'mission',
        img: 'point_Mars3.png',
        caption: 'The first photograph ever returned from the surface of another planet.\n\nAccording to the Soviet Academy of Sciences, the image contains no horizon, terrain features or other usable information - just noise.',
        lat: -45,
        long: 202
    },
    {
        name: 'Curiosity',
        description: "The landing site of NASA's most recent and most scientifically capable rover mission to date.\n\nCuriosity touched down on August 6, 2012, and continues to return valuable scientific data.",
        type: 'mission',
        img: 'point_Curiosity.jpg',
        caption: "A section of a selfie taken by Curiosity's 'Mars Hand Lens Imager' instrument on August 5, 2015.",
        lat: -4.59,
        long: 137.44
    },
    {
        name: 'Pathfinder',
        description: "The 1996-97 Mars Pathfinder mission was made up of a lander, called the 'Carl Sagan Memorial Station', and a small 10.5kg rover named 'Sojourner'.",
        type: 'mission',
        img: 'point_Pathfinder.jpg',
        caption: 'Sojourner rover collecting an Alpha Particle X-ray Spectrometry measurement of a basaltic rock, a few metres away from the Pathfinder lander.',
        lat: 19.75,
        long: 326.9
    },
    {
        name: 'Spirit',
        description: "The second of NASA's pair of Mars Exploration Rovers touched down here in early 2004.\n\nAfter 5 years and 4 months of successful exploration, Spirit became stuck and immobilized in May 2009 and eventually stopped communicating the following year.",
        type: 'mission',
        img: 'point_Spirit.jpg',
        caption: 'A Delta II rocket with Spirit on board lifts off from Cape Canaveral on June 10, 2003, to begin the 6 months-long trip to Mars.',
        lat: -14.57,
        long: 175.47
    },
    {
        name: 'Opportunity',
        description: "NASA's pair of Mars Exploration Rovers (MERs) were each planned to operate for 90 sols (about 92 Earth days).\n\nInstead, Spirit managed over 2,200 sols before getting stuck - and at the time of writing Opportunity is still going strong, over 14 years later.",
        type: 'mission',
        img: 'point_Opportunity.jpg',
        caption: 'Each MER stands around 1.5 metres high and weighs about 180kg.\n\nOpportunity has so far travelled over 28 miles, with a top speed of about 5cm per second.',
        lat: -1.95,
        long: 354.47
    }

];
console.log('JSON loaded for ' + points.length + ' points of interest.');