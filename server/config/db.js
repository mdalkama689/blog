import mongoose from 'mongoose'
import {config} from 'dotenv' 
config()

console.log(process.env.MONGO_URI)
const connectToDB = async () => {
    try {
    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log(`connected to db : ${connection.connection.host}`)

    } catch (error) {
        console.log('error durin db connection : ', error)
        process.exit(1)
    }
}


export default connectToDB