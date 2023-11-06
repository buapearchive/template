import { logger } from "@internal/logger"
import cors from "cors"
import express from "express"

const app = express()
app.use(cors())

app.get("/", (_req, _res) => {
	_res.json({ message: "Hello World!" })
})

app.all("*", (_req, res) => {
	res.redirect("https://example.com")
})

app.listen(process.env.API_PORT, () => {
	logger.info(`API listening on port ${process.env.API_PORT}`)
})
