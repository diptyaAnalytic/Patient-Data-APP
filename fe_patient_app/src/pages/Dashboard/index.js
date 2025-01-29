import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
// import Modal from "../../components/Modal";
import Api from "../../Api";
import moment from "moment";
// import { OdontogramGambar } from "../../assets";

const Dashboard = () => {
  const [dataRekamMedis, setDataRekamMedis] = useState("");
  const [dataRekamMedisDecrypt, setDataRekamMedisDecrypt] = useState("");
  // const [detailRekamMedis, setDetailRekamMedis] = useState(false);
  // const [modalAlert, setModalAlert] = useState(false);
  // const [dataDetailRekamMedis, setDataDetailRekamMedis] = useState("");
  // const [dataOdontogram, setDataOdontogram] = useState([]);
  const [amountHeader, setAmountHeader] = useState("");
  // const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  // const formatServiceNames = (param) => {
  //   return param.map((service) => service.name).join(", ");
  // };

  const getRekamMedis = async () => {
    try {
      const response = await Api.GetRekamMedis(
        localStorage.getItem("token"),
        "",
        ""
      );
      console.log(response);
      setDataRekamMedis(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getRekamMedisDecrypt = async () => {
    try {
      const response = await Api.GetRekamMedisDecrypt(
        localStorage.getItem("token"),
        "",
        ""
      );
      setDataRekamMedisDecrypt(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAmountHeader = async () => {
    try {
      const response = await Api.AmountHeader(
        localStorage.getItem("token"),
        "",
        ""
      );
      setAmountHeader(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRekamMedis();
    getRekamMedisDecrypt();
    getAmountHeader();
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-[#F2F2F2]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-between items-center lg:p-8 p-6 gap-4 lg:flex-row lg:gap-[40px] ">
          <div className="flex items-center py-[40px] px-[30px] w-full rounded-lg bg-white border-2 shadow-sm">
            <span className="text-[22px] font-medium">Total Patients</span>
            <span className="text-[50px] font-medium ml-6">
              {amountHeader.amountPatient}
            </span>
          </div>
          <div className="flex items-center py-[40px] px-[30px] rounded-lg bg-white w-full border-2 shadow-sm">
            <span className="text-[22px] font-medium">
              Total Medical Records
            </span>
            <span className="text-[50px] font-medium ml-6">
              {amountHeader.amountMedicalRecord}
            </span>
          </div>
        </div>
        <div className="px-8">
          <div className="border-2 bg-white rounded-lg p-10 space-y-[20px]">
            <div className="mb-[40px]">
              <h1 className="text-2xl text-slate-black font-medium">
                Data Decrypt Patient Visit
              </h1>
              <p className="text-medium text-[#737373] mt-2">
                This is a data display retrieved from the database that has been
                decrypted using SGKMS
              </p>
            </div>
            <div className="overflow-auto scrollbar-hide bg-white">
              <table className="w-full table-auto border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      No.
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Patient Code
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Fullname
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Gender
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Marital Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Religion
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Citizenship
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Mother
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-black">
                      Medical Records
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {Object.values(dataRekamMedisDecrypt).map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {moment(item.createdAt).format("DD MMMM YYYY")}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.numberRegristation}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {/* {moment(item.date).format("DD MMMM YYYY")} */}
                        {item.fullname}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.gender}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.maritalStatus}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.religion}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.citizenship}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {/* {moment(item.dateBirth).format("DD MMMM YYYY")} */}
                        {item.mother}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() =>
                            navigate("/rekam-medis", {
                              state: {
                                idPasien: item.id_patient,
                                namaPasien: item.fullname,
                              },
                            })
                          }
                          className="text-xs p-2 font-medium bg-slate-600 text-white rounded-lg"
                        >
                          See Medical Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-8 pt-4">
          <div className="border-2 bg-white rounded-lg p-10 space-y-[20px]">
            <div className="mb-[40px]">
              <h1 className="text-2xl text-slate-black font-medium">
                Data Encrypt Patient Visit
              </h1>
              <p className="text-medium text-[#737373] mt-2">
                This is a data display retrieved from the database that has been
                encrypted using SGKMS
              </p>
            </div>
            <div className="overflow-auto scrollbar-hide bg-white">
              <table className="w-full table-auto border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      No.
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      patient Code
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Fullname
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Gender
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Marital Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Religion
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Citizenship
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-black">
                      Mother
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {Object.values(dataRekamMedis).map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {moment(item.createdAt).format("DD MMMM YYYY")}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.numberRegristation}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.fullname}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.gender}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.maritalStatus}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.religion}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.citizenship}
                      </td>
                      <td className="px-4 py-2 text-xs text-[#737373] font-medium">
                        {item.mother}
                      </td>
                      {/* <td className="px-4 py-2 text-center">
                        <button
                          onClick={() =>
                            navigate("/rekam-medis", {
                              state: {
                                idPasien: item.id_patient,
                                namaPasien: item.fullname,
                              },
                            })
                          }
                          className="text-xs p-2 font-medium bg-slate-600 text-white rounded-lg"
                        >
                          See Medical Record
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
