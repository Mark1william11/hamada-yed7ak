/**
 * Game Data Structure
 * Each level contains:
 * - id: Unique identifier
 * - celebrity: Name of the celebrity
 * - baseImage: Image URL with missing mouth
 * - completeImage: Full image URL with correct mouth
 * - overlayStyle: Object with { top, left, width } percentages for mouth positioning
 * - options: Array of mouth option images (no labels)
 * - correctMouth: ID of the correct mouth option
 */

export const gameLevels = [
    {
        id: 1,
        celebrity: "Big Ramy",
        baseImage: "/assets/level1/base.png",
        completeImage: "/assets/level1/complete.png",
        overlayStyle: {
            top: "10%",    // Vertical position of mouth on face
            left: "55%",   // Horizontal position of mouth on face
            width: "15%",   // Width of mouth relative to face
            transform: "translate(-50%, -50%)"
        },
        options: [
            { id: "m1", image: "/assets/level1/mouth_wrong1.jpg" },
            { id: "m2", image: "/assets/level1/mouth_correct.jpg" },
            { id: "m3", image: "/assets/level1/mouth_wrong2.jpg" },
            { id: "m4", image: "/assets/level1/mouth_wrong3.jpg" },
        ],
        correctMouth: "m2"
    },
    {
        id: 2,
        celebrity: "Ahmed Helmy",
        baseImage: "/assets/level2/base.png",
        completeImage: "/assets/level2/complete.png",
        overlayStyle: {
            top: "28%",
            left: "42%",
            width: "15%"
        },
        options: [
            { id: "m1", image: "/assets/level2/mouth_wrong1.jpg" },
            { id: "m2", image: "/assets/level2/mouth_wrong2.jpg" },
            { id: "m3", image: "/assets/level2/mouth_correct.jpg" },
            { id: "m4", image: "/assets/level2/mouth_wrong3.jpg" },
        ],
        correctMouth: "m3"
    },
    {
        id: 3,
        celebrity: "Tamer Hosny",
        baseImage: "/assets/level3/base.png",
        completeImage: "/assets/level3/complete.png",
        overlayStyle: {
            top: "50%",
            left: "45%",
            width: "23%"
        },
        options: [
            { id: "m1", image: "/assets/level3/mouth_correct.jpg" },
            { id: "m2", image: "/assets/level3/mouth_wrong1.jpg" },
            { id: "m3", image: "/assets/level3/mouth_wrong2.jpg" },
            { id: "m4", image: "/assets/level3/mouth_wrong3.jpg" },
        ],
        correctMouth: "m1"
    },
    {
        id: 4,
        celebrity: "Mo Salah",
        baseImage: "/assets/level4/base.png",
        completeImage: "/assets/level4/complete.png",
        overlayStyle: {
            top: "25%",
            left: "35%",
            width: "20%"
        },
        options: [
            { id: "m1", image: "/assets/level4/mouth_wrong1.jpg" },
            { id: "m2", image: "/assets/level4/mouth_wrong2.jpg" },
            { id: "m3", image: "/assets/level4/mouth_wrong3.jpg" },
            { id: "m4", image: "/assets/level4/mouth_correct.jpg" },
        ],
        correctMouth: "m4"
    },
];

// Game configuration
export const GAME_CONFIG = {
    INITIAL_LIVES: 3,
    POINTS_PER_LEVEL: 100,
    POINTS_BONUS_SPEED: 50, // Bonus for quick answers
    ANIMATION_DURATION: 300,
    CONFETTI_DURATION: 3000
};
