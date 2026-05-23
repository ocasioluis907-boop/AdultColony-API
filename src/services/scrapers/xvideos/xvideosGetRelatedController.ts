import { load } from "cheerio";
// FIX: Using your verified AdultColony engine module to fetch data
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";
import { ISearchVideoData, XvideosRelatedRaw } from "../../../interfaces";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    // FIX: Using the verified fetchBody engine call
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class XvideosSearch {
      search: object[];
      constructor() {
        this.search = $("div#video-player-bg")
          .map((i, el) => {
            const script = $(el).find("script").html();
            const video_related = script?.split("var video_related=")[1];
            const badJson = video_related?.split("];")[0] + "]";
            const actualResult = JSON.parse(String(badJson)) as XvideosRelatedRaw[];
            const result = actualResult.map((rel) => {
              return {
                link: `${c.XVIDEOS}${rel.u}`,
                id: rel.u.slice(1, -1),
                title: rel.t,
                image: rel.i,
                duration: rel.d,
                views: `${rel.n}, ${rel.r}`,
                video: `${c.XVIDEOS}/embedframe/${rel.id}`
              };
            });
            return result;
          }).get();
      }
    }

    const x = new XvideosSearch();
    if (x.search.length === 0) throw Error("No result found");
    const result: ISearchVideoData = {
      success: true,
      data: x.search.flat() as unknown as string[],
      source: url,
    };
    return result;

  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
