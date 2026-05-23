import { load } from "cheerio";
// FIX: Using your verified AdultColony engine module to fetch data
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";
import { ISearchVideoData, XvideosRelatedRaw } from "../../../interfaces";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    // 1. Using the verified fetchBody engine call
    const res = await adultcolony.fetchBody(url);
    if (!res) {
      return { success: false, data: [], message: "Empty HTML response received from target source." };
    }
    
    const $ = load(res);
    let extractedData: any[] = [];

    // 2. Safely extract script tags without using a brittle inner class constructor
    $("div#video-player-bg").each((i, el) => {
      const scriptHtml = $(el).find("script").html();
      if (scriptHtml && scriptHtml.includes("var video_related=")) {
        try {
          const video_related = scriptHtml.split("var video_related=")[1];
          const badJson = video_related.split("];")[0] + "]";
          const actualResult = JSON.parse(String(badJson)) as XvideosRelatedRaw[];
          
          const result = actualResult.map((rel) => {
            return {
              link: `${c.XVIDEOS}${rel.u || ""}`,
              id: rel.u ? rel.u.slice(1, -1) : "",
              title: rel.t || "Untitled",
              image: rel.i || "",
              duration: rel.d || "",
              views: `${rel.n || ""}, ${rel.r || ""}`,
              video: `${c.XVIDEOS}/embedframe/${rel.id || ""}`
            };
          });
          
          extractedData = result;
        } catch (jsonErr) {
          // If JSON parsing fails, catch it here locally so the whole server doesn't crash
        }
      }
    });

    // 3. Return structural response safely
    if (extractedData.length === 0) {
      return {
        success: false,
        data: [],
        message: "No related elements discovered or script layout has updated."
      };
    }

    const result: ISearchVideoData = {
      success: true,
      data: extractedData as unknown as string[],
      source: url,
    };
    return result;

  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      data: [],
      message: e.message
    };
  }
}
