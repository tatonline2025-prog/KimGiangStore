import mongoose from "mongoose";

import { env } from "@/lib/env";

declare global {
  var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseConn ?? { conn: null, promise: null };

global.mongooseConn = cached;

export async function connectDb(): Promise<boolean> {
  if (!env.mongoUri) {
    return false;
  }

  if (cached.conn) {
    return true;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.mongoUri, {
      dbName: "kimgiang_store",
      autoIndex: true,
    });
  }

  cached.conn = await cached.promise;
  return true;
}
