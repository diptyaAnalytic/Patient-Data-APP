import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../Api";
import toast from "react-hot-toast";
import Sidebar from "../../../components/Sidebar";

export default function CreatePasien() {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  // create state
  const [tanggal, setTanggal] = useState();
  const [nama, setNama] = useState();
  const [maritalStatus, setMaritalStatus] = useState();
  const [citizenship, setCitizenship] = useState();
  const [gender, setGender] = useState();
  const [religion, setReligion] = useState();
  const [mother, setMother] = useState();
  const [tempatLahir, setTempatLahir] = useState();
  const [tanggalLahir, setTanggalLahir] = useState();
  const [alamat, setAlamat] = useState();
  const [pekerjaan, setPekerjaan] = useState();
  const [telepon, setTelepon] = useState();
  const [alergi, setAlergi] = useState();

  const createPasien = async () => {
    try {
      const data = {
        fullname: nama,
        maritalStatus,
        citizenship,
        religion,
        mother,
        gender,
        placeBirth: tempatLahir,
        dateBirth: tanggalLahir,
        address: alamat,
        work: pekerjaan,
        phone: String(telepon),
        history_illness: alergi,
      };
      const response = await Api.CreatePasien(
        localStorage.getItem("token"),
        data
      );
      toast.success("Success Create Patient");
      navigate("/pasien");
    } catch (error) {
      console.log(error);
      toast.error("Failed Create Patient");
    }
  };
  return (
    <div>
      <div className="min-h-screen bg-[#F2F2F2]">
        <div className="flex w-full">
          <Sidebar />
          <div className="w-full p-10">
            <div className="space-y-[20px] w-full p-5 bg-white border-2 rounded-lg">
              <h1 className="text-2xl text-slate-black font-medium mb-[20px]">
                Create Patient
              </h1>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Fullname</h1>
                <input
                  onChange={(e) => setNama(e.target.value)}
                  type="text"
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                  placeholder="Input Fullname Patient...."
                />
              </div>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Place of Birth</h1>
                <div className="flex items-center gap-7">
                  <input
                    onChange={(e) => setTempatLahir(e.target.value)}
                    type="text"
                    className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                    placeholder="Place of Birth...."
                  />
                  <input
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    type="date"
                    className="w-1/3 border outline-none shadow-md px-2 py-2 rounded-md"
                    placeholder="Date of Birth...."
                  />
                </div>
              </div>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Gender</h1>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Marital Status</h1>
                <input
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  type="text"
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                  placeholder="Input Marital Status...."
                />
              </div>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Citizenship</h1>
                <input
                  onChange={(e) => setCitizenship(e.target.value)}
                  type="text"
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                  placeholder="Input Citizenship...."
                />
              </div>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Religion</h1>
                <input
                  onChange={(e) => setReligion(e.target.value)}
                  type="text"
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                  placeholder="Input Religion...."
                />
              </div>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Mother</h1>
                <input
                  onChange={(e) => setMother(e.target.value)}
                  type="text"
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                  placeholder="Input Name Mother...."
                />
              </div>

              <div className="text-sm space-y-2">
                <h1 className="font-medium">Address</h1>
                <input
                  onChange={(e) => setAlamat(e.target.value)}
                  type="text"
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                  placeholder="Address...."
                />
              </div>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Work</h1>
                <input
                  onChange={(e) => setPekerjaan(e.target.value)}
                  type="text"
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                  placeholder="Work...."
                />
              </div>
              <div className="text-sm space-y-2">
                <h1 className="font-medium">Phone</h1>
                <input
                  onChange={(e) => setTelepon(e.target.value)}
                  type="number"
                  className="w-full border outline-none shadow-md px-2 py-2 rounded-md"
                  placeholder="Phone...."
                />
              </div>

              <div className="space-x-5 pt-7 flex items-center justify-end">
                <button
                  onClick={() => navigate(-1)}
                  className="py-2 px-5 border rounded-md border-blue-700  w-[100px] text-blue-700 text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={createPasien}
                  className="py-2 px-5 border rounded-md bg-blue-700 w-[100px] text-white text-lg"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
