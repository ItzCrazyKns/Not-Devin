import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import * as fs from "fs"

const fileListTool = new DynamicStructuredTool({
    name: "file-list",
    description: "This tool can be used to list files from the disk",
    schema: z.object({
        path: z.string().describe("The path of the directory to list files from"),
    }),
    func: async ({ path }) => {
        try {
            return fs.readdirSync(path).join(", ")
        } catch (err: any) {
            return err.toString()
        }
    }
})

export default fileListTool