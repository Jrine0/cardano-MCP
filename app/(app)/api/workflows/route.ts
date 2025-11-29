import { NextRequest, NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jsonData = body.jsonData;
    const wallet = body.wallet as string;

    const workflow = await prisma.workflow.create({
      data: {
        userId: wallet,
        name: jsonData.name,
        jsonData,
        wallet,
        status: "active",
      },
    });

    return NextResponse.json({ success: true, workflow }, { status: 201 });
  } catch (err: any) {
    console.error("SAVE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const workflows = await prisma.workflow.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return NextResponse.json(workflows);
}
