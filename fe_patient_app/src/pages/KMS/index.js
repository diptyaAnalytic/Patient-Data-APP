import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Api from "../../Api";

function MyComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");

  // Fungsi untuk menangani pemilihan file dan meng-upload ke backend
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Kirim file ke backend
      const formData = new FormData();
      formData.append("file", file);

      try {
        // const response = await fetch("https://example.com/upload", {
        //   method: "POST",
        //   body: formData,
        // });
        const response = await Api.Encrypt(
          localStorage.getItem("token"),
          formData
        );

        if (!response.ok) {
          throw new Error("Terjadi kesalahan saat meng-upload file");
        }

        // Mendapatkan URL file PDF dari response backend
        const result = await response.json();
        if (result.pdfUrl) {
          setDownloadUrl(result.pdfUrl);
        } else {
          throw new Error("URL file PDF tidak ditemukan");
        }

        // Beri tahu pengguna bahwa file sudah siap diunduh
        window.alert("File telah diproses dan siap diunduh!");
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        window.alert("Terjadi kesalahan saat memproses file");
      }
    }
  };

  // Fungsi untuk memulai download file
  const handleDownload = () => {
    if (downloadUrl) {
      // Membuat elemen <a> dan memulai download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "file.pdf"; // Nama file yang akan di-download
      link.click(); // Memulai download
    } else {
      window.alert("URL download tidak tersedia");
    }
  };

  return (
    // <div>
    //   {/* Input file untuk memilih file */}
    //   <input type="file" onChange={handleFileChange} />

    //   {/* Tombol untuk mengunduh file setelah di-upload */}
    //   <button
    //     onClick={handleDownload}
    //     className="px-4 py-2 border rounded-md bg-blue-500 text-white"
    //   >
    //     Download File
    //   </button>
    // </div>
    <div>
      <div className="min-h-screen bg-[#F2F2F2]">
        <div className="flex w-full">
          <Sidebar />
          <div className="w-full p-10">
            <div className="border-2 bg-white rounded-lg p-10 space-y-[20px]">
              <h1 className="text-2xl text-slate-black font-medium mb-[40px]">
                Encrypt File
              </h1>
              <div className="flex justify-center">
                <div>
                  {/* Input file untuk memilih file */}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />

                  {/* Tombol untuk mengunduh file setelah di-upload */}
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 border rounded-md bg-blue-500 text-white"
                  >
                    Download File
                  </button>
                </div>
              </div>
            </div>
            <div className="border-2 my-4 bg-white rounded-lg p-10 space-y-[20px]">
              <h1 className="text-2xl text-slate-black font-medium mb-[40px]">
                Decrypt File
              </h1>
              <div className="flex justify-center">
                <div>
                  {/* Input file untuk memilih file */}
                  <input type="file" onChange={handleFileChange} />

                  {/* Tombol untuk mengunduh file setelah di-upload */}
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 border rounded-md bg-blue-500 text-white"
                  >
                    Download File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyComponent;

// import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar";
// import { Link, useNavigate } from "react-router-dom";

// export default function EncryptDecrypt() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [downloadEncrypt, setdownloadEncrypt] = useState("");

//   // Fungsi untuk menangani pemilihan file
//   const encryptFile = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       console.log("File yang dipilih:", file);
//       console.log("upload file ke backeend dan hasil dikirim ke toast");
//       setdownloadEncrypt("silahkan di download file sudah ada");
//       console.log(downloadEncrypt);
//       // Di sini bisa tambahkan logika setelah file dipilih
//     }
//   };

//   // Fungsi untuk menampilkan alert dan memulai download
//   const handleDownload = () => {
//     // Tampilkan alert untuk memberi tahu pengguna tentang proses download
//     window.alert("File sedang diunduh...");

//     // URL file yang ingin di-download
//     const fileUrl = "https://example.com/path/to/your/file.pdf";

//     // Membuat elemen <a> dan memulai download
//     const link = document.createElement("a");
//     link.href = fileUrl;
//     link.download = "file.pdf"; // Nama file yang akan di-download
//     link.click(); // Memulai download
//   };

//   const decryptFile = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       console.log("File yang dipilih:", file);
//       // Di sini bisa tambahkan logika setelah file dipilih
//     }
//   };

//   return (
//     <div>
//       <div className="min-h-screen bg-[#F2F2F2]">
//         <div className="flex w-full">
//           <Sidebar />
//           <div className="w-full p-10">
//             <div className="border-2 bg-white rounded-lg p-10 space-y-[20px]">
//               <h1 className="text-2xl text-slate-black font-medium mb-[40px]">
//                 Document Encrypt Decrypt
//               </h1>
//               <div className="flex justify-center">
//                 <label className="px-9 py-8 mx-9 border rounded-md shadow-sm text-lg bg-blue-700 text-white cursor-pointer">
//                   Encrypt
//                   <input
//                     type="file"
//                     onChange={encryptFile}
//                     style={{ display: "none" }}
//                   />
//                 </label>

//                 <label className="px-9 py-8 mx-9 border rounded-md shadow-sm text-lg bg-blue-700 text-white cursor-pointer">
//                   Decrypt
//                   <input
//                     type="file"
//                     onChange={decryptFile}
//                     style={{ display: "none" }}
//                   />
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
