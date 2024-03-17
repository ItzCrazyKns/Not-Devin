import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import * as fs from "fs"

const fileReaderTool = new DynamicStructuredTool({
    name: "file-reader",
    description: "This tool can be used to read file from the disk",
    schema: z.object({
        path: z.string().describe("The path of the file to read"),
        name: z.string().describe("The name of the file to read"),
    }),
    func: async ({ path, name }) => {
        try {
            return fs.readFileSync(`${path}/${name}`, "utf-8")
        } catch (err: any) {
            return err.toString()
        }
    }
})

export default fileReaderTool