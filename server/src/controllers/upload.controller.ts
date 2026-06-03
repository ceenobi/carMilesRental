import { uploadToCloudinary, deleteFromCloudinary } from "../config/upload.js";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import { Request, Response, NextFunction } from "express";
import { sendTsRestError, sendTsRestSuccess } from "../lib/responseHandler.js";

export const uploadFile = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { files, folder } = req.body;
    if (!files || files.length === 0) {
      return sendTsRestError(res, 400, "No files uploaded");
    }
    const uploadedFiles = await Promise.all(
      files.map((file: string) =>
        uploadToCloudinary(file, {
          folder,
        }),
      ),
    );
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Files uploaded successfully",
      body: uploadedFiles,
    });
  },
);

export const deleteFile = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { mediaIds } = req.body;
    await Promise.all(mediaIds.map((id: string) => deleteFromCloudinary(id)));
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Media deleted successfully",
      body: mediaIds,
    });
  },
);
