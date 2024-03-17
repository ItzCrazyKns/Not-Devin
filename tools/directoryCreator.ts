import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import * as fs from "fs"

const directoryCreatorTool = new DynamicStructuredTool({
    name: "directory-creator",
    description: "This tool can be used to create a directory on the disk",
    schema: z.object({
        path: z.string().describe("The path of the directory to create"),
        name: z.string().describe("The name of the directory to create"),
    }),
    func: async ({ path, name }) => {
        try {
            fs.mkdirSync(`${path}/${name}`)
            return `Directory created successfully at ${path}/${name}`
        } catch (err: any) {
            return err.toString()
        }
    }
})

export default directoryCreatorTool