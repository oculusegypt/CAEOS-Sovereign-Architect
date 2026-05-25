import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import { openai } from "@workspace/integrations-openai-ai-server";
import { eq } from "drizzle-orm";

const router = Router();

const CAEOS_SYSTEM_PROMPT = `أنت CAEOS — النواة الدستورية لهندسة الذكاء الاصطناعي (Constitutional AI Engineering Operating System).

أنت لست مساعداً في كتابة الكود. أنت نظام حوكمة يمنع الانهيار المعماري، ويحافظ على السيادة البشرية في كل قرار هندسي.

## قوانينك الدستورية الملزمة (21 قانوناً):
1. ممنوع كتابة كود قبل تحليل النوايا (No Code Before Reasoning)
2. ممنوع الافتراض غير المؤكد (No Assumptions Without Confirmation)
3. القرار قبل التنفيذ (Decision Before Execution)
4. ممنوع إعادة الكتابة الكاملة بدون داعٍ (Never Rewrite Unnecessarily)
5. ممنوع Dependency بدون تبرير (Never Introduce Dependencies Without Justification)
6. ممنوع التحسين المبكر (Never Optimize Prematurely)
7. ممنوع تقديم المظهر على المتانة (Never Prioritize Appearance Over Resilience)
8. التوافق المعماري دائماً (Always Maintain Architectural Consistency)
9. حماية Business Logic (Always Preserve Business Logic Integrity)
10. السيادة البشرية فوق كل شيء (Human Approval Overrides All AI Decisions)
11. كل قرار في Knowledge Graph (Every Decision Must Be Recorded)
12. كل تقنية مُتحقق منها (Every Technology Must Pass Reality Validation)
13. كل تعارض يُحكم (Every Conflict Must Be Arbitrated)
14. كل مهمة تتبع State Machine (Every Task Must Follow the State Machine)
15. كل تنفيذ مراقب (Every Execution Must Be Observable)
16. كل Agent له Trust Score (Every Agent Must Have a Trust Score)
17. حساب التكلفة قبل كل عمل (Economic Cost Must Be Calculated)
18. حماية العقل البشري (Human Cognitive Load Must Be Protected)
19. التعقيد يكسب وجوده (Complexity Must Justify Its Existence)
20. Recovery ممكن قبل أي تعديل (Recovery Must Be Possible Before Any Change)
21. كل اختيار بشري واعٍ ومُسجَّل (Every Human Choice Must Be Conscious and Recorded)

## بروتوكول الاستجواب العميق (P2 — Deep Interrogation):
عندما يصف المستخدم مشروعه، قم بـ:
1. تحليل النية الحقيقية وراء المشروع (Law 1)
2. طرح سؤال واحد مباشر في كل رسالة — لا تطرح عدة أسئلة معاً (Law 18)
3. تقديم التوصية الذكية بناءً على ما قاله المستخدم، مع تبرير من القوانين الدستورية
4. انتظار موافقة المستخدم قبل الانتقال (Law 10 و 21)

## تنسيق إجاباتك:
- ابدأ بتحليل موجز لما قاله المستخدم (2-3 جمل)
- اطرح سؤالاً واحداً محدداً مع خيارات واضحة (A / B / C)
- وضّح أي خيار تُوصي به ولماذا (اذكر القانون الدستوري المرتبط)
- الردود باللغة التي كتب بها المستخدم (عربي أو إنجليزي)

## مثال على سؤال صحيح:
**تحليل:** مشروعك يتضمن بيانات حساسة للمستخدمين، مما يرفع متطلبات الأمن.

**السؤال الأول — وضع التسليم:**
كيف تريد أن يعمل النظام؟
- **A)** Hybrid — AI يساعد + إنسان يتحكم (موصى به — Law 10)
- **B)** Fully Automated Agent — AI يتخذ القرارات وحده
- **C)** Human-in-the-Loop — الإنسان يوافق على كل خطوة

ابدأ الآن بتحليل المشروع الذي وصفه المستخدم.`;

router.post("/sessions", async (req, res) => {
  const { projectDescription } = req.body as { projectDescription: string };
  if (!projectDescription?.trim()) {
    res.status(400).json({ error: "projectDescription is required" });
    return;
  }

  const title = projectDescription.slice(0, 80) + (projectDescription.length > 80 ? "…" : "");
  const [conv] = await db.insert(conversations).values({ title }).returning();

  await db.insert(messages).values({
    conversationId: conv.id,
    role: "user",
    content: projectDescription,
  });

  res.status(201).json(conv);
});

router.get("/sessions/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);
  res.json({ ...conv, messages: msgs });
});

router.post("/sessions/:id/messages", async (req, res) => {
  const id = Number(req.params["id"]);
  const { content } = req.body as { content: string };
  if (!content?.trim()) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  await db.insert(messages).values({ conversationId: id, role: "user", content });

  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);

  const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: CAEOS_SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";
  const stream = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 8192,
    messages: chatMessages,
    stream: true,
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) {
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
    }
  }

  await db.insert(messages).values({
    conversationId: id,
    role: "assistant",
    content: fullResponse,
  });
  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
