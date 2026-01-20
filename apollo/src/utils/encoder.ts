export class Encoder {
  DELIMETER = "|";

  // TODO: Change this to include more fields
  encode(...args: (string | number)[]) {
    return Buffer.from(args.join(this.DELIMETER), "utf8").toString("base64");
  }

  // TODO: Change this when more fields are included
  decode(encodedString: string) {
    return Buffer.from(encodedString, "base64").toString("utf8").split(this.DELIMETER);
  }
}
