import fs from "fs";

export const handleUploadError = (req: any, res: any, err: any) => {
  if (req.file && req.file.path) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting uploaded file:", unlinkErr);
      }
    });
  }

  return res.status(400).json({
    success: false,
    data: {},
    message: err.message || "File upload error",
  });
};
