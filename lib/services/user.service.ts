import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * User Service
 * Handles all user-related database operations
 */

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  gender: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  goal: string | null;
  activityLevel: string | null;
  bmi: number | null;
  tdee: number | null;
  targetCalories: number | null;
  targetProtein: number | null;
  onboardingCompleted: boolean;
}

export interface UserProfileUpdate {
  name?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  goal?: string;
  activityLevel?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface OnboardingData {
  email: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  goal?: string;
  activityLevel?: string;
  bmi?: number;
  tdee?: number;
  targetCalories?: number;
  targetProtein?: number;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        gender: true,
        age: true,
        height: true,
        weight: true,
        goal: true,
        activityLevel: true,
        bmi: true,
        tdee: true,
        targetCalories: true,
        targetProtein: true,
        onboardingCompleted: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}

/**
 * Update user profile with automatic metric recalculation
 */
export async function updateUserProfile(
  userId: string,
  data: UserProfileUpdate
): Promise<UserProfile> {
  try {
    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gender: true,
        age: true,
        height: true,
        weight: true,
        activityLevel: true,
        goal: true,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Build update data
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.age !== undefined) updateData.age = data.age;
    if (data.height !== undefined) updateData.height = data.height;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.goal !== undefined) updateData.goal = data.goal;
    if (data.activityLevel !== undefined) updateData.activityLevel = data.activityLevel;

    // Use updated values or fallback to current values
    const finalGender = data.gender ?? currentUser.gender;
    const finalAge = data.age ?? currentUser.age;
    const finalHeight = data.height ?? currentUser.height;
    const finalWeight = data.weight ?? currentUser.weight;
    const finalActivityLevel = data.activityLevel ?? currentUser.activityLevel;
    const finalGoal = data.goal ?? currentUser.goal;

    // Calculate BMI
    if (finalHeight && finalWeight) {
      const heightInMeters = finalHeight / 100;
      updateData.bmi = parseFloat(
        (finalWeight / (heightInMeters * heightInMeters)).toFixed(1)
      );
    }

    // Calculate TDEE
    if (finalAge && finalHeight && finalWeight && finalGender && finalActivityLevel) {
      let bmr: number;
      if (finalGender === "Male") {
        bmr = 10 * finalWeight + 6.25 * finalHeight - 5 * finalAge + 5;
      } else {
        bmr = 10 * finalWeight + 6.25 * finalHeight - 5 * finalAge - 161;
      }

      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725,
      };

      const tdee = Math.round(bmr * (activityMultipliers[finalActivityLevel] || 1.2));
      updateData.tdee = tdee;

      // Calculate target calories based on goal
      const goalMultipliers: Record<string, number> = {
        cut: 0.8,
        bulk: 1.2,
        recomp: 0.95,
        maintain: 1.0,
      };

      updateData.targetCalories = Math.round(
        tdee * (goalMultipliers[finalGoal || "maintain"] || 1.0)
      );
    }

    // Calculate target protein (2g per kg)
    if (finalWeight) {
      updateData.targetProtein = Math.round(finalWeight * 2);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        gender: true,
        age: true,
        height: true,
        weight: true,
        goal: true,
        activityLevel: true,
        bmi: true,
        tdee: true,
        targetCalories: true,
        targetProtein: true,
        onboardingCompleted: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}

/**
 * Create a new user (signup)
 */
export async function createUser(data: CreateUserData): Promise<{ id: string; email: string }> {
  try {
    const { name, email, password } = data;

    // Validate required fields
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
      throw error; // Re-throw validation errors
    }
    throw new Error("Failed to create user");
  }
}

/**
 * Complete user onboarding
 */
export async function completeOnboarding(data: OnboardingData): Promise<UserProfile> {
  try {
    const {
      email,
      gender,
      age,
      height,
      weight,
      goal,
      activityLevel,
      bmi,
      tdee,
      targetCalories,
      targetProtein,
    } = data;

    if (!email) {
      throw new Error("Email is required");
    }

    // Update user with onboarding data
    const user = await prisma.user.update({
      where: { email },
      data: {
        gender,
        age: age ? parseInt(String(age)) : null,
        height: height ? parseFloat(String(height)) : null,
        weight: weight ? parseFloat(String(weight)) : null,
        goal,
        activityLevel,
        bmi: bmi ? parseFloat(String(bmi)) : null,
        tdee: tdee ? parseInt(String(tdee)) : null,
        targetCalories: targetCalories ? parseInt(String(targetCalories)) : null,
        targetProtein: targetProtein ? parseInt(String(targetProtein)) : null,
        onboardingCompleted: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        gender: true,
        age: true,
        height: true,
        weight: true,
        goal: true,
        activityLevel: true,
        bmi: true,
        tdee: true,
        targetCalories: true,
        targetProtein: true,
        onboardingCompleted: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error completing onboarding:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to complete onboarding");
  }
}

/**
 * Change user password
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    // Validate inputs
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Error changing password:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to change password");
  }
}
