/**
 * app/api/ai/questions/route.ts
 * ──────────────────────────────
 * API Route لتوليد بنك الأسئلة.
 */

import { NextRequest, NextResponse } from "next/server";
import type { QuestionsInput } from "@/lib/types";

const TYPE_MAP: Record<string, string> = {
  multiple_choice: "اختيار من متعدد (أ، ب، ج، د) مع تحديد الإجابة الصحيحة",
  true_false:      "صح وخطأ مع التصحيح لكل سؤال",
  essay:           "مقالية تحتاج إجابة تفصيلية مع الإجابة النموذجية",
};

export async function POST(request: NextRequest) {
  try {
    const body: QuestionsInput = await request.json();
    const { subject, grade, topic, questionType, count } = body;

    if (!subject || !grade || !topic) {
      return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
    }

    const prompt = `
أنت معلم خبير في المنهج السعودي.
أنشئ بنك أسئلة احترافياً باللغة العربية وفق التالي:

- المادة: ${subject}
- الصف: ${grade}
- الموضوع: ${topic}
- نوع الأسئلة: ${TYPE_MAP[questionType] || questionType}
- عدد الأسئلة: ${count}

المطلوب:
- أسئلة متنوعة تغطي جوانب الموضوع
- مستويات متدرجة (سهل، متوسط، صعب)
- إجابات نموذجية واضحة لكل سؤال
- ترقيم واضح للأسئلة
    `.trim();

    // ── OpenAI (قم بتفعيله عند توفر المفتاح) ─────────────────────
    /*
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 2500,
    });
    const result = response.choices[0].message.content || "";
    return NextResponse.json({ result });
    */

    const result = generateMockQuestions(subject, grade, topic, questionType, count);
    return NextResponse.json({ result });

  } catch (error) {
    console.error("Questions API Error:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

function generateMockQuestions(
  subject: string,
  grade: string,
  topic: string,
  questionType: string,
  count: number
): string {
  const typeLabel = TYPE_MAP[questionType] || questionType;

  let questions = "";

  if (questionType === "multiple_choice") {
    for (let i = 1; i <= count; i++) {
      questions += `
السؤال ${i}: [سؤال متعلق بـ "${topic}" في مادة ${subject}]
   أ) الخيار الأول
   ب) الخيار الثاني
   ج) الخيار الثالث ✓ (الإجابة الصحيحة)
   د) الخيار الرابع
`;
    }
  } else if (questionType === "true_false") {
    for (let i = 1; i <= count; i++) {
      const answer = i % 2 === 0 ? "صح ✓" : "خطأ ✗";
      questions += `
السؤال ${i}: [عبارة متعلقة بـ "${topic}"]  (${answer})
`;
    }
  } else {
    for (let i = 1; i <= count; i++) {
      questions += `
السؤال ${i}: اشرح بالتفصيل [جانب من "${topic}" في مادة ${subject}]

الإجابة النموذجية:
[إجابة تفصيلية تغطي النقاط الرئيسية للسؤال...]
`;
    }
  }

  return `
════════════════════════════════════
     بنك أسئلة — ${subject} | ${grade}
════════════════════════════════════
الموضوع: ${topic}
النوع: ${typeLabel}
العدد: ${count} أسئلة
════════════════════════════════════
${questions}
════════════════════════════════════
⚠️ ملاحظة: نتيجة تجريبية. أضف OPENAI_API_KEY لتفعيل الذكاء الاصطناعي.
════════════════════════════════════
  `.trim();
}
