import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongoosecache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongoosecache;

if(!cached){
    cached = global.mongoosecache = {conn: null, promise: null};
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');
    
    if(cached.conn) return cached.conn;

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI , { bufferCommands: false});
    }


try {
    cached.conn = await cached.promise;
} catch(err) {
    cached.promise = null;
    throw err;
}
/* dev or prod */
console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`);

return cached.conn;

}