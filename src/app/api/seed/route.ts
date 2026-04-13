import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Tool from "@/models/Tool";
import Blog from "@/models/Blog";

const toolsData = [
  { name: "BMI Calculator", slug: "bmi-calculator", description: "Calculate your Body Mass Index (BMI) accurately.", metaTitle: "BMI Calculator - Free Online Tool", metaDescription: "Calculate your BMI easily." },
  { name: "Age Calculator", slug: "age-calculator", description: "Calculate your exact age in years, months, and days.", metaTitle: "Age Calculator - Find Your Exact Age", metaDescription: "Calculate your exact age." },
  { name: "EMI Calculator", slug: "emi-calculator", description: "Calculate your Equated Monthly Installment for loans.", metaTitle: "EMI Calculator - Free Loan Tool", metaDescription: "Calculate monthly EMI." },
  { name: "Percentage Calculator", slug: "percentage-calculator", description: "Calculate percentages easily and accurately.", metaTitle: "Percentage Calculator - Free Tool", metaDescription: "Find percentages fast." },
  { name: "Discount Calculator", slug: "discount-calculator", description: "Calculate the final price after applying a discount.", metaTitle: "Discount Calculator - Free Tool", metaDescription: "Calculate discount prices." },
  { name: "GPA Calculator", slug: "gpa-calculator", description: "Calculate your semester or cumulative GPA.", metaTitle: "GPA Calculator - College & High School", metaDescription: "Free GPA Calculator." },
  { name: "Calorie Calculator", slug: "calorie-calculator", description: "Estimate your daily calorie needs.", metaTitle: "Calorie Calculator - Daily Needs", metaDescription: "Calculate daily calories." },
  { name: "Time Duration Calculator", slug: "time-duration-calculator", description: "Calculate the duration between two times.", metaTitle: "Time Duration Calculator", metaDescription: "Calculate time differences." },
  { name: "Tip Calculator", slug: "tip-calculator", description: "Calculate tips and split the bill easily.", metaTitle: "Tip Calculator - Bill Splitter", metaDescription: "Free tip calculator." },
  { name: "Loan Interest Calculator", slug: "loan-interest-calculator", description: "Calculate total interest paid on a loan.", metaTitle: "Loan Interest Calculator", metaDescription: "Find out your loan interest." },
];

