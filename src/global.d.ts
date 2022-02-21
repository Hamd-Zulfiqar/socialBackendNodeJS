import "express";

declare global {
  namespace Express {
    interface Response {
      decodedData?: any;
      user?: any;
      post?: any;
    }
  }
}

export {};
