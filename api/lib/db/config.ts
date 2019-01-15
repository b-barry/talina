import mongoose, { Connection } from 'mongoose';

let conn: Connection & {
  then: Promise<Connection>['then'];
  catch: Promise<Connection>['catch'];
} = null;

const uri = process.env.mongo_db_uri;
export const getConnection = async () => {
  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
  }

  return conn;
};
