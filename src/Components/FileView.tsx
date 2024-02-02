import { LuHardDriveDownload } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { InventoryType } from "./Profile";
import axios from "axios";
import { useContext, useState } from "react";
import { AppContext } from "../App";
import { toast } from "react-toastify";
import DownloadModal from "./DownloadModal";

type Props = {
  data: InventoryType;
  getMyFiles: () => Promise<void>;
  setOpenDownloadModal: React.Dispatch<
    React.SetStateAction<Boolean | undefined>
  >;
  openDownloadModal: Boolean | undefined;
  IdCode: InventoryType | undefined;
  setIdCode: React.Dispatch<React.SetStateAction<InventoryType | undefined>>;
};

const FileView = ({
  data,
  getMyFiles,
  setOpenDownloadModal,
  openDownloadModal,
  IdCode,
  setIdCode,
}: Props) => {
  const { token } = useContext(AppContext);

  const handleDelete = async (id: string) => {
    const res = await axios.delete(
      `${process.env.REACT_APP_MOBIGIC_BACKEND_LINK}/inventory/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.data.data.status === 204) {
      toast.success(`${res.data.data.message}`);
      getMyFiles();
    }
  };

  return (
    <div className="h-28 w-28 relative">
      <div className="absolute -top-4 right-9">
        <DownloadButton
          title="Download"
          className="bg-blue-500"
          icon={<LuHardDriveDownload size={10} />}
          onclick={() => {
            setOpenDownloadModal(true);
            setIdCode(data);
          }}
        />
      </div>
      <div className="absolute -top-4 right-0">
        <DownloadButton
          title="Delete"
          className="bg-red-500"
          onclick={() => handleDelete(data._id)}
          icon={<LuTrash2 size={15} />}
        />
      </div>

      <img
        className="h-28 w-28 object-cover shadow-md rounded"
        src={process.env.REACT_APP_MOBIGIC_BACKEND_LINK + data.path}
        alt="inventory"
      />
    </div>
  );
};

export default FileView;

export const DownloadButton = ({
  icon,
  onclick,
  className,
  title,
}: {
  icon: React.ReactNode;
  onclick: () => void;
  className?: string;
  title: string;
}) => {
  return (
    <button
      title={title}
      className={`w-6 h-6 flex items-center justify-center rounded-full p-0 ${className}`}
      onClick={onclick}
    >
      {icon}
    </button>
  );
};
