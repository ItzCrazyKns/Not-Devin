import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import * as fs from "fs"

const fileWriterTool = new DynamicStructuredTool({
    name: "file-writer",
    description: "This tool can be used to write file on the disk",
    schema: z.object({
        content: z.string().describe("The content to write in the file"),
        path: z.string().describe("The path of the file to write"),
        name: z.string().describe("The name of the file to write"),
    }),
    func: async ({ content, name, path }) => {
        try {
            fs.writeFileSync(`${path}/${name}`, content)
            return `File written successfully at ${path}/${name}`
        } catch (err: any) {
            return err.toString()
        }
    }
})

export default fileWriterTool