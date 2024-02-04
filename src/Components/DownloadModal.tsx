import React, { useContext, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { InventoryType } from "./Profile";
import { FaRegCopy } from "react-icons/fa";
import axios from "axios";
import { AppContext } from "../App";
import { toast } from "react-toastify";

type props = {
  openDownloadModal: Boolean;
  setOpenDownloadModal: React.Dispatch<
    React.SetStateAction<Boolean | undefined>
  >;
  IdCode: InventoryType | undefined;
  setIdCode: React.Dispatch<React.SetStateAction<InventoryType | undefined>>;
};

const DownloadModal = ({
  openDownloadModal,
  setOpenDownloadModal,
  IdCode,
  setIdCode,
}: props) => {
  const { token } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");

  const handleDownload = async () => {
    if (IdCode) {
      const payload = {
        code: Number(inputValue),
        id: IdCode?._id,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_MOBIGIC_BACKEND_LINK}/inventory/check-code`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.isCodeValid == true) {
        const fileUrl =
          process.env.REACT_APP_MOBIGIC_BACKEND_LINK + IdCode?.path;
        fetch(fileUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${IdCode?.fileName}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((error) =>
            console.error("Error downloading the file:", error)
          );
        setOpenDownloadModal(false);
      } else if (res.data.isCodeValid == false) {
        toast.error("Provided code is incorrect");
        setOpenDownloadModal(true);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center  transition-opacity`}
    >
      <div className="bg-slate-100 p-5 w-96 rounded-lg shadow-lg border-2 border-slate-300">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Download</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              setOpenDownloadModal(false);
            }}
          >
            <IoMdCloseCircle size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 py-2">
            <label className="block text-sm font-medium text-gray-700">
              Code:
            </label>
            <button
              title="Click to copy the code"
              onClick={async () => {
                try {
                  if (IdCode?.code) {
                    await navigator.clipboard.writeText(
                      IdCode?.code?.toString()
                    );
                    alert("Number copied to clipboard!");
                  }
                } catch (err) {
                  console.error("Unable to copy to clipboard:", err);
                }
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaRegCopy size={25} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Add code to download file"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={() => {
            handleDownload();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default DownloadModal;
