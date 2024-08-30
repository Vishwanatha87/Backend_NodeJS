import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

// Configur cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localpath) => {
    try{
        if(!localpath) return null

        const response = await cloudinary.uploader.upload(localpath, {resource_type:"auto"})

        console.log("File uploaded on cloudinary file src" + response.url);

        // once the file is uploaded need to remove from the server
        fs.unlinkSync(localpath)
        return response
        

    }
    catch(e){
        fs.unlinkSync(localpath)
        return null
    }
}


export {uploadOnCloudinary}