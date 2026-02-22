export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
  }
  
  export const pretestQuestions: Question[] = [
    { id: 1, text: "سوال اول شما اینجا؟", options: ["گزینه ۱", "گزینه ۲", "گزینه ۳", "گزینه ۴"], correctAnswer: 0 },
    { id: 2, text: "سوال دوم شما اینجا؟", options: ["گزینه ۱", "گزینه ۲", "گزینه ۳", "گزینه ۴"], correctAnswer: 1 },
    { id: 3, text: "سوال دوم شما اینجا؟", options: ["گزینه ۱", "گزینه ۲", "گزینه ۳", "گزینه ۴"], correctAnswer: 1 }
    // ... بقیه ۲۰ سوال را اینجا کپی کن
  ];