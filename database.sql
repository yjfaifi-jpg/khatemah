-- ══════════════════════════════════════════════════════════════════
-- قاعدة بيانات منصة خاتمة التعليمية
-- شغّل هذا الملف في Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════

-- ── 1. جدول الملفات الشخصية للمعلمين ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL DEFAULT '',
  role       TEXT        NOT NULL DEFAULT 'teacher',
  school     TEXT,
  city       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- فهرس للبحث بالاسم
CREATE INDEX IF NOT EXISTS profiles_name_idx ON public.profiles(name);

-- تفعيل Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- المعلم يقرأ ويعدّل ملفه الشخصي فقط
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ── Trigger: إنشاء profile تلقائياً عند تسجيل مستخدم جديد ─────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. جدول الطلاب ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.students (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  grade      TEXT        NOT NULL DEFAULT '',
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- فهارس
CREATE INDEX IF NOT EXISTS students_teacher_idx ON public.students(teacher_id);
CREATE INDEX IF NOT EXISTS students_name_idx    ON public.students(name);

-- Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_select_own" ON public.students
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "students_insert_own" ON public.students
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "students_update_own" ON public.students
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "students_delete_own" ON public.students
  FOR DELETE USING (auth.uid() = teacher_id);

-- ── 3. جدول تاريخ استخدام الأدوات ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_tools_history (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name  TEXT        NOT NULL,
  input      JSONB,
  output     JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- فهارس
CREATE INDEX IF NOT EXISTS ai_history_teacher_idx   ON public.ai_tools_history(teacher_id);
CREATE INDEX IF NOT EXISTS ai_history_tool_idx      ON public.ai_tools_history(tool_name);
CREATE INDEX IF NOT EXISTS ai_history_created_idx   ON public.ai_tools_history(created_at DESC);

-- Row Level Security
ALTER TABLE public.ai_tools_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_history_select_own" ON public.ai_tools_history
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "ai_history_insert_own" ON public.ai_tools_history
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "ai_history_delete_own" ON public.ai_tools_history
  FOR DELETE USING (auth.uid() = teacher_id);

-- ══════════════════════════════════════════════════════════════════
-- انتهى — تحقق من الجداول في Supabase Table Editor
-- ══════════════════════════════════════════════════════════════════
