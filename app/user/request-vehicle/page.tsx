import UploadForm from "@/components/RegReqUploadForm";

export default function RequestVehiclePage() {
  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center gap-4 p-4">
      <h1 className="text-xl font-semibold">Vehicle Registration Upload</h1>
      <UploadForm />
    </main>
  );
}
