import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helper";
import jwt, { JsonWebTokenError, JwtPayload, VerifyErrors, VerifyOptions } from "jsonwebtoken";
import { IAdmin } from '../models/admin-model';

export interface authRequest extends Request{
  admin?: JwtPayload | string;
  authToken?: string;
}

export const authAdmin = async (req: authRequest, res: Response,next:NextFunction) => {
  try {
    const authData = req.cookies.validateAdminToken;
    if (!authData) {
      errorResponse(res,"Access denied",{},401);
    }else{
      const token = JSON.parse(authData)?.authToken;
      const jwtSecret = process.env.JWT_SECRET || "";
      jwt.verify(token,jwtSecret, (err:VerifyErrors | null,decoded:any) => {
        if (err || !decoded) return errorResponse(res,"Invalid token",{},401);
        req.admin = decoded.existingUser as IAdmin;
        req.authToken = token;
        next();
      });
    }
  } catch (error) {
    errorResponse(res,"Error while login as admin");
  }
};