const blogsData = [
  {
    title: "How to Calculate BMI Correctly",
    slug: "how-to-calculate-bmi-correctly",
    content: "# How to Calculate BMI Correctly\n\nBody Mass Index (BMI) is a simple height-to-weight ratio used to classify underweight, normal weight, overweight, and obesity in adults. While it's not a direct measure of body fat, it correlates strongly with metabolic disease risk.\n\n## The Formula\nThe basic formula is `Weight (kg) / Height (m)²`.\n\nFor example, if you weigh 70 kg and your height is 1.75 meters:\n`70 / (1.75 * 1.75) = 22.86`\n\n## BMI Categories\n- **Underweight**: Below 18.5\n- **Normal weight**: 18.5 - 24.9\n- **Overweight**: 25.0 - 29.9\n- **Obesity**: 30.0 and above\n\n## Why BMI Matters\nMaintaining a normal BMI reduces the risk of chronic conditions such as heart disease, high blood pressure, type 2 diabetes, and certain cancers. However, athletes with high muscle mass might have a high BMI without having excess body fat.\n\nTry our [BMI Calculator](/tools/bmi-calculator) to check your status instantly!",
    metaTitle: "How to Calculate BMI Correctly - Full Guide",
    metaDescription: "Learn what BMI is, how the formula works, and what your score means.",
  },
  {
    title: "EMI Calculator Guide for Beginners",
    slug: "emi-calculator-guide-beginners",
    content: "# EMI Calculator Guide for Beginners\n\nEquated Monthly Installment (EMI) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month.\n\n## How EMI is Calculated\nThe mathematical formula to calculate EMI is:\n`E = P x R x (1+R)^N / [(1+R)^N-1]`\n\nWhere:\n- **E** is EMI\n- **P** is Principal Loan Amount\n- **R** is rate of interest calculated on a monthly basis\n- **N** is loan tenure in months\n\n## Why Use an EMI Calculator?\nCalculating this manually is tedious. Using an automated tool helps you quickly assess whether a loan fits within your monthly budget. By adjusting the tenure, you can see how it affects your monthly payment and total interest outflow.\n\nCalculate your exact payments using our free [EMI Calculator](/tools/emi-calculator) today.",
    metaTitle: "EMI Calculator Guide for Beginners - Finance Tips",
    metaDescription: "Understand how Equated Monthly Installments are calculated and why they matter.",
  },
  {
    title: "How to Calculate Percentage Easily",
    slug: "how-to-calculate-percentage-easily",
    content: "# How to Calculate Percentage Easily\n\nPercentages are everywhere: shopping discounts, exam scores, taxes, and interest rates. The word 'percent' simply means 'per hundred'.\n\n## The Basic Rule\nTo find a percentage of a number, you multiply the number by the percentage fraction. For example, to find 20% of 150:\n`150 * (20 / 100) = 30`\n\n## Quick Mental Math Tips\n- **10%**: Move the decimal point one place to the left (10% of 450 is 45).\n- **5%**: Find 10% and halve it (5% of 450 is 22.5).\n- **1%**: Move the decimal point two places to the left.\n\nIf mental math isn't your thing, save time by using our [Percentage Calculator](/tools/percentage-calculator).",
    metaTitle: "How to Calculate Percentage Easily - Quick Tips",
    metaDescription: "Master percentage calculations with these easy mental math tricks.",
  },
  {
    title: "Loan Interest Explained Simply",
    slug: "loan-interest-explained",
    content: "# Loan Interest Explained Simply\n\nWhen you borrow money, you don't just pay back the borrowed amount (the principal); you also pay a fee for borrowing it. This fee is the interest.\n\n## Simple vs. Compound Interest\n- **Simple Interest** is calculated only on the principal amount of a loan.\n- **Compound Interest** is calculated on the principal amount AND also on the accumulated interest of previous periods.\n\nMost modern mortgages and personal loans use a form of amortizing interest that reduces over time as you pay down the principal.\n\n## How to Reduce Interest Paid\n1. Opt for a shorter loan term.\n2. Make extra principal payments.\n3. Shop around for lower interest rates.\n\nCurious about how much interest you'll pay over the life of your loan? Try our [Loan Interest Calculator](/tools/loan-interest-calculator).",
    metaTitle: "Loan Interest Explained Simply - Personal Finance",
    metaDescription: "Learn the difference between simple and compound interest and how loans work.",
  },
  {
    title: "Best Online Calculators You Should Use",
    slug: "best-online-calculators",
    content: "# Best Online Calculators You Should Use\n\nIn our digital age, you don't need a clunky physical calculator. Web-based tools have made everyday math straightforward and accessible everywhere.\n\n## Top Everyday Calculators\n\n1. **[Discount Calculator](/tools/discount-calculator)**: Never get fooled by multi-layered store sales again. Quickly figure out the final price of an item.\n2. **[Age Calculator](/tools/age-calculator)**: Need to know your exact age in days for legal documents or fun? This precise tool takes care of leap years automatically.\n3. **[Calorie Calculator](/tools/calorie-calculator)**: Crucial for fitness goals, whether you are cutting, bulking, or maintaining your weight.\n4. **[Tip Calculator](/tools/tip-calculator)**: Dining out with friends? Split the bill seamlessly and calculate tip percentages instantly.\n\nBookmark these tools to streamline your daily calculations!",
    metaTitle: "Best Online Calculators You Should Use Daily",
    metaDescription: "Discover the most useful free online calculators for health, finance, and everyday logic.",
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing
    await Tool.deleteMany({});
    await Blog.deleteMany({});
    
    // Insert new
    await Tool.insertMany(toolsData);
    await Blog.insertMany(blogsData);

    return NextResponse.json({ success: true, message: "Database seeded correctly!" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
