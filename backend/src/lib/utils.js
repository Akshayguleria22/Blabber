import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
        if (!mongoUrl) throw new Error('Missing MONGODB_URL or MONGODB_URI');
        const conn = await mongoose.connect(mongoUrl);
        console.log(`MongoDB connected ${conn.connection.host}`)
    } catch (error) {
        console.error('Mongo connection error:', error.message);
        process.exit(1);
    }
}
