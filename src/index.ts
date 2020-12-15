import { connectDB } from "./mongo";
import { startPolling } from "./slimbot";

const start = async() => {
    try {
        await connectDB()

        startPolling()

        console.log('polling....');
        
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
}

start()