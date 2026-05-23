import { scrapeContent } from "../../services/scrapers/xnxx/xnxxGetRelatedController";
import c from "../../utils/options";

export async function relatedXnxx({ query }: { query: { id: string } }) {
  try {
    const { id } = query;
    const url = `${c.XNXX}/${id}`;
    const data = await scrapeContent(url);
    res.json(data);
  } catch (err) {
    const e = err as Error;
    throw new Error(e.message);
  }
}

