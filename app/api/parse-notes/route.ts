import { NextRequest, NextResponse } from "next/server";
import { parseNotes } from "@/lib/parse-notes";

export async function POST(request: NextRequest) {
  try {
    const { notes } = await request.json();

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(
        { success: false, error: "请提供有效的笔记内容" },
        { status: 400 }
      );
    }

    const plan = parseNotes(notes);

    if (plan.scenes.length === 0) {
      return NextResponse.json(
        { success: false, error: "无法解析笔记内容，请确保格式正确" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Parse notes error:", error);
    return NextResponse.json(
      { success: false, error: "解析笔记时发生错误" },
      { status: 500 }
    );
  }
}

