import { load } from "cheerio";
// FIX: Using your verified AdultColony engine module to fetch data
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";
import { ISearchVideoData, XnxxRelatedRaw } from "../../../interfaces";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    // 1. Fetch data safely using verified engine method
    const res = await adultcolony.fetchBody(url);
    if (!res) {
      return { success: false, data: [], message: "Empty HTML response received from target source." };
    }
    
    const $ = load(res);
    let extractedData: any[] = [];

    // 2. Extract script tags safely without using a brittle class constructor
    $("div#video-player-bg").each((i, el) => {
      const scriptHtml = $(el).find("script").html();
      if (scriptHtml && scriptHtml.includes("var video_related=")) {
        try {
          const video_related = scriptHtml.split("var video_related=")[1];
          const badJson = video_related.split("];")[0] + "]";
          const actualResult = JSON.parse(String(badJson)) as XnxxRelatedRaw[];
          
          const result = actualResult.map((rel) => {
            return {
              link: `${c.XNXX}${rel.u || ""}`,
              id: rel.u ? rel.u.slice(1, -1) : "",
              title: rel.t || "Untitled",
              image: rel.i || "",
              duration: rel.d || "",
              views: `${rel.n || ""}, ${rel.r || ""}`,
              video: `${c.XNXX}/embedframe/${rel.id || ""}`
            };
          });
          
          extractedData = result;
        } catch (jsonErr) {
          // Local catch protects your route handler if a string split fails
        }
      }
    });

    // 3. Return a clean JSON validation response instead of throwing a raw crash
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
