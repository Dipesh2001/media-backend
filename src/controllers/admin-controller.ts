import { NextFunction, Request, Response } from "express";
import { Admin } from "../models/admin-model";
import { errorResponse, successResponse } from "../helper";
import jwt from "jsonwebtoken"

// Create a new user
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Admin.findOne({ email });

    if(existingUser){
     errorResponse(res,"Error creating admin",{ field: "email", message: "Email already exists" });
    }else{
      const newUser = new Admin({ name, email, password });
      await newUser.save();
      successResponse(res,"Admin registered successfully", { admin:newUser });
    }
  } catch (error) {
    errorResponse(res,"Error creating admin",{ });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Admin.findOne({ email });

    if(!existingUser){
     errorResponse(res,"Invalid Email",{ });
    }else{
      const isMatch = await existingUser.comparePassword(password);
      if (!isMatch) {
        errorResponse(res,"Invalid Credentials",{ });
      }else{
        const secret = process.env.JWT_SECRET || "";
        const token = jwt.sign({ existingUser }, secret, { expiresIn: "7h" });
        successResponse(res,"Admin logged in successfully", { admin:existingUser,authToken:token });
      }
    }
  } catch (error) {
    errorResponse(res,"Error while login as admin",{ });
  }
};