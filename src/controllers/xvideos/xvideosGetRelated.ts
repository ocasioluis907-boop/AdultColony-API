import { scrapeContent } from "../../services/scrapers/xvideos/xvideosGetRelatedController";
import c from "../../utils/options";

export async function relatedXvideos({ query }: { query: { id: string } }) {
  try {
    const { id } = query;
    const url = `${c.XVIDEOS}/${id}`;
    const data = await scrapeContent(url);
    res.json(data);
  } catch (err) {
    const e = err as Error;
    throw new Error(e.message);
  }
}

