export class Encoder {
  DELIMITER = "|";

  encode(...args: (string | number)[]) {
    return Buffer.from(args.join(this.DELIMITER), "utf8").toString("base64");
  }

  decode(encodedString: string) {
    return Buffer.from(encodedString, "base64").toString("utf8").split(this.DELIMITER);
  }
}
