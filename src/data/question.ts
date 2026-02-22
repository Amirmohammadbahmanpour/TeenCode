export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
  }
  
  export const pretestQuestions: Question[] = [
    {
      id: 1,
      text: "اولین قدم برای تغییر ذهنیت چیست؟",
      options: ["تغییر محیط", "شناسایی باورهای محدودکننده", "مطالعه کتاب", "خواب کافی"],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "کدام مورد باعث استمرار در عادت‌های جدید می‌شود؟",
      options: ["اراده قوی ناگهانی", "انگیزه لحظه‌ای", "برنامه‌ریزی کوچک و تداوم", "شانس"],
      correctAnswer: 2,
    },
    // سوالات بیشتر را اینجا اضافه کن
  ];