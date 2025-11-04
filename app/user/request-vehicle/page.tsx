import UploadForm from "@/components/RegReqUploadForm";

export default function RequestVehiclePage() {
  return (
    // Set the dark gradient background for the entire page
    // and default the text color to light gray
    <main className="w-full min-h-screen flex flex-col justify-center items-center gap-6 p-4 bg-gradient-to-br from-gray-900 to-black text-gray-100">
      
      {/* Styled the title with the 'web3' gradient text effect */}
      <h1 className="text-3xl font-semibold 
          bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-300 via-cyan-300 to-green-300">
        Vehicle Registration Upload
      </h1>

      {/* This UploadForm component is assumed to have its own glassmorphism styles 
        (e.g., backdrop-blur, transparent background, light border) 
        so it "pops" against the dark background.
      */}
      <UploadForm />
    </main>
  );
}