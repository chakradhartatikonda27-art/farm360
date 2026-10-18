import { NextRequest, NextResponse } from 'next/server';
import { processConsultation, ConsultationSubmission } from '@/lib/consultationAdapter';

export async function POST(request: NextRequest) {
  try {
    const body: ConsultationSubmission = await request.json();
    const result = await processConsultation(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Consultation API route error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred while processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
