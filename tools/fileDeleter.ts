import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import * as fs from "fs"

const fileDeleterTool = new DynamicStructuredTool({
    name: "file-deleter",
    description: "This tool can be used to delete file from the disk",
    schema: z.object({
        path: z.string().describe("The path of the file to delete"),
        name: z.string().describe("The name of the file to delete"),
    }),
    func: async ({ path, name }) => {
        try {
            fs.unlinkSync(`${path}/${name}`)
            return `File deleted successfully from ${path}/${name}`
        } catch (err: any) {
            return err.toString()
        }
    }
})

export default fileDeleterTool