import { logger } from "@qawolf/logger";
import { CaptureSize } from "./types";
const Xvfb = require("xvfb");

export class Display {
  private _xvfb: any;

  protected constructor(xvfb: any) {
    this._xvfb = xvfb;
    logger.debug(`Display: created ${this.value}`);
  }

  public get value() {
    return this._xvfb.display();
  }

  public static start(size: CaptureSize): Promise<Display> {
    logger.verbose(`Display: start ${JSON.stringify(size)}`);

    return new Promise((resolve, reject) => {
      const xvfb = new Xvfb({
        xvfb_args: [
          "-shmem",
          "-screen",
          "0",
          `${size.width}x${size.height}x24`,
          // do not listen on a unix socket to prevent
          // "_XSERVTransmkdir: ERROR: euid != 0,directory /tmp/.X11-unix will not be created"
          // https://phabricator.wikimedia.org/T202710
          "-nolisten",
          "unix"
        ]
      });

      xvfb.start(function(err: any) {
        if (err) {
          logger.error(`Display: could not start ${JSON.stringify(err)}`);
          reject();
        } else {
          resolve(new Display(xvfb));
        }
      });
    });
  }

  public stop() {
    return new Promise((resolve, reject) => {
      this._xvfb.stop(function(err: any) {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
