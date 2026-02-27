export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

// ۱. سوالات ارزیابی اولیه (Pre-test)
export const pretestQuestions: Question[] = [
  { id: 101, text: "سوال اول ارزیابی اولیه؟", options: ["گزینه ۱", "گزینه ۲", "گزینه ۳", "گزینه ۴"], correctAnswer: 0 },
  { id: 102, text: "سوال دوم ارزیابی اولیه؟", options: ["گزینه ۱", "گزینه ۲", "گزینه ۳", "گزینه ۴"], correctAnswer: 1 },
  // ... ۲۰ سوال
];

// ۲. سوالات پس‌آزمون درس اول (مثلاً مبانی کدنویسی)
export const posttestQuestions: Question[] = [
  { id: 201, text: "متغیرها در جاوااسکریپت با چه کلماتی تعریف می‌شوند؟", options: ["var", "let", "const", "همه موارد"], correctAnswer: 3 },
  { id: 202, text: "خروجی دستور console.log چیست؟", options: ["نمایش در صفحه", "چاپ کاغذی", "نمایش در کنسول مرورگر", "ذخیره در دیتابیس"], correctAnswer: 2 },
];
