import { describe, expect, it } from "vitest";
import { hashBytes, hashText } from "./hash-generator";

const md5Of = async (text: string) => {
  const [result] = await hashText(text);
  return result.digest;
};

describe("hashText", () => {
  it("returns all algorithms in order", async () => {
    const results = await hashText("abc");
    expect(results.map((r) => r.algorithm)).toEqual(["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"]);
  });

  it("matches RFC 1321 MD5 test vectors", async () => {
    const vectors: [string, string][] = [
      ["", "d41d8cd98f00b204e9800998ecf8427e"],
      ["a", "0cc175b9c0f1b6a831c399e269772661"],
      ["abc", "900150983cd24fb0d6963f7d28e17f72"],
      ["message digest", "f96b697d7cb7938d525a2f31aaf161d0"],
      ["abcdefghijklmnopqrstuvwxyz", "c3fcd3d76192e4007dfb496cca67e13b"],
      [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        "d174ab98d277d9f5a5611c2c9f419d9f"
      ],
      [
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
        "57edf4a22be3c955ac49da2e2107b67a"
      ]
    ];
    for (const [input, expected] of vectors) {
      expect(await md5Of(input)).toBe(expected);
    }
  });

  it("matches known SHA digests for 'abc'", async () => {
    const digests = Object.fromEntries((await hashText("abc")).map((r) => [r.algorithm, r.digest]));
    expect(digests["SHA-1"]).toBe("a9993e364706816aba3e25717850c26c9cd0d89d");
    expect(digests["SHA-256"]).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(digests["SHA-384"]).toBe(
      "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7"
    );
    expect(digests["SHA-512"]).toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
    );
  });

  it("encodes multi-byte characters as UTF-8", async () => {
    const viaText = await md5Of("🔒");
    const viaBytes = await hashBytes(new Uint8Array([0xf0, 0x9f, 0x94, 0x92]));
    expect(viaText).toBe(viaBytes[0].digest);
  });
});
