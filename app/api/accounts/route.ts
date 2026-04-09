import { NextResponse } from "next/server";
import { AccountsService } from "@/features/accounts/services/accounts-service";
import { AuthService } from "@/features/auth/services/auth-service";

export async function GET(request: Request) {
  try {
    const session = await AuthService.getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const result = await AccountsService.getByUserId(session.userId);
    return NextResponse.json({ accounts: result });
  } catch (error: any) {
    console.error("Fetch accounts error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar contas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await AuthService.getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const account = await AccountsService.create({
      ...body,
      user_id: session.userId,
    });

    return NextResponse.json({ account });
  } catch (error: any) {
    console.error("Create account error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
