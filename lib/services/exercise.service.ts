import { prisma } from "@/lib/prisma";

export interface CreateExerciseInput {
  name: string;
  description?: string;
  category: string;
  difficulty: string;
  equipment?: string;
  instructions?: string;
  imageUrl?: string;
  videoUrl?: string;
  muscleGroups: string[];
  isCustom?: boolean;
  userId?: string;
}

export interface UpdateExerciseInput {
  name?: string;
  description?: string;
  category?: string;
  difficulty?: string;
  equipment?: string;
  instructions?: string;
  imageUrl?: string;
  videoUrl?: string;
  muscleGroups?: string[];
}

// Get all exercises (system + user's custom exercises)
export async function getAllExercises(userId?: string, category?: string) {
  const where: any = {
    OR: [
      { isCustom: false }, // system exercises
      { userId: userId }, // user's custom exercises
    ],
  };

  if (category && category !== "all") {
    where.category = category;
  }

  return await prisma.exercise.findMany({
    where,
    orderBy: [
      { isCustom: "asc" }, // system exercises first
      { name: "asc" },
    ],
  });
}

// Get exercise by ID
export async function getExerciseById(id: string) {
  return await prisma.exercise.findUnique({
    where: { id },
  });
}

// Search exercises by name
export async function searchExercises(query: string, userId?: string) {
  return await prisma.exercise.findMany({
    where: {
      AND: [
        {
          OR: [
            { isCustom: false },
            { userId: userId },
          ],
        },
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: { name: "asc" },
  });
}

// Get exercises by category
export async function getExercisesByCategory(category: string, userId?: string) {
  return await prisma.exercise.findMany({
    where: {
      category,
      OR: [
        { isCustom: false },
        { userId: userId },
      ],
    },
    orderBy: { name: "asc" },
  });
}

// Create custom exercise
export async function createExercise(data: CreateExerciseInput) {
  return await prisma.exercise.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      equipment: data.equipment,
      instructions: data.instructions,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      muscleGroups: data.muscleGroups,
      isCustom: data.isCustom ?? true,
      userId: data.userId,
    },
  });
}

// Update exercise (only custom exercises)
export async function updateExercise(id: string, userId: string, data: UpdateExerciseInput) {
  // Verify this is a custom exercise owned by the user
  const exercise = await prisma.exercise.findFirst({
    where: {
      id,
      userId,
      isCustom: true,
    },
  });

  if (!exercise) {
    throw new Error("Exercise not found or you don't have permission to edit it");
  }

  return await prisma.exercise.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category && { category: data.category }),
      ...(data.difficulty && { difficulty: data.difficulty }),
      ...(data.equipment !== undefined && { equipment: data.equipment }),
      ...(data.instructions !== undefined && { instructions: data.instructions }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
      ...(data.muscleGroups && { muscleGroups: data.muscleGroups }),
    },
  });
}

// Delete exercise (only custom exercises)
export async function deleteExercise(id: string, userId: string) {
  // Verify this is a custom exercise owned by the user
  const exercise = await prisma.exercise.findFirst({
    where: {
      id,
      userId,
      isCustom: true,
    },
  });

  if (!exercise) {
    throw new Error("Exercise not found or you don't have permission to delete it");
  }

  return await prisma.exercise.delete({
    where: { id },
  });
}

// Get exercise categories
export function getExerciseCategories() {
  return [
    "chest",
    "back",
    "legs",
    "shoulders",
    "arms",
    "core",
    "cardio",
    "flexibility",
  ];
}

// Get difficulty levels
export function getDifficultyLevels() {
  return ["beginner", "intermediate", "advanced"];
}

// Get equipment types
export function getEquipmentTypes() {
  return [
    "barbell",
    "dumbbell",
    "bodyweight",
    "machine",
    "cable",
    "resistance_band",
    "kettlebell",
    "other",
  ];
}
