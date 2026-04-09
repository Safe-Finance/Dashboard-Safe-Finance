import { NextResponse } from "next/server";
import { TransactionsService } from "@/features/transactions/services/transactions-service";
import { AuthService } from "@/features/auth/services/auth-service";

export async function GET(request: Request) {
  try {
    const session = await AuthService.getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      accountId: searchParams.get("accountId") ? Number(searchParams.get("accountId")) : undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      category: searchParams.get("category") || undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    };

    const result = await TransactionsService.list(session.userId, filters);
    return NextResponse.json({ transactions: result });
  } catch (error: any) {
    console.error("Fetch transactions error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar transações" },
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
    const transaction = await TransactionsService.create({
      ...body,
      userId: session.userId,
    });

    return NextResponse.json({ transaction });
  } catch (error: any) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar transação" },
      { status: 500 }
    );
  }
}
