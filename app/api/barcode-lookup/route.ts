import { NextRequest, NextResponse } from "next/server";

interface OpenFoodFactsProduct {
  product_name?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    "energy-kcal_serving"?: number;
    proteins_serving?: number;
    carbohydrates_serving?: number;
    fat_serving?: number;
  };
  serving_size?: string;
  serving_quantity?: number;
}

interface ProductData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
}

// GET - Lookup product by barcode
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Barcode code is required" }, { status: 400 });
    }

    // Call Open Food Facts API
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json`,
      {
        headers: {
          "User-Agent": "MyFitnessPro - Nutrition Tracker App",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch product data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status === 0 || !data.product) {
      return NextResponse.json(
        { error: "Product not found. Try entering the barcode manually or add the meal manually." },
        { status: 404 }
      );
    }

    const product: OpenFoodFactsProduct = data.product;

    // Extract nutrition data - prefer serving size, fallback to 100g
    const nutriments = product.nutriments || {};

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let servingSize = product.serving_size || "100g";

    // Try to use per-serving data first
    if (
      nutriments["energy-kcal_serving"] !== undefined &&
      nutriments.proteins_serving !== undefined
    ) {
      calories = Math.round(nutriments["energy-kcal_serving"] || 0);
      protein = Math.round(nutriments.proteins_serving || 0);
      carbs = Math.round(nutriments.carbohydrates_serving || 0);
      fat = Math.round(nutriments.fat_serving || 0);
    } else {
      // Fallback to 100g values
      calories = Math.round(nutriments["energy-kcal_100g"] || 0);
      protein = Math.round(nutriments.proteins_100g || 0);
      carbs = Math.round(nutriments.carbohydrates_100g || 0);
      fat = Math.round(nutriments.fat_100g || 0);
      servingSize = "100g";
    }

    const productData: ProductData = {
      name: product.product_name || "Unknown Product",
      calories,
      protein,
      carbs,
      fat,
      servingSize,
    };

    return NextResponse.json({ product: productData });
  } catch (error) {
    console.error("Barcode lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error while looking up barcode" },
      { status: 500 }
    );
  }
}
