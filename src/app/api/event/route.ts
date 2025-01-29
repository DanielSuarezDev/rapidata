import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json();
    
    if (!data.websiteId) {
      return NextResponse.json({ error: "Missing website ID" }, { status: 400 });
    }
  
    await prisma.event.create({
      data: {
        website_id: data.websiteId,
        event_type: data.event,
        payload: JSON.stringify(data),
        timestamp: new Date(data.ts)
      }
    });
  
    return NextResponse.json({ success: true });
  }