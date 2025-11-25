import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultExercises = [
  // Chest Exercises
  {
    name: "Dumbbell Bench Press",
    description: "Lie on a bench and press dumbbells upward",
    category: "chest",
    difficulty: "beginner",
    equipment: "dumbbell",
    muscleGroups: ["chest", "triceps", "shoulders"],
    instructions: "Lie on a flat bench with a dumbbell in each hand. Start with arms extended, then lower the weights to chest level. Press back up to starting position.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzJS11W-MN1l7GI7_9WxK6GlEG51RyG--SJFxavHwc7s3KWt5eCTf_jHNuOCgRY2CYh9DIOdq5ul8r4VqxjILaFTkgrlWZksLHwcPipmM0Ap4RvFn7wrD-7diHA9SFnobBmjLpDIpJLV6dA_Hp9AAePBfN7FsX2CRWAUQXzpLXXvDJ68ctLhQXVOzF1kKt1gP-ML7Ij_aNU-FzMarIeseevnmlWR1taSjUSKu-AxfNugi1d9VX7GGnsobehvRrKGKFb9AaFeRqE0Y",
  },
  {
    name: "Push Up",
    description: "Classic bodyweight chest exercise",
    category: "chest",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["chest", "triceps", "core"],
    instructions: "Start in plank position. Lower body until chest nearly touches floor. Push back up to starting position.",
  },
  {
    name: "Chest Fly",
    description: "Isolation exercise for chest",
    category: "chest",
    difficulty: "intermediate",
    equipment: "dumbbell",
    muscleGroups: ["chest"],
    instructions: "Lie on bench with dumbbells extended above chest. Lower weights out to sides in wide arc. Return to starting position.",
  },

  // Back Exercises
  {
    name: "Deadlift",
    description: "Compound exercise for full posterior chain",
    category: "back",
    difficulty: "intermediate",
    equipment: "barbell",
    muscleGroups: ["back", "glutes", "hamstrings"],
    instructions: "Stand with barbell over mid-foot. Bend and grip bar. Lift by extending hips and knees. Lower bar back to ground.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4vDDXfLeE1b88rYya8pyK0_xfs9-FfGVLTrzIhMJliHnwKi8DDf5a_BWEJULJ59eSpAx1HWOP0E-2nj1DsNbO9zkez9GQecpI-TRyVX1ihbYlZe4CUY37ekj0qW-N6K3drmxikrRLLQMzCRFRfYURImo6FKmadHU-xX_Tixt5HAokTQ-hnkWMwb0gZeofvK4XdzdTd1aExOa-OdSr_vEfyk1XzrecQ-sheelT_6L6pW0-vcbmlhDEqXv4nxL1kaL5xQYFdlHU6aI",
  },
  {
    name: "Pull Up",
    description: "Bodyweight back and biceps exercise",
    category: "back",
    difficulty: "intermediate",
    equipment: "bodyweight",
    muscleGroups: ["back", "biceps"],
    instructions: "Hang from bar with overhand grip. Pull body up until chin over bar. Lower back to starting position.",
  },
  {
    name: "Bent Over Row",
    description: "Barbell rowing exercise for back",
    category: "back",
    difficulty: "intermediate",
    equipment: "barbell",
    muscleGroups: ["back", "biceps"],
    instructions: "Bend forward at hips with barbell. Pull bar to lower chest. Lower with control.",
  },

  // Leg Exercises
  {
    name: "Barbell Squat",
    description: "King of leg exercises",
    category: "legs",
    difficulty: "intermediate",
    equipment: "barbell",
    muscleGroups: ["quads", "glutes", "hamstrings"],
    instructions: "Bar on upper back. Squat down until thighs parallel to ground. Drive through heels to stand.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYWeSOwOKsqpttZLJH91C39LcPHSRYKlLJWI-G59BucFDj1rtIAMj8B6JMwUFRaD33mteOsUi_mHGjjeGdeAfRZC22ka3Dvkxhkh-Xi9boRVoMDlw1Fk506bq5cuwxSroibK_-xCpczUbbyQRthYG4IiCMY10HtniNckapajl-D93bm7VXwjfp3zT_nr_UCkKwKouFJVT7i-YdmXXqS9RddZBmFYD1TpmW0cPuZPLr7_RT8xL-0ddnGmKCu5BosiaLH1SaYEzoDE4",
  },
  {
    name: "Lunges",
    description: "Single leg strength exercise",
    category: "legs",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["quads", "glutes"],
    instructions: "Step forward with one leg. Lower hips until both knees bent at 90 degrees. Push back to starting position.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwlB_2NQaSHTBn4pw_ltL9QMO0mjCyFQhPZMEnsTbHj2qJIV-vrsYxj8drwSCz5f1e7Kq3oYCOYhMcBT2PtC49o37b544hYKrlfk30_ft9B1lYbqO2cYnNGq5FbpoV3bDQOIdRlcH4UUclAixrIvrqetnqk87pCQO48pKy1pOZbwQFZ2zcyCdk0iOTP4aqumGwAaCVKfMbkmwR99_NUci_4Ld_veb9myMkEf4fsNzpArKcZ8d6lCpTq7ZmP1gMLULHA7iVM8Z3BBw",
  },
  {
    name: "Leg Press",
    description: "Machine-based leg exercise",
    category: "legs",
    difficulty: "beginner",
    equipment: "machine",
    muscleGroups: ["quads", "glutes"],
    instructions: "Sit in leg press machine. Push platform away by extending legs. Return with control.",
  },

  // Shoulder Exercises
  {
    name: "Overhead Press",
    description: "Pressing movement for shoulders",
    category: "shoulders",
    difficulty: "intermediate",
    equipment: "barbell",
    muscleGroups: ["shoulders", "triceps"],
    instructions: "Stand with barbell at shoulders. Press overhead until arms extended. Lower back to shoulders.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuColZKF7FnxXjqO4h4b_jTWE9-cyI-vQ4pq_qLv6sgJ_mSd4bR7QfExVdf9dF7SMYJQZaiWUeZ12O5vA3-K_fzdnCcyRWZ-x3eLd8q8oSGDpPNmL_pCloON4SC1HZFFZnqw63Qn6jhiQ2Eqj6uKfmAuEJOm_OgJ62Fwiu7ouxnKcjope70L0UWMbZShDI_mIymg9Gf2VETxptLgcyP9lv1UMLL_TiBKHf9nlNsipBQAzljPjTT8j518OiWFOay3R0yQyeZF_anThkM",
  },
  {
    name: "Lateral Raise",
    description: "Isolation for side delts",
    category: "shoulders",
    difficulty: "beginner",
    equipment: "dumbbell",
    muscleGroups: ["shoulders"],
    instructions: "Hold dumbbells at sides. Raise arms out to sides until parallel to ground. Lower with control.",
  },
  {
    name: "Face Pull",
    description: "Rear delt and upper back exercise",
    category: "shoulders",
    difficulty: "beginner",
    equipment: "cable",
    muscleGroups: ["shoulders", "back"],
    instructions: "Pull rope attachment to face level, separating hands. Focus on rear delts.",
  },

  // Arm Exercises
  {
    name: "Bicep Curl",
    description: "Classic bicep isolation",
    category: "arms",
    difficulty: "beginner",
    equipment: "dumbbell",
    muscleGroups: ["biceps"],
    instructions: "Hold dumbbells at sides. Curl weights up by flexing elbows. Lower with control.",
  },
  {
    name: "Tricep Dips",
    description: "Bodyweight tricep exercise",
    category: "arms",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["triceps", "chest"],
    instructions: "Support body on bars. Lower by bending elbows. Push back up to starting position.",
  },
  {
    name: "Hammer Curl",
    description: "Bicep curl with neutral grip",
    category: "arms",
    difficulty: "beginner",
    equipment: "dumbbell",
    muscleGroups: ["biceps", "forearms"],
    instructions: "Hold dumbbells with neutral grip. Curl weights up. Lower with control.",
  },

  // Core Exercises
  {
    name: "Plank",
    description: "Isometric core strengthener",
    category: "core",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["core"],
    instructions: "Hold push-up position with forearms on ground. Keep body straight. Hold for time.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqdaD6VPRo8_gjekf91qGR3kb270ZVTA4Z2GbZCGGVzfz39HXHS_bEIuHspQCxlGtvcDOrOgM7KNEVBMA7M9NEHYGEtDBTn2KC-IIuqh-Jn15KnsY3BVT4Xu1x3yvRLzLYli56rTwg_chTV7Hge8pzDcvfOWoho182AdBDlc3N3eQM9NqmuyZXlknX-J1XpypsfVq92hvbRunm-lP8DKh4YnV_Chv6E8-WxMCSieCQM3MUmcUuriFtYD80Jn3d-Y8anCZzyHGr2Mg",
  },
  {
    name: "Crunches",
    description: "Basic abdominal exercise",
    category: "core",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["core"],
    instructions: "Lie on back with knees bent. Lift shoulders off ground. Lower back down.",
  },
  {
    name: "Russian Twist",
    description: "Rotational core exercise",
    category: "core",
    difficulty: "intermediate",
    equipment: "bodyweight",
    muscleGroups: ["core", "obliques"],
    instructions: "Sit with feet elevated. Rotate torso side to side. Can hold weight for difficulty.",
  },

  // Cardio Exercises
  {
    name: "Treadmill Run",
    description: "Running on treadmill",
    category: "cardio",
    difficulty: "beginner",
    equipment: "machine",
    muscleGroups: ["legs", "cardiovascular"],
    instructions: "Run at steady pace on treadmill. Adjust speed and incline as needed.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqJm9CAJPJfouLBYehE5312uVFzZxo6OW2cfOIdxOyKVl_MIbSUUw8Duqlp_RqzYQlop7ouOVz45b_NWgFn6g7Gax_LdMx6zJpcbXXDmXBZJkpmWjTYaoyIDn9UwrB9ixSmHHoYI5lp34qrbeNLGmP2FefsYTB6163q3B2E2WGN-SA_xP53ZiS0wU39u3rIdKoTqg9MSp8ZNfUNhyMvcapFnnTQ5QjDBh87TR_VnUiQU0shCHSqEQo-6RrVOQ4EBi8XxKGphi-bLw",
  },
  {
    name: "Cycling",
    description: "Stationary or road cycling",
    category: "cardio",
    difficulty: "beginner",
    equipment: "machine",
    muscleGroups: ["legs", "cardiovascular"],
    instructions: "Cycle at steady pace. Adjust resistance and duration as needed.",
  },
  {
    name: "Jumping Jacks",
    description: "Full body cardio exercise",
    category: "cardio",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["full_body", "cardiovascular"],
    instructions: "Jump while spreading legs and raising arms. Return to starting position. Repeat rapidly.",
  },
  {
    name: "Burpees",
    description: "High intensity full body exercise",
    category: "cardio",
    difficulty: "advanced",
    equipment: "bodyweight",
    muscleGroups: ["full_body", "cardiovascular"],
    instructions: "From standing, drop to plank, do push-up, jump feet to hands, jump up. Repeat.",
  },

  // Flexibility Exercises
  {
    name: "Yoga Flow",
    description: "Dynamic stretching and movement",
    category: "flexibility",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["full_body"],
    instructions: "Flow through various yoga poses focusing on breath and flexibility.",
  },
  {
    name: "Hamstring Stretch",
    description: "Static hamstring stretch",
    category: "flexibility",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["hamstrings"],
    instructions: "Sit with legs extended. Reach forward toward toes. Hold stretch.",
  },
  {
    name: "Hip Flexor Stretch",
    description: "Stretch for hip flexors",
    category: "flexibility",
    difficulty: "beginner",
    equipment: "bodyweight",
    muscleGroups: ["hips"],
    instructions: "Lunge position with back knee down. Push hips forward. Hold stretch.",
  },
];

async function main() {
  console.log("Starting database seed...");

  // Delete existing exercises if any
  await prisma.exercise.deleteMany({
    where: {
      isCustom: false,
    },
  });

  console.log("Cleared existing system exercises");

  // Create exercises
  for (const exercise of defaultExercises) {
    await prisma.exercise.create({
      data: {
        ...exercise,
        isCustom: false,
      },
    });
  }

  console.log(`Seeded ${defaultExercises.length} exercises successfully!`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
