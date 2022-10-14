import { exec } from "child_process";
import { intersection } from "lodash";
import { join } from "path";
import { promisify } from "util";
import { TestVariant } from "variants/types";

import { WriteTestRunner } from "./TestRunner";

export default class RustWriterTestRunner extends WriteTestRunner {
  readonly name = "rust-writer";

  async runWriteTest(filePath: string): Promise<Uint8Array> {
    const { stdout, stderr } = await promisify(exec)(`./conformance_writer ${filePath}`, {
      cwd: join(__dirname, "../../../../../rust/target/debug/examples"),
      encoding: undefined,
    });

    if (stderr instanceof Buffer) {
      const errText = new TextDecoder().decode(stderr);
      if (errText.length > 0) {
        console.error(errText);
      }
    }
    return stdout as unknown as Uint8Array;
  }

  supportsVariant(variant: TestVariant): boolean {
    return (
      intersection(
        [...variant.features],
        ["ch", "mx", "st", "rsh", "rch", "ax", "mdx", "chx", "sum", "pad"],
      ).length === 0
    );
  }
}
