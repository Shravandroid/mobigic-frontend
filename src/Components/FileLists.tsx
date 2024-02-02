import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import FileView from "./FileView";
import { InventoryList, InventoryType } from "./Profile";
import DownloadModal from "./DownloadModal";

type Props = {
  inventory: InventoryList | null;
  getMyFiles: () => Promise<void>;
};

const FileLists = ({ inventory, getMyFiles }: Props) => {
  const [IdCode, setIdCode] = useState<InventoryType>();
  const [openDownloadModal, setOpenDownloadModal] = useState<
    Boolean | undefined
  >();

  return (
    <div className="w-full grid grid-cols-5 gap-6 pt-6">
      {inventory ? (
        inventory?.map((inv) => (
          <FileView
            IdCode={IdCode}
            setIdCode={setIdCode}
            key={inv._id}
            data={inv}
            getMyFiles={getMyFiles}
            openDownloadModal={openDownloadModal}
            setOpenDownloadModal={setOpenDownloadModal}
          />
        ))
      ) : (
        <p>No profile images to show!</p>
      )}
      {openDownloadModal && (
        <DownloadModal
          IdCode={IdCode}
          setIdCode={setIdCode}
          openDownloadModal={openDownloadModal}
          setOpenDownloadModal={setOpenDownloadModal}
        />
      )}
    </div>
  );
};

export default FileLists;
