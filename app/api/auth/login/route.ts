import { NextResponse } from "next/server";
import { AuthService } from "@/features/auth/services/auth-service";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await AuthService.login(email, password);

    return NextResponse.json({
      success: true,
      user,
      message: "Login realizado com sucesso",
    });
  } catch (error: any) {
    console.error("Login mapping error:", error);
    return NextResponse.json(
      { error: error.message || "Credenciais inválidas" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  await AuthService.deleteSession();
  return NextResponse.json({ success: true });
}
