import { scrapeContent } from "../../services/scrapers/xvideos/xvideosGetRelatedController";
import c from "../../utils/options";
import { logger } from "../../utils/logger";
import { maybeError } from "../../utils/modifier";
import { Request, Response } from "express";

export async function relatedXvideos(req: Request, res: Response) {
  try {
    const id = req.query.id as string;
    if (!id) throw Error("Parameter id is required");

    const url = `${c.XVIDEOS}/${id}`;
    const data = await scrapeContent(url);
    logger.info({
      path: req.path,
      query: req.query,
      method: req.method,
      ip: req.ip,
      useragent: req.get("User-Agent"),
    });
    res.json(data);
  } catch (err) {
    const e = err as Error;
    res.status(400).json(maybeError(false, e.message));
  }
}

