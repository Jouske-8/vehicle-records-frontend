import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    // Get the single file from client
    const vehicleCertificate = data.get("vehicleCertificate") as Blob;

    if (!vehicleCertificate) {
      return NextResponse.json(
        { error: "Vehicle certificate file must be provided" },
        { status: 400 }
      );
    }

    // Convert to base64
    const buffer = Buffer.from(await vehicleCertificate.arrayBuffer());
    const base64 = `data:${vehicleCertificate.type};base64,${buffer.toString("base64")}`;

    // Pin JSON to IPFS
    const { cid } = await pinata.upload.public.json({
      certificate: base64,
      timestamp: new Date().toISOString(),
    });

    const url = await pinata.gateways.public.convert(cid);

    return NextResponse.json({ ipfsHash: cid, url }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}