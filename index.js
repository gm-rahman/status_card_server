import express from "express"
import multer from "multer"
import cors from "cors"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadPath = path.join(__dirname, "uploads")

if (!fs.existsSync(uploadPath)) {
   fs.mkdirSync(uploadPath)
}

const app = express()

app.use(
   cors({
      origin: "*",
   })
)

app.use(express.json())

const storage = multer.diskStorage({
   destination: (req, file, cb) => cb(null, "uploads/"),
   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
})
const upload = multer({ storage })

app.post("/api/upload", upload.array("files"), (req, res) => {
   try {
      const files = req.files.map((file) => ({
         name: file.originalname,
         path: file.path,
         type: file.mimetype,
         size: file.size,
      }))
      res.status(200).json({ files })
   } catch (error) {
      console.error("File upload failed", error)
      res.status(500).json({ error: "File upload failed" })
   }
})

app.listen(3000, () => {
   console.log("Server is running on http://localhost:3000")
})
