/**
 * app/api/ai/worksheets/route.ts
 * ───────────────────────────────
 * API Route لتوليد أوراق العمل.
 */

import { NextRequest, NextResponse } from "next/server";
import type { WorksheetInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: WorksheetInput = await request.json();
    const { subject, grade, topic, activitiesCount } = body;

    if (!subject || !grade || !topic) {
      return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });
    }

    const prompt = `
أنت معلم خبير في تصميم المواد التعليمية السعودية.
أنشئ ورقة عمل تفاعلية ومتنوعة باللغة العربية:

- المادة: ${subject}
- الصف: ${grade}
- الموضوع: ${topic}
- عدد الأنشطة: ${activitiesCount}

يجب أن تتضمن ورقة العمل:
- اسم الطالب والتاريخ والصف
- أنشطة متنوعة (ملء الفراغ، ربط، ترتيب، أسئلة مفتوحة)
- تعليمات واضحة لكل نشاط
- توزيع الدرجات على كل نشاط
- إجابات نموذجية في النهاية
    `.trim();

    // ── OpenAI ────────────────────────────────────────────────────
    /*
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });
    const result = response.choices[0].message.content || "";
    return NextResponse.json({ result });
    */

    const result = generateMockWorksheet(subject, grade, topic, activitiesCount);
    return NextResponse.json({ result });

  } catch (error) {
    console.error("Worksheets API Error:", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

function generateMockWorksheet(
  subject: string,
  grade: string,
  topic: string,
  activitiesCount: number
): string {
  const activities: string[] = [];

  const types = ["ملء الفراغات", "صل المتشابهات", "أجب عن الأسئلة", "رتّب الترتيب الصحيح", "اختر الإجابة الصحيحة", "استنتج وحلّل"];

  for (let i = 1; i <= activitiesCount; i++) {
    const type = types[(i - 1) % types.length];
    activities.push(`
النشاط ${i}: ${type} (${Math.floor(10 / activitiesCount)} درجات)
${"─".repeat(40)}
[أسئلة نشاط ${i} متعلقة بموضوع "${topic}" في مادة ${subject}]

1. ................................ 
2. ................................ 
3. ................................ 
`);
  }

  return `
╔══════════════════════════════════════╗
║        ورقة عمل — ${subject}         
║        ${grade}
╚══════════════════════════════════════╝

اسم الطالب: ________________________  الصف: _________  التاريخ: __________
═══════════════════════════════════════════

الموضوع: ${topic}
الدرجة الكاملة: 10 درجات
الزمن: 30 دقيقة

═══════════════════════════════════════════
${activities.join("\n")}
═══════════════════════════════════════════

📝 الإجابات النموذجية:
(للمعلم فقط)
[ستظهر الإجابات هنا عند استخدام الذكاء الاصطناعي الحقيقي]

════════════════════════════════════
⚠️ نتيجة تجريبية. أضف OPENAI_API_KEY لتفعيل الذكاء الاصطناعي.
════════════════════════════════════
  `.trim();
}
