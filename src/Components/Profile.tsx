import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AppContext } from "../App";
import axios from "axios";
import FileLists from "./FileLists";
import { MdLogout } from "react-icons/md";

const schema = yup.object().shape({
  file: yup.mixed(),
});

export type InventoryList = InventoryType[];

export interface InventoryType {
  _id: string;
  fileName: string;
  path: string;
  uploadedBy: string;
  isActive: boolean;
  code: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const Profile = () => {
  const { token, setToken } = useContext(AppContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inventory, setInventory] = useState<InventoryList | null>(null);
  useEffect(() => {
    getMyFiles();
    return () => {
      setInventory([]);
    };
  }, []);

  const getMyFiles = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_MOBIGIC_BACKEND_LINK}/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setInventory(res.data);
      } else {
        console.error("Invalid data structure:", res.data);
      }
    } catch (error) {
      console.log(error)
    }
  };
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const handleFileUpload = async (data: any) => {
    let formData: any = new FormData();
    for (const property in data) {
      if (data[property] !== null && data[property] !== "string") {
        formData.append(property, data[property]);
      }
      if (typeof data[property] === "number") {
        formData.append(property, data[property]);
      }
      if (Array.isArray(data[property])) {
        data[property]?.forEach((data: any, index: number) => {
          formData.append(`${property}[${index}]`, data);
        });
        delete data[property];
      }
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_MOBIGIC_BACKEND_LINK}/inventory`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`${res.data.message}`);
      if (res?.data?.status === 201) {
        getMyFiles();
        var inputElement = document.getElementById("file-id") as HTMLInputElement;
        if (inputElement) {
          inputElement.value = "";
        }
      }
      setSelectedFile(null);
      reset();
    } catch (error) {
      toast.error(`File could not be found!`);
    }
  };

  const logout = () => {
    setToken(undefined);
    sessionStorage.removeItem("token");
  };
  return (
    <div className="w-full h-screen p-8">
      <div className="flex w-full items-start justify-between">
        <button
          onClick={() => logout()}
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          <span>
            Logout <MdLogout size={18} className="inline ml-3" />{" "}
          </span>
        </button>
        <form
          onSubmit={handleSubmit(handleFileUpload)}
          className="flex items-center gap-2"
        >
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file-id"
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                const allowedFileTypes = [
                  "image/png",
                  "image/jpg",
                  "image/jpeg",
                  "application/pdf",
                  "image/jfif",
                ];

                if (file?.size > 1024000 * 10) {
                  // 1024000 is 1 MB * 10 MB
                  toast.error("File size should be less than 10 MB");
                } else if (!allowedFileTypes.includes(file?.type)) {
                  toast.error("Only png, jpg, jpeg, pdf files are allowed.");
                } else {
                  setValue("file", file);
                  setSelectedFile(file);
                }
              }
            }}
          />

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="bg-gray-50 w-full h-full">
        <FileLists inventory={inventory} getMyFiles={getMyFiles}/>
      </div>
    </div>
  );
};
