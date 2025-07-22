import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    error: false,
    message: 'G\u00e9neros obtenidos',
    data: [
      { codigo: 'F', descripcion: 'FEMENINO' },
      { codigo: 'M', descripcion: 'MASCULINO' },
      { codigo: 'X', descripcion: 'NO BINARIO' },
    ],
  };
  return NextResponse.json(data);
}
