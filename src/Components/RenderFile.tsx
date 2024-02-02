

export const RenderFile = ({ object }: { object: any }) => {
    switch (object?.type) {
      case "image/jpeg" || "image/jpg":
        return (
          <img
            style={{
              borderRadius: "8px",
              height: "auto",
              width: "200px",
            }}
            src={URL.createObjectURL(object)}
            alt="File Preview"
          />
        );
      case "image/png":
        return (
          <img
            style={{
              borderRadius: "8px",
              height: "auto",
              width: "200px",
            }}
            src={URL.createObjectURL(object)}
            alt="File Preview"
          />
        );
      default:
        return <></>;
    }
  };