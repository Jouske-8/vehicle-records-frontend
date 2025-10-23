import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    // Pinata accepts Blob directly in Node.js
    const addressProof = data.get("addressProof") as Blob;
    const invoice = data.get("invoice") as Blob;
    const chasisEngine = data.get("chasisEngine") as Blob;
    const panCard = data.get("panCard") as Blob;

    if (!addressProof || !invoice || !chasisEngine || !panCard) {
      return NextResponse.json(
        { error: "All files must be provided" },
        { status: 400 }
      );
    }

    // Combine files into JSON with base64
    const toBase64 = async (blob: Blob) => {
      const buffer = Buffer.from(await blob.arrayBuffer());
      return `data:${blob.type};base64,${buffer.toString("base64")}`;
    };

    const combinedData = {
      addressProof: await toBase64(addressProof),
      invoice: await toBase64(invoice),
      chasisEngine: await toBase64(chasisEngine),
      panCard: await toBase64(panCard),
      timestamp: new Date().toISOString(),
    };

    // Pin the combined JSON to IPFS
    const { cid } = await pinata.upload.public.json(combinedData);
    const url = await pinata.gateways.public.convert(cid);

    return NextResponse.json({ ipfsHash: cid, url }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
