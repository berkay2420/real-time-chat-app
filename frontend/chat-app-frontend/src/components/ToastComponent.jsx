import { Toaster } from "react-hot-toast";

const ToasterComponent = () => {
  return (
    <Toaster
      position="top-left"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#EFF6FF",      
          color: "#1E3A8A",           
          border: "1px solid #BFDBFE", 
          fontSize: "14px",
        },
        success: {
          style: {
            background: "#DBEAFE",   
            color: "#1D4ED8",        
          },
        },
        error: {
          style: {
            background: "#EFF6FF",
            color: "#1E40AF",        
          },
        },
      }}
    />
  );
};

export default ToasterComponent;
